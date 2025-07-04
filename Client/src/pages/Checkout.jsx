"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getCart } from "../store/slice/cartSlice"
import { createRazorpayOrder, verifyPayment } from "../store/slice/orderSlice"
import ShippingForm from "../components/checkout/ShippingForm"
import CheckoutSummary from "../components/checkout/CheckoutSummary"
import RazorpayCheckout from "../components/checkout/RazorpayCheckout"
import toast from "react-hot-toast"

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const { isLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout")
      return
    }

    dispatch(getCart())
  }, [dispatch, user, navigate])

  useEffect(() => {
    // Pre-fill user data
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  if (!user) {
    return null
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cart.totalAmount || 0
  const shipping = subtotal >= 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const steps = [
    { id: 1, name: "Shipping Details", completed: currentStep > 1 },
    { id: 2, name: "Review & Payment", completed: false },
  ]

  const handleShippingSubmit = (data) => {
    setShippingData(data)
    setCurrentStep(2)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsProcessingPayment(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway")
        return
      }

      // Create Razorpay order
      const orderResult = await dispatch(createRazorpayOrder(total)).unwrap()
      const { order } = orderResult

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Ksauni Bliss",
        description: "Fashion Store Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: {
                  street: shippingData.street,
                  city: shippingData.city,
                  state: shippingData.state,
                  zipCode: shippingData.pincode,
                  country: "India",
                  phone: shippingData.phone,
                },
              }),
            ).unwrap()

            toast.success("Order placed successfully!")
            navigate("/orders")
          } catch (error) {
            toast.error("Payment verification failed")
            console.error("Payment verification error:", error)
          }
        },
        prefill: {
          name: shippingData.fullName,
          email: shippingData.email,
          contact: shippingData.phone,
        },
        theme: {
          color: "#1F2937",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error("Failed to initiate payment")
      console.error("Payment error:", error)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.completed
                        ? "bg-green-600 text-white"
                        : currentStep === step.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.completed ? "✓" : step.id}
                  </div>
                  <span className={`ml-2 font-medium ${currentStep === step.id ? "text-blue-600" : "text-gray-600"}`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 mx-4 min-w-[100px]"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && <ShippingForm initialData={shippingData} onSubmit={handleShippingSubmit} />}

              {currentStep === 2 && (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      ← Edit Details
                    </button>
                  </div>

                  {/* Shipping Address Review */}
                  <div className="p-4 mb-6 rounded-lg bg-gray-50">
                    <h3 className="mb-2 font-medium text-gray-900">Shipping Address</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium">{shippingData.fullName}</p>
                      <p>{shippingData.street}</p>
                      <p>
                        {shippingData.city}, {shippingData.state} {shippingData.pincode}
                      </p>
                      <p>Phone: {shippingData.phone}</p>
                      <p>Email: {shippingData.email}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="mb-4 font-medium text-gray-900">Order Items</h3>
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center p-4 space-x-4 border border-gray-200 rounded-lg"
                        >
                          <img
                            src={item.product?.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                            alt={item.product?.name}
                            className="object-cover rounded-md w-15 h-15"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                            <p className="text-sm text-gray-600">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <RazorpayCheckout
                    onPayment={handlePayment}
                    isProcessing={isProcessingPayment || isLoading}
                    total={total}
                  />
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <CheckoutSummary items={cart.items} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
