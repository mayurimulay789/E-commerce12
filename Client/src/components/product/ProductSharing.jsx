"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const ProductSharing = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = window.location.href
  const shareText = `Check out this amazing ${product.name} from Ksauni Bliss!`

  const shareOptions = [
    {
      name: "Copy Link",
      icon: "🔗",
      action: () => {
        navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
        setIsOpen(false)
      },
    },
    {
      name: "WhatsApp",
      icon: "📱",
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`)
        setIsOpen(false)
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
        setIsOpen(false)
      },
    },
    {
      name: "Twitter",
      icon: "🐦",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        )
        setIsOpen(false)
      },
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-3 space-x-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full min-w-48">
          <h4 className="mb-3 font-medium text-gray-900">Share this product</h4>
          <div className="space-y-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="flex items-center w-full p-2 space-x-3 text-left transition-colors rounded-md hover:bg-gray-50"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm font-medium text-gray-700">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSharing
