const express = require("express")
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controller/CartController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.use(protect)

router.get("/", getCart)
router.post("/add", addToCart)
router.put("/update", updateCartItem)
router.delete("/remove/:itemId", removeFromCart)
router.delete("/clear", clearCart)

module.exports = router
