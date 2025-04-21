"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Calendar,
  Download,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
} from "lucide-react"
import { useGetApplications, useDeleteApplication, useUpdateApplication } from "@/app/hooks/useApplication"
import { useGetOffers } from "@/app/hooks/useOffers"
import type { Application } from "@/app/types/application"
import {Status} from "@/app/types/application";
import type { Offer } from "@/app/types/offer"

type NotificationType = {
  type: "success" | "warning" | "error"
  message: string
} | null



const ApplicationManagement = () => {
  const { data: applications, isLoading } = useGetApplications()
  const { data: offers } = useGetOffers()
  const { mutateAsync: deleteApplication } = useDeleteApplication()
  const { mutateAsync: updateApplication } = useUpdateApplication()

  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all")
  const [selectedOffer, setSelectedOffer] = useState<number | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [notification, setNotification] = useState<NotificationType>(null)
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application | ""
    direction: "ascending" | "descending"
  }>({ key: "", direction: "ascending" })
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (applications) {
      filterApplications()
    }
  }, [applications, searchTerm, selectedStatus, selectedOffer, sortConfig])

  const filterApplications = () => {
    if (!applications) return

    let filtered = [...applications]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (application) =>
          application.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.offer?.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((application) => application.status === selectedStatus)
    }

    // Offer filter
    if (selectedOffer !== "all") {
      filtered = filtered.filter((application) => application.offer_id === selectedOffer)
    }

    // Sorting
    if (sortConfig.key !== "") {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Application] ?? "";
        const bValue = b[sortConfig.key as keyof Application] ?? "";
        
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredApplications(filtered)
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)

  // Handle sort
  const requestSort = (key: keyof Application) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle delete application
  const handleDeleteApplication = async (applicationId: number) => {
    try {
      await deleteApplication(applicationId)

      setNotification({
        type: "success",
        message: "Candidature supprimée avec succès",
      })

      setShowDeleteConfirm(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la suppression de la candidature",
      })
    }
  }

  // Handle update application status
  const handleUpdateStatus = async (applicationId: number, status: Status) => {
    try {
      await updateApplication({
        id: applicationId,
        data: {
          status,
          feedback: feedback || undefined,
        },
      })

      setNotification({
        type: "success",
        message: `Candidature ${
          status === "accepted" ? "acceptée" : status === "rejected" ? "refusée" : "mise à jour"
        } avec succès`,
      })

      setViewingApplication(null)
      setFeedback("")

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la mise à jour de la candidature",
      })
    }
  }

  // Format date
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Get status badge
  const getStatusBadge = (status?: Status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Acceptée
          </span>
        )
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" /> Refusée
          </span>
        )
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <AlertTriangle size={12} className="mr-1" /> En attente
          </span>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple"></div>
        <span className="ml-3 text-electric-purple font-medium">Chargement des candidatures...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des candidatures</h1>
        <p className="text-gray-600">Gérez les candidatures reçues sur la plateforme</p>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 mb-6 rounded-lg flex items-center justify-between ${
              notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              placeholder="Rechercher une candidature..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple bg-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Status | "all")}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptées</option>
                  <option value="rejected">Refusées</option>
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple bg-white"
                  value={selectedOffer}
                  onChange={(e) => setSelectedOffer(e.target.value === "all" ? "all" : Number(e.target.value))}
                >
                  <option value="all">Toutes les offres</option>
                  {offers?.map((offer: Offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.title}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("firstname")}
                >
                  <div className="flex items-center">
                    Candidat
                    {sortConfig.key === "firstname" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp size={16} className="ml-1" />
                      ) : (
                        <ChevronDown size={16} className="ml-1" />
                      )
                    ) : (
                      <ChevronDown size={16} className="ml-1 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Offre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "createdAt" ? (
                      sortConfig.direction === "ascending" ? (
                        <ChevronUp size={16} className="ml-1" />
                      ) : (
                        <ChevronDown size={16} className="ml-1" />
                      )
                    ) : (
                      <ChevronDown size={16} className="ml-1 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CV
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-electric-purple/10 rounded-full flex items-center justify-center">
                        <User size={18} className="text-electric-purple" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.firstname} {application.lastname}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail size={14} className="mr-1" />
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.offer?.title}</div>
                    <div className="text-xs text-gray-500">{application.offer?.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(application.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(application.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={application.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-purple hover:text-electric-purple/80 flex items-center"
                    >
                      <Download size={16} className="mr-1" />
                      <span className="text-sm">Télécharger</span>
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-electric-purple hover:text-electric-purple/80"
                        onClick={() => setViewingApplication(application)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setShowDeleteConfirm(application.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredApplications.length)}</span> sur{" "}
              <span className="font-medium">{filteredApplications.length}</span> candidatures
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Application Modal */}
      <AnimatePresence>
        {viewingApplication && (
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
              className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Détails de la candidature</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setViewingApplication(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left column - Candidate info */}
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-electric-purple/10 rounded-full flex items-center justify-center mb-3">
                      <User size={32} className="text-electric-purple" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {viewingApplication.firstname} {viewingApplication.lastname}
                    </h3>
                    <p className="text-gray-600">{viewingApplication.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{viewingApplication.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date de candidature</p>
                        <p className="text-sm text-gray-600">{formatDate(viewingApplication.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CV</p>
                        <a
                          href={viewingApplication.cv}
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
                    <h1 className="text-2xl font-bold mb-2">Candidature pour: {viewingApplication.offer?.title}</h1>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {viewingApplication.offer?.location?.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="mr-1" size={16} />
                          <span>
                            {viewingApplication.offer?.location?.city}, {viewingApplication.offer?.location?.country}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="mr-1" size={16} />
                        <span>{viewingApplication.offer?.contract_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="mr-2">Statut actuel:</span>
                      {getStatusBadge(viewingApplication.status)}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Lettre de motivation</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{viewingApplication.content}</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">Feedback (optionnel)</h3>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple"
                      rows={3}
                      placeholder="Ajouter un feedback pour le candidat..."
                    ></textarea>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        onClick={() => handleUpdateStatus(viewingApplication.id, Status.ACCEPTED)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={18} />
                        Accepter la candidature
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(viewingApplication.id, Status.REJECTED)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle size={18} />
                        Refuser la candidature
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
                <p className="text-gray-600 text-center mb-6">
                  Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action ne peut pas être annulée.
                </p>

                <div className="flex justify-center space-x-3 w-full">
                  <button
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleDeleteApplication(showDeleteConfirm)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApplicationManagement

