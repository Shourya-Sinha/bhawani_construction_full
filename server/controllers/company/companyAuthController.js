import Company from "../../models/Company.js";
import sendMail from "../../Service/Mailer.js";
import { createDeviceFingerprint, getClientIP } from "../../utils/DeviceFingerPrint.js";
import filterObj from "../../utils/Filter.js";
import { GenerateOtp } from "../../utils/generateOTP.js";
import { apiResponse, errors } from "../../utils/GlobalErrorHandler.js";
import { LogError } from "../../utils/GlobalLogging.js";
import { sendOTPWithLimit, tokenGeneratorForCompany } from "./companyMiddleware.js";


// Custom Company Register
export const CompanyCustomRegister = async function (req, res, next) {
    try {
        const filteredBody = filterObj(req.body, 'email', 'password','comnpanyName','userName');
        const { email, password ,comnpanyName,userName} = filteredBody;

        // INPUT Validation
        if (!email || !password || !comnpanyName || !userName) {
            return errors.badRequest(res, 'All field required')
        }
        // validate password strength
        if (password.length < 8) {
            return errors.badRequest(res, 'Password length must be 8 character');
        }
        // Find User
        let user = await Company.findOne({ email });
        if (user) {
            const now = new Date();
            const delayExpiry = user.delayTime && new Date(user.delayTime) > now;
            if (user.sameIPRegisterRequest >= 4 && delayExpiry) {
                return errors.tooManyRequests(res, 'Too many requests. Please try again after 1 hour.');
            }
            if (user.isVerified) {
                return errors.conflict(res, 'Email is already registered and verified');
            }
            user.password = password;
            user.userName = userName;
            user.comnpanyName=comnpanyName
            await sendOTPWithLimit({ user, email, purpose: 'register', req });
            return apiResponse(res, 201, 'OTP sent for verification');
        }
        // New user case
        const newOTP = GenerateOtp();
        const newUser = new Company({
            comnpanyName,
            email,
            userName,
            password,
            otp: newOTP,
            createdAt: new Date(),
            sameIPRegisterRequest: 1,
            delayTime: new Date(Date.now() + 60 * 60 * 1000)
        });

        // Send Otp for verify email for new user
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

// Verify OTP and set Password
export const CompanyVerifyEmail = async (req, res) => {
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

        const user = await Company.findOne({ email });

        if (!user) {
            return errors.forbidden(res, "Invalid Request") // No need to expose user details
        }

        if (user.isVerified) {
            return errors.conflict(res, 'User already verified');
        }

        if (user.failedOtpAttempts >= 5) {
            return errors.tooManyRequests(res, 'Too many invalid attempts. Please try again later.');
        }

        if (user.isOtpExpired && user.isOtpExpired()) {
            return errors.badRequest(res, 'OTP expired. Please request a new one.');
        }


        // OTP validation
        const isValidOtp = await user.correctOtp(otp.toString());
        if (!isValidOtp) {
            user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1;
            await user.save();
            return errors.badRequest(res, 'Invalid OTP');
        }

        user.verifiedAt = new Date();
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.failedOtpAttempts = 0;

        const deviceFingerprint = createDeviceFingerprint(req);
        const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceFingerprint);
        if (!isKnownDevice) {
            await user.addKnownDevice({
                deviceId: deviceFingerprint,
                userAgent: req.headers['user-agent'],
                ipAddress: getClientIP(req),
                lastUsed: new Date()
            });
        }

        await user.save();

        const newToken = tokenGeneratorForCompany(user._id)

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
                email: user.email,
                userId: user._id,
                userName:user.userName,
                companyName:user.companyName,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }


        LogError('VERIFY_EMAIL', error);
        return errors.serverError(res, 'Error in Verification Email' + error.message);
    }
}

//Resend Otp
export const CompanyResendOTP = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email");
        const { email } = filteredBody;

        if (!email) {
            return errors.badRequest(res, 'Email is required');
        }

        const user = await Company.findOne({ email });

        if (!user) {
            return errors.forbidden(res, "Invalid request")
        }

        if (user.isVerified) {
            return errors.badRequest(res, 'User is already verified');
        }
        const deviceFingerprint = createDeviceFingerprint(req);
        const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceFingerprint);

        if (!isKnownDevice) {
            await user.addKnownDevice({
                deviceId: deviceFingerprint,
                userAgent: req.headers['user-agent'],
                ipAddress: getClientIP(req),
                lastUsed: new Date()
            });
        }

        const now = new Date();
        const delayExpiry = user.delayTime && new Date(user.delayTime) > now;

        if (user.sameIPRegisterRequest >= 5 && delayExpiry) {
            return errors.tooManyRequests(res, "Too many OTP requests. Try again after 1 hour.");
        }
        await sendOTPWithLimit({ user, email, purpose: 'register', req });

        return apiResponse(res, 200, "OTP sent successfully");
    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError("CompanyResendOTP", error);
        return errors.serverError(res, "Something went wrong");
    }
}

