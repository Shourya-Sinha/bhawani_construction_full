import Bid from "../../models/Bid.js";
import Company from "../../models/Company.js";
import Project from "../../models/Project.js";
import Worker from "../../models/Worker.js";
import { uploadCompanyLogoFromStream } from "../../Service/Imagekit.js";
import sendMail from "../../Service/Mailer.js";
import { createDeviceFingerprint } from "../../utils/DeviceFingerPrint.js";
import filterObj from "../../utils/Filter.js";
import { apiResponse, errors } from "../../utils/GlobalErrorHandler.js";
import { LogData, LogError } from "../../utils/GlobalLogging.js";
import { tokenGeneratorForCompany } from "./companyMiddleware.js";

// Update details
export const updateCompanyProfileDetails = async (req, res) => {
    try {
        const companyId = req.userId;
        const { companyName, phone } = req.body;

        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        if (companyName) company.companyName = companyName;
        if (phone) company.phone = phone;

        company.updatedAt = new Date();
        await company.save();

        return apiResponse(200, "profile updated successfully", {
            companyName: company.companyName || null,
            phone: company.phone || null,
            companyAddress: company.companyAddress || null,
            companyLogo: company.companyLogo || null,
            companyVerified: company.companyVerified || null,
            companyStatus: company.companyStatus || null,
            companyverifiedAt: company.companyverifiedAt || null,
            accountVerified: company.isVerified || null,

        });
    } catch (error) {
        LogError("updateCompanyProfileDetails", error);
        return errors.serverError(res, "Failed to update company profile");
    }
};
// Update Logo
export const updateCompanyLogo = async (req, res) => {
    try {
        const companyId = req.userId;
        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        if (!req.file || !req.file.buffer) return errors.badRequest(res, "No logo file uploaded");

        // Delete old logo if exists
        if (company.companyLogo?.fileId) {
            await deleteFile(company.companyLogo.fileId);
        }

        const uploaded = await uploadCompanyLogoFromStream(
            Readable.from(req.file.buffer),
            `${company._id}_logo_${Date.now()}`
        );

        company.companyLogo = {
            fileId: uploaded.fileId,
            url: uploaded.url
        };
        company.updatedAt = new Date();
        await company.save();

        return apiResponse(200,
            "logo updated successfully", {
            companyLogo: company.companyLogo
        });
    } catch (error) {
        LogError("updateCompanyLogo", error);
        return errors.serverError(res, "Failed to update company logo");
    }
};

// Update email
export const updateCompanyEmail = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email", "currentPassword")
        const { email, currentPassword } = filteredBody;
        const user = await Company.findById(req.userId);

        if (!email || !currentPassword) {
            return errors.badRequest(res, "Email and password are required");
        }

        const passwordValid = await user.comparePassword(currentPassword);
        if (!passwordValid) return errors.unauthenticated(res, "Incorrect password");

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
                LogData("CompnayUpdateEmail", `Email Change notification sent to ${user.email}`);
            } catch (err) {
                LogError("CompnayUpdateEmail-Notify", err);
                // Optional: don't block login on email failure
            }
        }
        user.lastLogin = new Date();
        await user.save();

        // Token generation
        const token = tokenGeneratorForCompany(user._id);
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
        return apiResponse(100, "Email updated successfully");
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

export const addComapanyRating = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { stars, feedback } = req.body;
        const workerId = req.userId; // assumed to be from protectCompanyRoute

        if (!stars || stars < 1 || stars > 5) {
            return errors.badRequest(res, "Rating must be between 1 and 5 stars.");
        }

        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        const existingRating = company.ratings.find(r => r.by.toString() === workerId.toString());
        if (existingRating) {
            return errors.conflict(res, "You have already rated this company.");
        }

        company.ratings.push({
            by: workerId,
            stars,
            feedback,
            createdAt: new Date()
        });

        // Recalculate average
        const total = company.ratings.reduce((sum, r) => sum + r.stars, 0);
        company.averageRating = parseFloat((total / company.ratings.length).toFixed(2));

        await company.save();

        const worker = await Worker.findById(workerId).select("fullName email workerAddress");

        return apiResponse(200, "Rating submitted successfully", {
            rating: {
                worker,
                stars,
                feedback,
            },
            averageRating: company.averageRating
        });

    } catch (error) {
        LogError("addWorkerRating", error);
        return errors.serverError(res, "Failed to add rating");
    }
};

