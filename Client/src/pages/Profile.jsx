"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProfile, getProfile } from "../store/slice/authSlice"
import toast from "react-hot-toast"

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isLoading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addresses: [],
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    dispatch(getProfile())
  }, [dispatch, user, navigate])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        addresses: user.addresses || [],
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile(formData)).unwrap()
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleAddAddress = () => {
    const newAddress = {
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      isDefault: formData.addresses.length === 0,
    }
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }))
  }

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses]
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value }
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }))
  }

  const handleRemoveAddress = (index) => {
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }))
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: "profile", name: "Profile Information", icon: "👤" },
    { id: "addresses", name: "Addresses", icon: "📍" },
    { id: "security", name: "Security", icon: "🔒" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center mb-6 space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-gray-600 bg-gray-300 rounded-full">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Profile Information Tab */}
                {activeTab === "profile" && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md bg-gray-50"
                          />
                          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Account Type</label>
                          <input
                            type="text"
                            value={user.role}
                            disabled
                            className="w-full px-3 py-2 text-gray-500 capitalize border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
                          >
                            {isLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === "addresses" && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                      >
                        Add Address
                      </button>
                    </div>

                    {formData.addresses.length > 0 ? (
                      <div className="space-y-4">
                        {formData.addresses.map((address, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 text-xs text-gray-700 capitalize bg-gray-100 rounded">
                                  {address.type}
                                </span>
                                {address.isDefault && (
                                  <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">Default</span>
                                )}
                              </div>
                              <button
                                onClick={() => handleRemoveAddress(index)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Street Address</label>
                                <input
                                  type="text"
                                  value={address.street}
                                  onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
                                <input
                                  type="text"
                                  value={address.city}
                                  onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
                                <input
                                  type="text"
                                  value={address.state}
                                  onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">ZIP Code</label>
                                <input
                                  type="text"
                                  value={address.zipCode}
                                  onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={handleSubmit}
                          className="w-full py-3 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
                        >
                          Save Addresses
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="mb-4 text-gray-600">No addresses saved yet</p>
                        <button
                          onClick={handleAddAddress}
                          className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Add Your First Address
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Security Settings</h2>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="mb-2 font-medium text-gray-900">Change Password</h3>
                        <p className="mb-4 text-sm text-gray-600">Update your password to keep your account secure</p>
                        <button className="px-4 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800">
                          Change Password
                        </button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="mb-2 font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="mb-4 text-sm text-gray-600">Add an extra layer of security to your account</p>
                        <button className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="p-4 border border-red-200 rounded-lg">
                        <h3 className="mb-2 font-medium text-red-900">Delete Account</h3>
                        <p className="mb-4 text-sm text-red-600">
                          Permanently delete your account and all associated data
                        </p>
                        <button className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
