"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // These would be actual API calls in a real app
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get("/orders/all?limit=1000"),
          api.get("/products?limit=1000"),
          api.get("/admin/users"), // This would need to be implemented
        ])

        const orders = ordersRes.data.orders || []
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: productsRes.data.pagination?.total || 0,
          totalUsers: usersRes.data?.users?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set mock data for demo
        setStats({
          totalOrders: 156,
          totalRevenue: 45230,
          totalProducts: 24,
          totalUsers: 89,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Products",
      value: stats.totalProducts,
      icon: "👕",
      color: "bg-purple-500",
      change: "+3",
      changeType: "increase",
    },
    {
      name: "Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-orange-500",
      change: "+15%",
      changeType: "increase",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="w-12 h-12 mb-4 bg-gray-300 rounded-lg"></div>
            <div className="h-6 mb-2 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-sm text-gray-500">from last month</span>
              </div>
            </div>
            <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminStats
