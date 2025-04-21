"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Briefcase,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useGetUsers } from "@/app/hooks/useUser"
import { useGetOffers } from "@/app/hooks/useOffers"
import { useGetApplications } from "@/app/hooks/useApplication"
import type { User} from "@/app/types/user"
import type { Application } from "@/app/types/application"
import type { Offer } from "@/app/types/offer"
type ActivityType = 
  | "user_registered"
  | "offer_created"
  | "application_submitted"
  | "application_accepted"
  | "application_rejected";

type Activity = {
  type: ActivityType;
  user: string;
  timestamp: string;
  details: string;
};

type Stats = {
  totalUsers: number;
  totalOffers: number;
  totalApplications: number;
  pendingApplications: number;
  usersByRole: {
    admin: number;
    recruiter: number;
    user: number;
  };
  recentActivity: Activity[];
};

export const AdminDashboard = () => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsers()
  const { data: offers, isLoading: isLoadingOffers } = useGetOffers()
  const { data: applications, isLoading: isLoadingApplications } = useGetApplications()

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOffers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    usersByRole: {
      admin: 0,
      recruiter: 0,
      user: 0,
    },
    recentActivity: [],
  })

//   useEffect(() => {
//     if (users && offers && applications) {
//       // Calculate stats
//       const usersByRole = {
//         admin: users.filter((user: User) => user.role === "admin").length,
//         recruiter: users.filter((user: User) => user.role === "recruiter").length,
//         user: users.filter((user: User) => user.role === "user").length,
//       }

//       const pendingApplications = applications.length
//       // .filter((app: Application) => !app.status || app.status === "pending").length

//       // Generate mock recent activity
//       const recentActivity: Activity[] = [
//         {
//           type: "user_registered",
//           user: users[users.length - 1]?.username || "Nouvel utilisateur",
//           timestamp: new Date().toISOString(),
//           details: "Nouvel utilisateur inscrit",
//         },
//         {
//           type: "offer_created",
//           user: "Recruteur",
//           timestamp: new Date(Date.now() - 3600000).toISOString(),
//           details: `Nouvelle offre: ${offers[offers.length - 1]?.title || "Développeur"}`,
//         },
//         {
//           type: "application_submitted",
//           user: users[0]?.username || "Candidat",
//           timestamp: new Date(Date.now() - 7200000).toISOString(),
//           details: "Nouvelle candidature soumise",
//         },
//         {
//           type: "application_accepted",
//           user: "Recruteur",
//           timestamp: new Date(Date.now() - 86400000).toISOString(),
//           details: "Candidature acceptée",
//         },
//       ]

//       setStats({
//         totalUsers: users.length,
//         totalOffers: offers.length,
//         totalApplications: applications.length,
//         pendingApplications,
//         usersByRole,
//         recentActivity,
//       })
//     }
//   }, [users, offers, applications])

useEffect(() => {
    if (users && offers && applications) {
      // Generate mock recent activity with current timestamp only on client
      const recentActivity: Activity[] = [
        {
          type: "user_registered",
          user: users[users.length - 1]?.username || "Nouvel utilisateur",
          timestamp: new Date().toISOString(), // Now only runs on client
          details: "Nouvel utilisateur inscrit",
        },
        // ... other activities
      ];
  
      setStats(prev => ({
        ...prev,
        recentActivity
      }));
    }
  }, [users, offers, applications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "user_registered":
        return <Users className="text-blue-500" />
      case "offer_created":
        return <Briefcase className="text-green-500" />
      case "application_submitted":
        return <FileText className="text-purple-500" />
      case "application_accepted":
        return <CheckCircle className="text-green-500" />
      case "application_rejected":
        return <XCircle className="text-red-500" />
      default:
        return <AlertTriangle className="text-yellow-500" />
    }
  }

//   if (isLoadingUsers || isLoadingOffers || isLoadingApplications) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple"></div>
//         <span className="ml-3 text-electric-purple font-medium">Chargement des données...</span>
//       </div>
//     )
//   }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord administrateur</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme JobBoard</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+12%</span>
            <span className="text-sm text-gray-500 ml-2">depuis le mois dernier</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Offres d'emploi</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOffers}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+5%</span>
            <span className="text-sm text-gray-500 ml-2">depuis le mois dernier</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Candidatures</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalApplications}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-medium">+18%</span>
            <span className="text-sm text-gray-500 ml-2">depuis le mois dernier</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingApplications}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-red-500 font-medium">-3%</span>
            <span className="text-sm text-gray-500 ml-2">depuis le mois dernier</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 lg:col-span-1"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution des utilisateurs</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">Administrateurs</span>
                <span className="text-sm font-medium text-gray-800">{stats.usersByRole.admin}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats.usersByRole.admin / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">Recruteurs</span>
                <span className="text-sm font-medium text-gray-800">{stats.usersByRole.recruiter}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.usersByRole.recruiter / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">Candidats</span>
                <span className="text-sm font-medium text-gray-800">{stats.usersByRole.user}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.usersByRole.user / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.details}</p>
                  <p className="text-xs text-gray-500">
                    Par {activity.user} • {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-medium text-electric-purple hover:text-electric-purple/80 transition-colors">
            Voir toute l'activité →
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard

