"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "orders", name: "Orders", icon: "📦" },
    { id: "wishlist", name: "Wishlist", icon: "❤️" },
    { id: "addresses", name: "Addresses", icon: "🏠" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-300 ease-in-out lg:static lg:inset-0
      `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Ksauni Bliss
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-600 lg:hidden hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
              <span className="text-sm font-medium text-gray-700">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  activeTab === item.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Back to store */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100"
          >
            <span className="text-lg">🏪</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
