"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";
import Image from "next/image";
import { Status, Application } from "@/app/types/application";
import { Offer } from "@/app/types/offer";

import { AnimatePresence } from "motion/react";
import ApplicationDetailsModal from "./modals/ApplicationDetailsModal";
import OffersFilter from "./filters/OffersFilter";
import { StatusFilter } from "./filters/StatusFilter";

type RecruiterApplicationsProps = {
  recruiterId: number;
  applications: Application[];
};

export default function RecruiterApplications({ recruiterId, applications }: RecruiterApplicationsProps) {
  // State for applications data
  // const [filteredApplications, setFilteredApplications] = useState<
  //   Application[]
  // >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isOpenApplicationDetailModal, setIsOpenApplicationDetailModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [offerFilter, setOfferFilter] = useState<number | "ALL">("ALL");
  // const [offersList, setOffersList] = useState<Offer[]>([]);
  const [isOpenOffersFilter, setIsOpenOffersFilter] = useState(false);
  const [isOpenStatusFilter, setIsOpenStatusFilter] = useState(false);

  // useEffect(() => {
  //   const fetchApplications = async () => {
  //     setIsLoading(true);

  //     setFilteredApplications(applications);

  //     // Extract unique offersList
  //     const uniqueOffers = Array.from(
  //       new Set(applications.map((app) => app.offer_id)),
  //     )
  //       .map((offerId) => {
  //         return applications.find((app) => app.offer_id === offerId)?.offer;
  //       })
  //       .filter(Boolean) as Offer[];

  //     setOffersList(uniqueOffers);
  //     setIsLoading(false);
  //   };

  //   fetchApplications();
  // }, [recruiterId, applications]);

  // // Filter applications based on search term and filters
  // useEffect(() => {
  //   let result = [...applications];

  //   // Apply search filter
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase();
  //     result = result.filter(
  //       (app) =>
  //         app.firstname.toLowerCase().includes(term) ||
  //         app.lastname.toLowerCase().includes(term) ||
  //         app.email.toLowerCase().includes(term) ||
  //         app.offer?.title.toLowerCase().includes(term) ||
  //         app.content.toLowerCase().includes(term),
  //     );
  //   }

  //   // Apply status filter
  //   if (statusFilter !== "ALL") {
  //     result = result.filter((app) => app.status === statusFilter);
  //   }

  //   // Apply offer filter
  //   if (offerFilter !== "ALL") {
  //     result = result.filter((app) => app.offer_id === offerFilter);
  //   }

  //   setFilteredApplications(result);
  // }, [searchTerm, statusFilter, offerFilter]);

  // Handle application status change

  // Memoized data fetch

  let { filteredApplications, offersList } = useMemo(() => {
    const fetchApplications = () => {
      const uniqueOffers = Array.from(new Set(applications.map(app => app.offer_id)))
        .map(offerId => {
          return applications.find(app => app.offer_id === offerId)?.offer;
        })
        .filter(Boolean) as Offer[];

      return {
        filteredApplications: applications,
        offersList: uniqueOffers,
      };
    };

    const { filteredApplications, offersList } = fetchApplications();
    setIsLoading(false);

    let result = [...filteredApplications];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        app =>
          app.firstname.toLowerCase().includes(term) ||
          app.lastname.toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term) ||
          app.offer?.title.toLowerCase().includes(term) ||
          app.content.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(app => app.status === statusFilter);
    }

    // Apply offer filter
    if (offerFilter !== "ALL") {
      result = result.filter(app => app.offer_id === offerFilter);
    }

    return {
      filteredApplications: result,
      offersList: offersList,
    };
  }, [applications, searchTerm, statusFilter, offerFilter]);

  const handleStatusChange = (applicationId: number, newStatus: Status, feedback: string = "") => {
    // setFilteredApplications((prevApplications) =>
    //   prevApplications.map((app) =>
    //     app.id === applicationId
    //       ? { ...app, status: newStatus, feedback: feedback || app.feedback }
    //       : app,
    //   ),
    // );

    offersList = offersList;
    filteredApplications = filteredApplications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus, feedback: feedback || app.feedback } : app
    );

    // Close detail view after status change
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication(prev => (prev ? { ...prev, status: newStatus, feedback } : null));
    }

    // Show success notification
    // console.log(`Application ${applicationId} status changed to ${newStatus}`);
  };

  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
            <Clock size={12} />
            En attente
          </span>
        );
      case Status.ACCEPTED:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
            <CheckCircle size={12} />
            Acceptée
          </span>
        );
      case Status.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
            <XCircle size={12} />
            Refusée
          </span>
        );
      default:
        return null;
    }
  };

  // View application details
  const viewApplicationDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsOpenApplicationDetailModal(true);
    setFeedbackText(application.feedback || "");
  };

  // Close application details
  const closeApplicationDetails = () => {
    setIsOpenApplicationDetailModal(false);
    setSelectedApplication(null);
    setFeedbackText("");
  };

  // Render skill level
  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <div key={star} className={`h-2 w-2 rounded-full ${star <= level ? "bg-electric-purple" : "bg-gray-200"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl rounded-3xl bg-gradient-to-br from-white/60 to-cream/50 p-4 sm:p-6">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Candidatures</h1>
          <p className="mt-2 text-gray-600">Consultez et gérez les candidatures pour vos offres d'emploi</p>
        </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-md md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat, une offre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-electric-purple focus:outline-none focus:ring-1 focus:ring-electric-purple"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <StatusFilter
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setIsOpenStatusFilter={setIsOpenStatusFilter}
              isOpenStatusFilter={isOpenStatusFilter}
            />

            {/* Offer Filter */}

            <OffersFilter
              offersList={offersList}
              offerFilter={offerFilter}
              setOfferFilter={setOfferFilter}
              setIsOpenOffersFilter={setIsOpenOffersFilter}
              isOpenOffersFilter={isOpenOffersFilter}
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="rounded-xl bg-white shadow-md">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-electric-purple"></div>
              <span className="ml-2 text-gray-600">Chargement des candidatures...</span>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Briefcase size={48} className="mb-4 text-gray-300" />
              <p className="text-gray-500">Aucune candidature ne correspond à vos critères</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Candidat
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
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Statut
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
                  {filteredApplications.map(application => (
                    <tr key={application.id} className="hover:bg-purple-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              src={application.user?.avatar || "/placeholder.svg?height=40&width=40"}
                              alt={`${application.firstname} ${application.lastname}`}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {application.firstname} {application.lastname}
                            </div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{application.offer?.title}</div>
                        <div className="text-sm text-gray-500">{application.offer?.company_name}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => viewApplicationDetails(application)}
                          className="mr-3 text-electric-purple hover:text-purple-800"
                        >
                          Voir
                        </button>
                        {application.status === Status.PENDING && (
                          <>
                            <button
                              onClick={() => handleStatusChange(application.id, Status.ACCEPTED)}
                              className="mr-3 text-green-600 hover:text-green-800"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => handleStatusChange(application.id, Status.REJECTED)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        <AnimatePresence>
          {isOpenApplicationDetailModal && selectedApplication && (
            <ApplicationDetailsModal
              onClose={() => setIsOpenApplicationDetailModal(false)}
              selectedApplication={selectedApplication}
              getStatusBadge={getStatusBadge}
              handleStatusChange={handleStatusChange}
              formatDate={formatDate}
              renderSkillLevel={renderSkillLevel}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
