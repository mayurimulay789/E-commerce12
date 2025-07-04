const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBannersByPosition,
  trackBannerView,
  trackBannerClick,
  getBannerAnalytics,
} = require("../controllers/bannerController")

// Public routes
router.get("/position/:position", getActiveBannersByPosition)
router.post("/:id/view", trackBannerView)
router.post("/:id/click", trackBannerClick)

// Protected routes
router.use(protect)

// Routes for admin and marketer
router.get("/", authorize("admin", "marketer"), getAllBanners)
router.get("/analytics", authorize("admin", "marketer"), getBannerAnalytics)
router.post("/", authorize("admin", "marketer"), createBanner)
router.get("/:id", authorize("admin", "marketer"), getBannerById)
router.put("/:id", authorize("admin", "marketer"), updateBanner)
router.delete("/:id", authorize("admin", "marketer"), deleteBanner)

module.exports = router