export const toggleLikeCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const userId = req.userId;

        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        const alreadyLiked = company.likes.includes(userId);
        const alreadyDisliked = company.dislikes.includes(userId);

        if (alreadyLiked) {
            // If already liked, remove it (toggle off)
            company.likes.pull(userId);
        } else {
            // Add like
            company.likes.push(userId);
            // Remove from dislikes if previously disliked
            if (alreadyDisliked) {
                company.dislikes.pull(userId);
            }
        }

        await company.save();
        return apiResponse(200, "Like successfully");
    } catch (error) {
        LogError("toggleLikeWorker", error);
        return errors.serverError(res, "Failed to update like status");
    }
};

export const toggleDislikeCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const userId = req.userId;

        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        const alreadyDisliked = company.dislikes.includes(userId);
        const alreadyLiked = company.likes.includes(userId);

        if (alreadyDisliked) {
            // Remove dislike (toggle off)
            company.dislikes.pull(userId);
        } else {
            // Add dislike
            company.dislikes.push(userId);
            // Remove from likes if previously liked
            if (alreadyLiked) {
                company.likes.pull(userId);
            }
        }

        await company.save();
        return apiResponse(200, "Dislike successfully");
    } catch (error) {
        LogError("toggleDislikeCompany", error);
        return errors.serverError(res, "Failed to update dislike status");
    }
};

export const getCompanyRatings = async (req, res) => {
    try {
        const companyId = req.userId; // from protectWorkerRoute

        const company = await Worker.findById(companyId)
            .populate({
                path: "ratings.by",
                model: "Worker",
                select: "fullName email workerAddress"
            });

        if (!company) return errors.notFound(res, "Company not found");

        return apiResponse(200, "Fetched ratings successfully", {
            ratings: company.ratings,
            averageRating: company.averageRating
        });
    } catch (error) {
        LogError("getWorkerRatings", error);
        return errors.serverError(res, "Failed to fetch ratings");
    }
};

export const getCompanyLikesDislikes = async (req, res) => {
    const { companyId } = req.params;
    const company = await Company.findById(companyId).select("likes dislikes averageRating");
    if (!company) return errors.notFound(res, "Company not found");

    return res.status(200).json({
        likes: company.likes.length,
        dislikes: company.dislikes.length
    });
};

// Bid Counter 
export const respondToBidByCompany = async (req, res) => {
    try {
        const { bidId } = req.params;
        const companyId = req.userId; // From company token
        const { response, counterOffer } = req.body;

        if (!['accepted', 'rejected', 'countered'].includes(response)) {
            return errors.badRequest(res, "Invalid response type");
        }

        const bid = await Bid.findById(bidId)
            .populate({
                path: "project",
                populate: {
                    path: "company",
                    select: "companyName email phone"
                },
                select: "projectName createdAt locationCoords budget category priorityLevel"
            });

        if (!bid) return errors.notFound(res, "Bid not found");

        const project = bid.project;

        if (project.company._id.toString() !== companyId) {
            return errors.unauthenticated(res, "You are not authorized to respond to this bid");
        }

        // If company counters the offer
        if (response === 'countered') {
            if (!counterOffer || counterOffer < 1000) {
                return errors.badRequest(res, "Counter offer must be at least 1000");
            }
            bid.counterOffer = counterOffer;
        }

        bid.response = response;
        bid.status = response;
        bid.updatedAt = new Date();
        await bid.save();

        const responseData = {
            companyName: project.company.companyName,
            companyEmail: project.company.email,
            companyPhone: project.company.phone,
            projectName: project.projectName,
            projectStartDate: project.createdAt, // Using createdAt as projectStartDate
            location: project.locationCoords,
            offeredAmount: bid.offeredAmount,
            counterOffer: bid.counterOffer || null,
            status: bid.status,
            response: bid.response,
            bidStartTime: bid.createdAt
        };

        return apiResponse(200, "Response recorded", responseData);
    } catch (err) {
        LogError("Respond to Bid", err);
        return errors.serverError(res, "Failed to Response on Bid");
    }
};

