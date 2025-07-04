"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateProfile } from "../../store/slice/authSlice"

const UserProfile = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const { orders } = useSelector((state) => state.orders)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const totalSpent = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile(formData)).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error("Profile update failed:", error)
    }
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    // Handle password change logic here
    console.log("Password change:", passwordData)
    setShowPasswordForm(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6 md:col-span-2">
              <div className="flex items-center justify-center w-20 h-20 bg-gray-300 rounded-full">
                <span className="text-2xl font-bold text-gray-700">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <button type="button" className="mt-2 text-sm text-blue-600 hover:text-blue-800" disabled={!isEditing}>
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Email Field */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Statistics */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Account Statistics</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{orders?.length || 0}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{wishlistItems?.length || 0}</p>
            <p className="text-sm text-gray-600">Wishlist Items</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Security Settings</h2>

        {!showPasswordForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-600">Last updated 30 days ago</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 font-medium text-blue-600 hover:text-blue-800"
              >
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 font-medium text-blue-600 hover:text-blue-800">Enable 2FA</button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and data</p>
              </div>
              <button className="px-4 py-2 font-medium text-red-600 hover:text-red-800">Delete Account</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-6 py-2 text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserProfile
