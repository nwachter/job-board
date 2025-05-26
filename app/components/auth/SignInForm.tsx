// components/auth/SignInForm.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, CircleAlert } from "lucide-react";
import { CardHeader, CardContent } from "@/components/ui/card"; // Assuming these are styled card components
import FormField from "./FormField";
import AuthAlert from "./AuthAlert";
import { useLogin } from "../../hooks/useAuth"; // Adjust path as needed
import { useRouter } from "next/navigation";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";

type SignInFormProps = {
  onToggleMode: () => void;
  chosenRole: "user" | "recruiter";
};

const SignInForm: React.FC<SignInFormProps> = ({
  onToggleMode,
  chosenRole,
}) => {
  const { data: userInfo } = useGetUserInfo();
  const userRole = useMemo(() => userInfo?.role, [userInfo]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", form: "" });
  const [alert, setAlert] = useState<{
    type: "success" | "danger" | "";
    message: string;
  }>({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (userRole) {
      router.push("/");
    }
  }, [userRole, router]);

  useEffect(() => {
    console.log(chosenRole);
  }, [chosenRole]);

  const validateForm = () => {
    let isValid = true;

    const newErrors = { email: "", password: "", form: "" };

    if (!email.trim()) {
      newErrors.email = "L'adresse email est requise.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis.";
      isValid = false;
    }
    // Add more password validation if needed (e.g., length)

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: "", message: "" }); // Clear previous alerts
    setErrors({ email: "", password: "", form: "" }); // Clear previous errors

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await login({ email, password });

      if (data) {
        const userInfo = {
          id: data.id,
          role: data.role,
          username: data.username,
          email: data.email,
        };
        localStorage.setItem("jobboard_user_info", JSON.stringify(userInfo));
        // Token should be handled by HttpOnly cookie from backend

        setAlert({
          type: "success",
          message: "Connexion réussie. Redirection...",
        });
        setTimeout(() => {
          router.push("/dashboard"); // Redirect to dashboard or desired page
        }, 1500);
      } else {
        // Use error message from backend if available, otherwise generic
        const errorMessage = "L'email ou le mot de passe est incorrect.";
        setErrors((prev) => ({ ...prev, form: errorMessage }));
        setAlert({ type: "danger", message: errorMessage });
      }
    } catch (error: Error | unknown) {
      console.error("Login Error:", error);
      const errorMessage =
        (error as Error & { response?: { data?: { message?: string } } })
          .response?.data?.message ||
        "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
      setErrors((prev) => ({ ...prev, form: errorMessage }));
      setAlert({ type: "danger", message: errorMessage });
    } finally {
      // Only stop loading if not redirecting immediately
      if (!alert.type || alert.type !== "success") {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <CardHeader className="pb-4 text-center">
        <h1 className="mb-1 font-merriweather-sans text-2xl font-bold">
          Connexion
        </h1>
        <p className="font-dm-sans text-sm text-gray-600">
          Entrez vos identifiants pour accéder à votre compte.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        {!userRole ? (
          <form onSubmit={handleSubmit} method="POST" className="space-y-5">
            {/* Display form-level errors or general alerts */}
            {alert.type && (
              <AuthAlert type={alert.type} message={alert.message} />
            )}

            <FormField
              icon={<Mail />}
              type="email"
              name="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
              disabled={isLoading}
              aria-label="Adresse email"
            />
            <FormField
              icon={<Lock />}
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
              disabled={isLoading}
              aria-label="Mot de passe"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 size={20} className="mr-2 animate-spin" />
              ) : (
                <ArrowRight size={20} className="order-last ml-2 mr-2" /> // Use mr-2 to space icon, order-last/ml-2 for right side
              )}
              <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
            </button>
            <div className="pt-2 text-center">
              {" "}
              {/* Adjusted spacing */}
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  disabled={isLoading}
                  className="font-medium text-purple-600 hover:text-purple-700 focus:underline focus:outline-none disabled:opacity-70"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </form>
        ) : (
          <div className="flex w-full justify-center rounded-xl border-[1px] border-electric-purple/20 bg-eggplant/10 px-4 py-2 font-medium text-electric-purple">
            <CircleAlert className="mr-2 h-6 w-6 rounded-full bg-white/50" />
            Vous êtes déjà connecté !
          </div>
        )}
      </CardContent>
    </>
  );
};

export default SignInForm;
