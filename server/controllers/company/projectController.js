import Company from "../../models/Company.js";
import Project from "../../models/Project.js";
import { Readable } from 'stream';
import { deleteFile, uploadCompanyProjectFileFromStream } from "../../Service/Imagekit.js";
import { apiResponse, errors } from "../../utils/GlobalErrorHandler.js";

//Publish Project
export const PublishProject = async (req, res) => {
    try {
        const companyId = req.userId;

        const company = await Company.findById(companyId);

        if (!company) {
            return errors.notFound(res, 'Company not found')
        }
        if (company.companyVerified !== 'completed') {
            return errors.unauthenticated(res, "Only verified companies can publish project")
        }
        const { projectName,
            budget,
            deadline,
            bidClosingDate,
            estimatedDuration,
            category,
            requirements,
            carpetArea,
            location,
            priorityLevel,
            locationCoords } = req.body;

        let uploadedFile = null;
        if (req.file && req.file.buffer) {
            uploadedFile = await uploadCompanyProjectFileFromStream(
                Readable.from(req.file.buffer),
                `${company._id}_projectFile_${Date.now()}`
            );
        }

        const newProject = await Project.create({
            projectName,
            company: companyId,
            budget,
            deadline,
            bidClosingDate,
            estimatedDuration,
            category,
            requirements: Array.isArray(requirements) ? requirements : [requirements],
            details: {
                carpetArea,
                location
            },
            priorityLevel,
            locationCoords,
            projectFile: uploadedFile?.url || null,
            attachments: uploadedFile ? [uploadedFile.url] : []
        });
        return apiResponse(201, "Successfully Published", {
            projectId: newProject._id,
            projectName,
            budget,
            deadline,
            estimatedDuration,
            category,
            priorityLevel,
            projectFile,
            attachments,
            locationCoords,
            status,
            isPublished,
            createdAt,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }


        LogError('Publish_Project', error);
        return errors.serverError(res, 'Server Error' + error.message);
    }
}

// Edit Project
export const editProject = async (req, res) => {
    try {
        const companyId = req.userId;
        const { projectId } = req.params;

        const project = await Project.findOne({ _id: projectId, company: companyId });
        if (!project) return errors.notFound(res, "Project not found");

        const {
            projectName,
            budget,
            deadline,
            bidClosingDate,
            estimatedDuration,
            category,
            requirements,
            carpetArea,
            location,
            priorityLevel,
            locationCoords
        } = req.body;

        if (projectName) project.projectName = projectName;
        if (budget) project.budget = budget;
        if (deadline) project.deadline = deadline;
        if (bidClosingDate) project.bidClosingDate = bidClosingDate;
        if (estimatedDuration) project.estimatedDuration = estimatedDuration;
        if (category) project.category = category;
        if (requirements) project.requirements = Array.isArray(requirements) ? requirements : [requirements];
        if (priorityLevel) project.priorityLevel = priorityLevel;
        if (locationCoords) project.locationCoords = locationCoords;
        if (carpetArea || location) {
            project.details = {
                carpetArea: carpetArea || project.details.carpetArea,
                location: location || project.details.location
            };
        }

        if (req.file && req.file.buffer) {
            if (project.projectFile) {
                const oldFileId = project.projectFile;
                if (oldFileId) await deleteFile(oldFileId);
            }

            const uploadedFile = await uploadCompanyProjectFileFromStream(
                Readable.from(req.file.buffer),
                `${companyId}_projectFile_updated_${Date.now()}`
            );

            project.projectFile = uploadedFile.url;
            project.attachments = [uploadedFile.url];
        }

        project.updatedAt = new Date();
        await project.save();

        return apiResponse(200, "Successfully Updated", {
            projectName,
            projectId,
            budget,
            deadline,
            estimatedDuration,
            category,
            priorityLevel,
            locationCoords,
            projectFile,
            attachments
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }


        LogError('Edit_Project', error);
        return errors.serverError(res, 'Server Error' + error.message);
    }
};

// Delete Project
export const deleteProject = async (req, res) => {
    try {
        const companyId = req.userId;
        const { projectId } = req.params;

        const project = await Project.findOne({ _id: projectId, company: companyId });
        if (!project) return errors.notFound(res, "Project not found");

        // ❌ Cannot delete if project is already assigned or completed
        if (['assigned', 'completed'].includes(project.status)) {
            return errors.forbidden(res, "You cannot delete a project that has already been assigned or completed");
        }

        // 🧼 Clean up uploaded file if exists
        if (project.projectFile) {
            const fileId = project.projectFile;
            if (fileId) await deleteFile(fileId);
        }

        await project.deleteOne();

        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("deleteProject error:", error);
        return errors.serverError(res, "Failed to delete project");
    }
};

// Rate Project 
export const rateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workerId = req.userId; // from token
        const { stars, feedback } = req.body;

        if (!stars || stars < 1 || stars > 5) {
            return errors.badRequest(res, "Rating must be between 1 and 5 stars");
        }

        const project = await Project.findById(projectId);
        if (!project) return errors.notFound(res, "Project not found");

        // ✅ Ensure only assigned workers can rate
        const isAssigned = project.assignedTo.some(w => w.toString() === workerId);
        if (!isAssigned) {
            return errors.forbidden(res, "Only assigned workers can rate this project");
        }

        // ❌ Prevent duplicate ratings
        const alreadyRated = project.ratings.find(r => r.by.toString() === workerId);
        if (alreadyRated) {
            return errors.conflict(res, "You have already rated this project");
        }

        // ✅ Add new rating
        project.ratings.push({ by: workerId, stars, feedback });

        // ✅ Recalculate average
        const totalStars = project.ratings.reduce((sum, r) => sum + r.stars, 0);
        project.averageRating = parseFloat((totalStars / project.ratings.length).toFixed(1));

        await project.save();

        return res.status(200).json({ message: "Project rated successfully" });
    } catch (err) {
        console.error("rateProject error:", err);
        return errors.serverError(res, "Failed to rate project");
    }
};

