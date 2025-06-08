"use client";
import React, { useEffect, useState } from "react";
import JobCard from "../general/JobCard";
import { Search } from "lucide-react";
import { Offer } from "@/app/types/offer";
import { useRouter } from "next/navigation";
import { searchOffers } from "@/app/services/offers";
import { Stats8 } from "../general/StatsCards";
import { Location } from "@/app/types/location";
import { Application } from "@/app/types/application";
import { RecentApplications } from "../general/RecentApplications";

type RecruiterDashboardProps = {
  offers: Offer[];
  applications: Application[];
  contractTypes: string[];
  applicationsNumber: number;
  locations: Location[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  userId: number;
};

type DashboardStats = {
  id: string;
  value: string;
  label: string;
};

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  offers,
  applications,
  contractTypes,
  applicationsNumber,
  locations,
  isLoading,
  isError,
  error,
  userId,
}) => {
  const router = useRouter();

  const [offersList, setOffersList] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // Get unique status values from all applications
  const getUniqueStatuses = (apps: Application[]) => {
    const statuses = new Set();
    apps?.forEach((app) => {
      if (app?.status) {
        statuses.add(app.status);
      }
    });
    return Array.from(statuses);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearchError(null);

    try {
      const offersResults = await searchOffers(
        searchQuery,
        contractType,
        locationId,
      );
      setOffersList(offersResults ?? offers);
    } catch (e) {
      console.error("Error : ", e);
      setSearchError(
        e instanceof Error
          ? e
          : new Error("Erreur lors de la recherche des offres"),
      );
    }
  };

  useEffect(() => {
    if (offers && offers.length > 0) {
      setOffersList(offers);
    }
  }, [offers]);

  useEffect(() => {
    const updatedStats = [
      {
        id: "stat-1",
        label: "Offres",
        value: String(offers?.length ?? 0),
      },
      {
        id: "stat-2",
        label: "Candidatures",
        value: String(applicationsNumber ?? 0),
      },
    ];

    setStats(updatedStats);
  }, [offers?.length, applicationsNumber]);

  if (isError) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
        {error?.message || "Une erreur est survenue"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <main className="ml-20 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="font-merriweather-sans text-4xl font-bold text-white">
              Tableau de Bord Recruteur
            </h1>
            <button
              onClick={() => {
                router.push("/jobs/new");
              }}
              className="rounded-lg bg-electric-purple px-6 py-2 text-white transition-all hover:brightness-125 hover:filter active:brightness-90 active:filter"
            >
              Publier une offre
            </button>
          </header>

          {/* Fix: Show search error if it exists */}
          {searchError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
              {searchError.message}
            </div>
          )}

          {/* Search Section */}
          <div className="mb-8 rounded-[30px] bg-white/70 p-6 shadow-md">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une offre..."
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Type de contrat</option>
                {contractTypes?.map((type, i) => (
                  <option key={`type-${i}`} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={locationId || ""}
                onChange={(e) =>
                  setLocationId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Localisation</option>
                {locations?.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="relative flex items-center gap-1.5 rounded-lg bg-electric-purple px-6 py-2 text-white transition-all hover:brightness-125 hover:filter active:brightness-90 active:filter"
              >
                <Search className="rotate-90 text-purple-200" size={25} />
              </button>
            </form>
          </div>

          <Stats8 stats={stats} userId={userId} />

          {/* Job Cards Grid */}
          <div className="flex items-start justify-center gap-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offersList?.length > 0 ? (
                offersList.map((offer) => (
                  <JobCard
                    key={`offer-${offer.id}`}
                    offer={offer}
                    router={router}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  Aucune offre trouvée
                </div>
              )}
            </div>
            <div className="h-full">
              <RecentApplications applications={applications ?? []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