// Get all Projects 
export const getAllProjects = async (req, res) => {
    try {
        const companyId = req.userId;
        const projects = await Project.find({ company: companyId })
            .populate({
                path: 'bids',
                select: 'offeredAmount status createdAt'
            })
            .populate({
                path: 'assignedTo',
                select: 'fullName email googleName workerVerified'
            })
            .populate({
                path: 'company',
                select: 'companyName email phone'
            })
            .sort({ createdAt: -1 });

        const formattedProjects = projects.map(project => ({
            // Project basic info
            projectId: project._id,
            projectName: project.projectName,
            budget: project.budget,
            category: project.category,
            priorityLevel: project.priorityLevel,
            status: project.status,
            isPublished: project.isPublished,
            createdAt: project.createdAt,

            // Project details
            carpetArea: project.details?.carpetArea,
            location: project.details?.location,
            locationLat: project.locationCoords?.lat,
            locationLng: project.locationCoords?.lng,
            deadline: project.deadline,
            bidClosingDate: project.bidClosingDate,
            estimatedDuration: project.estimatedDuration,

            // Files and attachments
            projectFile: project.projectFile,
            attachments: project.attachments,
            requirements: project.requirements,

            // Company info
            companyName: project.company.companyName,
            companyEmail: project.company.email,
            companyPhone: project.company.phone,

            // Bids summary
            bidsCount: project.bids.length,
            bids: project.bids.map(bid => ({
                bidId: bid._id,
                offeredAmount: bid.offeredAmount,
                status: bid.status,
                createdAt: bid.createdAt
            })),

            // Assigned workers
            assignedWorkers: project.assignedTo.map(worker => ({
                workerId: worker._id,
                fullName: worker.fullName,
                email: worker.email,
                gAuthName: worker.googleName,
                verifiedByAdmin: worker.workerVerified
            })),

            // Ratings and engagement
            averageRating: project.averageRating,
            views: project.views,
            likesCount: project.likesList.length,
            dislikesCount: project.dislikesList.length
        }));
        return apiResponse(200, "Projects fetched successfully", {
            // count: formattedProjects.length,
            projects: formattedProjects
        });
    } catch (e) {
        LogError("Fetch Projects", err);
        return errors.serverError(res, "Failed fetchj Project");
    }
};

// Get Single Projects
export const getProjectById = async (req, res) => {
    try {
        const companyId = req.userId;
        const { projectId } = req.params;
        const project = await Project.findOne({ _id: projectId, company: companyId })
            .populate('bids assignedTo ratings');
        if (!project) return errors.notFound(res, 'Project not found');
        return apiResponse(200, "Success", {
            project
        })
    } catch (e) {
        LogError("Fetch Projects", err);
        return errors.serverError(res, "Failed fetch Project");
    }
};

// Get All Bids
export const getAllBids = async (req, res) => {
    try {
        const companyId = req.userId;

        const bids = await Bid.find()
            .populate({
                path: 'project',
                match: { company: companyId },
                populate: {
                    path: 'company',
                    select: 'companyName email phone'
                },
                select: 'projectName createdAt locationCoords budget category priorityLevel'
            })
            .populate({
                path: 'proposedBy',
                select: 'firstName lastName email phone'
            })
            .sort({ createdAt: -1 });

        const filtered = bids.filter(b => b.project); // only bids for this company

        const formattedBids = filtered.map(bid => ({
            // Bid fields
            bidId: bid._id,
            offeredAmount: bid.offeredAmount,
            message: bid.message,
            response: bid.response,
            status: bid.status,
            counterOffer: bid.counterOffer,
            finalAmountAgreed: bid.finalAmountAgreed,
            bidCreatedAt: bid.createdAt,
            bidUpdatedAt: bid.updatedAt,

            // ProposedBy fields (if exists)
            proposedById: bid.proposedBy?._id,
            proposedByName: bid.proposedBy ? `${bid.proposedBy.firstName} ${bid.proposedBy.lastName}` : null,
            proposedByEmail: bid.proposedBy?.email,
            proposedByPhone: bid.proposedBy?.phone,

            // Project fields
            projectId: bid.project._id,
            projectName: bid.project.projectName,
            projectCreatedAt: bid.project.createdAt,
            projectBudget: bid.project.budget,
            projectCategory: bid.project.category,
            projectPriority: bid.project.priorityLevel,

            // Location fields
            locationLat: bid.project.locationCoords?.lat,
            locationLng: bid.project.locationCoords?.lng,

            // Company fields
            companyName: bid.project.company.companyName,
            companyEmail: bid.project.company.email,
            companyPhone: bid.project.company.phone
        }));

        return apiResponse(200, "Success", {
            count: formattedBids.length,
            bids: formattedBids
        });
    } catch (err) {
        LogError("Fetch Bids", err);
        return errors.serverError(res, "Failed to fetch Bids");
    }
};

