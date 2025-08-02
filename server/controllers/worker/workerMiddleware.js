import jwt from 'jsonwebtoken';
import { errors } from '../../utils/GlobalErrorHandler.js';
import Worker from '../../models/Worker.js';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadWorkerFilesMulterMiddleware = upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 },
    { name: 'profilePic', maxCount: 1 }
]);

export const validateFileType = (url, type) => {
    const allowedExtensions = {
        image: ['.jpg', '.jpeg'],
        video: ['.mp4'],
        document: ['.pdf']
    };

    const ext = path.extname(url).toLowerCase();

    if (type === 'image') return allowedExtensions.image.includes(ext);
    if (type === 'video') return allowedExtensions.video.includes(ext);
    if (type === 'document') return allowedExtensions.document.includes(ext);

    return false;
};

export const filterFiles = (files, ...allowedFields) => {
    if (!files || typeof files !== 'object') return {};
    return Object.fromEntries(
        Object.entries(files).filter(([key]) => allowedFields.includes(key))
    );
};


export const tokenGeneratorForWorker = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_FOR_WORKER, {
        expiresIn: process.env.JWT_EXPIRES_IN_WORKER
    });
};

export const protectWorkerRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.auth_token || req.headers.Authorization?.replace('Bearer ', '') || req.headers.authorization?.replace('Bearer ', '');
        console.log("token in middleware ", token);
        if (!token) {
            return errors.unauthorized(res, 'Not authenticated. Please login.');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_WORKER); // Make sure your secret matches
        const user = await Worker.findById(decoded.userId).select('_id isVerified');

        if (!user) {
            return errors.unauthorized(res, 'User not found or token invalid');
        }

        if (!user.isVerified) {
            return errors.forbidden(res, 'Account not verified');
        }

        // Attach user to request
        req.userId = user._id;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errors.unauthorized(res, 'Session expired. Please login again.');
        }
        return errors.unauthorized(res, 'Invalid token or not authorized');
    }
};

export const checkWorkerApprovalStatus = async (req, res, next) => {
    try {
        // Extract userId from req.userId or fallback from req.user
        const companyId = req.userId || req.user?._id;

        if (!companyId) {
            return errors.unauthorized(res, 'User ID missing from request');
        }

        // Fetch only approval status
        const company = await Worker.findById(companyId).select('workerVerified');

        if (!company) {
            return errors.notFound(res, 'Company not found');
        }

        // Check verification status
        if (company.workerVerified !== 'completed') {
            return errors.forbidden(
                res,
                `Your account is currently under review. Status: "${company.workerVerified}". You cannot perform this action until verified by admin.`
            );
        }

        next();
    } catch (error) {
        LogError('checkWorkerApprovalStatus', error);
        return errors.serverError(res, 'Error checking company verification status');
    }
};



