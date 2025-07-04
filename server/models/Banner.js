const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    type: {
      type: String,
      enum: ["hero", "secondary", "category", "sidebar", "popup"],
      required: true,
    },
    position: {
      type: String,
      enum: ["home", "products", "categories", "global"],
      default: "home",
    },
    link: {
      url: String,
      text: String,
      target: {
        type: String,
        enum: ["_self", "_blank"],
        default: "_self",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      ctr: {
        type: Number,
        default: 0,
      },
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

bannerSchema.index({ type: 1, position: 1, isActive: 1 })
bannerSchema.index({ createdBy: 1 })
bannerSchema.index({ startDate: 1, endDate: 1 })

module.exports = mongoose.model("Banner", bannerSchema)
