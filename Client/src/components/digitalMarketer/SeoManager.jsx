"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import api from "../../services/api"

const SEOManager = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("products")
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  })

  const [seoForm, setSeoForm] = useState({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    slug: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    twitterTitle: "",
    twitterDescription: "",
  })

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts()
    } else {
      fetchCategories()
    }
    fetchSEOAnalytics()
  }, [activeTab, searchTerm, pagination.current])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.get("/seo/products", {
        params: {
          page: pagination.current,
          limit: 20,
          search: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setProducts(response.data.products)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      toast.error("Error fetching products")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get("/seo/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      toast.error("Error fetching categories")
    } finally {
      setLoading(false)
    }
  }

  const fetchSEOAnalytics = async () => {
    try {
      const response = await api.get("/seo/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setAnalytics(response.data.analytics)
      }
    } catch (error) {
      console.error("Error fetching SEO analytics:", error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setSeoForm({
      metaTitle: item.seo?.metaTitle || "",
      metaDescription: item.seo?.metaDescription || "",
      keywords: item.seo?.keywords || [],
      slug: item.seo?.slug || "",
      canonicalUrl: item.seo?.canonicalUrl || "",
      ogTitle: item.seo?.ogTitle || "",
      ogDescription: item.seo?.ogDescription || "",
      twitterTitle: item.seo?.twitterTitle || "",
      twitterDescription: item.seo?.twitterDescription || "",
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint =
        activeTab === "products" ? `/seo/products/${editingItem._id}` : `/seo/categories/${editingItem._id}`

      const response = await api.put(endpoint, seoForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        toast.success("SEO data updated successfully")
        setShowModal(false)
        resetForm()
        if (activeTab === "products") {
          fetchProducts()
        } else {
          fetchCategories()
        }
        fetchSEOAnalytics()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating SEO data")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSeoForm({
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      slug: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      twitterTitle: "",
      twitterDescription: "",
    })
    setEditingItem(null)
  }

  const handleKeywordAdd = (keyword) => {
    if (keyword && !seoForm.keywords.includes(keyword)) {
      setSeoForm({
        ...seoForm,
        keywords: [...seoForm.keywords, keyword],
      })
    }
  }

  const handleKeywordRemove = (keyword) => {
    setSeoForm({
      ...seoForm,
      keywords: seoForm.keywords.filter((k) => k !== keyword),
    })
  }

  const getSEOScore = (item) => {
    let score = 0
    const seo = item.seo || {}

    if (seo.metaTitle) score += 25
    if (seo.metaDescription) score += 25
    if (seo.keywords && seo.keywords.length > 0) score += 20
    if (seo.slug) score += 15
    if (seo.ogTitle && seo.ogDescription) score += 15

    return score
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">SEO Manager</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "products" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "categories" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* SEO Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.overview.totalProducts}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Missing SEO</h3>
            <p className="text-3xl font-bold text-red-600">{analytics.overview.productsWithoutSEO}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">SEO Completion</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.overview.seoCompletionRate}%</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.overview.totalViews}</p>
          </div>
        </div>
      )}

      {/* Search */}
      {activeTab === "products" && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Products/Categories Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                {activeTab === "products" ? "Product" : "Category"}
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                SEO Score
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Meta Title
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Meta Description
              </th>
              {activeTab === "products" && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Performance
                </th>
              )}
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(activeTab === "products" ? products : categories).map((item) => {
              const score = getSEOScore(item)
              return (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {activeTab === "products" && item.category && (
                      <div className="text-sm text-gray-500">{item.category.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score)}`}
                    >
                      {score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-900 truncate">
                      {item.seo?.metaTitle || <span className="italic text-red-500">Missing</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-900 truncate">
                      {item.seo?.metaDescription || <span className="italic text-red-500">Missing</span>}
                    </div>
                  </td>
                  {activeTab === "products" && (
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <div>Views: {item.analytics?.views || 0}</div>
                      <div>Clicks: {item.analytics?.clicks || 0}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button onClick={() => handleEdit(item)} className="text-purple-600 hover:text-purple-900">
                      Edit SEO
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {activeTab === "products" && pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, current: page })}
                className={`px-3 py-2 rounded-md ${
                  pagination.current === page
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* SEO Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-11/12 max-w-4xl p-5 mx-auto bg-white border rounded-md shadow-lg top-20">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Edit SEO - {editingItem?.name}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic SEO */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meta Title ({seoForm.metaTitle.length}/60)
                    </label>
                    <input
                      type="text"
                      value={seoForm.metaTitle}
                      onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      maxLength={60}
                      placeholder="Enter meta title..."
                    />
                    {seoForm.metaTitle.length > 50 && (
                      <p className="mt-1 text-sm text-yellow-600">
                        Consider keeping under 60 characters for better display
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meta Description ({seoForm.metaDescription.length}/160)
                    </label>
                    <textarea
                      value={seoForm.metaDescription}
                      onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                      rows={3}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      maxLength={160}
                      placeholder="Enter meta description..."
                    />
                    {seoForm.metaDescription.length > 140 && (
                      <p className="mt-1 text-sm text-yellow-600">
                        Consider keeping under 160 characters for better display
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keywords</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        placeholder="Add keyword and press Enter"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleKeywordAdd(e.target.value.trim())
                            e.target.value = ""
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {seoForm.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleKeywordRemove(keyword)}
                              className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                    <input
                      type="text"
                      value={seoForm.slug}
                      onChange={(e) => setSeoForm({ ...seoForm, slug: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Canonical URL</label>
                    <input
                      type="url"
                      value={seoForm.canonicalUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      placeholder="https://example.com/canonical-url"
                    />
                  </div>
                </div>

                {/* Open Graph */}
                <div className="pt-6 border-t">
                  <h4 className="mb-4 font-medium text-gray-900 text-md">Open Graph (Facebook)</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">OG Title</label>
                      <input
                        type="text"
                        value={seoForm.ogTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Facebook share title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">OG Description</label>
                      <textarea
                        value={seoForm.ogDescription}
                        onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                        rows={2}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Facebook share description"
                      />
                    </div>
                  </div>
                </div>

                {/* Twitter */}
                <div className="pt-6 border-t">
                  <h4 className="mb-4 font-medium text-gray-900 text-md">Twitter Card</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Twitter Title</label>
                      <input
                        type="text"
                        value={seoForm.twitterTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, twitterTitle: e.target.value })}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Twitter share title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Twitter Description</label>
                      <textarea
                        value={seoForm.twitterDescription}
                        onChange={(e) => setSeoForm({ ...seoForm, twitterDescription: e.target.value })}
                        rows={2}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Twitter share description"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 space-x-3">
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
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save SEO Data"}
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

export default SEOManager
