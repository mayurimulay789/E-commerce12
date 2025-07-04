"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slice/authSlice"
import { getCart } from "../../store/slice/cartSlice"
import { getCategories } from "../../store/slice/categorySlice"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, token } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  const { categories } = useSelector((state) => state.categories)

  useEffect(() => {
    dispatch(getCategories())
    if (token) {
      dispatch(getCart())
    }
  }, [dispatch, token])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  const cartItemsCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container px-4 mx-auto">
        {/* Top Bar */}
        <div className="items-center justify-between hidden py-2 text-sm border-b md:flex">
          <div className="text-gray-600">Free shipping on orders over ₹999</div>
          <div className="flex space-x-4">
            <Link to="/track-order" className="text-gray-600 hover:text-gray-800">
              Track Order
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-800">
              Help
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Ksauni Bliss
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 lg:flex">
            <Link to="/" className="font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center font-medium text-gray-700 hover:text-gray-900">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 invisible w-48 py-2 transition-all duration-200 bg-white rounded-md shadow-lg opacity-0 top-full group-hover:opacity-100 group-hover:visible">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category._id}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/products" className="font-medium text-gray-700 hover:text-gray-900">
              All Products
            </Link>
            <Link to="/about" className="font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="font-medium text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Search, Cart, User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 p-4 mt-2 bg-white rounded-md shadow-lg top-full w-80">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </form>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </button>
                <div className="absolute right-0 invisible w-48 py-2 mt-2 transition-all duration-200 bg-white rounded-md shadow-lg opacity-0 top-full group-hover:opacity-100 group-hover:visible">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 font-medium text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 font-medium text-white bg-black rounded-md hover:bg-gray-800">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 lg:hidden hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="py-4 border-t lg:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link to="/products" className="font-medium text-gray-700 hover:text-gray-900">
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="pl-4 text-gray-600 hover:text-gray-800"
                >
                  {category.name}
                </Link>
              ))}
              <Link to="/about" className="font-medium text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link to="/contact" className="font-medium text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
