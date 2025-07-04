const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const { productUpload, bannerUpload, avatarUpload } = require("../config/cloudinary")
const {
  uploadProductImages,
  uploadBannerImage,
  uploadAvatar,
  deleteUploadedImage,
} = require("../controllers/uploadController")

// Product image upload (Admin only)
router.post("/product-images", protect, authorize("admin"), productUpload.array("images", 10), uploadProductImages)

// Banner image upload (Admin and Marketer)
router.post("/banner-image", protect, authorize("admin", "marketer"), bannerUpload.single("image"), uploadBannerImage)

// Avatar upload (All authenticated users)
router.post("/avatar", protect, avatarUpload.single("avatar"), uploadAvatar)

// Delete image (Admin and Marketer)
router.delete("/:publicId", protect, authorize("admin", "marketer"), deleteUploadedImage)

module.exports = router
