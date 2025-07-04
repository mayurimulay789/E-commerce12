"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

const ContentManager = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [contentForm, setContentForm] = useState({
    title: "",
    type: "blog",
    content: "",
    excerpt: "",
    status: "draft",
    tags: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      // This would be a real API call
      // For now, using mock data
      setContent([
        {
          _id: "1",
          title: "Summer Fashion Trends 2024",
          type: "blog",
          status: "published",
          createdAt: new Date(),
          views: 1250,
          engagement: 85,
        },
        {
          _id: "2",
          title: "How to Style Your Wardrobe",
          type: "guide",
          status: "draft",
          createdAt: new Date(),
          views: 0,
          engagement: 0,
        },
      ])
    } catch (error) {
      toast.error("Error fetching content")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // This would be a real API call
      toast.success("Content saved successfully")
      setShowModal(false)
      resetForm()
      fetchContent()
    } catch (error) {
      toast.error("Error saving content")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setContentForm({
      title: "",
      type: "blog",
      content: "",
      excerpt: "",
      status: "draft",
      tags: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    })
    setEditingContent(null)
  }

  const handleEdit = (item) => {
    setEditingContent(item)
    setContentForm({
      title: item.title || "",
      type: item.type || "blog",
      content: item.content || "",
      excerpt: item.excerpt || "",
      status: item.status || "draft",
      tags: item.tags || [],
      seo: item.seo || {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    })
    setShowModal(true)
  }

  const handleTagAdd = (tag) => {
    if (tag && !contentForm.tags.includes(tag)) {
      setContentForm({
        ...contentForm,
        tags: [...contentForm.tags, tag],
      })
    }
  }

  const handleTagRemove = (tag) => {
    setContentForm({
      ...contentForm,
      tags: contentForm.tags.filter((t) => t !== tag),
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Create Content
        </button>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Content</h3>
          <p className="text-3xl font-bold text-blue-600">{content.length}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Published</h3>
          <p className="text-3xl font-bold text-green-600">{content.filter((c) => c.status === "published").length}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">{content.filter((c) => c.status === "draft").length}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
          <p className="text-3xl font-bold text-purple-600">
            {content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Content
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Performance
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  <div>Views: {item.views}</div>
                  <div>Engagement: {item.engagement}%</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button onClick={() => handleEdit(item)} className="mr-4 text-purple-600 hover:text-purple-900">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative w-11/12 max-w-4xl p-5 mx-auto bg-white border rounded-md shadow-lg top-20">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {editingContent ? "Edit Content" : "Create New Content"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={contentForm.type}
                      onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    >
                      <option value="blog">Blog Post</option>
                      <option value="guide">Guide</option>
                      <option value="news">News</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea
                    value={contentForm.excerpt}
                    onChange={(e) => setContentForm({ ...contentForm, excerpt: e.target.value })}
                    rows={2}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Brief description of the content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={contentForm.content}
                    onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                    rows={10}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    placeholder="Write your content here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleTagAdd(e.target.value.trim())
                        e.target.value = ""
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contentForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* SEO Section */}
                <div className="pt-6 border-t">
                  <h4 className="mb-4 font-medium text-gray-900 text-md">SEO Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                      <input
                        type="text"
                        value={contentForm.seo.metaTitle}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            seo: { ...contentForm.seo, metaTitle: e.target.value },
                          })
                        }
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        maxLength={60}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                      <textarea
                        value={contentForm.seo.metaDescription}
                        onChange={(e) =>
                          setContentForm({
                            ...contentForm,
                            seo: { ...contentForm.seo, metaDescription: e.target.value },
                          })
                        }
                        rows={2}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        maxLength={160}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={contentForm.status}
                    onChange={(e) => setContentForm({ ...contentForm, status: e.target.value })}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
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
                    {loading ? "Saving..." : editingContent ? "Update" : "Create"}
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

export default ContentManager
