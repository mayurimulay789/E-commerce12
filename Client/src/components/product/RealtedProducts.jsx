"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getProducts } from "../../store/slices/productSlice"
import ProductCard from "./ProductCard"

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return

      setIsLoading(true)
      try {
        const result = await dispatch(
          getProducts({
            category: categoryId,
            limit: 4,
          }),
        ).unwrap()

        // Filter out current product
        const filtered = result.products.filter((product) => product._id !== currentProductId)
        setRelatedProducts(filtered.slice(0, 4))
      } catch (error) {
        console.error("Error fetching related products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [dispatch, categoryId, currentProductId])

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Related Products</h2>
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

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Related Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
