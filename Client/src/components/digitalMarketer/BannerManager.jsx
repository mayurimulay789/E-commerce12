"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const BannerManager = () => {
  const [banners, setBanners] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "hero",
    position: "home-hero",
    link: {
      url: "",
      text: "",
      openInNewTab: false,
    },
    status: "active",
    priority: 0,
    schedule: {
      startDate: "",
      endDate: "",
    },
    targetAudience: {
      userType: "all",
      categories: [],
    },
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBanners()
    fetchAnalytics()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setBanners(data.banners)
      }
    } catch (error) {
      toast.error("Error fetching banners")
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/banners/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const handleImageUpload = async (file) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/upload/banner-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        return data.image
      } else {
        toast.error(data.message)
        return null
      }
    } catch (error) {
      toast.error("Error uploading image")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageData = editingBanner?.image

      // Upload new image if selected
      if (imageFile) {
        imageData = await handleImageUpload(imageFile)
        if (!imageData) {
          setLoading(false)
          return
        }
      }

      const bannerData = {
        ...formData,
        image: imageData,
      }

      const url = editingBanner ? `/api/banners/${editingBanner._id}` : "/api/banners"
      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bannerData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setShowModal(false)
        resetForm()
        fetchBanners()
        fetchAnalytics()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error saving banner")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "hero",
      position: "home-hero",
      link: {
        url: "",
        text: "",
        openInNewTab: false,
      },
      status: "active",
      priority: 0,
      schedule: {
        startDate: "",
        endDate: "",
      },
      targetAudience: {
        userType: "all",
        categories: [],
      },
    })
    setImageFile(null)
    setImagePreview("")
    setEditingBanner(null)
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || "",
      type: banner.type,
      position: banner.position,
      link: banner.link || { url: "", text: "", openInNewTab: false },
      status: banner.status,
      priority: banner.priority,
      schedule: {
        startDate: banner.schedule?.startDate ? new Date(banner.schedule.startDate).toISOString().split("T")[0] : "",
        endDate: banner.schedule?.endDate ? new Date(banner.schedule.endDate).toISOString().split("T")[0] : "",
      },
      targetAudience: banner.targetAudience || { userType: "all", categories: [] },
    })
    setImagePreview(banner.image.url)
    setShowModal(true)
  }

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await fetch(`/api/banners/${bannerId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const data = await response.json()

        if (data.success) {
          toast.success("Banner deleted successfully")
          fetchBanners()
          fetchAnalytics()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error("Error deleting banner")
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const positionOptions = {
    "home-hero": "Home Hero",
    "home-secondary": "Home Secondary",
    "category-top": "Category Top",
    "sidebar-right": "Sidebar Right",
    "popup-center": "Popup Center",
  }

  const typeOptions = {
    hero: "Hero Banner",
    secondary: "Secondary Banner",
    category: "Category Banner",
    sidebar: "Sidebar Banner",
    popup: "Popup Banner",
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banner Manager</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Banner
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Banners</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.overview.totalBanners}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.overview.totalViews}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Clicks</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.overview.totalClicks}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Average CTR</h3>
            <p className="text-3xl font-bold text-orange-600">{analytics.overview.averageCTR}%</p>
          </div>
        </div>
      )}

      {/* Banners Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Banner</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Type & Position
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Performance
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-24 h-16">
                      <img
                        className="object-cover w-24 h-16 rounded-lg"
                        src={banner.image.url || "/placeholder.svg"}
                        alt={banner.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                      <div className="text-sm text-gray-500">{banner.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{typeOptions[banner.type]}</div>
                  <div className="text-sm text-gray-500">{positionOptions[banner.position]}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      banner.status === "active"
                        ? "bg-green-100 text-green-800"
                        : banner.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {banner.status}
                  </span>
                  <div className="mt-1 text-xs text-gray-500">Priority: {banner.priority}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  <div>Views: {banner.analytics.views}</div>
                  <div>Clicks: {banner.analytics.clicks}</div>
                  <div>CTR: {banner.calculatedCTR || 0}%</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button onClick={() => handleEdit(banner)} className="mr-4 text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-11/12 max-w-4xl p-5 mx-auto bg-white border rounded-md shadow-lg top-20">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Banner Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Banner Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      required
                    >
                      {Object.entries(typeOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      required
                    >
                      {Object.entries(positionOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Banner preview"
                        className="object-cover w-full h-32 max-w-md rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Link Settings */}
                <div className="pt-4 border-t">
                  <h4 className="mb-3 font-medium text-gray-900 text-md">Link Settings</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link URL</label>
                      <input
                        type="url"
                        value={formData.link.url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            link: { ...formData.link, url: e.target.value },
                          })
                        }
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link Text</label>
                      <input
                        type="text"
                        value={formData.link.text}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            link: { ...formData.link, text: e.target.value },
                          })
                        }
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Shop Now"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.link.openInNewTab}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            link: { ...formData.link, openInNewTab: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">Open in new tab</span>
                    </label>
                  </div>
                </div>

                {/* Schedule Settings */}
                <div className="pt-4 border-t">
                  <h4 className="mb-3 font-medium text-gray-900 text-md">Schedule (Optional)</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={formData.schedule.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schedule: { ...formData.schedule, startDate: e.target.value },
                          })
                        }
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={formData.schedule.endDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schedule: { ...formData.schedule, endDate: e.target.value },
                          })
                        }
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                    <select
                      value={formData.targetAudience.userType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAudience: { ...formData.targetAudience, userType: e.target.value },
                        })
                      }
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Users</option>
                      <option value="new">New Users</option>
                      <option value="returning">Returning Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : editingBanner ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerManager
