import api from "./api"

// Analytics APIs
const getAnalytics = async (token) => {
  const response = await api.get("/admin/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const getDashboardStats = async (token) => {
  const response = await api.get("/admin/dashboard-stats", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const getSalesChart = async (period = "7d", token) => {
  const response = await api.get(`/admin/sales-chart?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const getTopProducts = async (limit = 5, token) => {
  const response = await api.get(`/admin/top-products?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const getRecentOrders = async (limit = 10, token) => {
  const response = await api.get(`/admin/recent-orders?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// User Management APIs
const getAllUsers = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/admin/users?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const updateUserRole = async (userId, role, token) => {
  const response = await api.put(
    `/admin/users/${userId}/role`,
    { role },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

const banUser = async (userId, token) => {
  const response = await api.put(
    `/admin/users/${userId}/ban`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}

const deleteUser = async (userId, token) => {
  const response = await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Product Management APIs
const createProduct = async (productData, token) => {
  const response = await api.post("/admin/products", productData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const updateProduct = async (productId, productData, token) => {
  const response = await api.put(`/admin/products/${productId}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const deleteProduct = async (productId, token) => {
  const response = await api.delete(`/admin/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

// Image Upload APIs
const uploadProductImage = async (imageFile, token) => {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await api.post("/admin/upload/product-image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

const uploadBannerImage = async (imageFile, type, token) => {
  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("type", type)

  const response = await api.post("/admin/upload/banner", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Banner Management APIs
const getBanners = async (type, token) => {
  const response = await api.get(`/admin/banners?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const createBanner = async (bannerData, token) => {
  const response = await api.post("/admin/banners", bannerData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const deleteBanner = async (bannerId, token) => {
  const response = await api.delete(`/admin/banners/${bannerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

const adminService = {
  // Analytics
  getAnalytics,
  getDashboardStats,
  getSalesChart,
  getTopProducts,
  getRecentOrders,

  // User Management
  getAllUsers,
  updateUserRole,
  banUser,
  deleteUser,

  // Product Management
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,

  // Banner Management
  getBanners,
  createBanner,
  deleteBanner,
  uploadBannerImage,
}

export default adminService
