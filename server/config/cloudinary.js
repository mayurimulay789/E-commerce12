const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

// Storage configuration for different types of uploads
const createStorage = (folder, allowedFormats = ["jpg", "jpeg", "png", "webp"]) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `ksauni-bliss/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    },
  })
}

// Product images storage
const productStorage = createStorage("products")
const productUpload = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Banner images storage
const bannerStorage = createStorage("banners")
const bannerUpload = multer({
  storage: bannerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for banners
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Avatar images storage
const avatarStorage = createStorage("avatars")
const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw error
  }
}

// Get optimized image URL
const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: "auto",
    fetch_format: "auto",
    ...options,
  }

  return cloudinary.url(publicId, defaultOptions)
}

module.exports = {
  cloudinary,
  productUpload,
  bannerUpload,
  avatarUpload,
  deleteImage,
  getOptimizedUrl,
}
