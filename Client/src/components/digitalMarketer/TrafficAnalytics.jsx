"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import api from "../../services/api"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const TrafficAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState("30")
  const [activeMetric, setActiveMetric] = useState("traffic")

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await api.get("/analytics/overview", {
        params: { period },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        setAnalytics(response.data.analytics)
      }
    } catch (error) {
      toast.error("Error fetching analytics")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]

  if (loading && !analytics) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow">
                <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Traffic & Sales Analytics</h1>
        <div className="flex space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {analytics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
              <p className="mt-1 text-sm text-gray-500">{analytics.overview.totalOrders} orders</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Avg Order Value</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(analytics.overview.avgOrderValue)}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.overview.totalViews.toLocaleString()}</p>
              <p className="mt-1 text-sm text-gray-500">{analytics.overview.totalClicks.toLocaleString()} clicks</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
              <p className="text-3xl font-bold text-orange-600">{analytics.overview.conversionRate}%</p>
            </div>
          </div>

          {/* Metric Toggle */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMetric("traffic")}
                className={`px-4 py-2 rounded-lg ${
                  activeMetric === "traffic"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Traffic Data
              </button>
              <button
                onClick={() => setActiveMetric("sales")}
                className={`px-4 py-2 rounded-lg ${
                  activeMetric === "sales" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sales Data
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Traffic/Sales Chart */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">
                {activeMetric === "traffic" ? "Traffic Trends" : "Sales Trends"}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={
                    activeMetric === "traffic"
                      ? analytics.charts.trafficData.map((item) => ({
                          date: `${item._id.day}/${item._id.month}`,
                          views: item.totalViews,
                          clicks: item.totalClicks,
                        }))
                      : analytics.charts.salesData.map((item) => ({
                          date: `${item._id.day}/${item._id.month}`,
                          sales: item.totalSales,
                          orders: item.totalOrders,
                        }))
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {activeMetric === "traffic" ? (
                    <>
                      <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                      <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                    </>
                  ) : (
                    <>
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales (₹)" />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Registration Chart */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">New User Registrations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics.charts.userStats.map((item) => ({
                    date: `${item._id.day}/${item._id.month}`,
                    users: item.newUsers,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#ffc658" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Top Products by Revenue */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">Top Products by Revenue</h3>
              <div className="space-y-3">
                {analytics.topProducts.byRevenue.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-500">{product.totalQuantity} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(product.totalRevenue)}</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products by Views */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">Top Products by Views</h3>
              <div className="space-y-3">
                {analytics.topProducts.byViews.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.analytics.clicks} clicks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{product.analytics.views.toLocaleString()} views</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Funnel Chart */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">Conversion Funnel</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                  <span className="font-medium">Total Views</span>
                  <span className="font-bold text-blue-600">
                    {analytics.conversionFunnel.totalViews.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                  <span className="font-medium">Total Clicks</span>
                  <span className="font-bold text-green-600">
                    {analytics.conversionFunnel.totalClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                  <span className="font-medium">Total Purchases</span>
                  <span className="font-bold text-purple-600">
                    {analytics.conversionFunnel.totalPurchases.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 mt-4 rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-600">
                    <p>
                      Click-through Rate:{" "}
                      {analytics.conversionFunnel.totalViews > 0
                        ? (
                            (analytics.conversionFunnel.totalClicks / analytics.conversionFunnel.totalViews) *
                            100
                          ).toFixed(2)
                        : 0}
                      %
                    </p>
                    <p>
                      Purchase Rate:{" "}
                      {analytics.conversionFunnel.totalClicks > 0
                        ? (
                            (analytics.conversionFunnel.totalPurchases / analytics.conversionFunnel.totalClicks) *
                            100
                          ).toFixed(2)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Performance */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold">Banner Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50">
                  <span className="font-medium">Total Banner Views</span>
                  <span className="font-bold text-yellow-600">{analytics.bannerStats.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                  <span className="font-medium">Total Banner Clicks</span>
                  <span className="font-bold text-orange-600">
                    {analytics.bannerStats.totalClicks.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                  <span className="font-medium">Average CTR</span>
                  <span className="font-bold text-red-600">{analytics.bannerStats.avgCTR.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TrafficAnalytics
