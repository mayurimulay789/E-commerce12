"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateCartItem, removeFromCart } from "../../store/slice/cartSlice"
import toast from "react-hot-toast"

const CartItem = ({ item }) => {
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      await dispatch(
        updateCartItem({
          productId: item.product._id,
          size: item.size,
          quantity: newQuantity,
        }),
      ).unwrap()

      toast.success("Cart updated")
    } catch (error) {
      toast.error(error || "Failed to update cart")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveItem = async () => {
    try {
      await dispatch(removeFromCart(item._id)).unwrap()
      toast.success("Item removed from cart")
      setShowRemoveConfirm(false)
    } catch (error) {
      toast.error(error || "Failed to remove item")
    }
  }

  const itemTotal = item.price * item.quantity

  return (
    <div className="relative p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.product?.images?.[0]?.url || "/placeholder.svg?height=120&width=120"}
            alt={item.product?.name}
            className="object-cover w-24 h-24 rounded-lg sm:w-32 sm:h-32"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.product?.name}</h3>

          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="font-medium">Size:</span>
              <span className="px-2 py-1 ml-1 text-xs font-medium bg-gray-100 rounded">{item.size}</span>
            </span>

            {item.color && (
              <span className="flex items-center">
                <span className="font-medium">Color:</span>
                <span className="ml-1">{item.color}</span>
              </span>
            )}

            <span className="font-medium text-green-600">{item.product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-4 space-x-2">
            <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
            {item.product?.originalPrice && item.product.originalPrice > item.price && (
              <>
                <span className="text-sm text-gray-500 line-through">₹{item.product.originalPrice}</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(((item.product.originalPrice - item.price) / item.product.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityUpdate(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="p-2 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                  {isUpdating ? "..." : item.quantity}
                </span>

                <button
                  onClick={() => handleQuantityUpdate(item.quantity + 1)}
                  disabled={item.quantity >= (item.product?.stock || 0) || isUpdating}
                  className="p-2 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">₹{itemTotal.toLocaleString()}</div>
              {item.quantity > 1 && <div className="text-sm text-gray-500">₹{item.price} each</div>}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="p-2 text-gray-400 transition-colors hover:text-red-600"
            title="Remove item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Remove Item</h3>
            <p className="mb-4 text-gray-600">Are you sure you want to remove "{item.product?.name}" from your cart?</p>
            <div className="flex space-x-3">
              <button
                onClick={handleRemoveItem}
                className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Remove
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-800 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartItem
