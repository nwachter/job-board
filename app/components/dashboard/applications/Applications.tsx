// testerror : A FIX (poster une candidature bugge)
"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Status, type Application } from "@/app/types/application";
// import { useLocations } from "@/app/hooks/useLocations"
import { searchApplications } from "@/app/services/applications";
import ApplicationCard from "../../general/ApplicationCard";
import { motion, AnimatePresence } from "framer-motion";
import { useGetLocations } from "@/app/hooks/useLocations";

type ApplicationsProps = {
  applications: Application[];
};

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const {
    data: locations,
    isLoading,
    error: errorData,
    isError: isErrorLocations,
  } = useGetLocations();
  const [error, setError] = useState<string | null>(null);

  const [applicationsList, setApplicationsList] = useState<Application[]>(
    Array.isArray(applications) ? applications : [],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const applicationsResults = await searchApplications(searchQuery);
      setApplicationsList(applicationsResults || []);
    } catch (e) {
      console.error("Error : ", e);
      setError(
        errorData?.message ?? "Erreur lors de la recherche des candidatures",
      );
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
            const oneWeekAgo = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000,
            );
            return applicationDate >= oneWeekAgo;
          } else if (dateFilter === "month") {
            const oneMonthAgo = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            );
            return applicationDate >= oneMonthAgo;
          }
        }
        return true;
      })
    : [];

  useEffect(() => {

    console.log("Candidatures : ", applications);
    setApplicationsList(Array.isArray(applications) ? applications : []);
  }, [applications]);


  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400"
      >
        {error}
      </motion.div>
    );

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-electric-purple"></div>
        <span className="ml-3 font-medium text-white">
          Chargement des candidatures...
        </span>
      </div>
    );

  return (
    <div className="flex h-full w-full">
      <main className="ml-20 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <h1 className="font-merriweather-sans text-4xl font-bold text-white">
              Candidatures
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <CheckCircle size={18} className="mr-1 text-green-400" />
                  <span className="text-sm text-white">
                    {/* {applicationsList.filter((a) => a.status === "accepted").length}  */}
                    Acceptées
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex items-center">
                  <XCircle size={18} className="mr-1 text-red-400" />
                  <span className="text-sm text-white">
                    {/* {applicationsList.filter((a) => a.status === "rejected").length}  */}
                    Refusées
                  </span>
                </div>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex items-center">
                  <AlertCircle size={18} className="mr-1 text-yellow-400" />
                  <span className="text-sm text-white">
                    {
                      applicationsList.filter(
                        (a) => a.status === Status.PENDING,
                      ).length
                    }
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
            className="mb-8 rounded-[30px] bg-white/70 p-6 shadow-md"
          >
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une candidature..."
                  className="w-full rounded-lg border py-2 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-electric-purple"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                  isFiltersOpen
                    ? "border-electric-purple bg-electric-purple text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-electric-purple"
                }`}
              >
                <Filter size={18} />
                <span>Filtres</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-electric-purple px-6 py-2 text-white shadow-md transition-all hover:bg-electric-purple/90 hover:shadow-lg active:bg-electric-purple/80"
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
                  <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Statut
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setStatusFilter("all")}
                          className={`rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setDateFilter("all")}
                          className={`rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
                          className={`flex items-center rounded-full px-3 py-1.5 text-sm transition-all ${
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={`application-${application.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <ApplicationCard
                    application={application}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-[30px] bg-white/70 p-10 text-center"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-800">
                Aucune candidature trouvée
              </h3>
              <p className="mx-auto max-w-md text-gray-600">
                Aucune candidature ne correspond à vos critères de recherche.
                Essayez d'ajuster vos filtres ou de créer de nouvelles offres
                d'emploi.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applications;
