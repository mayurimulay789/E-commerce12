"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../components/dashboard/DashboardLayout"
import DashboardStats from "../components/dashboard/DashboardStats"
import UserProfile from "../components/dashboard/UserProfile"
import UserOrders from "../components/dashboard/UsersOrders"
import Wishlist from "../components/dashboard/Wishlist"
import AddressBook from "../components/dashboard/AddressBook"
import { getUserOrders } from "../store/slice/orderSlice"
import { getWishlist } from "../store/slice/wishlist"
import { getAddresses } from "../store/slice/addressSlice"

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user || !token) {
      navigate("/login?redirect=/dashboard")
      return
    }

    // Load user data
    dispatch(getUserOrders())
    dispatch(getWishlist())
    dispatch(getAddresses())
  }, [user, token, navigate, dispatch])

  if (!user || !token) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardStats />
      case "profile":
        return <UserProfile />
      case "orders":
        return <UserOrders />
      case "wishlist":
        return <Wishlist />
      case "addresses":
        return <AddressBook />
      default:
        return <DashboardStats />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}

export default Dashboard
