const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const Banner = require("../models/Banner")

// Get traffic and sales overview
const getTrafficSalesOverview = async (req, res) => {
  try {
    const { period = "30" } = req.query
    const days = Number.parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Sales Analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalSales: { $sum: "$pricing.totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$pricing.totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Traffic Analytics
    const trafficData = await Product.aggregate([
      {
        $match: {
          "analytics.dailyViews.date": { $gte: startDate },
        },
      },
      {
        $unwind: "$analytics.dailyViews",
      },
      {
        $match: {
          "analytics.dailyViews.date": { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$analytics.dailyViews.date" },
            month: { $month: "$analytics.dailyViews.date" },
            day: { $dayOfMonth: "$analytics.dailyViews.date" },
          },
          totalViews: { $sum: "$analytics.dailyViews.views" },
          totalClicks: { $sum: "$analytics.dailyViews.clicks" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Overall metrics
    const totalSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalAmount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$pricing.totalAmount" },
        },
      },
    ])

    const totalTraffic = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$analytics.views" },
          totalClicks: { $sum: "$analytics.clicks" },
        },
      },
    ])

    // Top products by revenue
    const topProductsByRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalRevenue: { $sum: "$items.total" },
          totalQuantity: { $sum: "$items.quantity" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ])

    // Top products by views
    const topProductsByViews = await Product.find().select("name analytics").sort({ "analytics.views": -1 }).limit(10)

    // Conversion funnel
    const conversionFunnel = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$analytics.views" },
          totalClicks: { $sum: "$analytics.clicks" },
          totalPurchases: { $sum: "$analytics.purchases" },
        },
      },
    ])

    // User analytics
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          newUsers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    // Banner performance
    const bannerStats = await Banner.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$analytics.views" },
          totalClicks: { $sum: "$analytics.clicks" },
          avgCTR: { $avg: "$analytics.ctr" },
        },
      },
    ])

    res.json({
      success: true,
      analytics: {
        overview: {
          totalRevenue: totalSales[0]?.totalRevenue || 0,
          totalOrders: totalSales[0]?.totalOrders || 0,
          avgOrderValue: totalSales[0]?.avgOrderValue || 0,
          totalViews: totalTraffic[0]?.totalViews || 0,
          totalClicks: totalTraffic[0]?.totalClicks || 0,
          conversionRate: conversionFunnel[0]
            ? ((conversionFunnel[0].totalPurchases / conversionFunnel[0].totalViews) * 100).toFixed(2)
            : 0,
        },
        charts: {
          salesData,
          trafficData,
          userStats,
        },
        topProducts: {
          byRevenue: topProductsByRevenue,
          byViews: topProductsByViews,
        },
        conversionFunnel: conversionFunnel[0] || {
          totalViews: 0,
          totalClicks: 0,
          totalPurchases: 0,
        },
        bannerStats: bannerStats[0] || {
          totalViews: 0,
          totalClicks: 0,
          avgCTR: 0,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get detailed product analytics
const getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params
    const { period = "30" } = req.query
    const days = Number.parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const product = await Product.findById(productId).select("name analytics seo").populate("category", "name")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Get daily analytics for the period
    const dailyAnalytics = product.analytics.dailyViews.filter((day) => day.date >= startDate)

    // Get orders for this product
    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          "items.product": product._id,
          orderStatus: { $nin: ["cancelled", "refunded"] },
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.product": product._id,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$items.total" },
          totalQuantity: { $sum: "$items.quantity" },
          totalOrders: { $sum: 1 },
          avgPrice: { $avg: "$items.price" },
        },
      },
    ])

    res.json({
      success: true,
      product: {
        ...product.toObject(),
        orderStats: orderStats[0] || {
          totalRevenue: 0,
          totalQuantity: 0,
          totalOrders: 0,
          avgPrice: 0,
        },
        dailyAnalytics,
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
  getTrafficSalesOverview,
  getProductAnalytics,
}