// ForgotPassword
export const CompanyForgotPassword = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, 'email');
        const { email } = filteredBody;

        if (!email) {
            return errors.badRequest(res, 'Email is required');
        }

        const user = await Company.findOne({ email });

        if (!user) {
            return errors.forbidden(res, 'Invalid Credentials');
        }
        await sendOTPWithLimit({ user, email, purpose: 'forgot', req });
        return apiResponse(res, 200, "OTP sent successfully to you email");
    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError('CompanyForgotPassword', error);
        return errors.serverError(res, 'Something went wrong' + error.message);
    }
}

// Reset Password
export const CompanyResetPassword = async (req, res) => {
    try {
        const filteredBody = filterObj(req.body, "email", "otp", "newPassword");
        const { email, otp, newPassword } = filteredBody;

        // Check required fields
        if (!email || !otp || !newPassword) {
            return errors.badRequest(res, 'All fields are required');
        }
        if (newPassword.length < 8) {
            return errors.badRequest(req, "Password length not match")
        }
        const user = await Company.findOne({ email });

        if (!user) {
            return errors.forbidden(res, 'Invalid request'); // not expose user
        }
        if (user.isVerified === false) {
            return errors.forbidden(res, 'User is not verified yet');
        }

        if (!user.otp || !user.otpExpiry) {
            return errors.badRequest(res, 'No OTP was generated. Please request a new one');
        }

        if (user.isOtpExpired && user.isOtpExpired()) {
            return errors.badRequest(res, 'OTP has expired. Please request a new one');
        }

        const isOtpValid = await user.correctOtp(otp);
        if (!isOtpValid) {
            return errors.badRequest(res, 'Invalid OTP');
        }
        const deviceFingerprint = createDeviceFingerprint(req);
        const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceFingerprint);

        if (!isKnownDevice) {
            await user.addKnownDevice({
                deviceId: deviceFingerprint,
                userAgent: req.headers['user-agent'],
                ipAddress: getClientIP(req)
            });
        }

        // Update password and reset OTP info
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.forgotPasswordOtpCount = 0;
        user.forgotPasswordDelayTime = null;
        user.updatedAt = new Date();

        await user.save();

        return apiResponse(res, 200, "Password reset Successfully");
    } catch (error) {
        if (error.name === 'ValidationError') {
            return errors.unprocessable(res, 'Validation failed', error.errors);
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError("CompanyResetPassword", error);
        return errors.serverError(res, 'Something went wrong' + error.message);
    }
}

// Login
export const CompanyLogin = async (req, res) => {
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
        const user = await Company.findOne({ email });
        if (!user) {
            return errors.forbidden(res, "Invalid credentials")
        }
        if (!user.isVerified) {
            return errors.conflict(res, "User not verified")
        }
        if (typeof user.isPasswordExpired === 'function' && await user.isPasswordExpired()) {
            return errors.badRequest(res, "Your password has expired. Please reset it.");
        }
        const isCorrectPwd = await user.comparePassword(password);
        if (!isCorrectPwd) {
            return errors.conflict(res, "Incorrect Password")
        }

        const deviceId = createDeviceFingerprint(req);
        const isKnownDevice = user.deviceFingerPrint?.some(d => d.deviceId === deviceId);

        if (!isKnownDevice) {
            await user.addKnownDevice({
                deviceId,
                userAgent: req.headers['user-agent'],
                ipAddress: getClientIP(req)
            });
            try {
                await sendMail({
                    to: user.email,
                    subject: "New Login Detected",
                    html: `
            <h3>New Login to Your Account</h3>
            <p><b>Time:</b> ${new Date().toLocaleString()}</p>
            <p><b>IP Address:</b> ${getClientIP(req)}</p>
            <p><b>Device:</b> ${req.headers['user-agent']}</p>
            <p>If this was you, no action is needed. If not, please reset your password immediately.</p>
            
        `,
                });
                LogData("CompanyLogin", `Login notification sent to ${user.email}`);
            } catch (err) {
                LogError("CompanyLogin-Notify", err);
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

        return apiResponse(res, 200, 'Login Successfull', {
            email: user.email,
            userName: user.userName || null,
            companyName: user.companyName || null,
            userId:user._id
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return errors.unprocessable(res, "Validation failed", error.errors);
        }
        if (error.name === "MongoError" && error.code === 11000) {
            return errors.conflict(res, error);
        }
        LogError("CompanyLogin", error);
        return errors.serverError(res, "Something went wrong: " + error.message);
    }
}

// Logout Controller
export const CompanyLogout = async (req, res) => {
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
        LogError("CompanyLogout", error);
        return errors.serverError(res, 'Logout failed: ' + error.message);
    }
};