// Likes or DisLikes
export const likeOrDislikeProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { action } = req.body; // "like" or "dislike"
        const workerId = req.userId;

        if (!['like', 'dislike'].includes(action)) {
            return errors.badRequest(res, "Invalid action. Must be 'like' or 'dislike'");
        }

        const project = await Project.findById(projectId);
        if (!project) return errors.notFound(res, "Project not found");

        // Check if worker is assigned to this project
        const isAssigned = project.assignedTo.some(w => w.toString() === workerId);
        if (!isAssigned) {
            return errors.forbidden(res, "Only assigned workers can react to this project");
        }

        // Check if already liked/disliked
        const likedIndex = project.likesList?.findIndex(id => id.toString() === workerId) ?? -1;
        const dislikedIndex = project.dislikesList?.findIndex(id => id.toString() === workerId) ?? -1;

        // Initialize lists if not present
        if (!project.likesList) project.likesList = [];
        if (!project.dislikesList) project.dislikesList = [];

        // Remove from opposite list if exists
        if (action === 'like') {
            if (dislikedIndex !== -1) project.dislikesList.splice(dislikedIndex, 1);
            if (likedIndex === -1) project.likesList.push(workerId);
        } else {
            if (likedIndex !== -1) project.likesList.splice(likedIndex, 1);
            if (dislikedIndex === -1) project.dislikesList.push(workerId);
        }

        // Update total counts
        project.likes = project.likesList.length;
        project.dislikes = project.dislikesList.length;

        await project.save();

        return res.status(200).json({ message: `Project ${action}d successfully` });
    } catch (error) {
        console.error("likeOrDislikeProject error:", error);
        return errors.serverError(res, "Failed to update project reaction");
    }
};

