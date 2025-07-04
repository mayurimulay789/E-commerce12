const Banner = require("../models/Banner")
const { deleteImage } = require("../config/cloudinary")

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      position,
      status,
      createdBy,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    const query = {}

    if (type) query.type = type
    if (position) query.position = position
    if (status) query.status = status
    if (createdBy) query.createdBy = createdBy

    // If user is not admin, only show their own banners
    if (req.user.role === "marketer") {
      query.createdBy = req.user.id
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const banners = await Banner.find(query)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Banner.countDocuments(query)

    res.json({
      success: true,
      banners,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get banner by ID
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    // Check if user can access this banner
    if (req.user.role === "marketer" && banner.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      banner,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Create banner
const createBanner = async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user.id,
    }

    const banner = await Banner.create(bannerData)
    await banner.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update banner
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    // Check if user can update this banner
    if (req.user.role === "marketer" && banner.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // If image is being updated, delete old image
    if (req.body.image && req.body.image.publicId !== banner.image.publicId) {
      try {
        await deleteImage(banner.image.publicId)
      } catch (error) {
        console.log("Error deleting old banner image:", error)
      }
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true },
    ).populate("createdBy updatedBy", "name email")

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    // Check if user can delete this banner
    if (req.user.role === "marketer" && banner.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Delete image from Cloudinary
    try {
      await deleteImage(banner.image.publicId)
    } catch (error) {
      console.log("Error deleting banner image:", error)
    }

    await Banner.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Banner deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get active banners by position (public endpoint)
const getActiveBannersByPosition = async (req, res) => {
  try {
    const { position } = req.params
    const banners = await Banner.getActiveByPosition(position)

    res.json({
      success: true,
      banners,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Track banner view
const trackBannerView = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    await banner.incrementViews()

    res.json({
      success: true,
      message: "View tracked successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Track banner click
const trackBannerClick = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      })
    }

    await banner.incrementClicks()

    res.json({
      success: true,
      message: "Click tracked successfully",
      redirectUrl: banner.link.url,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get banner analytics
const getBannerAnalytics = async (req, res) => {
  try {
    const query = req.user.role === "marketer" ? { createdBy: req.user.id } : {}

    const banners = await Banner.find(query).select("title analytics type position")

    const totalViews = banners.reduce((sum, banner) => sum + banner.analytics.views, 0)
    const totalClicks = banners.reduce((sum, banner) => sum + banner.analytics.clicks, 0)
    const averageCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0

    const topPerforming = banners.sort((a, b) => b.analytics.clicks - a.analytics.clicks).slice(0, 5)

    const typePerformance = banners.reduce((acc, banner) => {
      if (!acc[banner.type]) {
        acc[banner.type] = { views: 0, clicks: 0, count: 0 }
      }
      acc[banner.type].views += banner.analytics.views
      acc[banner.type].clicks += banner.analytics.clicks
      acc[banner.type].count += 1
      return acc
    }, {})

    res.json({
      success: true,
      analytics: {
        overview: {
          totalBanners: banners.length,
          totalViews,
          totalClicks,
          averageCTR: Number.parseFloat(averageCTR),
        },
        topPerforming,
        typePerformance,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBannersByPosition,
  trackBannerView,
  trackBannerClick,
  getBannerAnalytics,
}
