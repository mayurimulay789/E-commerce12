import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { Toaster } from "react-hot-toast"
import { store } from "./store/store"

// Layout
import Layout from "./components/layout/Layout"

// Pages
import Home from "./pages/Home"
import Products from "./pages/Product"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VerifyMobile from "./pages/VerifyMobile"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import OrderTracking from "./pages/OrderTracking"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import DigitalMarketerDashboard from "./pages/DigitalMarketer/DigitalMarketerDashboard"

// Protected Route Component
import ProtectedRoute from "./components/ProectedRoute"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />

          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-mobile" element={<VerifyMobile />} />

            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
            </Route>

            {/* Protected Routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="track/:orderNumber" element={<OrderTracking />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Digital Marketer Routes */}
            <Route
              path="/marketer/*"
              element={
                <ProtectedRoute requiredRole={["admin", "marketer"]}>
                  <DigitalMarketerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
