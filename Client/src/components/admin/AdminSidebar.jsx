"use client"

import { Link, useLocation } from "react-router-dom"

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "👕" },
    { name: "Orders", href: "/admin/orders", icon: "📦" },
    { name: "Categories", href: "/admin/categories", icon: "📂" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Analytics", href: "/admin/analytics", icon: "📈" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-300 ease-in-out lg:static lg:inset-0
      `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Ksauni Bliss Admin
          </Link>
          <button onClick={onClose} className="p-2 text-gray-600 lg:hidden hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100"
          >
            <span className="text-lg">🏠</span>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
