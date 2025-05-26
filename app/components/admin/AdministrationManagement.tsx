"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplication,
} from "@/app/hooks/useApplication";
import { useGetOffers } from "@/app/hooks/useOffers";
import type { Application } from "@/app/types/application";
import { Status } from "@/app/types/application";
import type { Offer } from "@/app/types/offer";

type NotificationType = {
  type: "success" | "warning" | "error";
  message: string;
} | null;

const ApplicationManagement = () => {
  const { data: applications, isLoading } = useGetApplications();
  const { data: offers } = useGetOffers();
  const { mutateAsync: deleteApplication } = useDeleteApplication();
  const { mutateAsync: updateApplication } = useUpdateApplication();

  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");
  const [selectedOffer, setSelectedOffer] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null,
  );
  const [notification, setNotification] = useState<NotificationType>(null);
  const [viewingApplication, setViewingApplication] =
    useState<Application | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application | "";
    direction: "ascending" | "descending";
  }>({ key: "", direction: "ascending" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const filterApplications = () => {
      if (!applications) return;

      let filtered = [...applications];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (application) =>
            application.firstname
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            application.lastname
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            application.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            application.offer?.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }

      // Status filter
      if (selectedStatus !== "all") {
        filtered = filtered.filter(
          (application) => application.status === selectedStatus,
        );
      }

      // Offer filter
      if (selectedOffer !== "all") {
        filtered = filtered.filter(
          (application) => application.offer_id === selectedOffer,
        );
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

      setFilteredApplications(filtered);
    };
    if (applications) {
      filterApplications();
    }
  }, [applications, searchTerm, selectedStatus, selectedOffer, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Handle sort
  const requestSort = (key: keyof Application) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle delete application
  const handleDeleteApplication = async (applicationId: number) => {
    try {
      await deleteApplication(applicationId);

      setNotification({
        type: "success",
        message: "Candidature supprimée avec succès",
      });

      setShowDeleteConfirm(null);

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          (error as Error).message ||
          "Erreur lors de la suppression de la candidature",
      });
    }
  };

  // Handle update application status
  const handleUpdateStatus = async (applicationId: number, status: Status) => {
    try {
      await updateApplication({
        id: applicationId,
        data: {
          status,
          feedback: feedback || undefined,
        },
      });

      setNotification({
        type: "success",
        message: `Candidature ${
          status === Status.ACCEPTED
            ? "acceptée"
            : status === Status.REJECTED
              ? "refusée"
              : "mise à jour"
        } avec succès`,
      });

      setViewingApplication(null);
      setFeedback("");

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          (error as Error).message ||
          "Erreur lors de la mise à jour de la candidature",
      });
    }
  };

  // Format date
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status?: Status) => {
    switch (status) {
      case Status.ACCEPTED:
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Acceptée
          </span>
        );
      case Status.REJECTED:
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
            <XCircle size={12} className="mr-1" /> Refusée
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
            <AlertTriangle size={12} className="mr-1" /> En attente
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-electric-purple"></div>
        <span className="ml-3 font-medium text-electric-purple">
          Chargement des candidatures...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des candidatures
        </h1>
        <p className="text-gray-600">
          Gérez les candidatures reçues sur la plateforme
        </p>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 flex items-center justify-between rounded-lg p-4 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="mr-2 h-5 w-5" />
              ) : (
                <AlertTriangle className="mr-2 h-5 w-5" />
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
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <input
              type="search"
              placeholder="Rechercher une candidature..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as Status | "all")
                  }
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptées</option>
                  <option value="rejected">Refusées</option>
                </select>
                <Filter
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                  value={selectedOffer}
                  onChange={(e) =>
                    setSelectedOffer(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
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
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Offre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  CV
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-electric-purple/10">
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
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {application.offer?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {application.offer?.company_name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(application.createdAt)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      href={application.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-electric-purple hover:text-electric-purple/80"
                    >
                      <Download size={16} className="mr-1" />
                      <span className="text-sm">Télécharger</span>
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
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
          <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
            <div className="text-sm text-gray-700">
              Affichage de{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredApplications.length)}
              </span>{" "}
              sur{" "}
              <span className="font-medium">{filteredApplications.length}</span>{" "}
              candidatures
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded p-1 ${
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`rounded p-1 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Détails de la candidature</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setViewingApplication(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Left column - Candidate info */}
                <div className="rounded-xl bg-gray-50 p-6 md:col-span-1">
                  <div className="mb-6 flex flex-col items-center">
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-electric-purple/10">
                      <User size={32} className="text-electric-purple" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {viewingApplication.firstname}{" "}
                      {viewingApplication.lastname}
                    </h3>
                    <p className="text-gray-600">{viewingApplication.email}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          {viewingApplication.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Date de candidature
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(viewingApplication.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FileText className="mr-3 mt-0.5 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CV</p>
                        <a
                          href={viewingApplication.cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center rounded-lg bg-electric-purple/10 px-3 py-1.5 text-sm text-electric-purple transition-colors hover:bg-electric-purple/20"
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
                    <h1 className="mb-2 text-2xl font-bold">
                      Candidature pour: {viewingApplication.offer?.title}
                    </h1>
                    <div className="mb-4 flex flex-wrap gap-3">
                      {viewingApplication.offer?.location?.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="mr-1" size={16} />
                          <span>
                            {viewingApplication.offer?.location?.city},{" "}
                            {viewingApplication.offer?.location?.country}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="mr-1" size={16} />
                        <span>{viewingApplication.offer?.contract_type}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="mr-2">Statut actuel:</span>
                      {getStatusBadge(viewingApplication.status)}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-3 text-lg font-semibold">
                      Lettre de motivation
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="whitespace-pre-line text-gray-700">
                        {viewingApplication.content}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-3 text-lg font-semibold">
                      Feedback (optionnel)
                    </h3>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                      rows={3}
                      placeholder="Ajouter un feedback pour le candidat..."
                    ></textarea>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            viewingApplication.id,
                            Status.ACCEPTED,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white transition-colors hover:bg-green-700"
                      >
                        <CheckCircle size={18} />
                        Accepter la candidature
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            viewingApplication.id,
                            Status.REJECTED,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h2 className="mb-2 text-xl font-bold">
                  Confirmer la suppression
                </h2>
                <p className="mb-6 text-center text-gray-600">
                  Êtes-vous sûr de vouloir supprimer cette candidature ? Cette
                  action ne peut pas être annulée.
                </p>

                <div className="flex w-full justify-center space-x-3">
                  <button
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
  );
};

export default ApplicationManagement;
