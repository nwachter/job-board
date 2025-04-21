"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  Mail,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
} from "lucide-react"
import { Application, Status } from "@/app/types/application"
import { motion, AnimatePresence } from "framer-motion"
import { updateApplication } from "@/app/services/applications"

interface ApplicationDetailProps {
  application: Partial<Application>
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application }) => {
  const router = useRouter()
  const [status, setStatus] = useState<string>(application?.status || Status.PENDING)
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [actionType, setActionType] = useState<Status.ACCEPTED | Status.REJECTED | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const handleStatusChange = async (newStatus: Status.ACCEPTED | Status.REJECTED) => {
    setActionType(newStatus)
    setIsConfirmOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!application.id) return

    setIsLoading(true)
    try {
      await updateApplication(application.id, {
        status: actionType as Status,
        feedback: feedback,
      })
      setStatus(actionType || "pending")
      setIsConfirmOpen(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case Status.ACCEPTED:
        return (
          <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <CheckCircle size={16} className="mr-1" />
            Candidature acceptée
          </div>
        )
      case Status.REJECTED:
        return (
          <div className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <XCircle size={16} className="mr-1" />
            Candidature refusée
          </div>
        )
      default:
        return (
          <div className="flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            <AlertCircle size={16} className="mr-1" />
            En attente de décision
          </div>
        )
    }
  }

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "Date non disponible"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="flex w-full h-full flex-col items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full p-8 bg-white text-black rounded-xl shadow-lg"
      >
        {/* Success notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 flex items-center"
            >
              <CheckCircle className="mr-2" size={20} />
              <span>Le statut de la candidature a été mis à jour avec succès.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-electric-purple hover:text-electric-purple/80 transition-colors"
          >
            <ArrowLeft className="mr-2" />
            Retour aux candidatures
          </button>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Candidate info */}
          <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-electric-purple/10 rounded-full flex items-center justify-center mb-3">
                <User size={32} className="text-electric-purple" />
              </div>
              <h3 className="text-xl font-bold">
                {application.firstname} {application.lastname}
              </h3>
              <p className="text-gray-600">{application.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{application.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Date de candidature</p>
                  <p className="text-sm text-gray-600">{formatDate(application.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FileText className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">CV</p>
                  <a
                    href={application.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-1 px-3 py-1.5 bg-electric-purple/10 text-electric-purple text-sm rounded-lg hover:bg-electric-purple/20 transition-colors"
                  >
                    <Download size={14} className="mr-1.5" />
                    Télécharger le CV
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Application details */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Candidature pour: {application?.offer?.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {application?.offer?.location?.city && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1" size={16} />
                    <span>
                      {application?.offer?.location?.city}, {application?.offer?.location?.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="mr-1" size={16} />
                  <span>{application?.offer?.company_name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1" size={16} />
                  <span>{application?.offer?.contract_type}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Lettre de motivation</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{application.content}</p>
              </div>
            </div>

            {status === "pending" && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => handleStatusChange(Status.ACCEPTED)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={18} />
                  Accepter la candidature
                </button>
                <button
                  onClick={() => handleStatusChange(Status.REJECTED)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle size={18} />
                  Refuser la candidature
                </button>
              </div>
            )}

            {status !== "pending" && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">
                  {status === Status.ACCEPTED ? "Candidature acceptée" : "Candidature refusée"}
                </h3>
                <p className="text-gray-600">
                  {status === Status.ACCEPTED
                    ? "Vous avez accepté cette candidature. Le candidat a été notifié."
                    : "Vous avez refusé cette candidature. Le candidat a été notifié."}
                </p>
                {application.feedback && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700">Votre feedback:</p>
                    <p className="text-sm text-gray-600 mt-1">{application.feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">
                {actionType === Status.ACCEPTED ? "Accepter la candidature" : "Refuser la candidature"}
              </h3>
              <p className="text-gray-600 mb-4">
                {actionType === Status.ACCEPTED
                  ? "Êtes-vous sûr de vouloir accepter cette candidature ? Le candidat sera notifié."
                  : "Êtes-vous sûr de vouloir refuser cette candidature ? Le candidat sera notifié."}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (optionnel)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                  rows={3}
                  placeholder={
                    actionType === Status.ACCEPTED
                      ? "Expliquez pourquoi vous acceptez cette candidature..."
                      : "Expliquez pourquoi vous refusez cette candidature..."
                  }
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmStatusChange}
                  className={`px-4 py-2 rounded-lg text-white flex items-center ${
                    actionType === Status.ACCEPTED ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      {actionType === Status.ACCEPTED ? (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Confirmer l'acceptation
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="mr-2" />
                          Confirmer le refus
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApplicationDetail

