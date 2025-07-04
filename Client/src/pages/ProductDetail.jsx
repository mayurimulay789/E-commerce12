"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getProduct, clearProduct, addReview } from "../store/slice/productSlice"
import { addToCart } from "../store/slice/cartSlice"
import ImageCarousel from "../components/product/ImageCarousel"
import ProductTabs from "../components/product/ProductaTabs"
import Breadcrumbs from "../components/ui/Breadcumbs"
import toast from "react-hot-toast"
import SizeGuide from "../components/product/SizeGuide"
import ProductRecommendations from "../components/product/ProductRecommendations"
import ProductBadges from "../components/product/ProductBadges"
import ProductSharing from "../components/product/ProductSharing"
import ProductNotification from "../components/product/ProductNotification"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const { product, isLoading, isError } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id))
    }

    return () => {
      dispatch(clearProduct())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (product) {
      // Set default selections
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0].size)
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name)
      }
    }
  }, [product])

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }

    if (isOutOfStock) {
      toast.error("This size is out of stock")
      return
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      }),
    )

    toast.success(`Added ${quantity} item(s) to cart!`, {
      icon: "🛒",
      duration: 3000,
    })
  }

  const handleReviewSubmit = (reviewData) => {
    if (!user) {
      toast.error("Please login to add a review")
      navigate("/login")
      return
    }

    dispatch(
      addReview({
        productId: product._id,
        reviewData,
      }),
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image Skeleton */}
            <div className="bg-gray-300 h-96 lg:h-[600px] rounded-lg animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-1/3 h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Product Not Found</h2>
          <p className="mb-6 text-gray-600">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.category?.name || "Category", href: `/products?category=${product.category?._id}` },
    { label: product.name },
  ]

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const selectedSizeStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
  const isOutOfStock = selectedSizeStock === 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        <ProductBadges product={product} />

        <div className="grid grid-cols-1 gap-12 mb-16 lg:grid-cols-2">
          {/* Product Images */}
          <div>
            <ImageCarousel images={product.images || []} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mb-4 space-x-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="px-2 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4 space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating?.average?.toFixed(1) || 0} ({product.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>

              <p className="leading-relaxed text-gray-600">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj) => (
                    <button
                      key={sizeObj.size}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      disabled={sizeObj.stock === 0}
                      className={`
                        px-4 py-2 border rounded-md font-medium transition-colors
                        ${
                          selectedSize === sizeObj.size
                            ? "bg-gray-900 text-white border-gray-900"
                            : sizeObj.stock === 0
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }
                      `}
                    >
                      {sizeObj.size}
                      {sizeObj.stock === 0 && <span className="ml-1 text-xs">(Out of Stock)</span>}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <SizeGuide />
                  <span className="text-sm text-gray-600">{selectedSizeStock} in stock</span>
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((colorObj) => (
                    <button
                      key={colorObj.name}
                      onClick={() => setSelectedColor(colorObj.name)}
                      className={`
                        px-4 py-2 border rounded-md font-medium transition-colors
                        ${
                          selectedColor === colorObj.name
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }
                      `}
                    >
                      {colorObj.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 font-medium text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                  disabled={quantity >= selectedSizeStock}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-600">{selectedSizeStock} available</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || !selectedSize}
                className="w-full py-4 font-semibold text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <ProductNotification product={product} selectedSize={selectedSize} />

              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50">
                  Add to Wishlist
                </button>
                <ProductSharing product={product} />
              </div>
            </div>

            {/* Product Features */}
            <div className="pt-6 border-t">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs
          product={product}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReviewSubmit={handleReviewSubmit}
        />

        {/* Related Products */}
        <ProductRecommendations currentProduct={product} />
      </div>
    </div>
  )
}

export default ProductDetail
