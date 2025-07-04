"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { getProducts } from "../store/slices/productSlice"
import { getCategories } from "../store/slices/categorySlice"
import ProductCard from "../components/product/ProductCard"
import FilterSidebar from "../components/product/FilterSidebar"
import ProductSort from "../components/product/ProductSort"
import Breadcrumbs from "../components/ui/Breadcumbs"
import Pagination from "../components/ui/Pagination"

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const dispatch = useDispatch()
  const { products, isLoading, pagination } = useSelector((state) => state.products)
  const { categories } = useSelector((state) => state.categories)

  // Get filters from URL params
  const filters = {
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    size: searchParams.get("size") || "",
    color: searchParams.get("color") || "",
    sort: searchParams.get("sort") || "createdAt",
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || "1",
  }

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ""))
    dispatch(getProducts(params))
  }, [dispatch, searchParams])

  const handleFilterChange = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams)

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value)
      } else {
        updatedParams.delete(key)
      }
    })

    updatedParams.set("page", "1") // Reset to first page
    setSearchParams(updatedParams)
  }

  const handlePageChange = (page) => {
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set("page", page.toString())
    setSearchParams(updatedParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ]

  if (filters.category) {
    const category = categories.find((cat) => cat._id === filters.category)
    if (category) {
      breadcrumbItems.push({ label: category.name })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col items-start justify-between mb-8 lg:flex-row lg:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {filters.search ? `Search Results for "${filters.search}"` : "All Products"}
            </h1>
            <p className="text-gray-600">{pagination.total} products found</p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center px-4 py-2 space-x-2 bg-white border border-gray-300 rounded-md shadow-sm lg:hidden hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex flex-col items-start justify-between p-4 mb-6 bg-white rounded-lg shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center mb-4 space-x-4 sm:mb-0">
                <span className="text-sm text-gray-600">
                  Showing {(pagination.current - 1) * 12 + 1}-{Math.min(pagination.current * 12, pagination.total)} of{" "}
                  {pagination.total} results
                </span>
              </div>

              <ProductSort currentSort={filters.sort} onSortChange={(sort) => handleFilterChange({ sort })} />
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-md animate-pulse">
                    <div className="h-64 mb-4 bg-gray-300 rounded-lg"></div>
                    <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-4 mb-2 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.current}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                    />
                  </svg>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">No products found</h3>
                  <p className="mb-4 text-gray-600">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
