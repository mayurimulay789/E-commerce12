const express = require("express")
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.post("/", protect, authorize("admin"), createCategory)
router.put("/:id", protect, authorize("admin"), updateCategory)
router.delete("/:id", protect, authorize("admin"), deleteCategory)

module.exports = router
