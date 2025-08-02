import Company from "../../models/Company.js";
import Project from "../../models/Project.js";
import Worker from "../../models/Worker.js";
import { deleteFile, uploadIDFileFromStream, uploadIntroVideoFileFromStream, uploadProfilePicFromStream } from "../../Service/Imagekit.js";
import sendMail from "../../Service/Mailer.js";
import filterObj from "../../utils/Filter.js";
import { apiResponse, errors } from "../../utils/GlobalErrorHandler.js";
import { LogError } from "../../utils/GlobalLogging.js";
import { filterFiles, tokenGeneratorForWorker, validateFileType } from "./workerMiddleware.js";


// Update Email
export const updateWorkerEmail = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email", "currentPassword")
        const { email, currentPassword } = filteredBody;
        const user = await Worker.findById(req.userId);

        if (!email || !currentPassword) {
            return errors.badRequest(res, "Email and password are required");
        }

        const passwordValid = await user.comparePassword(currentPassword);
        if (!passwordValid) return errors.unauthorized(res, "Incorrect password");

        const deviceId = createDeviceFingerprint(req);
        const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceId);

        if (!isKnownDevice) {
            await user.addKnownDevice({
                deviceId,
                userAgent: req.headers['user-agent'],
                ipAddress: getClientIP(req),
                lastUsed: new Date()
            });
            try {
                await sendMail({
                    to: user.email,
                    subject: "Email Change Detected",
                    html: `
                    <h3>New Email Add in Your Account</h3>
                    <p><b>Time:</b> ${new Date().toLocaleString()}</p>
                    <p><b>IP Address:</b> ${getClientIP(req)}</p>
                    <p><b>Device:</b> ${req.headers['user-agent']}</p>
                    <p>If this was you, no action is needed. If not, please check your account or contact our support team immediately</p>
                    
                `,
                });
                LogData("WorkerUpdateEmail", `Email Change notification sent to ${user.email}`);
            } catch (err) {
                LogError("WorkerUpdateEmail-Notify", err);
                // Optional: don't block login on email failure
            }
        }
        user.lastLogin = new Date();
        await user.save();

        // Token generation
        const token = tokenGeneratorForWorker(user._id);
        // Set secure cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More secure than 'lax'
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined
        });

        user.email = email;
        user.updatedAt = new Date();
        await user.save();
        return apiResponse(200, "Email updated successfully");
    } catch (error) {
        if (error.name === "ValidationError") {
            return errors.unprocessable(res, "Validation failed", error.errors);
        }
        if (error.name === "MongoError" && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError("updateEmail", error);
        return errors.serverError(res, "Failed to update email");
    }
};

// Update Basic Info
export const updateBasicInfo = async (req, res) => {
    try {
        const user = await Worker.findById(req.userId);
        if (!user) return errors.notFound(res, "User not found");

        const filteredFiles = filterFiles(req.files || {}, "idProof", "introVideo", "profilePic");
        const { idProof, introVideo, profilePic } = filteredFiles;
        const { userName, phone, fullName } = req.body || {};
        if (userName) user.userName = userName;
        if (phone) user.phone = phone;
        if (fullName) user.fullName = fullName;

        // File uploads
        if (idProof) {
            const idProofFile = idProof[0];
            if (!validateFileType(idProofFile.originalname, 'document')) {
                return errors.badRequest(res, "Only PDF allowed for ID Proof");
            }
            if (user.idProof?.fileId) await deleteFile(user.idProof.fileId);

            const uploaded = await uploadIDFileFromStream(
                idProofFile.stream,
                `id_${user._id}_${Date.now()}`
            );
            user.idProof = { url: uploaded.url, fileId: uploaded.fileId };
        }

        // Intro Video
        if (introVideo) {
            const introVideoFile = introVideo[0];
            if (!validateFileType(introVideoFile.originalname, 'video')) {
                return errors.badRequest(res, "Only MP4 allowed for intro video");
            }
            if (user.introVideo?.fileId) await deleteFile(user.introVideo.fileId);

            const uploaded = await uploadIntroVideoFileFromStream(
                introVideoFile.stream,
                `intro_${user._id}_${Date.now()}`
            );
            user.introVideo = { url: uploaded.url, fileId: uploaded.fileId };
        }

        // Profile Pic
        if (profilePic) {
            const profilePicFile = profilePic[0];
            if (!validateFileType(profilePicFile.originalname, 'image')) {
                return errors.badRequest(res, "Only JPG or JPEG allowed for profile picture");
            }
            if (user.profilePic?.fileId) await deleteFile(user.profilePic.fileId);

            const uploaded = await uploadProfilePicFromStream(
                profilePicFile.buffer,
                `profile_${user._id}_${Date.now()}`
            );
            user.profilePic = { url: uploaded.url, fileId: uploaded.fileId };
        }
    user.updatedAt = new Date();
    await user.save();
    return apiResponse(res,200, "Profile updated successfully", {
        userName: user.userName || null,
        phone: user.phone || null,
        fullName: user.fullName || null,
        email: user.email || null,
        profilePic: user.profilePic || null,
        introVideo: user.introVideo || null,
        idProof: user.idProof || null,
    });
} catch (err) {
    LogError("updateBasicInfo", err);
    return errors.serverError(res, "Error updating profile");
}
};

