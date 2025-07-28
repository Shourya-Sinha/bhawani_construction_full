import Company from '../../models/Company.js';
import sendMail from '../../Service/Mailer.js';
import { createDeviceFingerprint, getClientIP } from '../../utils/DeviceFingerPrint.js';
import { GenerateOtp } from '../../utils/generateOTP.js';
import { errors } from '../../utils/GlobalErrorHandler.js';
import { LogData, LogError } from '../../utils/GlobalLogging.js';
import jwt from 'jsonwebtoken';


export const tokenGeneratorForCompany = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_FOR_COMPANY, {
        expiresIn: process.env.JWT_EXPIRES_IN_COMPANY
    });
};


export const sendOTPWithLimit = async ({ user, email, purpose, req }) => {
    const now = new Date();
    const purposeField = {
        register: 'sameIPRegisterRequest',
        forgot: 'forgotPasswordOtpCount'
    }[purpose];

    const delayField = {
        register: 'delayTime',
        forgot: 'forgotPasswordDelayTime'
    }[purpose];

    if (!purposeField || !delayField) {
        throw new Error('Invalid OTP purpose');
    }

    const isBlocked = user[delayField] && user[delayField] > now;
    const maxAttempts = purpose === 'register' ? 5 : 4;

    if (user[purposeField] >= maxAttempts && isBlocked) {
        throw new Error('Too many OTP attempts. Try again after 1 hour');
    }

    const otp = GenerateOtp();
    LogData("SendotpWithLimit",otp)

    try {
        await Promise.race([
            sendMail({
                to: email,
                subject: `${purpose === 'forgot' ? 'Password Reset' : 'Email Verification'} OTP`,
                html: `Your OTP is <b>${otp}</b>. It will expire in 10 minutes.`
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout')), 30000))
        ]);

        LogData('sendOTPWithLimit', `Sent OTP for ${purpose} to ${email}`);
    } catch (error) {
        LogError('sendOTPWithLimit', error);
        throw new Error('Failed to send OTP');
    }

    user.otp = otp;
    user.markModified('otp');
    user[`${purpose}OtpCount`] = (user[`${purpose}OtpCount`] || 0) + 1;
    if (user[`${purpose}OtpCount`] >= maxAttempts) {
        user[delayField] = new Date(Date.now() + 60 * 60 * 1000); // Block 1 hour
    }

    // Add new device if unknown
    const deviceId = createDeviceFingerprint(req);
    const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceId);
    if (!isKnownDevice) {
        await user.addKnownDevice({
            deviceId,
            userAgent: req.headers['user-agent'],
            ipAddress: getClientIP(req),
            lastUsed: new Date()
        });
    }

    await user.save();
};

export const protectCompanyRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.auth_token;

        if (!token) {
            return errors.unauthorized(res, 'Not authenticated. Please login.');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_FOR_COMPANY); // Make sure your secret matches
        const user = await Company.findById(decoded.id).select('_id isVerified');

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

export const checkCompanyApprovalStatus = async (req, res, next) => {
    try {
        // Extract userId from req.userId or fallback from req.user
        const companyId = req.userId || req.user?._id;

        if (!companyId) {
            return errors.unauthorized(res, 'User ID missing from request');
        }

        // Fetch only approval status
        const company = await Company.findById(companyId).select('companyVerified');

        if (!company) {
            return errors.notFound(res, 'Company not found');
        }

        // Check verification status
        if (company.companyVerified !== 'completed') {
            return errors.forbidden(
                res,
                `Your account is currently under review. Status: "${company.companyVerified}". You cannot perform this action until verified by admin.`
            );
        }

        next();
    } catch (error) {
        LogError('checkCompanyApprovalStatus', error);
        return errors.serverError(res, 'Error checking company verification status');
    }
};




