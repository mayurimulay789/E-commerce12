const Cart = require("../models/Cart")
const Product = require("../models/Product")

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price images")

    if (!cart) {
      return res.json({
        success: true,
        cart: { items: [], totalAmount: 0 },
      })
    }

    res.json({
      success: true,
      cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color,
    )

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price,
      })
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    await cart.populate("items.product", "name price images")

    res.json({
      success: true,
      message: "Item added to cart",
      cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    const item = cart.items.id(itemId)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      })
    }

    if (quantity <= 0) {
      cart.items.pull(itemId)
    } else {
      item.quantity = quantity
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    await cart.populate("items.product", "name price images")

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    cart.items.pull(itemId)

    // Recalculate total
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    await cart.save()
    await cart.populate("items.product", "name price images")

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalAmount: 0 })

    res.json({
      success: true,
      message: "Cart cleared successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}
