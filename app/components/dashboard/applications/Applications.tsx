"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Status, type Application } from "@/app/types/application"
// import { useLocations } from "@/app/hooks/useLocations"
import { searchApplications } from "@/app/services/applications"
import ApplicationCard from "../../general/ApplicationCard"
import { motion, AnimatePresence } from "framer-motion"
import { useGetLocations } from "@/app/hooks/useLocations"

type ApplicationsProps = {
  applications: Application[]
}

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const { data: locations, isLoading, error: errorData, isError: isErrorLocations } = useGetLocations()
  const [error, setError] = useState<string | null>(null)
  const [applicationsList, setApplicationsList] = useState<Application[]>(Array.isArray(applications) ? applications : []);
      const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const applicationsResults = await searchApplications(searchQuery);
      setApplicationsList(applicationsResults || []);
    } catch (e) {
      console.error("Error : ", e);
      setError(errorData?.message ?? "Erreur lors de la recherche des candidatures");
    }
  };

  // Filter applications based on status and date
  const filteredApplications = Array.isArray(applicationsList) 
  ? applicationsList.filter((application) => {
        // Status filter (uncomment if you want to use it)
    if (statusFilter !== "all") {
      const status = application.status || Status.PENDING;
      if (status !== statusFilter) return false;
    }
      // Date filter
      if (dateFilter !== "all") {
        const applicationDate = new Date(application.createdAt || Date.now());
        const now = new Date();

        if (dateFilter === "today") {
          return applicationDate.toDateString() === now.toDateString();
        } else if (dateFilter === "week") {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return applicationDate >= oneWeekAgo;
        } else if (dateFilter === "month") {
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return applicationDate >= oneMonthAgo;
        }
      }
      return true;
    })
  : [];

  useEffect(() => {
    setApplicationsList(Array.isArray(applications) ? applications : []);
  }, [applications]);

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all"
      >
        {error}
      </motion.div>
    )

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple"></div>
        <span className="ml-3 text-white font-medium">Chargement des candidatures...</span>
      </div>
    )

  return (
    <div className="flex h-full w-full">
      <main className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-white text-4xl font-merriweather-sans font-bold">Candidatures</h1>
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2">
                <div className="flex items-center">
                  <CheckCircle size={18} className="text-green-400 mr-1" />
                  <span className="text-white text-sm">
                    {/* {applicationsList.filter((a) => a.status === "accepted").length}  */}
                    Acceptées
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex items-center">
                  <XCircle size={18} className="text-red-400 mr-1" />
                  <span className="text-white text-sm">
                    {/* {applicationsList.filter((a) => a.status === "rejected").length}  */}Refusées
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex items-center">
                  <AlertCircle size={18} className="text-yellow-400 mr-1" />
                  <span className="text-white text-sm">
                    {applicationsList.filter((a) => a.status === Status.PENDING).length} 
                     En attente
                  </span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 rounded-[30px] p-6 mb-8 shadow-md"
          >
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une candidature..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple focus:border-transparent transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                  isFiltersOpen
                    ? "bg-electric-purple text-white border-electric-purple"
                    : "bg-white text-gray-700 border-gray-300 hover:border-electric-purple"
                }`}
              >
                <Filter size={18} />
                <span>Filtres</span>
              </button>
              <button
                type="submit"
                className="bg-electric-purple text-white px-6 py-2 flex items-center gap-1.5 rounded-lg hover:bg-electric-purple/90 active:bg-electric-purple/80 transition-all shadow-md hover:shadow-lg"
              >
                <Search className="rotate-90 text-purple-200" size={20} />
                <span>Rechercher</span>
              </button>
            </form>

            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setStatusFilter("all")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            statusFilter === "all"
                              ? "bg-electric-purple text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Tous
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter(Status.PENDING)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            statusFilter === Status.PENDING
                              ? "bg-yellow-500 text-white"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          <AlertCircle size={14} className="mr-1" />
                          En attente
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter("accepted")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            statusFilter === "accepted"
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Acceptées
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusFilter("rejected")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            statusFilter === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <XCircle size={14} className="mr-1" />
                          Refusées
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setDateFilter("all")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            dateFilter === "all"
                              ? "bg-electric-purple text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Toutes les dates
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateFilter("today")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            dateFilter === "today"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <Calendar size={14} className="mr-1" />
                          Aujourd'hui
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateFilter("week")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            dateFilter === "week"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <Clock size={14} className="mr-1" />
                          Cette semaine
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateFilter("month")}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center ${
                            dateFilter === "month"
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <Calendar size={14} className="mr-1" />
                          Ce mois
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Applications Grid */}
          {filteredApplications && filteredApplications.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredApplications.map((application, index) => (
      <motion.div
        key={`application-${application.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -5 }}
      >
        <ApplicationCard application={application} showActions={true} />
      </motion.div>
    ))}
  </div>
) : (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white/70 rounded-[30px] p-10 text-center"
  >
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle size={32} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">Aucune candidature trouvée</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Aucune candidature ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres ou de créer
      de nouvelles offres d'emploi.
    </p>
  </motion.div>
)}
     
        </div>
      </main>
    </div>
  )
}

export default Applications

