import mongoose from "mongoose";
import { isRestrictedEmail } from "../utils/Email_Validators.js";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^[0-9]{6}$/;

const CompanySchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        validate: [
            {
                validator: async function (username) {
                    const existing = await mongoose.models.Company.findOne({ userName: username });
                    if (existing && existing._id.toString() !== this._id.toString()) {
                        return false; // someone else already using it
                    }
                },
                message: (props) => `Username ${props.value} already taken`,
            }
        ]
    },
    companyName: {
        type: String,
        required: [true, 'Company name is Required']
    },
    phone: {
        type: String,
    },
    companyAddress: {
        type: String,
    },
    companyLogo: {
        fileId: String,
        url: String
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "Email must be unique"],
        lowercase: true,
        validate: [
            {
                validator: function (email) {
                    const isValid = emailRegex.test(email);
                    return isValid;
                },
                message: (props) => `Provided email ${props.value} is Invalid`
            },
            {
                validator: function (email) {
                    const isRestrcted = isRestrictedEmail(email);
                    return !isRestrcted;
                },
                message: (props) => `Restricted word use detected in your email ${props.email}`
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        minlength: [8, "Password Minimum 8 Character Long"],
        validate: {
            validator: function (value) {
                const hasNumber = /\d/.test(value);
                const hasLowercase = /[a-z]/.test(value);
                const hasUppercase = /[A-Z]/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                return hasNumber && hasLowercase && hasUppercase && hasSpecialChar;
            },
            message: (props) => `Passowrd must combinaiton of lowercase,uppercase,number and special character. This is :- ${props.value} is invalid`
        }
    },
    passwordExpiry: {
        type: Date,
    },
    otp: {
        type: String,
        minlength: [6, "OTP minimum 6 character long"],
        // validate: [
        //     {
        //         validator: function (value) {
        //             const hasNumber = /\d/.test(value);
        //             return hasNumber;
        //         },
        //         message: (props) => `OTP should only number. This not valid ${props.value}`
        //     },
        //     {
        //         validator: function (value) {
        //             const isValid = otpRegex(value);
        //             return isValid;
        //         },
        //         message: (props) => `Provided OTP ${props.value} is Invalid`
        //     }
        // ]
    },
    otpExpiry: {
        type: Date
    },
    forgotPasswordOtpCount: {
        type: Number,
        default: 0,
        max: 4
    },
    forgotPasswordDelayTime: {
        type: Date
    },
    failedOtpAttempts: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    lastLogin: {
        type: Date,
        default: null
    },
    companyVerified: {
        type: Boolean,
        enum: ["reviewing", "processing", "completed"],
        default: false
    },
    companyverifiedAt: {
        type: Date
    },
    companyStatus: {
        type: String,
        default: 'unfreeze',
        enum: ['freeze', 'unfreeze']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    // bidsReceived: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Bid'
    // }],
    knownDevices: [{
        deviceId: String,
        userAgent: String,
        ipAddress: String,
        lastUsed: Date
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    ratings: [{
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
        stars: { type: Number, min: 1, max: 5 },
        feedback: String,
        createdAt: { type: Date, default: Date.now },
    }],
    averageRating: { type: Number, default: 0 },
    sameIPRegisterRequest: {
        type: Number,
        default: 0,
        maximum: 4,
        delayTime: Date
    }
});

// PRE-SAVE HOOK TO APPEND COMPANY SUFFIX
CompanySchema.pre("save", function (next) {
    if (!this.userName.endsWith(".BHCFamily")) {
        this.userName = `${this.userName}.BHCFamily`;
    }
    next();
});


// HASH PASSWORD BEFORE SAVE
CompanySchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password.toString(), 12);
        this.passwordExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    next();
});

// HASH OTP BEFORE SAVE
CompanySchema.pre("save", async function (next) {
    if (this.isModified("otp") && this.otp) {
        this.otp = await bcrypt.hash(this.otp.toString(), 12);

        //Add expiry Time
        this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    }
    next();
});

// METHOD TO COMPARE PASSWORD
CompanySchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// METHOD TO VERIFY OTP
CompanySchema.methods.correctOtp = async function (enteredOtp) {
    if (!this.otp) return false;
    return await bcrypt.compare(enteredOtp, this.otp);
};

// Method to check if the OTP is expired
CompanySchema.methods.isOtpExpired = function () {
    if (!this.otpExpiryTime) {
        return false;
    }
    return new Date() > this.otpExpiryTime;
}

// Check password expiry
CompanySchema.methods.isPasswordExpired = function () {
    if (!this.passwordExpiry) return true;
    return new Date() > this.passwordExpiry;
};


// UPDATE TIMESTAMP BEFORE SAVE
CompanySchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

CompanySchema.methods.recalculateAverageRating = function () {
    const total = this.ratings.reduce((sum, r) => sum + r.stars, 0);
    this.averageRating = this.ratings.length ? (total / this.ratings.length).toFixed(2) : 0;
    return this.save();
};

// Adding KNown Device
CompanySchema.methods.addKnownDevice = async function (deviceInfo) {
    const existingDevice = this.knownDevices.find(d =>
        d.deviceId === deviceInfo.deviceId
    );

    if (existingDevice) {
        existingDevice.lastUsed = new Date();
    } else {
        this.knownDevices.push({
            ...deviceInfo,
            lastUsed: new Date()
        });
    }

    await this.save();
};

const Company = mongoose.model('Company', CompanySchema);
export default Company;