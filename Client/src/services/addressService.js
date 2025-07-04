import api from "./api"

const getAddresses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.get("/users/addresses", config)
  return response.data
}

const addAddress = async (addressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.post("/users/addresses", addressData, config)
  return response.data
}

const updateAddress = async (addressId, addressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.put(`/users/addresses/${addressId}`, addressData, config)
  return response.data
}

const deleteAddress = async (addressId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.delete(`/users/addresses/${addressId}`, config)
  return response.data
}

const setDefaultAddress = async (addressId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await api.put(`/users/addresses/${addressId}/default`, {}, config)
  return response.data
}

const addressService = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
}

export default addressService
