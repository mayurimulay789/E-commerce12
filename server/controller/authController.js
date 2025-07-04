const User = require("../models/User")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  })
}

// Send OTP (Mock implementation - integrate with SMS service)
const sendOTP = async (mobile, otp) => {
  // Integrate with SMS service like Twilio, MSG91, etc.
  console.log(`OTP for ${mobile}: ${otp}`)
  return true
}

const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body

    // Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    })

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "mobile number"
      return res.status(400).json({
        success: false,
        message: `User already exists with this ${field}`,
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password,
    })

    // Generate OTP for mobile verification
    const otp = user.generateMobileOTP()
    await user.save()

    // Send OTP
    await sendOTP(mobile, otp)

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your mobile number.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
      },
      requiresVerification: true,
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}

const login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body

    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      })
    }

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Account is inactive. Please contact support.",
      })
    }

    // Update login info
    await user.updateLoginInfo()

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

const verifyMobileOTP = async (req, res) => {
  try {
    const { otp } = req.body

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      })
    }

    const user = await User.findById(req.user.id)

    if (!user.mobileVerificationOTP || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      })
    }

    if (user.mobileVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    // Verify mobile
    user.mobileVerified = true
    user.mobileVerificationOTP = undefined
    user.otpExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: "Mobile number verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    })
  }
}

const resendOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    const otp = user.generateMobileOTP()
    await user.save()

    await sendOTP(user.mobile, otp)

    res.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist")
    res.json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, addresses } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, { name, addresses }, { new: true, runValidators: true })

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  register,
  login,
  verifyMobileOTP,
  resendOTP,
  getProfile,
  updateProfile,
}
