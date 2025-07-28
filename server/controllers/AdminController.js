import Bid from "../models/Bid.js";
import Company from "../models/Company.js";
import Project from "../models/Project.js";
import Worker from "../models/Worker.js";
import { apiResponse, errors } from "../utils/GlobalErrorHandler.js";
import { LogError } from "../utils/GlobalLogging.js";
import filterObj from "../utils/Filter.js";
import { GenerateOtp } from "../utils/generateOTP.js";
import { sendOTPWithLimit } from "./company/companyMiddleware.js";
import Admin from "../models/AdminModel.js";
import { tokenGeneratorForAdmin } from "../utils/TokenGenerator.js";

// admin register
export const adminRegister = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email", "password", "name");
        const { email, password, name } = filteredBody;
        //Validation
        if (!email || !password || !name) {
            return errors.badRequest(res, "All fields required");
        }

        if (password.length < 8) {
            return errors.conflict(res, "Paswowrd length min 8 character")
        }

        let user = await Admin.findOne({ email });

        if (user) {
            return errors.conflict(res, "Already Registered")
        }

        const newOTP = GenerateOtp();

        const newUser = new AdminModel({
            name,
            email,
            password,
            otp: newOTP,
            createdAt: new Date(),
        });

        await sendOTPWithLimit({ user: newUser, email, purpose: 'register', req });
        await newUser.save({ new: true });
        return apiResponse(res, 201, 'Registration successful');
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, 'Email already exists');
        }

        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed: ' + error.message);
        }

        LogError("customRegister", error);
        return errors.serverError(res, error.message);
    }
}

// Admin Verify Otp
export const adminVerifyOTP = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, 'email', 'otp');
        const { email, otp } = filteredBody;

        // Input validation
        if (!email || !otp) {
            return errors.badRequest(res, 'All Fields Required')
        }

        // validate password Strength
        if (otp.length < 6) {
            return errors.badRequest(res, 'OTP length Must be atleast 6 Character');
        }

        const user = await Admin.findOne({ email });

        if (!user) {
            return errors.forbidden(res, "Invalid Request") // No need to expose user details
        }


        if (user.isOtpExpired && user.isOtpExpired()) {
            return errors.badRequest(res, 'OTP expired. Please request a new one.');
        }

        // OTP validation
        const isValidOtp = await user.correctOtp(otp.toString());
        if (!isValidOtp) {
            return errors.badRequest(res, 'Invalid OTP');
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const newToken = tokenGeneratorForAdmin(user._id)

        // Set secure cookie
        res.cookie('auth_token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More secure than 'lax'
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined
        });

        return apiResponse(res, 201, 'Email Verified successfully', {
            name: user.name,
            email: user.email,
            userId: user._id
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }


        LogError('VERIFY_EMAIL_ADMIN', error);
        return errors.serverError(res, 'Error in Verification Email' + error.message);
    }
}

// Login Admin
export const adminLogin = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email", "password");
        const { email, password } = filteredBody;
        // Validation
        if (!email || !password) {
            return errors.badRequest(res, "All fields are required");
        }
        //password validaiton
        if (password.length < 8) {
            return errors.badRequest(res, "Password length must be at least 8 characters");
        }
        // find user
        const user = await Admin.findOne({ email });
        if (!user) {
            return errors.forbidden(res, "Invalid credentials")
        }
        if (!user.isVerified) {
            return errors.conflict(res, "User not verified")
        }
        const isCorrectPwd = await user.comparePassword(password);
        if (!isCorrectPwd) {
            return errors.conflict(res, "Incorrect Password")
        }
        user.lastLogin = new Date();
        await user.save();

        // Token generation
        const token = tokenGeneratorForAdmin(user._id);
        // Set secure cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More secure than 'lax'
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined
        });

        return apiResponse(res, 200, 'Login Successfull', {
            email: user.email,
            name: user.name || null,
            userId: user._id
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return errors.unprocessable(res, "Validation failed", error.errors);
        }
        if (error.name === "MongoError" && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError("AdminLogin", error);
        return errors.serverError(res, "Something went wrong: " + error.message);
    }
}

// Admin Logout
export const AdminLogout = async (req, res) => {
    try {
        // Clear the cookie by setting it with expired maxAge
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            domain: process.env.COOKIE_DOMAIN || undefined,
        });
        return apiResponse(res, 200, "Logout Success");
    } catch (error) {
        LogError("AdminLogout", error);
        return errors.serverError(res, 'Logout failed: ' + error.message);
    }
};

