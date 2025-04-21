"use client"
import React, { useState } from "react"
import AdminDashboard from "@/app/components/admin/AdminDashboard"
import UserManagement from "@/app/components/admin/UserManagement"
// import OfferManagement from "@/app/components/admin/OfferManagement"
// import ApplicationManagement from "@/app/components/admin/ApplicationManagement"
// import SettingsManagement from "@/app/components/admin/SettingsManagement"
import { useGetUserInfo } from "@/app/hooks/useUserInfo"
import { useRouter } from "next/navigation"
import { Briefcase, FileText, LayoutDashboard, Loader2, Settings, UsersIcon } from "lucide-react"
import OfferManagement from "../components/admin/OfferManagement"
import ApplicationManagement from "../components/admin/ApplicationManagement"
import SettingsManagement from "../components/admin/SettingsManagement"

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { data: userInfo, isLoading } = useGetUserInfo()
  const router = useRouter()

  // Redirect if not admin
  React.useEffect(() => {
    // if (!isLoading && userInfo?.role !== "admin") {
    //   router.push("/dashboard")
    // }
  }, [userInfo, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-electric-purple animate-spin" />
        <span className="ml-2 text-electric-purple">Chargement...</span>
      </div>
    )
  }

  // if (!userInfo || userInfo.role !== "admin") {
  //   return null // Will redirect in useEffect
  // }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />
      case "users":
        return <UserManagement />
      case "offers":
        return <OfferManagement />
      case "applications":
        return <ApplicationManagement />
      case "settings":
        return <SettingsManagement />
      default:
        return <AdminDashboard />
    }
  }

  const tabs = [
    { id: "dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { id: "users", icon: <UsersIcon className="w-5 h-5" />, label: "Users" },
    { id: "offers", icon: <Briefcase className="w-5 h-5" />, label: "Offers" },
    { id: "applications", icon: <FileText className="w-5 h-5" />, label: "Applications" },
    { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 pb-24 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-[30%] right-[30%] bg-white border-t rounded-t-2xl border-gray-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                activeTab === tab.id 
                  ? "text-electric-purple" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className={`p-1 rounded-full ${
                activeTab === tab.id ? "bg-electric-purple/10" : ""
              }`}>
                {tab.icon}
              </div>
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

