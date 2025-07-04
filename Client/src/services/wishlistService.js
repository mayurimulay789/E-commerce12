import api from "./api"

const getWishlist = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.get("/users/wishlist", config)
  return response.data
}

const addToWishlist = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.post("/users/wishlist/add", { productId }, config)
  return response.data
}

const removeFromWishlist = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.delete(`/users/wishlist/remove/${productId}`, config)
  return response.data
}

const clearWishlist = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.delete("/users/wishlist/clear", config)
  return response.data
}

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
}

export default wishlistService
