const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("../config/database.js")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", require("../routes/authRoutes.js"))
app.use("/api/products", require("../routes/productRoutes.js"))
app.use("/api/categories", require("../routes/categoryRoutes.js"))
app.use("/api/cart", require("../routes/cartRoutes.js"))
app.use("/api/orders", require("../routes/orderRoutes.js"))
app.use("/api/upload", require("../routes/uploadRoutes.js"))
app.use("/api/banners", require("../routes/bannerRoutes.js"))
app.use("/api/seo", require("../routes/seoRoutes.js"))
app.use("/api/analytics", require("../routes/analyaticsRoute.js"))

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack)

  if (error.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large",
      })
    }
  }

  res.status(500).json({
    success: false,
    message: error.message || "Something went wrong!",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
})
