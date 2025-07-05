const Order = require("../models/Order")
const Cart = require("../models/Cart")
const User = require("../models/User")
const crypto = require("crypto")


const Razorpay = require("razorpay");
console.log("RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET", process.env.RAZORPAY_KEY_SECRET)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      })
    }

    // Generate order number
    const orderNumber = `KSB${Date.now()}`

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderNumber,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      })),
      shippingAddress,
      paymentInfo: {
        method: "razorpay",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "completed",
      },
      subtotal: cart.totalAmount,
      totalAmount: cart.totalAmount,
      orderStatus: "confirmed",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
        },
        {
          status: "confirmed",
          timestamp: new Date(),
        },
      ],
    })

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalAmount: 0 })

    await order.populate("items.product", "name images")

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = { user: req.user.id }

    if (status) query.orderStatus = status

    const orders = await Order.find(query)
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      orders,
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

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images")
      .populate("user", "name email mobile")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params

    const order = await Order.findOne({ orderNumber })
      .populate("items.product", "name images")
      .select("orderNumber orderStatus statusHistory trackingInfo createdAt estimatedDelivery")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Calculate estimated delivery if not set
    let estimatedDelivery = order.trackingInfo?.estimatedDelivery
    if (!estimatedDelivery && order.orderStatus === "shipped") {
      estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    }

    const trackingData = {
      orderNumber: order.orderNumber,
      currentStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      trackingInfo: order.trackingInfo,
      estimatedDelivery,
      orderDate: order.createdAt,
      items: order.items,
    }

    res.json({
      success: true,
      tracking: trackingData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const query = {}

    if (status) query.orderStatus = status
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.name": { $regex: search, $options: "i" } },
      ]
    }

    const orders = await Order.find(query)
      .populate("user", "name email mobile")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      orders,
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

const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier, note } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Update order status
    order.orderStatus = status

    // Update tracking info if provided
    if (trackingNumber) {
      order.trackingInfo.trackingNumber = trackingNumber
    }
    if (carrier) {
      order.trackingInfo.carrier = carrier
    }

    // Set estimated delivery for shipped orders
    if (status === "shipped" && !order.trackingInfo.estimatedDelivery) {
      order.trackingInfo.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }

    // Set actual delivery date for delivered orders
    if (status === "delivered") {
      order.trackingInfo.actualDelivery = new Date()
    }

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note,
      updatedBy: req.user.id,
    })

    await order.save()

    await order.populate("items.product", "name")

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      })
    }

    order.orderStatus = "cancelled"
    order.cancelReason = reason
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: `Cancelled by customer: ${reason}`,
    })

    await order.save()

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
}
