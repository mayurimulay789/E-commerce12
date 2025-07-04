import api from "./api"

const getCart = async (token) => {
  const response = await api.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const addToCart = async (itemData, token) => {
  const response = await api.post("/cart/add", itemData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const updateCartItem = async (updateData, token) => {
  const response = await api.put("/cart/update", updateData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const removeFromCart = async (itemId, token) => {
  const response = await api.delete(`/cart/remove/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const clearCart = async (token) => {
  const response = await api.delete("/cart/clear", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}

export default cartService
