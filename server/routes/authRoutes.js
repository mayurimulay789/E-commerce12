const express = require("express")
const {
  register,
  login,
  verifyMobileOTP,
  resendOTP,
  getProfile,
  updateProfile,
} = require("../controller/authController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-mobile", protect, verifyMobileOTP)
router.post("/resend-otp", protect, resendOTP)
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)

module.exports = router
