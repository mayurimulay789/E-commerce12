import api from "./api"

const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/products?${queryString}`)
  return response.data
}

const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

const addReview = async (productId, reviewData, token) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const productService = {
  getProducts,
  getProduct,
  addReview,
}

export default productService