// Get Bid By Id
export const getBidById = async (req, res) => {
    try {
        const companyId = req.userId;
        const { bidId } = req.params;
        const bid = await Bid.findById(bidId)
            .populate({
                path: 'project',
                select: 'projectName budget category priorityLevel createdAt locationCoords company',
                populate: {
                    path: 'company',
                    select: 'companyName email phone'
                }
            })
            .populate({
                path: 'proposedBy',
                select: 'email'
            });
        if (!bid) return errors.notFound(res, 'Bid not found');
        if (bid.project.company.toString() !== companyId)
            return errors.unauthenticated(res, 'Not authorized');
        const responseData = {
            // Bid information
            bidId: bid._id,
            offeredAmount: bid.offeredAmount,
            message: bid.message,
            status: bid.status,
            response: bid.response,
            counterOffer: bid.counterOffer,
            finalAmountAgreed: bid.finalAmountAgreed,
            createdAt: bid.createdAt,

            // Project information
            projectId: bid.project._id,
            projectName: bid.project.projectName,
            projectBudget: bid.project.budget,
            projectCategory: bid.project.category,
            projectPriority: bid.project.priorityLevel,
            projectCreatedAt: bid.project.createdAt,

            // Location
            locationLat: bid.project.locationCoords?.lat,
            locationLng: bid.project.locationCoords?.lng,

            // Company information
            companyName: bid.project.company.companyName,
            companyEmail: bid.project.company.email,
            companyPhone: bid.project.company.phone,

            // ProposedBy information (if exists)
            proposedById: bid.proposedBy?._id,
            proposedByEmail: bid.proposedBy?.email,
        };
        return apiResponse(200, "Success", {data:responseData});
    } catch (e) {
        LogError("Fetch Bids", err);
        return errors.serverError(res, "Failed fetch Bid");
    }
};

// Get Profiule
export const getCompanyProfile = async (req, res) => {
    try {
        const companyId = req.userId;

        // Get company info
        const company = await Company.findById(companyId).lean();
        if (!company) {
            return errors.notFound(res, 'Company not found');
        }

        // Get all projects related to the company
        const projects = await Project.find({ company: companyId }).lean();

        const totalProjects = projects.length;

        // Status counts: open, reviewing, assigned, completed
        const statusCounts = projects.reduce((acc, project) => {
            const status = project.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Priority counts: low, medium, high
        const priorityCounts = projects.reduce((acc, project) => {
            const priority = project.priorityLevel || 'unknown';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});

        // Category counts: residential, commercial, etc.
        const categoryCounts = projects.reduce((acc, project) => {
            const category = project.category || 'other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        // Likes & Dislikes counts from company schema
        const likesCount = company.likesList?.length || 0;
        const dislikesCount = company.dislikesList?.length || 0;

        // Final profile object
        const profile = {
            companyName: company.companyName,
            userName: company.userName,
            email: company.email,
            phone: company.phone,
            companyAddress: company.companyAddress,
            companyLogo: company.companyLogo,
            isVerified: company.isVerified,
            companyVerified: company.companyVerified,
            companyStatus: company.companyStatus,
            createdAt: company.createdAt,
            averageRating: company.averageRating,
            totalRatings: company.ratings?.length || 0,
            totalLikes: likesCount,
            totalDislikes: dislikesCount,
            projectStats: {
                totalProjects,
                ...statusCounts,
                priorities: priorityCounts,
                categories: categoryCounts,
            },
        };

        return apiResponse(res,200, "Data fetched Successfully", { data: profile });
    } catch (error) {
        console.error('[CompanyProfileError]', error);
        return errors.serverError(res, 'Server Error' );
    }
};