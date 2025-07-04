"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"

const TopProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await api.get("/products?featured=true&limit=5")
        setProducts(response.data.products || [])
      } catch (error) {
        console.error("Error fetching top products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopProducts()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
        <Link to="/admin/products" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="p-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center py-3 space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <div key={product._id} className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={product.images?.[0]?.url || "/placeholder.svg?height=48&width=48"}
                  alt={product.name}
                  className="object-cover w-12 h-12 rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.rating?.count || 0} reviews • {product.category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.price}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-600">{product.rating?.average?.toFixed(1) || "0.0"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-600">
          <p>No products found</p>
        </div>
      )}
    </div>
  )
}

export default TopProducts
