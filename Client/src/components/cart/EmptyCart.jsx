"use client"

import { useNavigate } from "react-router-dom"

const EmptyCart = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md px-4 mx-auto text-center">
        {/* Empty Cart Icon */}
        <div className="mb-8">
          <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
        </div>

        {/* Empty State Content */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>

        <p className="mb-8 text-gray-600">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/products")}
            className="w-full px-6 py-3 font-semibold text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
          >
            Start Shopping
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Home
          </button>
        </div>

        {/* Featured Categories */}
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Popular Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/products?category=women")}
              className="p-4 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
            >
              <div className="mb-2 text-2xl">👗</div>
              <div className="text-sm font-medium text-gray-900">Women's Fashion</div>
            </button>

            <button
              onClick={() => navigate("/products?category=men")}
              className="p-4 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
            >
              <div className="mb-2 text-2xl">👔</div>
              <div className="text-sm font-medium text-gray-900">Men's Fashion</div>
            </button>

            <button
              onClick={() => navigate("/products?category=accessories")}
              className="p-4 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
            >
              <div className="mb-2 text-2xl">👜</div>
              <div className="text-sm font-medium text-gray-900">Accessories</div>
            </button>

            <button
              onClick={() => navigate("/products?category=shoes")}
              className="p-4 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
            >
              <div className="mb-2 text-2xl">👟</div>
              <div className="text-sm font-medium text-gray-900">Footwear</div>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-8 mt-12 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="mb-2 text-green-600">
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">Free Shipping</div>
            </div>

            <div>
              <div className="mb-2 text-blue-600">
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">Easy Returns</div>
            </div>

            <div>
              <div className="mb-2 text-purple-600">
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">Secure Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCart
