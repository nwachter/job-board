"use client";

import type { Application } from "@/app/types/application";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type React from "react";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const ApplicationCard: React.FC<{
  application: Application;
  router?: AppRouterInstance;
  showActions?: boolean;
}> = ({ application, router, showActions = false }) => {
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "Date non disponible";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = () => {
    // const status = application.status || "pending"
    const status: string = "pending";

    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Acceptée
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            <XCircle size={12} className="mr-1" />
            Refusée
          </div>
        );
      default:
        return (
          <div className="flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            En attente
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-electric-purple/10">
              <User size={16} className="text-electric-purple" />
            </div>
            <h3 className="font-merriweather-sans text-lg font-semibold">
              {application.firstname} {application.lastname}
            </h3>
          </div>
          <p className="font-dm-sans text-sm text-gray-600">
            {application?.offer?.title}
          </p>
        </div>
        <div className="flex items-center">{getStatusBadge()}</div>
      </div>

      <div className="mb-4 flex-grow space-y-3 font-dm-sans">
        <div className="flex flex-wrap gap-2">
          {application?.offer?.contract_type && (
            <Badge className="rounded-3xl border-[1px] border-mint/30 bg-mint/10 text-mint transition-all hover:bg-mint/30">
              {application.offer?.contract_type}
            </Badge>
          )}

          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(application.createdAt)}</span>
          </div>
        </div>

        <div className="mt-3">
          <p className="line-clamp-2 text-gray-700">{application.content}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4 font-dm-sans">
        <div className="flex items-center">
          <FileText size={14} className="mr-1 text-gray-500" />
          <a
            href={application?.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-electric-purple underline underline-offset-2 hover:text-electric-purple/80"
          >
            Voir le CV
          </a>
        </div>

        {showActions ? (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
            >
              <CheckCircle size={14} className="mr-1 inline-block" />
              Accepter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              <XCircle size={14} className="mr-1 inline-block" />
              Refuser
            </motion.button>
          </div>
        ) : (
          <Link
            href={`/dashboard/application/${application?.id}`}
            className="flex items-center text-sm font-medium text-electric-purple hover:text-electric-purple/80"
          >
            Voir détails
          </Link>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
