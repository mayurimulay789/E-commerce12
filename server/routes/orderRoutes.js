const express = require("express")
const {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controller/orderController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Customer routes
router.post("/create-razorpay-order", protect, createRazorpayOrder)
router.post("/verify-payment", protect, verifyPayment)
router.get("/my-orders", protect, getUserOrders)
router.get("/track/:orderNumber", protect, trackOrder)
router.put("/:id/cancel", protect, cancelOrder)

// Admin routes
router.get("/all", protect, authorize("admin"), getAllOrders)
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus)

// Common routes
router.get("/:id", protect, getOrderById)

module.exports = router
