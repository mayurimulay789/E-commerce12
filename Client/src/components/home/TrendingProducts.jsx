"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getTrendingProducts } from "../../store/slice/productSlice"
import ProductCard from "../product/ProductCard"

const TrendingProducts = () => {
  const dispatch = useDispatch()
  const { trendingProducts, isLoading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getTrendingProducts())
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Trending Now</h2>
            <p className="max-w-2xl mx-auto text-gray-600">What everyone's talking about</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-64 mb-4 bg-gray-300 rounded-lg"></div>
                <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Trending Now</h2>
          <p className="max-w-2xl mx-auto text-gray-600">What everyone's talking about</p>
        </div>

        {trendingProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products?trending=true"
                className="inline-block px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                View All Trending
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No trending products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrendingProducts
