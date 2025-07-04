"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const ProductNotification = ({ product, selectedSize }) => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNotifyMe = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email")
      return
    }

    // Here you would typically call an API to subscribe the user
    // For now, we'll just show a success message
    setIsSubscribed(true)
    toast.success("You'll be notified when this item is back in stock!")
    setEmail("")
  }

  const selectedSizeStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
  const isOutOfStock = selectedSizeStock === 0

  if (!isOutOfStock) {
    return null
  }

  return (
    <div className="p-4 mt-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 className="mb-2 font-medium text-gray-900">Out of Stock</h4>
      {!isSubscribed ? (
        <form onSubmit={handleNotifyMe} className="space-y-3">
          <p className="text-sm text-gray-600">Get notified when size {selectedSize} is back in stock</p>
          <div className="flex space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
            >
              Notify Me
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center space-x-2 text-green-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">You'll be notified when this item is back in stock</span>
        </div>
      )}
    </div>
  )
}

export default ProductNotification
