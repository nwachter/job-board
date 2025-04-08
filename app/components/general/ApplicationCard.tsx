"use client"

import type { Application } from "@/app/types/application"
import { CheckCircle, XCircle, AlertCircle, Calendar, User, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type React from "react"
import { motion } from "framer-motion"

const ApplicationCard: React.FC<{
  application: Application
  router?: any
  showActions?: boolean
}> = ({ application, router, showActions = false }) => {
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "Date non disponible"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = () => {
    // const status = application.status || "pending"
    const status : string = "pending"

    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            <CheckCircle size={12} className="mr-1" />
            Acceptée
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            <XCircle size={12} className="mr-1" />
            Refusée
          </div>
        )
      default:
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            <AlertCircle size={12} className="mr-1" />
            En attente
          </div>
        )
    }
  }

  return (
    <div className="bg-white hover:shadow-lg rounded-xl p-6 shadow-sm transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center mb-1">
            <div className="w-8 h-8 bg-electric-purple/10 rounded-full flex items-center justify-center mr-2">
              <User size={16} className="text-electric-purple" />
            </div>
            <h3 className="font-semibold font-merriweather-sans text-lg">
              {application.firstname} {application.lastname}
            </h3>
          </div>
          <p className="text-gray-600 font-dm-sans text-sm">{application?.offer?.title}</p>
        </div>
        <div className="flex items-center">{getStatusBadge()}</div>
      </div>

      <div className="space-y-3 font-dm-sans mb-4 flex-grow">
        <div className="flex flex-wrap gap-2">
          {application?.offer?.contract_type && (
            <Badge className="border-[1px] transition-all border-mint/30 bg-mint/10 text-mint hover:bg-mint/30 rounded-3xl">
              {application.offer?.contract_type}
            </Badge>
          )}

          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(application.createdAt)}</span>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-gray-700 line-clamp-2">{application.content}</p>
        </div>
      </div>

      <div className="flex justify-between font-dm-sans items-center pt-4 border-t">
        <div className="flex items-center">
          <FileText size={14} className="text-gray-500 mr-1" />
          <a
            href={application?.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-purple hover:text-electric-purple/80 text-sm font-medium underline underline-offset-2"
          >
            Voir le CV
          </a>
        </div>

        {showActions ? (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              <CheckCircle size={14} className="inline-block mr-1" />
              Accepter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              <XCircle size={14} className="inline-block mr-1" />
              Refuser
            </motion.button>
          </div>
        ) : (
          <Link
            href={`/dashboard/application/${application?.id}`}
            className="text-electric-purple hover:text-electric-purple/80 font-medium text-sm flex items-center"
          >
            Voir détails
          </Link>
        )}
      </div>
    </div>
  )
}

export default ApplicationCard

