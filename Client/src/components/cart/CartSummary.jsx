"use client"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const CartSummary = () => {
  const navigate = useNavigate()
  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = cart.totalAmount || 0
  const freeShippingThreshold = 999
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 99
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0 // 10% discount if promo applied
  const total = subtotal + shippingCost + tax - discount

  const remainingForFreeShipping = freeShippingThreshold - subtotal
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
      setPromoCode("")
    }
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout")
    } else {
      navigate("/checkout")
    }
  }

  return (
    <div className="sticky bg-white rounded-lg shadow-sm top-8">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

        {/* Free Shipping Progress */}
        {subtotal < freeShippingThreshold && (
          <div className="p-4 mb-6 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Free Shipping</span>
              <span className="text-sm text-blue-700">₹{remainingForFreeShipping} to go</span>
            </div>
            <div className="w-full h-2 bg-blue-200 rounded-full">
              <div
                className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-blue-700">Add ₹{remainingForFreeShipping} more to get free shipping!</p>
          </div>
        )}

        {/* Promo Code */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={promoApplied}
            />
            <button
              onClick={handlePromoCode}
              disabled={!promoCode || promoApplied}
              className="px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Promo code applied! 10% discount
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({cart.items?.length || 0} items)</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shippingCost === 0 ? <span className="text-green-600">Free</span> : `₹${shippingCost}`}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (GST 18%)</span>
            <span className="font-medium">₹{tax.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-3 border-t">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full px-4 py-3 font-semibold text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
        >
          {user ? "Proceed to Checkout" : "Login to Checkout"}
        </button>

        {/* Security Badges */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Easy Returns</span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">We accept all major credit cards, debit cards, UPI, and net banking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
