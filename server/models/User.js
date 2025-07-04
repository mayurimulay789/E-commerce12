const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    mobile: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "marketer"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiresAt: Date,
      attempts: {
        type: Number,
        default: 0,
      },
    },
    profile: {
      avatar: {
        url: String,
        publicId: String,
      },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      addresses: [
        {
          type: {
            type: String,
            enum: ["home", "work", "other"],
            default: "home",
          },
          name: String,
          mobile: String,
          addressLine1: String,
          addressLine2: String,
          city: String,
          state: String,
          pincode: String,
          landmark: String,
          isDefault: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      smsUpdates: {
        type: Boolean,
        default: true,
      },
      emailUpdates: {
        type: Boolean,
        default: true,
      },
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "banned"],
      default: "active",
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ mobile: 1 })
userSchema.index({ role: 1 })
userSchema.index({ accountStatus: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0,
  }
  return otp
}

// Verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
  if (!this.otp || !this.otp.code) {
    return false
  }

  if (this.otp.expiresAt < new Date()) {
    return false
  }

  if (this.otp.attempts >= 3) {
    return false
  }

  if (this.otp.code !== enteredOTP) {
    this.otp.attempts += 1
    return false
  }

  // Clear OTP after successful verification
  this.otp = undefined
  this.mobileVerified = true
  this.isVerified = true
  return true
}

module.exports = mongoose.model("User", userSchema)
