const express = require("express")
const {
  getAnalytics,
  getDashboardStats,
  getSalesChart,
  getTopProducts,
  getRecentOrders,
  getAllUsers,
  updateUserRole,
  banUser,
  deleteUser,
} = require("../controllers/adminController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Apply admin middleware to all routes
router.use(protect)
router.use(authorize("admin"))

// Analytics Routes
router.get("/analytics", getAnalytics)
router.get("/dashboard-stats", getDashboardStats)
router.get("/sales-chart", getSalesChart)
router.get("/top-products", getTopProducts)
router.get("/recent-orders", getRecentOrders)

// User Management Routes
router.get("/users", getAllUsers)
router.put("/users/:userId/role", updateUserRole)
router.put("/users/:userId/ban", banUser)
router.delete("/users/:userId", deleteUser)

module.exports = router
