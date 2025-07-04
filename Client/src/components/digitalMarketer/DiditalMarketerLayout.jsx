"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../../store/slice/authSlice"

const DigitalMarketerLayout = ({ children, activeTab, setActiveTab }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { id: "analytics", name: "Analytics", icon: "📊" },
    { id: "seo", name: "SEO Manager", icon: "🔍" },
    { id: "banners", name: "Banner Manager", icon: "🎨" },
    { id: "content", name: "Content Manager", icon: "📝" },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

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
            Ksauni Bliss Marketing
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
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full">
              <span className="text-sm font-medium text-white">{user?.name?.charAt(0).toUpperCase() || "M"}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-purple-600">Digital Marketer</p>
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
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="absolute space-y-2 bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100"
          >
            <span className="text-lg">🏪</span>
            <span>View Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 space-x-3 text-sm font-medium text-red-600 transition-colors rounded-md hover:bg-red-50"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
          <h1 className="text-xl font-semibold text-gray-900">Marketing Dashboard</h1>
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

export default DigitalMarketerLayout
