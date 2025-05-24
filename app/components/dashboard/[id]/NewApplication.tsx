"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FileText, User, Mail, Send, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { createApplication } from "@/app/services/applications";
import { uploadPdfFile } from "@/app/services/upload";
import { motion, AnimatePresence } from "framer-motion";
import { Status } from "@/app/types/application";

export type FormInputs = {
  firstname: string;
  lastname: string;
  email: string;
  content: string;
  cv: FileList | null;
};


type NewApplicationProps = {
  offer_id: number;
  onCancel: () => void;
};

const NewApplication: React.FC<NewApplicationProps> = ({
  offer_id,
  onCancel,
}) => {
  const [inputs, setInputs] = useState<FormInputs>({
    firstname: "",
    lastname: "",
    email: "",
    content: "",
    cv: null,
  });
  const [errors, setErrors] = useState<Partial<FormInputs>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const { data: userInfo } = useGetUserInfo();
  const router = useRouter();


  useEffect(() => {
    // Pre-fill form with user info if available
    if (userInfo) {
      const nameParts = userInfo.username?.split(" ") || ["", ""];
      setInputs((prev) => ({
        ...prev,
        firstname: nameParts[0] || "",
        lastname: nameParts[1] || "",
        email: userInfo.email || "",
      }));
    }
  }, [userInfo]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormInputs> = {};

    if (!inputs.firstname.trim()) {
      newErrors.firstname = "Le prénom est requis";
    }

    if (!inputs.lastname.trim()) {
      newErrors.lastname = "Le nom est requis";
    }

    if (!inputs.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!inputs.content.trim()) {
      newErrors.content = "Veuillez ajouter une lettre de motivation";
    }

    // if (!inputs.cv || inputs.cv.length === 0) {
    //   newErrors.cv = "Veuillez joindre votre CV"
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setInputs((prev) => ({ ...prev, cv: e.target.files as FileList }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userId = userInfo?.id;

      if (!userId) {
        throw new Error("Vous devez être connecté pour postuler");
      }

      let fileLink = "";
      if (inputs.cv) {
        fileLink = await uploadPdfFile(inputs.cv);
        if (!fileLink) {
          throw new Error("Erreur lors de l'upload du CV");
        }
      }

      const applicationData = {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        content: inputs.content,
        email: inputs.email,
        user_id: Number(userId),
        offer_id: Number(offer_id),
        cv: fileLink,
        status: Status.PENDING,
      };

      const application = await createApplication(applicationData);

      if (application) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'envoi de votre candidature",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mx-auto w-full max-w-3xl rounded-xl bg-white p-8 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Postuler à cette offre
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 transition-colors hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-start rounded-lg bg-green-50 p-4 text-green-800"
          >
            <div className="mr-3 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Send size={16} className="text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium">Candidature envoyée avec succès!</h3>
              <p className="mt-1 text-sm">
                Votre candidature a bien été enregistrée. Vous serez redirigé
                vers le tableau de bord.
              </p>
            </div>
          </motion.div>
        )}

        {submitError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-start rounded-lg bg-red-50 p-4 text-red-800"
          >
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Erreur lors de l'envoi</h3>
              <p className="mt-1 text-sm">{submitError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="firstname"
                value={inputs.firstname}
                onChange={(e) =>
                  setInputs({ ...inputs, firstname: e.target.value })
                }
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 ${
                  errors.firstname
                    ? "border-red-300 ring-red-500"
                    : "border-gray-300 focus:ring-electric-purple"
                } text-eggplant/70 transition-all placeholder:text-eggplant/40 focus:outline-none focus:ring-2`}
                placeholder="Votre prénom"
              />
            </div>
            {errors.firstname && (
              <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="lastname"
                value={inputs.lastname}
                onChange={(e) =>
                  setInputs({ ...inputs, lastname: e.target.value })
                }
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 ${
                  errors.lastname
                    ? "border-red-300 ring-red-500"
                    : "border-gray-300 focus:ring-electric-purple"
                } text-eggplant/70 transition-all placeholder:text-eggplant/40 focus:outline-none focus:ring-2`}
                placeholder="Votre nom"
              />
            </div>
            {errors.lastname && (
              <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 ${
                errors.email
                  ? "border-red-300 ring-red-500"
                  : "border-gray-300 focus:ring-electric-purple"
              } text-eggplant/70 transition-all placeholder:text-eggplant/40 focus:outline-none focus:ring-2`}
              placeholder="Votre adresse email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Lettre de motivation
          </label>
          <div className="relative">
            <textarea
              name="content"
              value={inputs.content}
              onChange={(e) =>
                setInputs({ ...inputs, content: e.target.value })
              }
              rows={6}
              className={`w-full rounded-lg border px-4 py-2.5 ${
                errors.content
                  ? "border-red-300 ring-red-500"
                  : "border-gray-300 focus:ring-electric-purple"
              } text-eggplant/70 transition-all placeholder:text-eggplant/40 focus:outline-none focus:ring-2`}
              placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par ce poste..."
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            CV (PDF)
          </label>
          <div
            className={`rounded-lg border-2 border-dashed p-6 ${
              errors.cv
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-electric-purple"
            } cursor-pointer transition-colors`}
          >
            <input
              type="file"
              name="cv"
              id="cv"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="cv"
              className="flex cursor-pointer flex-col items-center"
            >
              <FileText
                size={36}
                className={errors.cv ? "text-red-500" : "text-electric-purple"}
              />
              <p className="mt-2 text-sm text-gray-600">
                {selectedFile
                  ? selectedFile.name
                  : "Cliquez pour sélectionner votre CV (format PDF)"}
              </p>
              <p className="mt-1 text-xs text-gray-500">Taille maximale: 5MB</p>
            </label>
          </div>
          {/* {errors.cv && <p className="mt-1 text-sm text-red-600">{errors.cv}</p>} */}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center rounded-lg bg-electric-purple px-6 py-2.5 text-white transition-colors hover:bg-electric-purple/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Envoyer ma candidature
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewApplication;
