"use client";
import React, { useEffect, useState } from "react";
import JobCard from "../general/JobCard";
import { Search } from "lucide-react";
import { Offer } from "@/app/types/offer";
import { useRouter } from "next/navigation";
import { useLocations } from "@/app/hooks/useLocations";
import { searchOffers } from "@/app/services/offers";
import { Stats8 } from "../general/StatsCards";

type RecruiterDashboardProps = {
  offers: Offer[];
  contractTypes: string[];
  applicationsNumber: number;
};

type DashboardStats = {
  id: string;
  value: string;
  label: string;
};

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  offers,
  contractTypes,
  applicationsNumber,
}) => {
  const router = useRouter();
  const {
    data: locations,
    isLoading: isLoadingLocations,
    error: errorData,
  } = useLocations();
  const [error, setError] = useState<string | null>(null);
  const [offersList, setOffersList] = useState<Offer[]>(offers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [stats, setStats] = useState<DashboardStats[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const offersResults = await searchOffers(
        searchQuery,
        contractType,
        locationId
      );
      setOffersList(offersResults ?? offers);
    } catch (e) {
      console.error("Error : ", e);
      setError(errorData ?? "Erreur lors de la recherche des offres");
    }
  };

  useEffect(() => {
    const updatedOffers =
      offersList && offersList.length > 0 ? offersList : offers;
    setOffersList(updatedOffers);
  }, [offers, offersList]);

  // In RecruiterDashboard.tsx
  useEffect(() => {
    const updatedStats = [
      {
        id: "stat-1",
        label: "Offres",
        value: String(offers?.length || 0),
      },
      {
        id: "stat-2",
        label: "Candidatures",
        value: String(applicationsNumber || 0),
      },
    ];

    setStats(updatedStats);
  }, [offers, applicationsNumber]);

  if (error)
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all">
        {error}
      </div>
    );
  if (isLoadingLocations)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  return (
  
      <main className="flex-1 ml-20 p-8 flex h-full w-full">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-white text-4xl font-merriweather-sans font-bold">
              Tableau de Bord Recruteur
            </h1>
            <button
              onClick={() => {
                router.push("/jobs/new");
              }}
              className="bg-electric-purple text-white px-6 py-2 rounded-lg hover:filter hover:brightness-125 active:filter active:brightness-90 transition-all"
            >
              Publier une offre
            </button>
          </header>

          {/* Search Section */}
          <div className="bg-white/70 rounded-[30px] p-6 mb-8 shadow-md">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une offre..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                defaultValue=""
                onChange={(e) => setContractType(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option disabled value="">
                  Type de contrat
                </option>
                {contractTypes.map((type, i) => (
                  <option key={`type-${i}`} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                defaultValue=""
                onChange={(e) => setLocationId(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option disabled value="">
                  Localisation
                </option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className=" text-white px-6 relative py-2 flex items-center gap-1.5 bg-electric-purple rounded-lg hover:filter hover:brightness-125 active:filter active:brightness-90 transition-all"
              >
                <Search className="rotate-90 text-purple-200" size={25} />
              </button>
            </form>
          </div>

          {<Stats8 stats={stats} />}
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offersList?.map((offer) => (
              <JobCard
                key={`offer-${offer.id}`}
                offer={offer}
                router={router}
              />
            ))}
          </div>
        </div>
      </main>
   
  );
};

export default RecruiterDashboard;
