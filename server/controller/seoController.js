const Product = require("../models/Product")
const Category = require("../models/Category")

// Get SEO data for products
const getProductSEO = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query

    const query = {}
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { "seo.metaTitle": { $regex: search, $options: "i" } }]
    }

    const products = await Product.find(query)
      .select("name seo analytics createdAt updatedAt")
      .populate("category", "name")
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      products,
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

// Update product SEO
const updateProductSEO = async (req, res) => {
  try {
    const { id } = req.params
    const seoData = req.body

    // Validate SEO data
    if (seoData.metaTitle && seoData.metaTitle.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Meta title cannot exceed 60 characters",
      })
    }

    if (seoData.metaDescription && seoData.metaDescription.length > 160) {
      return res.status(400).json({
        success: false,
        message: "Meta description cannot exceed 160 characters",
      })
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        seo: seoData,
        updatedBy: req.user.id,
      },
      { new: true, runValidators: true },
    ).populate("category", "name")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "SEO data updated successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get category SEO data
const getCategorySEO = async (req, res) => {
  try {
    const categories = await Category.find().select("name seo createdAt updatedAt").sort({ updatedAt: -1 })

    res.json({
      success: true,
      categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Update category SEO
const updateCategorySEO = async (req, res) => {
  try {
    const { id } = req.params
    const seoData = req.body

    const category = await Category.findByIdAndUpdate(
      id,
      {
        seo: seoData,
        updatedBy: req.user.id,
      },
      { new: true, runValidators: true },
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    res.json({
      success: true,
      message: "Category SEO updated successfully",
      category,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get SEO analytics
const getSEOAnalytics = async (req, res) => {
  try {
    const { period = "30" } = req.query
    const days = Number.parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get products with SEO issues
    const productsWithoutSEO = await Product.countDocuments({
      $or: [
        { "seo.metaTitle": { $exists: false } },
        { "seo.metaTitle": "" },
        { "seo.metaDescription": { $exists: false } },
        { "seo.metaDescription": "" },
      ],
    })

    const totalProducts = await Product.countDocuments()
    const seoCompletionRate = ((totalProducts - productsWithoutSEO) / totalProducts) * 100

    // Get top performing products by views
    const topProducts = await Product.find().select("name seo analytics").sort({ "analytics.views": -1 }).limit(10)

    // Get products with low performance
    const lowPerformingProducts = await Product.find({
      "analytics.views": { $lt: 10 },
      createdAt: { $lt: startDate },
    })
      .select("name seo analytics createdAt")
      .limit(10)

    // Calculate average metrics
    const avgMetrics = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgViews: { $avg: "$analytics.views" },
          avgClicks: { $avg: "$analytics.clicks" },
          avgConversionRate: { $avg: "$analytics.conversionRate" },
          totalViews: { $sum: "$analytics.views" },
          totalClicks: { $sum: "$analytics.clicks" },
        },
      },
    ])

    res.json({
      success: true,
      analytics: {
        overview: {
          totalProducts,
          productsWithoutSEO,
          seoCompletionRate: Math.round(seoCompletionRate),
          avgViews: avgMetrics[0]?.avgViews || 0,
          avgClicks: avgMetrics[0]?.avgClicks || 0,
          avgConversionRate: avgMetrics[0]?.avgConversionRate || 0,
          totalViews: avgMetrics[0]?.totalViews || 0,
          totalClicks: avgMetrics[0]?.totalClicks || 0,
        },
        topProducts,
        lowPerformingProducts,
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
  getProductSEO,
  updateProductSEO,
  getCategorySEO,
  updateCategorySEO,
  getSEOAnalytics,
}
