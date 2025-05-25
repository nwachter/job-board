// components/auth/SignUpForm.tsx
"use client";

import React, { useState } from "react";
import { Mail, Lock, UserIcon, ArrowRight, Loader2 } from "lucide-react";
import { CardHeader, CardContent } from "@/components/ui/card";
import FormField from "./FormField";
import AuthAlert from "./AuthAlert";
import { useRegister } from "../../hooks/useAuth"; // Adjust path as needed
import { Checkbox } from "../ui/Checkbox";

import { Role, User } from "@/app/types/user";

type SignUpFormProps = {
  onToggleMode: () => void;
  chosenRole: "user" | "recruiter";
};

// Validation function (can be moved to a utils file)
const validateInput = (name: string, value: string, inputs: any = {}) => {
  const rules = {
    username: {
      min: 3,
      max: 20,
      regex: /^[a-zA-Z0-9]+$/,
      message: "doit contenir 3-20 caractères alphanumériques.",
    },
    email: {
      min: 5,
      max: 100,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "doit être une adresse email valide.",
    },
    password: {
      min: 8,
      max: 30,
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      message:
        "doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
    },
    password_confirmation: {
      min: 8,
      max: 30,
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      message: "doit correspondre au mot de passe.",
    },
  };

  const fieldRule = rules[name as keyof typeof rules];
  if (!fieldRule) return "";

  const translatedName =
    name === "password"
      ? "Le mot de passe"
      : name === "password_confirmation"
        ? "La confirmation"
        : `Le ${name}`;

  if (value.length < fieldRule.min)
    return `${translatedName} ${name === "password_confirmation" ? "de passe " : ""}doit contenir au moins ${fieldRule.min} caractères.`;
  if (value.length > fieldRule.max)
    return `${translatedName} ${name === "password_confirmation" ? "de passe " : ""}doit contenir au plus ${fieldRule.max} caractères.`;
  if (!fieldRule.regex.test(value))
    return `${translatedName} ${fieldRule.message}`;
  if (name === "password_confirmation" && value !== inputs.password)
    return "Les mots de passe ne correspondent pas.";

  return "";
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  onToggleMode,
  chosenRole = "user",
}) => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: chosenRole === "recruiter" ? Role.RECRUITER : Role.USER,
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    form: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "";
    message: string;
  }>({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: register } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    // Validate on change and clear error for the specific field
    const error = validateInput(name, value, inputs);
    setErrors((prev) => ({ ...prev, [name]: error, form: "" })); // Clear form error on field change
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      form: "",
    };

    for (const key in inputs) {
      if (key === "role") {
        return isValid;
      }
      const error = validateInput(
        key,
        String(inputs[key as keyof typeof inputs] ?? ""),
        inputs,
      );
      if (error) {
        newErrors[key as keyof typeof newErrors] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" }); // Clear previous alerts

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const dataToSend: Omit<
      User,
      "id" | "applications" | "offers" | "createdAt" | "updatedAt"
    > = {
      avatar: "", // Default or handle later
      email: inputs.email,
      password: inputs.password,
      username: inputs.username,
      role: inputs.role ? (inputs.role as Role) : Role.USER,
    };

    try {
      const data = await register({ data: dataToSend });

      if (data?.username) {
        setAlert({
          type: "success",
          message:
            "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        });
        // Optionally clear form or toggle to sign in after a delay
        setTimeout(() => {
          onToggleMode(); // Switch to Sign In view
        }, 2000);
        // Reset form fields after successful submission maybe?
        // setInputs({ username: '', email: '', password: '', password_confirmation: '' });
      } else {
        const errorMessage = "Une erreur est survenue lors de l'inscription.";
        setErrors((prev) => ({ ...prev, form: errorMessage }));
        setAlert({ type: "danger", message: errorMessage });
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      // Check for specific backend validation errors (e.g., email already exists)
      let errorMessage =
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      if (error.response?.data?.errors) {
        // Example: If backend returns { errors: { email: ["Email already taken"] } }
        const backendErrors = error.response.data.errors;
        const firstErrorField = Object.keys(backendErrors)[0];
        errorMessage = backendErrors[firstErrorField][0] || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      if (!alert.type || alert.type !== "success") {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <CardHeader className="pb-4 text-center">
        <h1 className="mb-1 font-merriweather-sans text-2xl font-bold">
          Créer un compte
        </h1>
        <p className="font-dm-sans text-sm text-gray-600">
          Renseignez vos informations pour rejoindre la communauté.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} method="POST" className="space-y-5">
          {alert.type && (
            <AuthAlert type={alert.type} message={alert.message} />
          )}

          <FormField
            icon={<UserIcon />}
            type="text"
            name="username"
            placeholder="Pseudo"
            value={inputs.username}
            onChange={handleChange}
            error={errors.username}
            disabled={isLoading}
            aria-label="Pseudo"
          />
          <FormField
            icon={<Mail />}
            type="email"
            name="email"
            placeholder="Adresse email"
            value={inputs.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
            aria-label="Adresse email"
          />
          <FormField
            icon={<Lock />}
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={inputs.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            aria-label="Mot de passe"
          />
          <FormField
            icon={<Lock />}
            type="password"
            name="password_confirmation"
            placeholder="Confirmer le mot de passe"
            value={inputs.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            disabled={isLoading}
            aria-label="Confirmer le mot de passe"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="role_user" className="mr-4 flex items-center gap-2">
              <Checkbox
                id="role_user"
                checked={inputs.role === Role.USER}
                onCheckedChange={(checked) =>
                  setInputs((prev) => ({
                    ...prev,
                    role: checked ? Role.USER : Role.RECRUITER,
                  }))
                }
                name={Role.USER}
                className="border-electric-purple/30 data-[state=checked]:bg-electric-purple data-[state=checked]:text-white"
                value={Role.USER}
              />
              Candidat
            </label>
            <label htmlFor="role_recruiter" className="flex items-center gap-2">
              <Checkbox
                id="role_recruiter"
                checked={inputs.role === Role.RECRUITER}
                onCheckedChange={(checked) =>
                  setInputs((prev) => ({
                    ...prev,
                    role: checked ? Role.RECRUITER : Role.USER,
                  }))
                }
                name={Role.RECRUITER}
                className="border-electric-purple/30 data-[state=checked]:bg-electric-purple data-[state=checked]:text-white"
                value={Role.RECRUITER}
              />
              Recruteur
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <ArrowRight size={20} className="order-last ml-2 mr-2" />
            )}
            <span>{isLoading ? "Création..." : "Créer mon compte"}</span>
          </button>
          <div className="pt-2 text-center">
            <p className="text-sm text-gray-600">
              Déjà inscrit ?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                disabled={isLoading}
                className="font-medium text-purple-600 hover:text-purple-700 focus:underline focus:outline-none disabled:opacity-70"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </>
  );
};

export default SignUpForm;
