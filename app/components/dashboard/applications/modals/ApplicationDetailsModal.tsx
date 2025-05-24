import { formatDate } from "date-fns";
import { motion } from "motion/react";
import {
  XCircle,
  Download,
  CheckCircle,
  Calendar,
  MessageSquare,
} from "lucide-react";
import React, { JSX, useState } from "react";
import Image from "next/image";
import { Skill } from "@/app/types/skill";
import { Status } from "@/app/types/application";

type ApplicationDetailsModalProps = {
  onClose: () => void;
  selectedApplication: any;
  getStatusBadge: (status: Status) => JSX.Element | null;
  handleStatusChange: (
    applicationId: number,
    newStatus: Status,
    feedback: string,
  ) => void;
  formatDate: (dateString?: Date) => string;
  renderSkillLevel: (level: number) => JSX.Element;
};
export const ApplicationDetailsModal: React.FC<
  ApplicationDetailsModalProps
> = ({
  onClose,
  selectedApplication,
  getStatusBadge,
  handleStatusChange,
  formatDate,
  renderSkillLevel,
}) => {
  const [feedbackText, setFeedbackText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-xl"
      >
        <button
          onClick={onClose}
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
                {selectedApplication.firstname} {selectedApplication.lastname}
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
                  {selectedApplication.user?.skills?.map((skill: Skill) => (
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
                  Salaire: {selectedApplication.offer?.salary.toLocaleString()}{" "}
                  €/an
                </p>

                {/* Skills required */}
                <div className="mt-4">
                  <h5 className="mb-2 text-sm font-medium text-gray-700">
                    Compétences requises
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.offer?.skills?.map((skill: Skill) => (
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
                        {selectedApplication.feedback || "Aucun retour fourni."}
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
  );
};

export default ApplicationDetailsModal;
