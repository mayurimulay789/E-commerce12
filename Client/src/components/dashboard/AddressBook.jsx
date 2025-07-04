"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../store/slice/addressSlice"

const AddressBook = () => {
  const dispatch = useDispatch()
  const { addresses, isLoading } = useSelector((state) => state.address)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    type: "home",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false,
  })

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ]

  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ id: editingAddress._id, addressData: formData })).unwrap()
      } else {
        await dispatch(addAddress(formData)).unwrap()
      }
      resetForm()
    } catch (error) {
      console.error("Address operation failed:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: "home",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      isDefault: false,
    })
    setShowForm(false)
    setEditingAddress(null)
  }

  const handleEdit = (address) => {
    setFormData(address)
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(deleteAddress(addressId))
    }
  }

  const handleSetDefault = async (addressId) => {
    await dispatch(setDefaultAddress(addressId))
  }

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "home":
        return "🏠"
      case "work":
        return "🏢"
      default:
        return "📍"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
        >
          Add New Address
        </button>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{editingAddress ? "Edit Address" : "Add New Address"}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Address Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PIN Code */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">PIN Code</label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex pt-4 space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
              <div className="w-20 h-4 mb-4 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                address.isDefault ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {/* Address Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getAddressTypeIcon(address.type)}</span>
                  <span className="font-medium text-gray-900 capitalize">{address.type}</span>
                  {address.isDefault && (
                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">Default</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(address)} className="text-sm text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(address._id)} className="text-sm text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{address.fullName}</p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state} {address.pinCode}
                </p>
                <p>{address.phone}</p>
              </div>

              {/* Set Default Button */}
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="px-3 py-1 mt-4 text-sm text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-6xl">🏠</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No addresses saved</h3>
          <p className="mb-6 text-gray-600">Add your shipping addresses to make checkout faster and easier.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Address Tips */}
      {addresses.length > 0 && (
        <div className="p-6 rounded-lg bg-green-50">
          <h3 className="mb-2 font-medium text-green-900">📍 Address Tips</h3>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Set a default address for faster checkout</li>
            <li>• Add work and home addresses for convenience</li>
            <li>• Keep your addresses updated for accurate delivery</li>
            <li>• Include landmark details for easier delivery</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AddressBook
