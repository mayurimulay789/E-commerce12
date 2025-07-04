const { deleteImage } = require("../config/cloudinary")

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      })
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: req.body.alt || "",
    }))

    res.json({
      success: true,
      message: "Images uploaded successfully",
      images,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Upload single banner image
const uploadBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      })
    }

    const image = {
      url: req.file.path,
      publicId: req.file.filename,
      alt: req.body.alt || "",
    }

    res.json({
      success: true,
      message: "Banner image uploaded successfully",
      image,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Upload user avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      })
    }

    // Delete old avatar if exists
    if (req.user.avatar && req.user.avatar.publicId) {
      try {
        await deleteImage(req.user.avatar.publicId)
      } catch (error) {
        console.log("Error deleting old avatar:", error)
      }
    }

    const avatar = {
      url: req.file.path,
      publicId: req.file.filename,
    }

    // Update user avatar
    req.user.avatar = avatar
    await req.user.save()

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete image
const deleteUploadedImage = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      })
    }

    await deleteImage(publicId)

    res.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  uploadProductImages,
  uploadBannerImage,
  uploadAvatar,
  deleteUploadedImage,
}
