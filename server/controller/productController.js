const Product = require("../models/Product")
const Category = require("../models/Category")

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      sort = "createdAt",
      search,
      featured,
      trending,
    } = req.query

    const query = { status: "active" }

    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (size) query["sizes.size"] = size
    if (color) query["colors.name"] = new RegExp(color, "i")
    if (search) query.$text = { $search: search }
    if (featured === "true") query.featured = true
    if (trending === "true") query.trending = true

    const sortOptions = {}
    switch (sort) {
      case "price_asc":
        sortOptions.price = 1
        break
      case "price_desc":
        sortOptions.price = -1
        break
      case "rating":
        sortOptions["rating.average"] = -1
        break
      default:
        sortOptions.createdAt = -1
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOptions)
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

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("reviews.user", "name")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    await product.populate("category", "name slug")

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    const existingReview = product.reviews.find((review) => review.user.toString() === req.user.id)

    if (existingReview) {
      existingReview.rating = rating
      existingReview.comment = comment
    } else {
      product.reviews.push({
        user: req.user.id,
        rating,
        comment,
      })
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    product.rating.average = totalRating / product.reviews.length
    product.rating.count = product.reviews.length

    await product.save()

    res.json({
      success: true,
      message: "Review added successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
}
