"use client"

import { useState } from "react"

const ProductImageZoom = ({ image, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 rounded-lg group">
      <img
        src={image?.url || "/placeholder.svg?height=600&width=600"}
        alt={image?.alt || productName}
        className={`w-full h-96 lg:h-[600px] object-cover transition-transform duration-300 ${
          isZoomed ? "scale-150" : "scale-100"
        }`}
        style={
          isZoomed
            ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              }
            : {}
        }
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      />

      {/* Zoom indicator */}
      <div className="absolute px-2 py-1 text-sm text-white transition-opacity bg-black bg-opacity-50 rounded opacity-0 top-4 right-4 group-hover:opacity-100">
        🔍 Hover to zoom
      </div>
    </div>
  )
}

export default ProductImageZoom
