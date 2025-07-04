"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { getUserOrders, getOrderById } from "../store/slice/orderSlice"

const Orders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { user } = useSelector((state) => state.auth)
  const { orders, order, isLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    dispatch(getUserOrders())
  }, [dispatch, user, navigate])

  const handleViewOrder = async (orderId) => {
    await dispatch(getOrderById(orderId))
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
              <div className="h-8 mb-6 bg-gray-300 rounded"></div>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="pb-4 mb-4 border-b">
                  <div className="h-6 mb-2 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {orders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2 space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p>
                            {order.items.length} item(s) • Total: ₹{order.totalAmount}
                          </p>
                          {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
                        </div>
                      </div>

                      <div className="flex items-center mt-4 space-x-3 lg:mt-0">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          View Details
                        </button>
                        {order.orderStatus === "delivered" && (
                          <Link
                            to={`/products/${order.items[0]?.product?._id}?review=true`}
                            className="px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                          >
                            Write Review
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center mt-4 space-x-2">
                      {order.items.slice(0, 4).map((item, index) => (
                        <img
                          key={index}
                          src={item.product?.images?.[0]?.url || "/placeholder.svg?height=50&width=50"}
                          alt={item.product?.name}
                          className="object-cover w-12 h-12 rounded-md"
                        />
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex items-center justify-center w-12 h-12 text-xs text-gray-600 bg-gray-100 rounded-md">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-gray-400"
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
              <h2 className="mb-4 text-2xl font-bold text-gray-900">No orders yet</h2>
              <p className="mb-8 text-gray-600">When you place your first order, it will appear here.</p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order Number</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium">₹{selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="mb-2 font-medium text-gray-900">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                    {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                  <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="mb-4 font-medium text-gray-900">Items Ordered</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.product?.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                        alt={item.product?.name}
                        className="object-cover rounded-md w-15 h-15"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} | Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
