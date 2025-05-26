"use client";
import React, { useEffect, useState } from "react";
import JobCard from "../general/JobCard";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Filter,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { Offer } from "@/app/types/offer";
import { searchOffers } from "@/app/services/offers";
import { Location } from "@/app/types/location";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Application } from "@/app/types/application";

type UserDashboardProps = {
  offers: Offer[];
  applications: Application[];
  contractTypes: string[];
  locations: Location[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};
const UserDashboard: React.FC<UserDashboardProps> = ({
  offers,
  applications,
  contractTypes,
  locations,
  isLoading,
  isError,
  error,
}) => {
  const router = useRouter();

  // const [error, setError] = useState<string | null>(null);
  const [offersList, setOffersList] = useState<Offer[]>(offers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const clearFilters = () => {
    setSearchQuery("");
    setContractType("");
    setLocationId(undefined);
    setOffersList(offers);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    error = error;
    try {
      const offersResults = await searchOffers(
        searchQuery,
        contractType,
        locationId,
      );
      setOffersList(offersResults ?? offers);
    } catch (e) {
      console.error("Error : ", e);
      // setError(error?.message ?? "Erreur lors de la recherche des offres");
      error = error ?? new Error("Erreur lors de la recherche des offres");
    }
  };

  useEffect(() => {
    const updatedOffers =
      offersList && offersList.length > 0 ? offersList : offers;
    setOffersList(updatedOffers);
    console.log("locations : ", locations);
  }, [offers, locations, offersList]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const filterVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  if (isError)
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
        {error
          ? error.message
          : "Erreur lors de la recherche des localisations"}
      </div>
    );
  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  return (
    <div className="flex h-full w-full">
      {/* Main Content */}
      <main className="ml-20 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* <header className="flex justify-between items-center mb-8">
            <h1 className="text-white text-4xl font-merriweather-sans font-bold">Tableau de Bord des Offres</h1>

          </header> */}

          {/* Search Section */}
          {/* <div className="bg-white/70 rounded-[30px] p-6 mb-8 shadow-md">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une offre..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select defaultValue="" onChange={(e) => setContractType(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="" disabled>Type de contrat</option>
                {contractTypes.map((type, i) => (
                  <option key={`type-${i}`} value={type}>{type}</option>
                ))}
              </select>
              <select onChange={(e) => setLocationId(Number(e.target.value))} defaultValue="" className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option disabled value="">Localisation</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>{location.city}, {location.country}</option>
                ))}
              </select>
      <button type="submit" className="bg-purple-600 text-white px-6 relative py-2 flex items-center gap-1.5  rounded-lg active:bg-purple-700 transition-all hover:bg-purple-500"><Search className="rotate-90 text-purple-200" size={25} />
                   </button>
            </form>
          </div> */}
          {/* Header Section */}
          <motion.header
            className="mb-8 flex items-center justify-between"
            variants={itemVariants}
          >
            <div>
              <h1 className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text font-merriweather-sans text-4xl font-bold text-transparent">
                Tableau de bord
              </h1>
              <p className="mt-2 font-dm-sans font-light text-electric-purple">
                Découvrez {offersList.length} offres d'emploi correspondant à
                vos critères
              </p>
            </div>

            <motion.div
              className="flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm text-white/80">Trier par:</span>
              <select className="border-none bg-transparent text-sm text-white outline-none">
                <option value="recent">Plus récentes</option>
                <option value="salary">Salaire</option>
                <option value="relevance">Pertinence</option>
              </select>
            </motion.div>
          </motion.header>

          {/* Search Section */}
          <motion.div
            className="mb-8 rounded-[30px] border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-md"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-3 text-indigo-300"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre, compétence ou entreprise..."
                    className="w-full rounded-xl border border-indigo-100 bg-white/80 py-3 pl-10 pr-4 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <motion.button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-3 transition-all",
                    isFilterOpen
                      ? "bg-indigo-600 text-white"
                      : "bg-white/80 text-indigo-600 hover:bg-indigo-50",
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter size={18} />
                  <span>Filtres</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                  />
                </motion.button>

                <motion.button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-white transition-all hover:shadow-lg"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                  <span>{isSearching ? "Recherche..." : "Rechercher"}</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={filterVariants}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
                      <div className="relative">
                        <Briefcase
                          className="absolute left-3 top-3 text-indigo-300"
                          size={20}
                        />
                        <select
                          value={contractType}
                          onChange={(e) => setContractType(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-indigo-100 bg-white/80 py-3 pl-10 pr-4 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Tous les types de contrat</option>
                          {contractTypes.map((type, i) => (
                            <option key={`type-${i}`} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-3 text-indigo-300"
                          size={20}
                        />
                        <select
                          value={locationId || ""}
                          onChange={(e) =>
                            setLocationId(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full appearance-none rounded-xl border border-indigo-100 bg-white/80 py-3 pl-10 pr-4 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Toutes les localisations</option>
                          {locations?.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.city}, {location.country}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-3 text-indigo-300"
                          size={20}
                        />
                        <select className="w-full appearance-none rounded-xl border border-indigo-100 bg-white/80 py-3 pl-10 pr-4 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="">Date de publication</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois-ci</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <motion.button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-indigo-200 transition-colors hover:text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={16} />
                        <span>Effacer les filtres</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Job Cards Grid */}
          <AnimatePresence>
            <motion.div
              animate="visible"
              variants={containerVariants}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {offersList?.map((offer) => (
                <JobCard
                  key={`offer-${offer.id}`}
                  offer={offer}
                  router={router}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
