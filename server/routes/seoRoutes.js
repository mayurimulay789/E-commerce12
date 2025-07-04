const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const {
  getProductSEO,
  updateProductSEO,
  getCategorySEO,
  updateCategorySEO,
  getSEOAnalytics,
} = require("../controller/seoController")

// All routes require authentication and marketer/admin role
router.use(protect)
router.use(authorize("admin", "marketer"))

// Product SEO routes
router.get("/products", getProductSEO)
router.put("/products/:id", updateProductSEO)

// Category SEO routes
router.get("/categories", getCategorySEO)
router.put("/categories/:id", updateCategorySEO)

// SEO Analytics
router.get("/analytics", getSEOAnalytics)

module.exports = router
