"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getWishlist, removeFromWishlist } from "../../store/slice/wishlist"
import { addToCart } from "../../store/slice/cartSlice"

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items, isLoading } = useSelector((state) => state.wishlist)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    dispatch(getWishlist())
  }, [dispatch])

  const handleRemoveItem = (productId) => {
    dispatch(removeFromWishlist(productId))
  }

  const handleMoveToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        quantity: 1,
        size: product.sizes?.[0]?.size || "M",
        color: product.colors?.[0]?.name || "Default",
        price: product.price,
      }),
    )
    dispatch(removeFromWishlist(product._id))
  }

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item._id))
    }
  }

  const handleBulkAddToCart = () => {
    selectedItems.forEach((productId) => {
      const product = items.find((item) => item._id === productId)
      if (product) {
        handleMoveToCart(product)
      }
    })
    setSelectedItems([])
  }

  const handleBulkRemove = () => {
    selectedItems.forEach((productId) => {
      dispatch(removeFromWishlist(productId))
    })
    setSelectedItems([])
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="h-48 mb-4 bg-gray-300 rounded-md"></div>
            <div className="h-4 mb-2 bg-gray-300 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist ({items.length})</h1>

        {items.length > 0 && (
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            <button onClick={handleSelectAll} className="text-sm font-medium text-blue-600 hover:text-blue-800">
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </button>

            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={handleBulkAddToCart}
                  className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Selected to Cart ({selectedItems.length})
                </button>
                <button
                  onClick={handleBulkRemove}
                  className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                >
                  Remove Selected
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <div key={product._id} className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              {/* Selection Checkbox */}
              <div className="absolute z-10 top-4 left-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product._id)}
                  onChange={() => handleSelectItem(product._id)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* Product Image */}
              <div className="relative">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images?.[0]?.url || "/placeholder.svg?height=250&width=300"}
                    alt={product.name}
                    className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="mb-2 font-medium text-gray-900 transition-colors hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({product.rating?.count || 0})</span>
                  </div>
                </div>

                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs text-gray-600">Available Sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.slice(0, 4).map((size, index) => (
                        <span key={index} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                          {size.size}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                          +{product.sizes.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? "Move to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(product._id)}
                    className="px-3 py-2 text-red-600 transition-colors hover:text-red-800"
                    title="Remove from wishlist"
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
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-6xl">❤️</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mb-6 text-gray-600">Save items you love to your wishlist and shop them later.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* Wishlist Tips */}
      {items.length > 0 && (
        <div className="p-6 rounded-lg bg-blue-50">
          <h3 className="mb-2 font-medium text-blue-900">💡 Wishlist Tips</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Items in your wishlist are saved across all your devices</li>
            <li>• Get notified when wishlist items go on sale</li>
            <li>• Share your wishlist with friends and family</li>
            <li>• Move multiple items to cart at once using bulk actions</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Wishlist
