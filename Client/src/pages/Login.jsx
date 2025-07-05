"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, reset } from "../store/slice/authSlice"
import toast from "react-hot-toast"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  const from = location.state?.from?.pathname || "/"

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess || user) {
      navigate(from, { replace: true })
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch, from])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Left Side - Image */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-400/20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-blue-500 opacity-90"></div>
          <div className="relative z-20 text-center">
            <div className="mb-8 animate-bounce">
              <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">Welcome Back!</h1>
            <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
              Sign in to continue your shopping journey
            </p>
            <div className="mt-8 space-y-4 animate-fade-in-up animation-delay-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm">Secure Login</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-100"></div>
                <span className="text-sm">Fast & Easy</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute w-4 h-4 rounded-full top-20 left-20 bg-white/30 animate-float"></div>
        <div className="absolute w-6 h-6 rounded-full top-40 right-32 bg-white/20 animate-float animation-delay-300"></div>
        <div className="absolute w-3 h-3 rounded-full bottom-32 left-16 bg-white/40 animate-float animation-delay-600"></div>
        <div className="absolute w-5 h-5 rounded-full bottom-20 right-20 bg-white/25 animate-float animation-delay-900"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center animate-fade-in-down">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 transform shadow-lg bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl group-hover:scale-110">
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text">
                Ksauni Bliss
              </span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20 animate-fade-in-up">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-pink-500 transition-colors duration-300 hover:text-pink-600"
                >
                  Create one
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 transition-all duration-300 border-2 border-gray-200 outline-none bg-gray-50 rounded-xl focus:border-pink-400 focus:bg-white group-hover:border-gray-300"
                    placeholder="Enter your email"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 transition-all duration-300 border-2 border-gray-200 outline-none bg-gray-50 rounded-xl focus:border-pink-400 focus:bg-white group-hover:border-gray-300"
                    placeholder="Enter your password"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-colors duration-300 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-pink-500 border-2 border-gray-300 rounded focus:ring-pink-400 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-pink-500 transition-colors duration-300 hover:text-pink-600"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl hover:from-pink-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 group"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 group"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                    Facebook
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  )
}

export default Login
