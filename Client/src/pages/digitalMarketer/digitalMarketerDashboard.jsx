"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DigitalMarketerLayout from "../../components/digitalMarketer/DiditalMarketerLayout"
import SEOManager from "../../components/digitalMarketer/SeoManager"
import TrafficAnalytics from "../../components/digitalMarketer/TrafficAnalytics"
import BannerManager from "../../components/digitalMarketer/BannerManager"
import ContentManager from "../../components/digitalMarketer/ContentManager"

const DigitalMarketerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("analytics")

  useEffect(() => {
    if (!user || (user.role !== "marketer" && user.role !== "admin")) {
      navigate("/unauthorized")
      return
    }
  }, [user, navigate])

  if (!user || (user.role !== "marketer" && user.role !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mb-6 text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <TrafficAnalytics />
      case "seo":
        return <SEOManager />
      case "banners":
        return <BannerManager />
      case "content":
        return <ContentManager />
      default:
        return <TrafficAnalytics />
    }
  }

  return (
    <DigitalMarketerLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DigitalMarketerLayout>
  )
}

export default DigitalMarketerDashboard
