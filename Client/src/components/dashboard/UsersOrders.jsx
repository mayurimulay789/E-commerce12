"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getUserOrders, getOrderById } from "../../store/slice/orderSlice"

const UserOrders = () => {
  const dispatch = useDispatch()
  const { orders, order, isLoading } = useSelector((state) => state.orders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")

  useEffect(() => {
    dispatch(getUserOrders())
  }, [dispatch])

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

  const getActionButton = (order) => {
    switch (order.orderStatus) {
      case "processing":
        return (
          <button className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200">Cancel Order</button>
        )
      case "shipped":
        return (
          <button className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded hover:bg-blue-200">Track Order</button>
        )
      case "delivered":
        return (
          <button className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200">
            Write Review
          </button>
        )
      default:
        return null
    }
  }

  const filteredOrders =
    orders?.filter((order) => {
      if (filterStatus === "all") return true
      return order.orderStatus === filterStatus
    }) || []

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date_desc":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "date_asc":
        return new Date(a.createdAt) - new Date(b.createdAt)
      case "amount_desc":
        return b.totalAmount - a.totalAmount
      case "amount_asc":
        return a.totalAmount - b.totalAmount
      default:
        return 0
    }
  })

  const handleViewOrder = async (orderId) => {
    await dispatch(getOrderById(orderId))
    setSelectedOrder(orderId)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-24 h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="w-20 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="flex mt-4 space-x-4 sm:mt-0">
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {sortedOrders.length > 0 ? (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex flex-col mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center mt-2 space-x-4 sm:mt-0">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span className="font-semibold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center mb-4 space-x-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={item.product?.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                      alt={item.product?.name}
                      className="object-cover w-12 h-12 rounded-md"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-md">
                      <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Order Placed</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ["confirmed", "shipped", "delivered"].includes(order.orderStatus)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Confirmed</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ["shipped", "delivered"].includes(order.orderStatus) ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Shipped</span>
                    </div>
                    <div className="w-4 h-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.orderStatus === "delivered" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => handleViewOrder(order._id)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                  <div className="mt-2 sm:mt-0">{getActionButton(order)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mb-6 text-gray-600">
            {filterStatus === "all" ? "You haven't placed any orders yet." : `No ${filterStatus} orders found.`}
          </p>
          <a
            href="/products"
            className="inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Shopping
          </a>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="mb-2 font-medium text-gray-900">Order #{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-4 font-medium text-gray-900">Items ({order.items.length})</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.product?.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                        alt={item.product?.name}
                        className="object-cover w-16 h-16 rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="mb-2 font-medium text-gray-900">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pinCode}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-lg font-semibold">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserOrders
