"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getProducts } from "../../store/slices/productSlice"
import ProductCard from "./ProductCard"

const ProductRecommendations = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentProduct) return

      setIsLoading(true)
      try {
        // Get products from same category
        const categoryResult = await dispatch(
          getProducts({
            category: currentProduct.category?._id,
            limit: 8,
          }),
        ).unwrap()

        // Filter out current product and get random selection
        const filtered = categoryResult.products
          .filter((product) => product._id !== currentProduct._id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)

        setRecommendations(filtered)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [dispatch, currentProduct])

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">You Might Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md animate-pulse">
              <div className="h-64 mb-4 bg-gray-300 rounded-lg"></div>
              <div className="h-4 mb-2 bg-gray-300 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
        <button className="font-medium text-blue-600 hover:text-blue-800">View All →</button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations
