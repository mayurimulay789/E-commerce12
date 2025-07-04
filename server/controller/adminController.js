const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")
const Category = require("../models/Category")

// Analytics Controller
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $in: ["delivered", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          orderStatus: { $in: ["delivered", "completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ["pending", "processing"] },
    })

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingOrders,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    // Get current date ranges
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
    })

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          orderStatus: { $in: ["delivered", "completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // Weekly stats
    const weeklyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfWeek },
    })

    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          orderStatus: { $in: ["delivered", "completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // Monthly stats
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $in: ["delivered", "completed"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ])

    // New users this month
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    res.json({
      success: true,
      stats: {
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0,
        },
        weekly: {
          orders: weeklyOrders,
          revenue: weeklyRevenue[0]?.total || 0,
        },
        monthly: {
          orders: monthlyOrders,
          revenue: monthlyRevenue[0]?.total || 0,
          newUsers,
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

const getSalesChart = async (req, res) => {
  try {
    const { period = "7d" } = req.query
    let days = 7

    switch (period) {
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
      default:
        days = 7
    }

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $in: ["delivered", "completed"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ])

    res.json({
      success: true,
      salesData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images", 0] },
          totalSold: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: Number.parseInt(limit) },
    ])

    res.json({
      success: true,
      topProducts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit))

    res.json({
      success: true,
      recentOrders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query
    const query = {}

    if (role) query.role = role
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      users,
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

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    const { userId } = req.params

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const banUser = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findByIdAndUpdate(userId, { status: "banned" }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User banned successfully",
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getAnalytics,
  getDashboardStats,
  getSalesChart,
  getTopProducts,
  getRecentOrders,
  getAllUsers,
  updateUserRole,
  banUser,
  deleteUser,
}