export const updateSkillsExperience = async (req, res) => {
    try {
        const { skills, experience } = req.body;
        const user = await Worker.findById(req.userId);

        if (skills) user.skills = skills; // array of strings
        if (experience) user.experience = experience; // array of objects
        user.updatedAt = new Date();
        await user.save();
        return apiResponse(200, "Skills and experience updated");
    } catch (err) {
        LogError("updateSkillsExperience", err);
        return errors.serverError(res, "Update failed");
    }
};

// Get Assigned Projects
export const getAssignedProjects = async (req, res) => {
    try {
        const workerId = req.userId;
        const projects = await Project.find({ assignedTo: workerId })
            .select('projectName category priorityLevel locationCoords status createdAt averageRating company') // Select only needed fields
            .populate({
                path: 'company',
                select: 'companyName email companyAddress'
            });
        return apiResponse(200, "Success", {
            projects
        })
    } catch (e) {
        LogError("Fetch Assigned Projects worker", e);
        return errors.serverError(res, "Failed fetch assigned Project ");
    }
};

export const getCompletedProjects = async (req, res) => {
    try {
        const workerId = req.userId;

        const projects = await Project.find({
            assignedTo: workerId,
            status: 'completed'
        })
            .select('projectName category priorityLevel locationCoords status createdAt averageRating company')
            .populate({
                path: 'company',
                select: 'companyName email location'
            });

        return apiResponse(200, "Success", { projects });
    } catch (e) {
        LogError("Failed to Fetch completed Projects worker", e);
        return errors.serverError(res, "Failed to fetch completed projects");
    }
};


export const addWorkerRating = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { stars, feedback } = req.body;
        const companyId = req.userId; // assumed to be from protectCompanyRoute

        if (!stars || stars < 1 || stars > 5) {
            return errors.badRequest(res, "Rating must be between 1 and 5 stars.");
        }

        const worker = await Worker.findById(workerId);
        if (!worker) return errors.notFound(res, "Worker not found");

        const existingRating = worker.ratings.find(r => r.by.toString() === companyId.toString());
        if (existingRating) {
            return errors.conflict(res, "You have already rated this worker.");
        }

        worker.ratings.push({
            by: companyId,
            stars,
            feedback,
            createdAt: new Date()
        });

        // Recalculate average
        const total = worker.ratings.reduce((sum, r) => sum + r.stars, 0);
        worker.averageRating = parseFloat((total / worker.ratings.length).toFixed(2));

        await worker.save();

        const company = await Company.findById(companyId).select("companyName email companyAddress");

        return apiResponse(200, "Rating submitted successfully", {
            rating: {
                company,
                stars,
                feedback,
            },
            averageRating: worker.averageRating
        });
    } catch (error) {
        LogError("addWorkerRating", error);
        return errors.serverError(res, "Failed to add rating");
    }
};

export const getWorkerRatings = async (req, res) => {
    try {
        const workerId = req.userId; // from protectWorkerRoute

        const worker = await Worker.findById(workerId)
            .populate({
                path: "ratings.by",
                model: "Company",
                select: "companyName email companyAddress"
            });

        if (!worker) return errors.notFound(res, "Worker not found");

        return apiResponse(200, "Fetched ratings successfully", {
            ratings: worker.ratings,
            averageRating: worker.averageRating
        });
    } catch (error) {
        LogError("getWorkerRatings", error);
        return errors.serverError(res, "Failed to fetch ratings");
    }
};

export const toggleLikeWorker = async (req, res) => {
    try {
        const { workerId } = req.params;
        const userId = req.userId;

        const worker = await Worker.findById(workerId);
        if (!worker) return errors.notFound(res, "Worker not found");

        const alreadyLiked = worker.likes.includes(userId);
        const alreadyDisliked = worker.dislikes.includes(userId);

        if (alreadyLiked) {
            // If already liked, remove it (toggle off)
            worker.likes.pull(userId);
        } else {
            // Add like
            worker.likes.push(userId);
            // Remove from dislikes if previously disliked
            if (alreadyDisliked) {
                worker.dislikes.pull(userId);
            }
        }

        await worker.save();
        return apiResponse("Like toggled successfully");
    } catch (error) {
        LogError("toggleLikeWorker", error);
        return errors.serverError(res, "Failed to update like status");
    }
};

export const toggleDislikeWorker = async (req, res) => {
    try {
        const { workerId } = req.params;
        const userId = req.userId;

        const worker = await Worker.findById(workerId);
        if (!worker) return errors.notFound(res, "Worker not found");

        const alreadyDisliked = worker.dislikes.includes(userId);
        const alreadyLiked = worker.likes.includes(userId);

        if (alreadyDisliked) {
            // Remove dislike (toggle off)
            worker.dislikes.pull(userId);
        } else {
            // Add dislike
            worker.dislikes.push(userId);
            // Remove from likes if previously liked
            if (alreadyLiked) {
                worker.likes.pull(userId);
            }
        }

        await worker.save();
        return apiResponse("Dislike toggled successfully");
    } catch (error) {
        LogError("toggleDislikeWorker", error);
        return errors.serverError(res, "Failed to update dislike status");
    }
};

export const getWorkerLikesDislikes = async (req, res) => {
    const { workerId } = req.params;
    const worker = await Worker.findById(workerId).select("likes dislikes averageRating");
    if (!worker) return errors.notFound(res, "Worker not found");

    return apiResponse(200, {
        likes: worker.likes.length,
        dislikes: worker.dislikes.length
    });
};
