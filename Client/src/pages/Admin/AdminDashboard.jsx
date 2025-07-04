"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminStats from "../../components/admin/AdminStats"
import ProductManager from "../../components/admin/ProductManager"
// import UserManager from "../../components/admin/UserManager"
import OrderManager from "../../components/admin/RecentOrders"
// import BannerManager from "../../components/admin/BannerManager"
// import AdminAnalytics from "../../components/admin/AdminAnalytics"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/unauthorized")
      return
    }
  }, [user, navigate])

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mb-6 text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminStats />
      case "products":
        return <ProductManager />
      case "users":
        return <UserManager />
      case "orders":
        return <OrderManager />
      case "banners":
        return <BannerManager />
      case "analytics":
        return <AdminAnalytics />
      default:
        return <AdminStats />
    }
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  )
}

export default AdminDashboard
