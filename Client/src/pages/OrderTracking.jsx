"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import orderService from "../services/orderService"

const OrderTracking = () => {
  const { orderNumber } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [tracking, setTracking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchTrackingInfo()
  }, [orderNumber, user, navigate])

  const fetchTrackingInfo = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await orderService.trackOrder(orderNumber, token)

      if (response.success) {
        setTracking(response.tracking)
      } else {
        toast.error(response.message)
        navigate("/orders")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tracking info")
      navigate("/orders")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusSteps = () => {
    const allSteps = [
      { key: "pending", label: "Order Placed", icon: "📝" },
      { key: "confirmed", label: "Confirmed", icon: "✅" },
      { key: "processing", label: "Processing", icon: "⚙️" },
      { key: "packed", label: "Packed", icon: "📦" },
      { key: "shipped", label: "Shipped", icon: "🚚" },
      { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
      { key: "delivered", label: "Delivered", icon: "🎉" },
    ]

    const currentStatusIndex = allSteps.findIndex((step) => step.key === tracking?.currentStatus)

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      current: step.key === tracking?.currentStatus,
    }))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
              <div className="h-8 mb-6 bg-gray-300 rounded"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Order Not Found</h2>
          <p className="mb-6 text-gray-600">
            The order you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            View All Orders
          </button>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-600">Order #{tracking.orderNumber}</p>
          </div>

          {/* Order Status Timeline */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Order Status</h2>

            <div className="relative">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex items-center mb-8 last:mb-0">
                  {/* Timeline Line */}
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-16 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  )}

                  {/* Status Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : step.current
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>

                  {/* Status Info */}
                  <div className="flex-1 ml-4">
                    <h3
                      className={`font-medium ${
                        step.current ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {step.current && <p className="mt-1 text-sm text-gray-600">Current status</p>}
                  </div>

                  {/* Timestamp */}
                  <div className="text-right">
                    {tracking.statusHistory
                      .filter((history) => history.status === step.key)
                      .map((history, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {formatDate(history.timestamp)}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Information */}
          {tracking.trackingInfo?.trackingNumber && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Shipping Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-medium text-gray-900">{tracking.trackingInfo.trackingNumber}</p>
                </div>
                {tracking.trackingInfo.carrier && (
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="font-medium text-gray-900">{tracking.trackingInfo.carrier}</p>
                  </div>
                )}
                {tracking.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-medium text-gray-900">{formatDate(tracking.estimatedDelivery)}</p>
                  </div>
                )}
                {tracking.trackingInfo.actualDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Delivered On</p>
                    <p className="font-medium text-green-600">{formatDate(tracking.trackingInfo.actualDelivery)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Items</h2>
            <div className="space-y-4">
              {tracking.items?.map((item, index) => (
                <div key={index} className="flex items-center p-4 space-x-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product?.images?.[0]?.url || "/placeholder.svg?height=80&width=80"}
                    alt={item.product?.name}
                    className="object-cover w-20 h-20 rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} {item.size && `• Size: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order History</h2>
            <div className="space-y-4">
              {tracking.statusHistory
                ?.slice()
                .reverse()
                .map((history, index) => (
                  <div key={index} className="flex items-start p-4 space-x-4 border-l-4 border-blue-500 bg-blue-50">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{history.status.replace("_", " ")}</p>
                      {history.note && <p className="mt-1 text-sm text-gray-600">{history.note}</p>}
                    </div>
                    <div className="text-sm text-gray-600">{formatDate(history.timestamp)}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
