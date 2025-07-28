import mongoose from "mongoose";
import { isRestrictedEmail } from "../utils/Email_Validators.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^[0-9]{6}$/;

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: [true, "Email must be unique"],
    lowercase: true,
    validate: [
      {
        validator: function (email) {
          const isValid = emailRegex(email);
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
  otp: {
    type: String,
    minlength: [6, "OTP minimum 6 character long"],
  },
  otpExpiry: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'viewer'],
    default: 'viewer'
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});


AdminSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// HASH PASSWORD BEFORE SAVE
AdminSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password.toString(), 12);
    this.passwordExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// HASH OTP BEFORE SAVE
AdminSchema.pre("save", async function (next) {
  if (this.isModified("otp") && this.otp) {
    this.otp = await bcrypt.hash(this.otp.toString(), 12);

    //Add expiry Time
    this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  }
  next();
});

// METHOD TO COMPARE PASSWORD
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// METHOD TO VERIFY OTP
AdminSchema.methods.correctOtp = async function (enteredOtp) {
  if (!this.otp) return false;
  return await bcrypt.compare(enteredOtp, this.otp);
};

// Method to check if the OTP is expired
AdminSchema.methods.isOtpExpired = function () {
  if (!this.otpExpiryTime) {
    return false;
  }
  return new Date() > this.otpExpiryTime;
}

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin
