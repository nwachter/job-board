"use client";
import React, { useEffect, useState } from 'react'
import JobCard from '../general/JobCard';
import { Briefcase, Calendar, ChevronDown, Filter, Loader2, MapPin, Search, X } from 'lucide-react';
import { Offer } from '@/app/types/offer';
import { useGetLocations } from '@/app/hooks/useLocations';
import { searchOffers } from '@/app/services/offers';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type JobsProps = {
  offers: Offer[];
  contractTypes: string[];
}

const Jobs: React.FC<JobsProps> = ({ offers, contractTypes }) => {
  // const router = useRouter();
  const { data: locations, isLoading: isLoadingLocations, error: errorData } = useGetLocations();
  const [error, setError] = useState<string | null>(null);
  const [offersList, setOffersList] = useState<Offer[]>(offers);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [locationId, setLocationId] = useState<number | undefined>(undefined);

    const [isSearching, setIsSearching] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const offersResults = await searchOffers(searchQuery, contractType, locationId);
      setOffersList(offersResults ?? offers);
      return offers;
    } catch (e) {
      console.error("Error : ", e);
      setError(errorData?.message ?? "Erreur lors de la recherche des offres");
    }
  };

  const clearFilters = () => {
    setSearchQuery("")
    setContractType("")
    setLocationId(undefined)
    setOffersList(offers)
  }

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

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
  }

  const filterVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  }
  

  useEffect(() => {
    const updatedOffers = offersList && offersList.length > 0 ? offersList : offers;
    setOffersList(updatedOffers);
  }, [offers, offersList])

  if (error) return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all">{error}</div>;
  if (isLoadingLocations) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
      <span className="ml-2">Chargement des offres...</span>
    </div>
  );
  return (
    <div className="flex h-full w-full">

      {/* Main Content */}
      <main className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.header className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h1 className="text-4xl font-merriweather-sans font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                
                Tableau de Bord
              </h1>
              <p className="text-electric-purple font-dm-sans font-light mt-2">
                Découvrez {offersList.length} offres d'emploi correspondant à vos critères
              </p>
            </div>

            <motion.div
              className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white/80 text-sm">Trier par:</span>
              <select className="bg-transparent text-white border-none outline-none text-sm">
                <option value="recent">Plus récentes</option>
                <option value="salary">Salaire</option>
                <option value="relevance">Pertinence</option>
              </select>
            </motion.div>
          </motion.header>

          {/* Search Section */}
          <motion.div
            className=" backdrop-blur-md p-6 mb-8 border border-white/20 shadow-xl bg-white/70 rounded-[30px] "
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-indigo-300" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre, compétence ou entreprise..."
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <motion.button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl transition-all",
                    isFilterOpen ? "bg-indigo-600 text-white" : "bg-white/80 text-indigo-600 hover:bg-indigo-50",
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter size={18} />
                  <span>Filtres</span>
                  <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-indigo-300" size={20} />
                        <select
                          value={contractType}
                          onChange={(e) => setContractType(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
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
                        <MapPin className="absolute left-3 top-3 text-indigo-300" size={20} />
                        <select
                          value={locationId || ""}
                          onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
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
                        <Calendar className="absolute left-3 top-3 text-indigo-300" size={20} />
                        <select className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all">
                          <option value="">Date de publication</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois-ci</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <motion.button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-indigo-200 hover:text-white transition-colors"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offersList?.map((offer) => (
              <JobCard key={`offer-${offer.id}`} offer={offer} />
            ))}
          </motion.div>
          </AnimatePresence>
   
        </div>
      </main>
    </div>
  );
}

export default Jobs