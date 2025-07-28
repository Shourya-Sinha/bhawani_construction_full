import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isRestrictedEmail } from "../utils/Email_Validators.js";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^[0-9]{6}$/;


const WorkerSchema = new mongoose.Schema({
    googleName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        validate: [
            {
                validator: async function (username) {
                    const existing = await mongoose.models.Worker.findOne({ userName: username });
                    if (existing && existing._id.toString() !== this._id.toString()) {
                        return false; // someone else already using it
                    }
                },
                message: (props) => `Username ${props.value} already taken`,
            }
        ]
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
    googleId: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
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
        //             const isValid = otpRegex.test(value);
        //             return isValid;
        //         },
        //         message: (props) => `Provided OTP ${props.value} is Invalid`
        //     }
        // ]
    },
    workerAddress:{
        type:String
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
    registeredViaGoogle: {
        type: Boolean,
        default: false,
    },
    idProof: {
        fileId: String,
        url: String
    },
    introVideo: {
        fileId: String,
        url: String
    },
    profilePic: {
        fileId: String,
        url: String
    },
    experience: [{
        title: String,
        description: String,
        duration: String
    }],
    skills: [String],
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    workerVerified: {
        type: Boolean,
        enum: ["reviewing", "processing", "completed"],
        default: false
    },
    workerVerifiedAt: {
        type: Date,
    },
    workerStatus: {
        type: String,
        default: 'unfreeze',
        enum: ['freeze', 'unfreeze']
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    knownDevices: [{
        deviceId: String,
        userAgent: String,
        ipAddress: String,
        lastUsed: Date
    }],
    ratings: [{
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        stars: { type: Number, min: 1, max: 5 },
        feedback: String,
        createdAt: { type: Date, default: Date.now },
    }],
    averageRating: { type: Number, default: 0 },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }],
    sameIPRegisterRequest: {
        type: Number,
        default: 0,
        maximum: 4,
        delayTime: Date
    }
});

// PRE-SAVE HOOK TO APPEND COMPANY SUFFIX
WorkerSchema.pre("save", function (next) {
    if (!this.userName.endsWith(".BHCFamily")) {
        this.userName = `${this.userName}.BHCFamily`;
    }
    next();
});


// HASH PASSWORD BEFORE SAVE
WorkerSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
    next();
});

// HASH OTP BEFORE SAVE
WorkerSchema.pre("save", async function (next) {
    if (this.isModified("otp") && this.otp) {
        this.otp = await bcrypt.hash(this.otp.toString(), 12);

        //Add expiry Time
        this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    }
    next();
});

// METHOD TO COMPARE PASSWORD
WorkerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// METHOD TO VERIFY OTP
WorkerSchema.methods.correctOtp = async function (enteredOtp) {
    if (!this.otp) return false;
    return await bcrypt.compare(enteredOtp, this.otp);
};

// Method to check if the OTP is expired
WorkerSchema.methods.isOtpExpired = function () {
    if (!this.otpExpiryTime) {
        return false;
    }
    return new Date() > this.otpExpiryTime;
}

// Check password expiry
WorkerSchema.methods.isPasswordExpired = function () {
    if (!this.passwordExpiry) return true;
    return new Date() > this.passwordExpiry;
};

// UPDATE TIMESTAMP BEFORE SAVE
WorkerSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

WorkerSchema.methods.recalculateAverageRating = function () {
    const total = this.ratings.reduce((sum, r) => sum + r.stars, 0);
    this.averageRating = this.ratings.length ? (total / this.ratings.length).toFixed(2) : 0;
    return this.save();
};

WorkerSchema.methods.addKnownDevice = async function (deviceInfo) {
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

const Worker = mongoose.model('Worker', WorkerSchema);
export default Worker;