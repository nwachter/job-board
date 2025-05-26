import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowRight,
  File,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { OfferSkillsSelector } from "@/app/components/general/SkillSelector";
import { useCreateSkill, useGetSkills } from "@/app/hooks/useSkills";
import { Skill } from "@/app/types/skill";
import { useCreateLocation, useGetLocations } from "@/app/hooks/useLocations";
import { useCreateOffer } from "@/app/hooks/useOffers";
import { Location } from "@/app/types/location";

// Define the Offer type based on your Prisma schema
interface Offer {
  id?: number;
  title: string;
  description: string;
  company_name: string;
  location_id: number;
  salary: number;
  contract_type: string;
  recruiter_id: number;
  skills?: Skill[];
}

export type CreateOfferFormInputs = {
  [key: string]: string | number | FileList | string[] | number[];
};

type FormErrors = {
  title: string | null;
  description: string | null;
  company_name: string | null;
  salary: string | null;
  contract_type: string | null;
  city: string | null;
  country: string | null;
  skills: string | null;
};

type CreateNewOfferProps = {
  title: string;
  description: string;
};

export const CreateNewOffer: React.FC<CreateNewOfferProps> = ({
  title,
  description,
}) => {
  const { data: userInfo } = useGetUserInfo();
  const recruiterId = userInfo?.id ?? "";
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<{ name: string }[]>([]);
  const [inputs, setInputs] = useState<CreateOfferFormInputs>({
    title: "",
    description: "",
    company_name: "",
    salary: 0,
    contract_type: "",
    city: "",
    country: "France", // Default as per schema
    skills: [],
  });

  const [errors, setErrors] = useState<FormErrors>({
    title: null,
    description: null,
    company_name: null,
    salary: null,
    contract_type: null,
    city: null,
    country: null,
    skills: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const { data: skills = [], isLoading: isLoadingSkills } = useGetSkills();
  const { data: locations = [], isLoading: isLoadingLocations } =
    useGetLocations();

  const createSkillMutation = useCreateSkill();
  const createOfferMutation = useCreateOffer();
  const createLocationMutation = useCreateLocation();

  const [offerSkillsList, setOfferSkillsList] = useState<Omit<Skill, "id">[]>(
    [],
  );

  const handleSkillsChange = (skillsData: Omit<Skill, "id">[]) => {
    setOfferSkillsList(skillsData);
    setSelectedSkills(skillsData.map((skill) => ({ name: skill.name })));
    setErrors((prev) => ({ ...prev, skills: null }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      title: !inputs.title ? "Title is required" : null,
      description: !inputs.description ? "Description is required" : null,
      company_name: !inputs.company_name ? "Company name is required" : null,
      salary: !inputs.salary ? "Salary is required" : null,
      contract_type: !inputs.contract_type ? "Contract type is required" : null,
      city: !inputs.city ? "City is required" : null,
      country: !inputs.country ? "Country is required" : null,
      skills:
        selectedSkills.length === 0 ? "At least one skill is required" : null,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sent Data : ", inputs);
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsToCreate = selectedSkills.filter(
        (skill) => !skills.find((s) => s.name === skill.name),
      );

      console.log("skillsToCreate", skillsToCreate);

      const existingSkills = skills.filter((skill) =>
        selectedSkills.find((s) => s.name === skill.name),
      );

      console.log("existingSkills", existingSkills);
      // Create or get skills that don't already exist in the database (@unique constraint)
      const uploadedSkills = await Promise.all(
        skillsToCreate.map(async (skillToCreate) => {
          return await createSkillMutation.mutateAsync({ data: skillToCreate });
        }),
      );

      const offerSkills: Skill[] = { ...uploadedSkills, ...existingSkills };

      // Create location
      const formLocationData: Omit<Location, "id"> = {
        city: String(inputs.city),
        country: String(inputs.country),
      };
      const existingLocation = locations.find(
        (location) =>
          location.city === formLocationData.city &&
          location.country === formLocationData.country,
      );

      let createdLocation: Location | undefined = undefined;
      if (!existingLocation) {
        createdLocation = await createLocationMutation.mutateAsync({
          data: formLocationData,
        });
      }
      const offerLocation = createdLocation
        ? createdLocation
        : existingLocation;
      console.log("offerLocation", offerLocation);
      if (!offerLocation || !offerLocation.id) {
        throw new Error("Failed to create location or location ID is missing");
      }

      const locationId = offerLocation.id;

      // Create offer
      const offerData: Omit<Offer, "id"> = {
        title: String(inputs.title),
        description: String(inputs.description), // Fixed from title to description
        company_name: String(inputs.company_name),
        location_id: Number(locationId),
        salary: Number(inputs.salary),
        contract_type: String(inputs.contract_type),
        recruiter_id: Number(recruiterId),
      };

      if (offerSkills && offerSkills.length > 0) {
        offerData.skills = offerSkills; //testerror
      }

      const offer = await createOfferMutation.mutateAsync({ data: offerData });

      if (offer) {
        setAlertMessage({
          type: "success",
          message: "Offer created successfully!",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage({
        type: "error",
        message: "Server error, please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center rounded-ss-3xl font-dm-sans">
      <Card className="mx-auto my-auto w-full max-w-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2 text-center">
          <h1 className="mb-2 font-merriweather-sans text-2xl font-bold">
            {title}
          </h1>
          <p className="font-dm-sans text-gray-600">{description}</p>
          {alertMessage.type && (
            <div
              className={`mt-4 rounded p-3 ${
                alertMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              role="alert"
            >
              <span className="font-semibold">
                {alertMessage.type === "success" ? "Success" : "Error"}:
              </span>{" "}
              {alertMessage.message}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} method="POST" className="space-y-4">
            {/* Title input */}
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Titre de l'offre*
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <File size={18} />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter job title"
                  value={inputs.title as string}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description input */}
            <div className="flex flex-col">
              <label
                htmlFor="description"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Description*
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter job description"
                  value={inputs.description as string}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Company Name input */}
            <div className="flex flex-col">
              <label
                htmlFor="company_name"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Nom de l'entreprise*
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Building size={18} />
                </div>
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  placeholder="Enter company name"
                  value={inputs.company_name as string}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.company_name}
                </p>
              )}
            </div>

            {/* Location inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="city"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Ville*
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter city"
                    value={inputs.city as string}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="country"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Pays*
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Enter country"
                    value={inputs.country as string}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                )}
              </div>
            </div>

            {/* Salary input */}
            <div className="flex flex-col">
              <label
                htmlFor="salary"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Salaire (€)*
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={18} />
                </div>
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  placeholder="Enter salary"
                  value={inputs.salary as number}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {errors.salary && (
                <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
              )}
            </div>

            {/* Contract Type input */}
            <div className="flex flex-col">
              <label
                htmlFor="contract_type"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Type de contrat*
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Briefcase size={18} />
                </div>
                <select
                  name="contract_type"
                  id="contract_type"
                  value={inputs.contract_type as string}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(e)
                  }
                  className="w-full appearance-none rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sélectionner le type de contrat</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Stage</option>
                  <option value="Apprenticeship">Alternance</option>
                </select>
              </div>
              {errors.contract_type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.contract_type}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Compétences requises*
              </label>
              <OfferSkillsSelector
                existingSkills={skills ?? []}
                onSkillsChange={handleSkillsChange}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-purple-600 py-2.5 text-white transition-colors hover:bg-purple-700 disabled:bg-purple-300"
            >
              <span>{isSubmitting ? "En cours..." : "Créer une offre"}</span>
              {!isSubmitting && <ArrowRight size={20} className="ml-2" />}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewOffer;
