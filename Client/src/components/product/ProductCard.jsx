"use client"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../../store/slice/cartSlice"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    const defaultSize = product.sizes?.[0]?.size || "M"
    const defaultColor = product.colors?.[0]?.name || "Default"

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        size: defaultSize,
        color: defaultColor,
      }),
    )
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md group hover:shadow-xl">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <div className="absolute px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded-md top-2 left-2">
              -{discountPercentage}%
            </div>
          )}
          {product.featured && (
            <div className="absolute px-2 py-1 text-sm font-semibold text-white bg-blue-500 rounded-md top-2 right-2">
              Featured
            </div>
          )}
          {product.trending && (
            <div className="absolute px-2 py-1 text-sm font-semibold text-white bg-green-500 rounded-md top-2 right-2">
              Trending
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

          <div className="flex items-center mb-2">
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

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Available Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 4).map((sizeObj, index) => (
                  <span key={index} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                    {sizeObj.size}
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
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full px-4 py-2 font-semibold text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
