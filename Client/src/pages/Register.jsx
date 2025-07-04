"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register, reset } from "../store/slice/authSlice"
import toast from "react-hot-toast"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess && user) {
      if (!user.mobileVerified) {
        navigate("/verify-mobile")
      } else {
        navigate("/")
      }
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const mobileRegex = /^[6-9]\d{9}$/
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required"
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      mobile: formData.mobile.trim(),
      password: formData.password,
    }
    dispatch(register(userData))
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center animate-slide-in-left">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 transform shadow-lg bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl group-hover:scale-110">
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text">
                Ksauni Bliss
              </span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="p-8 border shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl border-white/30 animate-slide-in-left animation-delay-200">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-purple-500 transition-colors duration-300 hover:text-purple-600"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all duration-300 outline-none ${
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-400 group-hover:border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all duration-300 outline-none ${
                      errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-400 group-hover:border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
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
                {errors.email && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.email}</p>}
              </div>

              {/* Mobile Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all duration-300 outline-none ${
                      errors.mobile
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-400 group-hover:border-gray-300"
                    }`}
                    placeholder="Enter 10-digit mobile number"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.mobile && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.mobile}</p>}
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all duration-300 outline-none ${
                      errors.password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-400 group-hover:border-gray-300"
                    }`}
                    placeholder="Create password (min 6 chars)"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
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
                {errors.password && <p className="mt-1 text-sm text-red-500 animate-shake">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all duration-300 outline-none ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-400 group-hover:border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 transition-colors duration-300 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 animate-shake">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 text-purple-500 border-2 border-gray-300 rounded focus:ring-purple-400 focus:ring-2 mt-0.5"
                />
                <label className="text-sm leading-relaxed text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-purple-500 transition-colors duration-300 hover:text-purple-600"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-purple-500 transition-colors duration-300 hover:text-purple-600"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl hover:from-purple-600 hover:to-orange-600 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-orange-400/20 to-pink-400/20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-orange-500 opacity-90"></div>
          <div className="relative z-20 text-center">
            <div className="mb-8 animate-bounce">
              <div className="flex items-center justify-center w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold animate-slide-in-right">Join Our Family!</h1>
            <p className="text-xl opacity-90 animate-slide-in-right animation-delay-200">
              Create your account and start your amazing shopping experience
            </p>
            <div className="mt-8 space-y-4 animate-slide-in-right animation-delay-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm">Quick Registration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-100"></div>
                <span className="text-sm">Exclusive Offers</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
                <span className="text-sm">Premium Support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute w-4 h-4 rounded-full top-16 right-20 bg-white/30 animate-float"></div>
        <div className="absolute w-6 h-6 rounded-full top-32 left-32 bg-white/20 animate-float animation-delay-300"></div>
        <div className="absolute w-3 h-3 rounded-full bottom-40 right-16 bg-white/40 animate-float animation-delay-600"></div>
        <div className="absolute w-5 h-5 rounded-full bottom-24 left-20 bg-white/25 animate-float animation-delay-900"></div>
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
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
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
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

export default Register
