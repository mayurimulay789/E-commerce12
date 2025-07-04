"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCart } from "../store/slice/cartSlice"
import CartItem from "../components/cart/CartItem"
import CartSummary from "../components/cart/CartSummary"
import EmptyCart from "../components/cart/EmptyCart"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { cart, isLoading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(getCart())
    }
  }, [dispatch, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <div className="animate-pulse">
            <div className="w-1/4 h-8 mb-8 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-300 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                        <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm h-fit">
                <div className="space-y-4">
                  <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cart.items.length} {cart.items.length === 1 ? "item" : "items"})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <CartItem key={`${item.product._id}-${item.size}`} item={item} />
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <button
                  onClick={() => navigate("/products")}
                  className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
