"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Building2,
  Send,
  Share2,
  BookmarkPlus,
  Users,
  Plus,
} from "lucide-react";
import type { Offer } from "@/app/types/offer";
import { motion, AnimatePresence } from "framer-motion";
import NewApplication from "./NewApplication";

interface OfferDetailProps {
  offer: Partial<Offer>;
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer }) => {
  const router = useRouter();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "Date non disponible";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `Offre d'emploi: ${offer.title} chez ${offer.company_name}`;

    let shareUrl = "";

    switch (platform) {
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Découvrez cette offre d'emploi: ${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }

    setIsShareMenuOpen(false);
  };

  return (
    <div className="h-full w-full px-6">
      <div className="flex h-full w-full flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl rounded-xl bg-white p-8 text-black shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-electric-purple transition-colors hover:text-electric-purple/80"
            >
              <ArrowLeft className="mr-2" />
              Retour aux offres
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="relative rounded-full p-2 transition-colors hover:bg-slate-100"
              >
                <Share2 size={20} className="text-slate-600" />

                <AnimatePresence>
                  {isShareMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg"
                    >
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex w-full items-center px-4 py-2 text-left hover:bg-slate-100"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-[#0077B5]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                        </svg>
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex w-full items-center px-4 py-2 text-left hover:bg-slate-100"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-[#1DA1F2]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                        </svg>
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex w-full items-center px-4 py-2 text-left hover:bg-slate-100"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-[#1877F2]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"></path>
                        </svg>
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("email")}
                        className="flex w-full items-center px-4 py-2 text-left hover:bg-slate-100"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                        Email
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
                <BookmarkPlus size={20} className="text-slate-600" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-electric-purple/10">
                <Building2 size={24} className="text-electric-purple" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{offer.title}</h1>
                <p className="text-slate-600">{offer.company_name}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {offer?.location?.city && (
                <div className="flex items-center rounded-lg bg-slate-50 p-3">
                  <MapPin className="mr-3 text-electric-purple" size={20} />
                  <div>
                    <p className="text-sm text-slate-500">Localisation</p>
                    <p className="font-medium">
                      {offer.location?.city}, {offer.location?.country}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center rounded-lg bg-slate-50 p-3">
                <Briefcase className="mr-3 text-electric-purple" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Type de contrat</p>
                  <p className="font-medium">{offer.contract_type}</p>
                </div>
              </div>

              <div className="flex items-center rounded-lg bg-slate-50 p-3">
                <DollarSign className="mr-3 text-electric-purple" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Salaire</p>
                  <p className="font-medium">{offer.salary} € / an</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center text-sm text-slate-500">
              <Calendar size={16} className="mr-1" />
              <span>Publié le {formatDate(offer.createdAt)}</span>

              {offer.applications && (
                <>
                  <span className="mx-2">•</span>
                  <Users size={16} className="mr-1" />
                  <span>
                    {offer.applications.length} candidature
                    {offer.applications.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Description du poste</h2>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line">{offer.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">À propos de l'entreprise</h2>
            <div className="prose prose-slate max-w-none">
              <p>
                {offer.company_name} est une entreprise dynamique et innovante
                dans son secteur. Rejoignez notre équipe pour participer à des
                projets passionnants et évoluer dans un environnement stimulant.
              </p>
            </div>
          </div>

          {offer?.skills && offer.skills.length > 0 && (
            <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-slate-200">
              <h2 className="border-b border-slate-100 px-4 py-2 text-lg font-bold">
                Competences requises
              </h2>
              {offer?.skills?.length > 0 ? (
                <div className="flex gap-1 px-4 py-2">
                  {offer?.skills?.map((skill, i) => (
                    <span
                      key={`skill-${skill.id}`}
                      className="hover:shadow-electric-purple-50 flex w-fit items-center justify-center rounded-3xl border border-slate-200 bg-electric-purple/5 px-4 py-2 text-left transition-all hover:bg-electric-purple hover:text-white hover:shadow-md"
                    >
                      {typeof skill === "object" &&
                        skill?.name !== undefined && <span>{skill?.name}</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500">
                  Aucune compétence trouvée
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsApplicationOpen(true)}
              className="flex items-center rounded-lg bg-electric-purple px-8 py-3 text-white shadow-md transition-colors hover:bg-electric-purple/90"
            >
              <Send size={18} className="mr-2" />
              Postuler maintenant
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isApplicationOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            >
              <div className="w-full max-w-4xl">
                {offer.id && (
                  <NewApplication
                    offer_id={offer.id}
                    onCancel={() => setIsApplicationOpen(false)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OfferDetail;
