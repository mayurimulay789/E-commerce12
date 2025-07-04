"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { getUserOrders } from "../../store/slice/orderSlice"

const DashboardStats = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orders } = useSelector((state) => state.orders)
  const { items: cartItems } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { addresses } = useSelector((state) => state.address)

  useEffect(() => {
    dispatch(getUserOrders())
  }, [dispatch])

  const stats = [
    {
      name: "Total Orders",
      value: orders?.length || 0,
      icon: "📦",
      color: "bg-blue-500",
      link: "/dashboard?tab=orders",
    },
    {
      name: "Cart Items",
      value: cartItems?.length || 0,
      icon: "🛒",
      color: "bg-green-500",
      link: "/cart",
    },
    {
      name: "Wishlist",
      value: wishlistItems?.length || 0,
      icon: "❤️",
      color: "bg-red-500",
      link: "/dashboard?tab=wishlist",
    },
    {
      name: "Addresses",
      value: addresses?.length || 0,
      icon: "🏠",
      color: "bg-purple-500",
      link: "/dashboard?tab=addresses",
    },
  ]

  const recentOrders = orders?.slice(0, 3) || []

  const quickActions = [
    { name: "Edit Profile", icon: "✏️", link: "/dashboard?tab=profile" },
    { name: "Track Orders", icon: "📍", link: "/dashboard?tab=orders" },
    { name: "Manage Addresses", icon: "📍", link: "/dashboard?tab=addresses" },
    { name: "View Wishlist", icon: "❤️", link: "/dashboard?tab=wishlist" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="p-6 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
        <h1 className="mb-2 text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Manage your account and track your orders from your dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/dashboard?tab=orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            <p>No orders yet</p>
            <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className="flex flex-col items-center p-4 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
            >
              <span className="mb-2 text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-center text-gray-700">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Health */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Account Health</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span className="text-sm text-gray-700">Email Verified</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span className="text-sm text-gray-700">Profile Complete</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={addresses?.length > 0 ? "text-green-500" : "text-yellow-500"}>
                {addresses?.length > 0 ? "✅" : "⚠️"}
              </span>
              <span className="text-sm text-gray-700">Shipping Address</span>
            </div>
            {addresses?.length === 0 && (
              <Link to="/dashboard?tab=addresses" className="text-sm text-blue-600 hover:text-blue-800">
                Add Address
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
