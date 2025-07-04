"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getFeaturedProducts } from "../../store/slice/productSlice"
import ProductCard from "../product/ProductCard"

const FeaturedProducts = () => {
  const dispatch = useDispatch()
  const { featuredProducts, isLoading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getFeaturedProducts())
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Featured Products</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Discover our handpicked selection of premium oversized t-shirts
            </p>
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
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">Featured Products</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover our handpicked selection of premium oversized t-shirts
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products"
                className="inline-block px-8 py-3 font-semibold text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                View All Products
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
