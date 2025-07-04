const express = require("express")
const router = express.Router()
const { protect, authorize } = require("../middleware/auth")
const { getTrafficSalesOverview, getProductAnalytics } = require("../controllers/analyticsController")

// All routes require authentication and marketer/admin role
router.use(protect)
router.use(authorize("admin", "marketer"))

// Analytics routes
router.get("/overview", getTrafficSalesOverview)
router.get("/products/:productId", getProductAnalytics)

module.exports = router
