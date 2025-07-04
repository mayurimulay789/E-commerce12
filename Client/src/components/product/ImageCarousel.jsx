"use client"

import { useState } from "react"
import ProductImageZoom from "./ProductImageZoom"

const ImageCarousel = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const defaultImage = "/placeholder.svg?height=600&width=600"
  const productImages = images && images.length > 0 ? images : [{ url: defaultImage, alt: productName }]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <ProductImageZoom image={productImages[currentIndex]} productName={productName} />

      {/* Thumbnail Images */}
      {productImages.length > 1 && (
        <div className="flex pb-2 space-x-2 overflow-x-auto">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={image.url || defaultImage}
                alt={image.alt || `${productName} ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
