"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../store/slice/authSlice"
import { getCart } from "../../store/slice/cartSlice"
import { getCategories } from "../../store/slice/categorySlice"
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown, FiHeart } from "react-icons/fi"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
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
    <>
      {/* Top Banner */}
      <div className="top-banner">
        <div className="container">
          <div className="banner-content">
            <span className="banner-text">🚀 Free shipping on orders over ₹999 | 24/7 Customer Support</span>
            <div className="banner-links">
              <Link to="/track-order" className="banner-link">
                Track Order
              </Link>
              <Link to="/help" className="banner-link">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <div className="logo-icon">
                <span>K</span>
              </div>
              <span className="logo-text">Ksauni Bliss</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <Link to="/" className="nav-link">
                <span>Home</span>
              </Link>

              <div className="nav-dropdown">
                <button className="nav-link dropdown-trigger">
                  <span>Categories</span>
                  <FiChevronDown className="dropdown-icon" />
                </button>
                <div className="dropdown-menu">
                  {categories.map((category) => (
                    <Link key={category._id} to={`/products?category=${category._id}`} className="dropdown-item">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/products" className="nav-link">
                <span>All Products</span>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-form">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </form>
            </div>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Mobile Search */}
              <button className="action-btn mobile-search-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <FiSearch />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="action-btn">
                <FiHeart />
                <span className="action-label">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="action-btn cart-btn">
                <div className="cart-icon-wrapper">
                  <FiShoppingBag />
                  {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
                </div>
                <span className="action-label">Cart</span>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="user-menu">
                  <button className="user-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                    <span className="user-name">{user.name}</span>
                    <FiChevronDown className="user-dropdown-icon" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar-large">{user.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="user-name-large">{user.name}</p>
                          <p className="user-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/dashboard" className="dropdown-item">
                        <FiUser className="dropdown-icon" />
                        Dashboard
                      </Link>
                      <Link to="/orders" className="dropdown-item">
                        <FiShoppingBag className="dropdown-icon" />
                        My Orders
                      </Link>
                      <Link to="/profile" className="dropdown-item">
                        <FiUser className="dropdown-icon" />
                        Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="dropdown-item">
                          <FiUser className="dropdown-icon" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                  <Link to="/register" className="signup-btn">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="mobile-search">
              <form onSubmit={handleSearch} className="mobile-search-form">
                <FiSearch className="mobile-search-icon" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                  autoFocus
                />
                <button type="submit" className="mobile-search-btn">
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <nav className="mobile-nav">
                <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/products" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  All Products
                </Link>
                <div className="mobile-categories">
                  <p className="mobile-categories-title">Categories</p>
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products?category=${category._id}`}
                      className="mobile-category-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                {!user && (
                  <div className="mobile-auth">
                    <Link to="/login" className="mobile-auth-link" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="mobile-auth-link signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header
