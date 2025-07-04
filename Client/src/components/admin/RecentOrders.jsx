"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"

const RecentOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await api.get("/orders/all?limit=5&sort=createdAt")
        setOrders(response.data.orders || [])
      } catch (error) {
        console.error("Error fetching recent orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="p-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center py-3 space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <span className="text-sm font-medium text-gray-600">
                      {order.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.user?.name || "Unknown User"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-600">
          <p>No recent orders</p>
        </div>
      )}
    </div>
  )
}

export default RecentOrders
