const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
      },
    ],
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    colors: [
      {
        name: String,
        code: String,
        images: [
          {
            url: String,
            publicId: String,
            alt: String,
          },
        ],
      },
    ],
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [String],
      slug: {
        type: String,
        unique: true,
      },
      canonicalUrl: String,
      ogTitle: String,
      ogDescription: String,
      ogImage: {
        url: String,
        publicId: String,
      },
      twitterTitle: String,
      twitterDescription: String,
      twitterImage: {
        url: String,
        publicId: String,
      },
      structuredData: {
        type: mongoose.Schema.Types.Mixed,
      },
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
      purchases: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
      },
      lastViewed: Date,
      dailyViews: [
        {
          date: Date,
          views: Number,
          clicks: Number,
        },
      ],
    },
    inventory: {
      totalStock: {
        type: Number,
        default: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      trackInventory: {
        type: Boolean,
        default: true,
      },
    },
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      freeShipping: {
        type: Boolean,
        default: false,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for efficient queries
productSchema.index({ name: "text", description: "text", tags: "text" })
productSchema.index({ category: 1, status: 1 })
productSchema.index({ featured: 1, status: 1 })
productSchema.index({ trending: 1, status: 1 })
productSchema.index({ price: 1 })
productSchema.index({ "rating.average": -1 })
productSchema.index({ "seo.slug": 1 })
productSchema.index({ "analytics.views": -1 })

// Virtual for calculating total stock
productSchema.virtual("totalStock").get(function () {
  return this.sizes.reduce((total, size) => total + size.stock, 0)
})

// Virtual for checking if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.totalStock > 0
})

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Update conversion rate
  if (this.analytics.views > 0) {
    this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views) * 100
  }

  next()
})

// Method to increment views
productSchema.methods.incrementViews = function () {
  this.analytics.views += 1
  this.analytics.lastViewed = new Date()

  // Update daily views
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dailyView = this.analytics.dailyViews.find((view) => view.date.getTime() === today.getTime())

  if (dailyView) {
    dailyView.views += 1
  } else {
    this.analytics.dailyViews.push({
      date: today,
      views: 1,
      clicks: 0,
    })
  }

  // Keep only last 30 days
  this.analytics.dailyViews = this.analytics.dailyViews.sort((a, b) => b.date - a.date).slice(0, 30)

  return this.save()
}

module.exports = mongoose.model("Product", productSchema)
