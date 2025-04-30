"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Eye,
  Clock,
  Briefcase,
  Award,
} from "lucide-react";
import Image from "next/image";
import { Status, Application } from "@/app/types/application";
import { Offer } from "@/app/types/offer";
import { User } from "@/app/types/user";

import { motion, AnimatePresence } from "framer-motion";

type RecruiterApplicationsProps = {
  recruiterId: number;
};

export default function RecruiterApplications({
  recruiterId,
}: RecruiterApplicationsProps) {
  // State for applications data
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [offerFilter, setOfferFilter] = useState<number | "ALL">("ALL");
  const [offers, setOffers] = useState<Offer[]>([]);

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchApplications = async () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Mock data
        const mockApplications: Application[] = [
          {
            id: 1,
            content:
              "Je suis très intéressé par ce poste car j'ai 5 ans d'expérience en développement web et je suis passionné par les nouvelles technologies.",
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            offer_id: 1,
            offer: {
              id: 1,
              title: "Développeur Full Stack",
              description:
                "Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe.",
              company_name: "TechCorp",
              location_id: 1,
              salary: 55000,
              contract_type: "CDI",
              recruiter_id: recruiterId,
              skills: [
                { id: 1, name: "React", level: 4 },
                { id: 2, name: "Node.js", level: 3 },
              ],
            },
            user_id: 101,
            user: {
              id: 101,
              username: "Jean Dupont",
              email: "jean.dupont@example.com",
              role: "CANDIDATE" as any,
              avatar: "/placeholder.svg?height=100&width=100",
              password: "",
              skills: [
                { id: 1, name: "React", level: 4 },
                { id: 2, name: "Node.js", level: 3 },
                { id: 5, name: "TypeScript", level: 3 },
              ],
            },
            cv: "jean_dupont_cv.pdf",
            status: Status.PENDING,
            createdAt: new Date("2025-04-15T10:30:00"),
          },
          {
            id: 2,
            content:
              "Ayant travaillé sur des projets similaires, je pense pouvoir apporter une réelle valeur ajoutée à votre entreprise.",
            firstname: "Marie",
            lastname: "Martin",
            email: "marie.martin@example.com",
            offer_id: 1,
            offer: {
              id: 1,
              title: "Développeur Full Stack",
              description:
                "Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe.",
              company_name: "TechCorp",
              location_id: 1,
              salary: 55000,
              contract_type: "CDI",
              recruiter_id: recruiterId,
              skills: [
                { id: 1, name: "React", level: 4 },
                { id: 2, name: "Node.js", level: 3 },
              ],
            },
            user_id: 102,
            user: {
              id: 102,
              username: "Marie Martin",
              email: "marie.martin@example.com",
              role: "CANDIDATE" as any,
              avatar: "/placeholder.svg?height=100&width=100",
              password: "",
              skills: [
                { id: 1, name: "React", level: 5 },
                { id: 3, name: "Python", level: 4 },
                { id: 4, name: "SQL", level: 3 },
              ],
            },
            cv: "marie_martin_cv.pdf",
            status: Status.ACCEPTED,
            feedback:
              "Excellent profil, compétences techniques solides et bonne communication.",
            createdAt: new Date("2025-04-10T14:45:00"),
          },
          {
            id: 3,
            content:
              "Mon expérience en tant que lead developer me permettrait d'apporter une vision stratégique à ce poste.",
            firstname: "Lucas",
            lastname: "Bernard",
            email: "lucas.bernard@example.com",
            offer_id: 2,
            offer: {
              id: 2,
              title: "Lead Developer",
              description:
                "Nous cherchons un lead developer pour diriger notre équipe technique.",
              company_name: "TechCorp",
              location_id: 1,
              salary: 70000,
              contract_type: "CDI",
              recruiter_id: recruiterId,
              skills: [
                { id: 1, name: "React", level: 5 },
                { id: 5, name: "TypeScript", level: 4 },
                { id: 6, name: "Team Management", level: 4 },
              ],
            },
            user_id: 103,
            user: {
              id: 103,
              username: "Lucas Bernard",
              email: "lucas.bernard@example.com",
              role: "CANDIDATE" as any,
              avatar: "/placeholder.svg?height=100&width=100",
              password: "",
              skills: [
                { id: 1, name: "React", level: 5 },
                { id: 5, name: "TypeScript", level: 5 },
                { id: 6, name: "Team Management", level: 4 },
              ],
            },
            cv: "lucas_bernard_cv.pdf",
            status: Status.REJECTED,
            feedback:
              "Profil intéressant mais nous recherchons quelqu'un avec plus d'expérience en management d'équipe.",
            createdAt: new Date("2025-04-05T09:15:00"),
          },
          {
            id: 4,
            content:
              "Je suis passionnée par le développement mobile et j'ai réalisé plusieurs applications React Native.",
            firstname: "Sophie",
            lastname: "Petit",
            email: "sophie.petit@example.com",
            offer_id: 3,
            offer: {
              id: 3,
              title: "Développeur Mobile",
              description:
                "Nous recherchons un développeur mobile pour créer des applications iOS et Android.",
              company_name: "TechCorp",
              location_id: 1,
              salary: 50000,
              contract_type: "CDD",
              recruiter_id: recruiterId,
              skills: [
                { id: 7, name: "React Native", level: 4 },
                { id: 8, name: "Swift", level: 3 },
                { id: 9, name: "Kotlin", level: 3 },
              ],
            },
            user_id: 104,
            user: {
              id: 104,
              username: "Sophie Petit",
              email: "sophie.petit@example.com",
              role: "CANDIDATE" as any,
              avatar: "/placeholder.svg?height=100&width=100",
              password: "",
              skills: [
                { id: 7, name: "React Native", level: 5 },
                { id: 1, name: "React", level: 4 },
                { id: 8, name: "Swift", level: 3 },
              ],
            },
            cv: "sophie_petit_cv.pdf",
            status: Status.PENDING,
            createdAt: new Date("2025-04-20T16:30:00"),
          },
        ];

        setApplications(mockApplications);
        setFilteredApplications(mockApplications);

        // Extract unique offers
        const uniqueOffers = Array.from(
          new Set(mockApplications.map((app) => app.offer_id)),
        )
          .map((offerId) => {
            return mockApplications.find((app) => app.offer_id === offerId)
              ?.offer;
          })
          .filter(Boolean) as Offer[];

        setOffers(uniqueOffers);
        setIsLoading(false);
      }, 1000);
    };

    fetchApplications();
  }, [recruiterId]);

  // Filter applications based on search term and filters
  useEffect(() => {
    let result = [...applications];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.firstname.toLowerCase().includes(term) ||
          app.lastname.toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term) ||
          app.offer?.title.toLowerCase().includes(term) ||
          app.content.toLowerCase().includes(term),
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Apply offer filter
    if (offerFilter !== "ALL") {
      result = result.filter((app) => app.offer_id === offerFilter);
    }

    setFilteredApplications(result);
  }, [searchTerm, statusFilter, offerFilter, applications]);

  // Handle application status change
  const handleStatusChange = (
    applicationId: number,
    newStatus: Status,
    feedback: string = "",
  ) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus, feedback: feedback || app.feedback }
          : app,
      ),
    );

    // Close detail view after status change
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication((prev) =>
        prev ? { ...prev, status: newStatus, feedback } : null,
      );
    }

    // Show success notification (in a real app)
    console.log(`Application ${applicationId} status changed to ${newStatus}`);
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
    setShowApplicationDetail(true);
    setFeedbackText(application.feedback || "");
  };

  // Close application details
  const closeApplicationDetails = () => {
    setShowApplicationDetail(false);
    setSelectedApplication(null);
    setFeedbackText("");
  };

  // Render skill level
  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`h-2 w-2 rounded-full ${star <= level ? "bg-electric-purple" : "bg-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Candidatures
          </h1>
          <p className="mt-2 text-gray-600">
            Consultez et gérez les candidatures pour vos offres d'emploi
          </p>
        </header>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-md md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat, une offre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-electric-purple focus:outline-none focus:ring-1 focus:ring-electric-purple"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                <Filter size={16} className="text-gray-500" />
                Statut
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === "ALL" ? "bg-purple-50 text-electric-purple" : ""}`}
                >
                  Tous les statuts
                </button>
                <button
                  onClick={() => setStatusFilter(Status.PENDING)}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.PENDING ? "bg-purple-50 text-electric-purple" : ""}`}
                >
                  En attente
                </button>
                <button
                  onClick={() => setStatusFilter(Status.ACCEPTED)}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.ACCEPTED ? "bg-purple-50 text-electric-purple" : ""}`}
                >
                  Acceptées
                </button>
                <button
                  onClick={() => setStatusFilter(Status.REJECTED)}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.REJECTED ? "bg-purple-50 text-electric-purple" : ""}`}
                >
                  Refusées
                </button>
              </div>
            </div>

            {/* Offer Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50">
                <Briefcase size={16} className="text-gray-500" />
                Offre
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={() => setOfferFilter("ALL")}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${offerFilter === "ALL" ? "bg-purple-50 text-electric-purple" : ""}`}
                >
                  Toutes les offres
                </button>
                {offers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => setOfferFilter(offer.id)}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${offerFilter === offer.id ? "bg-purple-50 text-electric-purple" : ""}`}
                  >
                    {offer.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="rounded-xl bg-white shadow-md">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-electric-purple"></div>
              <span className="ml-2 text-gray-600">
                Chargement des candidatures...
              </span>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Briefcase size={48} className="mb-4 text-gray-300" />
              <p className="text-gray-500">
                Aucune candidature ne correspond à vos critères
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-purple-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              src={
                                application.user?.avatar ||
                                "/placeholder.svg?height=40&width=40"
                              }
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
                            <div className="text-sm text-gray-500">
                              {application.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.offer?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.offer?.company_name}
                        </div>
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
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  Status.ACCEPTED,
                                )
                              }
                              className="mr-3 text-green-600 hover:text-green-800"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application.id,
                                  Status.REJECTED,
                                )
                              }
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
          {showApplicationDetail && selectedApplication && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-xl"
              >
                <button
                  onClick={closeApplicationDetails}
                  className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                  {/* Left Column - Candidate Info */}
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                      <div className="relative mb-4 h-24 w-24">
                        <Image
                          src={
                            selectedApplication.user?.avatar ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt={`${selectedApplication.firstname} ${selectedApplication.lastname}`}
                          width={96}
                          height={96}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-md">
                          {getStatusBadge(selectedApplication.status)}
                        </div>
                      </div>

                      <h3 className="mb-1 text-xl font-bold text-gray-900">
                        {selectedApplication.firstname}{" "}
                        {selectedApplication.lastname}
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        {selectedApplication.email}
                      </p>

                      <div className="mt-2 flex w-full flex-col gap-3">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-electric-purple bg-white px-4 py-2 text-sm font-medium text-electric-purple transition-colors hover:bg-electric-purple hover:text-white"
                        >
                          <Download size={16} />
                          Télécharger le CV
                        </a>

                        {selectedApplication.status === Status.PENDING && (
                          <div className="mt-2 grid w-full grid-cols-2 gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  selectedApplication.id,
                                  Status.ACCEPTED,
                                  feedbackText,
                                )
                              }
                              className="flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                            >
                              <CheckCircle size={16} />
                              Accepter
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  selectedApplication.id,
                                  Status.REJECTED,
                                  feedbackText,
                                )
                              }
                              className="flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            >
                              <XCircle size={16} />
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 w-full">
                        <h4 className="mb-2 text-left text-sm font-medium text-gray-700">
                          Compétences
                        </h4>
                        <div className="space-y-2">
                          {selectedApplication.user?.skills?.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                            >
                              <span className="text-sm">{skill.name}</span>
                              {renderSkillLevel(skill.level)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Application Details */}
                  <div className="md:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                          Détails de la candidature
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          {formatDate(selectedApplication.createdAt)}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="mb-6 rounded-lg bg-purple-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            {selectedApplication.offer?.title}
                          </h4>
                          <span className="rounded-full bg-electric-purple px-3 py-1 text-xs font-medium text-white">
                            {selectedApplication.offer?.contract_type}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {selectedApplication.offer?.company_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Salaire:{" "}
                          {selectedApplication.offer?.salary.toLocaleString()}{" "}
                          €/an
                        </p>

                        {/* Skills required */}
                        <div className="mt-4">
                          <h5 className="mb-2 text-sm font-medium text-gray-700">
                            Compétences requises
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.offer?.skills?.map((skill) => (
                              <span
                                key={skill.id}
                                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-electric-purple shadow-sm"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Motivation */}
                      <div className="mb-6">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Lettre de motivation
                        </h4>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                          <p>{selectedApplication.content}</p>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          {selectedApplication.status === Status.PENDING
                            ? "Ajouter un retour"
                            : "Retour"}
                        </h4>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          {selectedApplication.status === Status.PENDING ? (
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Ajoutez un commentaire ou un retour pour le candidat..."
                              className="h-32 w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:border-electric-purple focus:outline-none focus:ring-1 focus:ring-electric-purple"
                            />
                          ) : (
                            <div className="flex items-start gap-3">
                              <MessageSquare
                                size={18}
                                className="mt-0.5 text-gray-400"
                              />
                              <p className="text-sm text-gray-700">
                                {selectedApplication.feedback ||
                                  "Aucun retour fourni."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