// Protect
export const protectAdminRoute = async (req, res, next) => {
  let token;

  // 1. Try Bearer token from Authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Fallback: Try token from cookie (assuming named 'adminToken')
  if (!token && req.cookies?.adminToken) {
    token = req.cookies.adminToken;
  }

  // 3. If no token found, return error
  if (!token) {
    return unauthenticated(res, "Authentication token not found (header or cookie)");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isVerified) {
      return unauthenticated(res, "Invalid or unverified admin");
    }

    req.admin = admin; // attach to request
    next();
  } catch (err) {
    return unauthenticated(res, "Token is invalid or expired");
  }
};

// Role
export const checkAdminRole = (allowedRoles = ['superadmin']) => {
  return (req, res, next) => {
    if (!req.admin) {
      return unauthenticated(res, "Admin not found in request");
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return unauthorized(res, "You don't have permission to perform this action");
    }

    next();
  };
};

// Update Project By Admin
export const updateProjectByAdmin = async (req, res) => {
    try {
        const { projectId } = req.params;
        const {
            assignedTo,
            status,
            priorityLevel,
            category,
        } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return errors.notFound(res, "Project not found");

        if (assignedTo) {
            const validWorkers = await Worker.find({ _id: { $in: assignedTo } });
            if (validWorkers.length !== assignedTo.length)
                return errors.badRequest(res, "Some assigned workers not found");
            project.assignedTo = assignedTo;
        }

        if (status) project.status = status;
        if (priorityLevel) project.priorityLevel = priorityLevel;
        if (category) project.category = category;

        project.updatedAt = new Date();

        await project.save();

        return res.status(200).json({ message: "Project updated by admin", project });
    } catch (err) {
        LogError("Update_Project_By_Admin_Error:", err);
        return errors.serverError(res, "Failed to update worker status");
    }
};

// Verify Worker
export const verifyWorker = async (req, res) => {
    try {
        const { workerId } = req.params;
        const { status } = req.body;

        const worker = await Worker.findById(workerId);
        if (!worker) return errors.notFound(res, "Worker not found");

        worker.workerVerified = status;
        worker.workerVerifiedAt = new Date();

        await worker.save();
        return apiResponse(201, 'Worker Verified Successfully', {
            workerId: worker._id,
            workerVerified,
            workerVerifiedAt
        });
    } catch (err) {
        LogError("verifyWorker error:", err);
        return errors.serverError(res, "Failed to update worker status");
    }
};

// Verify Company
export const verifyCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status } = req.body;

        const company = await Company.findById(companyId);
        if (!company) return errors.notFound(res, "Company not found");

        company.companyVerified = status;
        company.companyverifiedAt = new Date();

        await company.save();
        return apiResponse(201, "Company Verified Successfully", {
            companyId,
            companyVerified,
            companyverifiedAt
        });
    } catch (err) {
        LogError("verifyCompany error:", err);
        return errors.serverError(res, "Failed to update worker status");
    }
};

// Create Bid
export const createBidByAdmin = async (req, res) => {
    try {
        const { projectId } = req.params;
        const adminId = req.userId; // from token
        const { offeredAmount, message } = req.body;

        if (!offeredAmount || offeredAmount < 1000) {
            return errors.badRequest(res, "Bid amount must be at least 1000");
        }

        // Validate project exists
        const project = await Project.findById(projectId);
        if (!project) return errors.notFound(res, "Project not found");

        // Optional: Check if admin already submitted a bid
        const existingBid = await Bid.findOne({ project: projectId, proposedBy: adminId });
        if (existingBid) {
            return errors.conflict(res, "You have already submitted a bid for this project");
        }

        // Create new bid
        const newBid = new Bid({
            project: projectId,
            proposedBy: adminId,
            offeredAmount,
            message
        });

        await newBid.save();

        return apiResponse(201, "Bid Succfully submitted", {
            bidId: newBid._id,
            offeredAmount,
            message,
        })
    } catch (error) {
        LogError("Create Bid error:", err);
        return errors.serverError(res, "Failed to Create Bid");
    }
};

