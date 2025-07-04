"use client"

import { useState } from "react"

const FilterSidebar = ({ filters, categories, onFilterChange, onClearFilters, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  })

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Gray", code: "#6B7280" },
    { name: "Navy", code: "#1E3A8A" },
    { name: "Red", code: "#DC2626" },
    { name: "Green", code: "#059669" },
  ]

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ category: categoryId })
  }

  const handleSizeChange = (size) => {
    const currentSizes = filters.size ? filters.size.split(",") : []
    const newSizes = currentSizes.includes(size) ? currentSizes.filter((s) => s !== size) : [...currentSizes, size]

    onFilterChange({ size: newSizes.join(",") })
  }

  const handleColorChange = (color) => {
    const currentColors = filters.color ? filters.color.split(",") : []
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color]

    onFilterChange({ color: newColors.join(",") })
  }

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    })
  }

  const selectedSizes = filters.size ? filters.size.split(",") : []
  const selectedColors = filters.color ? filters.color.split(",") : []

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-80 lg:w-64 bg-white lg:bg-transparent
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        overflow-y-auto lg:overflow-visible
        border-r lg:border-r-0 border-gray-200
      `}
      >
        <div className="p-6 lg:p-0">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Clear Filters */}
          <div className="mb-6">
            <button
              onClick={onClearFilters}
              className="w-full px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear All Filters
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`
                    px-3 py-2 text-sm border rounded-md transition-colors
                    ${
                      selectedSizes.includes(size)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`
                    w-10 h-10 rounded-full border-2 transition-all
                    ${
                      selectedColors.includes(color.name)
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                >
                  {selectedColors.includes(color.name) && (
                    <svg className="w-4 h-4 mx-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handlePriceChange}
                className="w-full px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar
