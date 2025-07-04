import api from "./api"

const register = async (userData) => {
  const response = await api.post("/auth/register", userData)

  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", response.data.token)
  }

  return response.data
}

const login = async (userData) => {
  const response = await api.post("/auth/login", userData)

  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", response.data.token)
  }

  return response.data
}

const verifyMobileOTP = async (otp, token) => {
  const response = await api.post(
    "/auth/verify-mobile",
    { otp },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}

const resendOTP = async (token) => {
  const response = await api.post(
    "/auth/resend-otp",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}

const getProfile = async (token) => {
  const response = await api.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}

const updateProfile = async (userData, token) => {
  const response = await api.put("/auth/profile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.data.success) {
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

const logout = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}

const authService = {
  register,
  login,
  verifyMobileOTP,
  resendOTP,
  getProfile,
  updateProfile,
  logout,
}

export default authService