// Final Response
export const finalizeBidByAdmin = async (req, res) => {
    try {
        const { bidId } = req.params;
        const { action, finalAmount } = req.body;

        if (!['accept', 'reject'].includes(action)) {
            return errors.badRequest(res, "Invalid action. Must be 'accept' or 'reject'");
        }

        const bid = await Bid.findById(bidId).populate("project");
        if (!bid) return errors.notFound(res, "Bid not found");

        if (action === 'accept') {
            if (!finalAmount || finalAmount < 1000) {
                return errors.badRequest(res, "Final amount must be a number above 1000");
            }

            bid.finalAmountAgreed = finalAmount;
            bid.status = 'accepted';
        } else {
            bid.finalAmountAgreed = null;
            bid.status = 'rejected';
        }

        bid.updatedAt = new Date();
        await bid.save();

        return res.status(200).json({
            message: `Bid ${action === 'accept' ? 'finalized' : 'rejected'} successfully`,
            bid
        });
    } catch (err) {
        LogError("Finalize Bid error:", err);
        return errors.serverError(res, "Failed to finalize Bid");
    }
};

/** WORKER MANAGEMENT **/
export const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        return apiResponse(200, "success", {
            workers
        })
    } catch (e) {
        console.error(e);
        LogError("Failed to fetch workers:", err);
        return errors.serverError(res, "Failed to fetch workers");
    }
}

export const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.workerId);
        if (!worker) return errors.notFound(res, 'Worker not found');
        return apiResponse(200, "success", {
            worker
        })
    } catch (e) {
        LogError("Failed to fetch workers:", err);
        return errors.serverError(res, 'Failed to fetch worker');
    }
};

export const freezeWorker = async (req, res) => changeWorkerStatus(req, res, false);
export const unfreezeWorker = async (req, res) => changeWorkerStatus(req, res, true);

const changeWorkerStatus = async (req, res, freeze) => {
    try {
        const worker = await Worker.findById(req.params.workerId);
        if (!worker) return errors.notFound(res, 'Worker not found');
        worker.workerStatus = freeze;
        await worker.save();
        return apiResponse(200, `Worker ${freeze ? 'unfrozen' : 'frozen'}`)
    } catch (e) {
        LogError("Failed to change status:", err);
        return errors.serverError(res, 'Failed to change status');
    }
};

/** COMPANY MANAGEMENT **/
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return apiResponse(200, "success", {
            companies
        })
    } catch (e) {
        LogError("Failed to fetch companies:", err);
        return errors.serverError(res, 'Failed to fetch companies');
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const c = await Company.findById(req.params.companyId);
        if (!c) return errors.notFound(res, 'Company not found');
        return apiResponse(200, "success", {
            company: c
        })
    } catch (e) {
        LogError("Failed to fetch companies:", err);
        return errors.serverError(res, 'Failed to fetch company');
    }
};

export const freezeCompany = async (req, res) => changeCompanyStatus(req, res, false);
export const unfreezeCompany = async (req, res) => changeCompanyStatus(req, res, true);

const changeCompanyStatus = async (req, res, freeze) => {
    try {
        const c = await Company.findById(req.params.companyId);
        if (!c) return errors.notFound(res, 'Company not found');
        c.companyStatus = freeze;
        await c.save();
        return apiResponse(200, `Company ${freeze ? 'unfrozen' : 'frozen'}`)
    } catch (e) {
        LogError("Failed to change status:", err);
        return errors.serverError(res, 'Failed to change status');
    }
};

/** PROJECT MANAGEMENT **/
export const getAllProjectsAdmin = async (req, res) => {
    try {
        const projects = await Project.find().populate('company assignedTo bids');
        return apiResponse(200, "success", {
            projects
        })
    } catch (e) {
        LogError("Failed to fetch projects:", e);
        return errors.serverError(res, 'Failed to fetch projects');
    }
};

export const getProjectByIdAdmin = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('company assignedTo bids ratings');
        if (!project) return errors.notFound(res, 'Project not found');
        return apiResponse(200, "success", {
            project
        })
    } catch (e) {
        LogError("Failed to fetch projects:", e);
        return errors.serverError(res, 'Failed to fetch project');
    }
};

/** BID MANAGEMENT **/
export const getAllBidsAdmin = async (req, res) => {
    try {
        const bids = await Bid.find().populate('project proposedBy');
        return apiResponse(200, "success", {
            bids
        })
    } catch (e) {
        LogError("Failed to fetch bids:", e);
        return errors.serverError(res, 'Failed to fetch bids');
    }
};

export const getBidByIdAdmin = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId)
            .populate('project proposedBy');
        if (!bid) return errors.notFound(res, 'Bid not found');
        return apiResponse(200, "success", {
            bid
        })

    } catch (e) {
        LogError("Failed to fetch bid:", e);
        return errors.serverError(res, 'Failed to fetch bid');
    }
};