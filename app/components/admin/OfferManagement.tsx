"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useGetOffers, useDeleteOffer, useUpdateOffer, useCreateOffer } from "@/app/hooks/useOffers"
// import { useLocations } from "@/app/hooks/useLocations"
import { useGetUserInfo } from "@/app/hooks/useUserInfo"
import type { Offer } from "@/app/types/offer"
import type { Location } from "@/app/types/location"
import { useGetLocations } from "@/app/hooks/useLocations"
import { isError } from "util"

type NotificationType = {
  type: "success" | "error"
  message: string
} | null

type OfferFormType = {
   id?: number
  title: string
  description: string
  company_name: string
  salary: number
  location_id: number
  contract_type: string
  recruiter_id: number
}

const OfferManagement = () => {
  const { data: offers, isLoading: isLoadingOffers, isError: isErrorOffers, error: errorOffers } = useGetOffers()
  const { data: locations, isLoading: isLoadingLocations, isError: isErrorLocations, error: errorLocations } = useGetLocations()
  const { data: userInfo } = useGetUserInfo()
  const { mutateAsync: deleteOffer } = useDeleteOffer()
  const { mutateAsync: updateOffer } = useUpdateOffer()
  const { mutateAsync: createOffer } = useCreateOffer()

  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContractType, setSelectedContractType] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<number | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddingOffer, setIsAddingOffer] = useState(false)
  const [editingOffer, setEditingOffer] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [notification, setNotification] = useState<NotificationType>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Offer | null
    direction: "ascending" | "descending"
  }>({ key: null, direction: "ascending" })

  // Form state
  const [offerForm, setOfferForm] = useState<OfferFormType>({
    title: "",
    description: "",
    company_name: "",
    salary: 0,
    location_id: 0,
    contract_type: "",
    recruiter_id: userInfo?.id || 0,
  })

  // Contract types
  const contractTypes = offers ? Array.from(new Set(offers.map((offer) => offer.contract_type))) : []

  useEffect(() => {
    if (offers) {
      filterOffers()
    }
  }, [offers, searchTerm, selectedContractType, selectedLocation, sortConfig])

  const filterOffers = () => {
    if (!offers) return

    let filtered = [...offers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Contract type filter
    if (selectedContractType !== "all") {
      filtered = filtered.filter((offer) => offer.contract_type === selectedContractType)
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter((offer) => offer.location_id === selectedLocation)
    }

// Sorting
if (sortConfig.key) {
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Offer];  // We know it's a keyof Offer here
      const bValue = b[sortConfig.key as keyof Offer];
      
      if ((aValue ?? 0) < (bValue ?? 0)) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if ((aValue ?? 0) > (bValue ?? 0)) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }
    setFilteredOffers(filtered)
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOfferForm((prev) => ({
      ...prev,
      [name]: name === "salary" || name === "location_id" ? Number(value) : value,
    }))
  }

  // Handle sort
  const requestSort = (key: keyof Offer) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Handle add offer form submission
  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
       
      await createOffer({
        data: {
          ...offerForm,
          recruiter_id: userInfo?.id || 0,
        },
      })

      setNotification({
        type: "success",
        message: "Offre créée avec succès",
      })

      setIsAddingOffer(false)
      setOfferForm({
        title: "",
        description: "",
        company_name: "",
        salary: 0,
        location_id: 0,
        contract_type: "",
        recruiter_id: userInfo?.id || 0,
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la création de l'offre",
      })
    }
  }

  // Handle edit offer
  const handleEditClick = (offer: Offer) => {
    setEditingOffer(offer.id)
    setOfferForm({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      company_name: offer.company_name,
      salary: offer.salary,
      location_id: offer.location_id,
      contract_type: offer.contract_type,
      recruiter_id: offer.recruiter_id,
    })
  }

  // Handle update offer
  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!offerForm.id) return

    try {
      await updateOffer({
        id: offerForm.id,
        data: offerForm,
      })

      setNotification({
        type: "success",
        message: "Offre mise à jour avec succès",
      })

      setEditingOffer(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la mise à jour de l'offre",
      })
    }
  }

  // Handle delete offer
  const handleDeleteOffer = async (offerId: number) => {
    try {
      await deleteOffer(offerId)

      setNotification({
        type: "success",
        message: "Offre supprimée avec succès",
      })

      setShowDeleteConfirm(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la suppression de l'offre",
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

  if(isErrorOffers || isErrorLocations) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all">
        {errorOffers?.message || "Erreur lors de la récupération des offres et/ou des localisations"}
      </div>
    )
  }
  if (isLoadingOffers || isLoadingLocations) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple"></div>
        <span className="ml-3 text-electric-purple font-medium">Chargement des offres...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des offres</h1>
        <p className="text-gray-600">Gérez les offres d'emploi de la plateforme</p>
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
              placeholder="Rechercher une offre..."
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
                  value={selectedContractType}
                  onChange={(e) => setSelectedContractType(e.target.value)}
                >
                  <option value="all">Tous les contrats</option>
                  {contractTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple bg-white"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value === "all" ? "all" : Number(e.target.value))}
                >
                  <option value="all">Toutes les localisations</option>
                  {locations?.map((location: Location) => (
                    <option key={location.id} value={location.id}>
                      {location.city}, {location.country}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Add Offer Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-electric-purple text-white rounded-lg hover:bg-electric-purple/90 transition-colors"
              onClick={() => setIsAddingOffer(true)}
            >
              <Plus size={18} />
              Ajouter une offre
            </button>
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center">
                    Titre
                    {sortConfig.key === "title" ? (
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("company_name")}
                >
                  <div className="flex items-center">
                    Entreprise
                    {sortConfig.key === "company_name" ? (
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
                  Localisation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type de contrat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("salary")}
                >
                  <div className="flex items-center">
                    Salaire
                    {sortConfig.key === "salary" ? (
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
                  Date de création
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
              {currentOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-electric-purple/10 rounded-full flex items-center justify-center">
                        <Briefcase size={18} className="text-electric-purple" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {offer.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{offer.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      {offer.location?.city}, {offer.location?.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {offer.contract_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {offer.salary.toLocaleString()} €/an
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(offer.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-electric-purple hover:text-electric-purple/80"
                        onClick={() => handleEditClick(offer)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setShowDeleteConfirm(offer.id)}
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
              <span className="font-medium">{Math.min(indexOfLastItem, filteredOffers.length)}</span> sur{" "}
              <span className="font-medium">{filteredOffers.length}</span> offres
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

      {/* Add Offer Modal */}
      <AnimatePresence>
        {isAddingOffer && (
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
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ajouter une offre</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsAddingOffer(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddOffer}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre</label>
                    <div className="relative">
                      <Briefcase
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                    <div className="relative">
                      <Building2
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="company_name"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.company_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="location_id"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.location_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionner une localisation</option>
                        {locations?.map((location: Location) => (
                          <option key={location.id} value={location.id}>
                            {location.city}, {location.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                    <div className="relative">
                      <FileText
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="contract_type"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.contract_type}
                        onChange={handleInputChange}
                        placeholder="CDI, CDD, Stage, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salaire annuel (€)</label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        name="salary"
                        required
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.salary}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                      value={offerForm.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAddingOffer(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-electric-purple text-white rounded-md hover:bg-electric-purple/90"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Offer Modal */}
      <AnimatePresence>
        {editingOffer && (
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
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Modifier l'offre</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditingOffer(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateOffer}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre</label>
                    <div className="relative">
                      <Briefcase
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                    <div className="relative">
                      <Building2
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="company_name"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.company_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="location_id"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.location_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionner une localisation</option>
                        {locations?.map((location: Location) => (
                          <option key={location.id} value={location.id}>
                            {location.city}, {location.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                    <div className="relative">
                      <FileText
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="contract_type"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.contract_type}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salaire annuel (€)</label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        name="salary"
                        required
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={offerForm.salary}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                      value={offerForm.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setEditingOffer(null)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-electric-purple text-white rounded-md hover:bg-electric-purple/90"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
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
                  Êtes-vous sûr de vouloir supprimer cette offre ? Cette action ne peut pas être annulée.
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
                    onClick={() => handleDeleteOffer(showDeleteConfirm)}
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

export default OfferManagement

