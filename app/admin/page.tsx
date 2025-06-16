"use client";
import React, { useState } from "react";
import AdminDashboard from "@/app/components/admin/AdminDashboard";
import UserManagement from "@/app/components/admin/UserManagement";
// import OfferManagement from "@/app/components/admin/OfferManagement"
// import ApplicationManagement from "@/app/components/admin/ApplicationManagement"
// import SettingsManagement from "@/app/components/admin/SettingsManagement"
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { Briefcase, FileText, LayoutDashboard, Loader2, Settings, UsersIcon } from "lucide-react";
import OfferManagement from "../components/admin/OfferManagement";
import ApplicationManagement from "../components/admin/ApplicationManagement";
// import SettingsManagement from "../components/admin/SettingsManagement"

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: userInfo, isLoading } = useGetUserInfo();
  const router = useRouter();

  // Redirect if not admin
  React.useEffect(() => {
    // if (!isLoading && userInfo?.role !== "admin") {
    //   router.push("/dashboard")
    // }
  }, [userInfo, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
        <span className="ml-2 text-electric-purple">Chargement...</span>
      </div>
    );
  }

  // if (!userInfo || userInfo.role !== "admin") {
  //   return null // Will redirect in useEffect
  // }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UserManagement />;
      case "offers":
        return <OfferManagement />;
      case "applications":
        return <ApplicationManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  const tabs = [
    {
      id: "dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    { id: "users", icon: <UsersIcon className="h-5 w-5" />, label: "Users" },
    { id: "offers", icon: <Briefcase className="h-5 w-5" />, label: "Offers" },
    {
      id: "applications",
      icon: <FileText className="h-5 w-5" />,
      label: "Applications",
    },
    // { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <div className="flex h-screen flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">{renderContent()}</div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-[30%] right-[30%] z-50 rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="flex h-16 items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
                activeTab === tab.id ? "text-electric-purple" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className={`rounded-full p-1 ${activeTab === tab.id ? "bg-electric-purple/10" : ""}`}>
                {tab.icon}
              </div>
              <span className="mt-1 text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
