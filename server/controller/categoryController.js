const Category = require("../models/Category")

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" }).populate("parent", "name slug")

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

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent", "name slug")

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    res.json({
      success: true,
      category,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const createCategory = async (req, res) => {
  try {
    const { name, description, image, parent } = req.body
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parent,
    })

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body
    const updateData = { ...req.body }

    if (name) {
      updateData.slug = name.toLowerCase().replace(/\s+/g, "-")
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
