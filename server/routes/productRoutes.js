const express = require("express")
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controller/productController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", protect, authorize("admin"), createProduct)
router.put("/:id", protect, authorize("admin"), updateProduct)
router.delete("/:id", protect, authorize("admin"), deleteProduct)
router.post("/:id/reviews", protect, addReview)

module.exports = router
