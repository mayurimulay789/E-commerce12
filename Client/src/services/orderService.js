import api from "./api"

const createRazorpayOrder = async (amount, token) => {
  const response = await api.post(
    "/orders/create-razorpay-order",
    { amount },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

const verifyPayment = async (paymentData, token) => {
  const response = await api.post("/orders/verify-payment", paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const getUserOrders = async (token, params = {}) => {
  const response = await api.get("/orders/my-orders", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })
  return response.data
}

const getOrderById = async (orderId, token) => {
  const response = await api.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const trackOrder = async (orderNumber, token) => {
  const response = await api.get(`/orders/track/${orderNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const cancelOrder = async (orderId, reason, token) => {
  const response = await api.put(
    `/orders/${orderId}/cancel`,
    { reason },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

const orderService = {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
}

export default orderService
