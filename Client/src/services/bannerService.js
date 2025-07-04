import api from "./api"

const getAllBanners = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/banners?${queryString}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const getBannerById = async (id) => {
  const response = await api.get(`/banners/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const createBanner = async (bannerData) => {
  const response = await api.post("/banners", bannerData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const updateBanner = async (id, bannerData) => {
  const response = await api.put(`/banners/${id}`, bannerData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const deleteBanner = async (id) => {
  const response = await api.delete(`/banners/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const getActiveBannersByPosition = async (position) => {
  const response = await api.get(`/banners/position/${position}`)
  return response.data
}

const trackBannerView = async (id) => {
  const response = await api.post(`/banners/${id}/view`)
  return response.data
}

const trackBannerClick = async (id) => {
  const response = await api.post(`/banners/${id}/click`)
  return response.data
}

const getBannerAnalytics = async () => {
  const response = await api.get("/banners/analytics", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.data
}

const bannerService = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBannersByPosition,
  trackBannerView,
  trackBannerClick,
  getBannerAnalytics,
}

export default bannerService
