const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        total: Number,
      },
    ],
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      landmark: String,
    },
    billingAddress: {
      name: String,
      mobile: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ["razorpay", "cod", "wallet"],
        required: true,
      },
      transactionId: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
      amount: Number,
    },
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "placed",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "placed",
            "confirmed",
            "processing",
            "packed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "returned",
            "refunded",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    shipping: {
      carrier: String,
      trackingNumber: String,
      trackingUrl: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      shippingCost: {
        type: Number,
        default: 0,
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        default: 0,
      },
      shippingCost: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      couponCode: String,
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    notes: {
      customer: String,
      admin: String,
    },
    cancellation: {
      reason: String,
      cancelledAt: Date,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "failed"],
      },
      refundAmount: Number,
      refundDate: Date,
    },
    analytics: {
      source: String,
      campaign: String,
      medium: String,
      referrer: String,
      userAgent: String,
      ipAddress: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ "paymentInfo.status": 1 })
orderSchema.index({ createdAt: -1 })

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments()
    this.orderNumber = `KB${Date.now()}${(count + 1).toString().padStart(4, "0")}`
  }
  next()
})

// Method to update status
orderSchema.methods.updateStatus = function (newStatus, note, updatedBy) {
  this.orderStatus = newStatus
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  })

  // Set specific timestamps
  if (newStatus === "delivered") {
    this.shipping.actualDelivery = new Date()
  }

  return this.save()
}

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason, cancelledBy) {
  this.orderStatus = "cancelled"
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy,
    refundStatus: this.paymentInfo.status === "completed" ? "pending" : null,
  }

  this.statusHistory.push({
    status: "cancelled",
    timestamp: new Date(),
    note: `Order cancelled: ${reason}`,
    updatedBy: cancelledBy,
  })

  return this.save()
}

// Virtual for checking if order can be cancelled
orderSchema.virtual("canBeCancelled").get(function () {
  const cancellableStatuses = ["placed", "confirmed", "processing"]
  return cancellableStatuses.includes(this.orderStatus)
})

// Virtual for checking if order is delivered
orderSchema.virtual("isDelivered").get(function () {
  return this.orderStatus === "delivered"
})

module.exports = mongoose.model("Order", orderSchema)
