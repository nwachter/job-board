// components/auth/SignInForm.tsx
"use client";

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { CardHeader, CardContent } from '@/components/ui/card'; // Assuming these are styled card components
import FormField from './FormField';
import AuthAlert from './AuthAlert';
import { useLogin } from '../../hooks/useAuth'; // Adjust path as needed
import { useRouter } from 'next/navigation';

type SignInFormProps = {
    onToggleMode: () => void;
};

const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '', form: '' });
    const [alert, setAlert] = useState<{ type: 'success' | 'danger' | '', message: string }>({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { mutateAsync: login } = useLogin();
    const router = useRouter();

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '', form: '' };

        if (!email.trim()) {
            newErrors.email = 'L\'adresse email est requise.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Format d\'email invalide.';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Le mot de passe est requis.';
            isValid = false;
        }
        // Add more password validation if needed (e.g., length)

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlert({ type: '', message: '' }); // Clear previous alerts
        setErrors({ email: '', password: '', form: '' }); // Clear previous errors

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const data = await login({ email, password });

            if (data?.user) {
                const userInfo = {
                    id: data.user.id,
                    role: data.user.role,
                    username: data.user.username,
                    email: data.user.email,
                };
                localStorage.setItem("jobboard_user_info", JSON.stringify(userInfo));
                // Token should be handled by HttpOnly cookie from backend

                setAlert({ type: 'success', message: 'Connexion réussie. Redirection...' });
                setTimeout(() => {
                    router.push('/dashboard'); // Redirect to dashboard or desired page
                }, 1500);

            } else {
                 // Use error message from backend if available, otherwise generic
                 const errorMessage = data?.message || "L'email ou le mot de passe est incorrect.";
                 setErrors(prev => ({ ...prev, form: errorMessage }));
                 setAlert({ type: 'danger', message: errorMessage });
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
            setErrors(prev => ({ ...prev, form: errorMessage }));
            setAlert({ type: 'danger', message: errorMessage });
        } finally {
            // Only stop loading if not redirecting immediately
             if (!alert.type || alert.type !== 'success') {
                 setIsLoading(false);
             }
        }
    };

    return (
        <>
            <CardHeader className="text-center pb-4">
                <h1 className="text-2xl font-merriweather-sans font-bold mb-1">
                    Connexion
                </h1>
                <p className="text-sm text-gray-600 font-dm-sans">
                    Entrez vos identifiants pour accéder à votre compte.
                </p>
            </CardHeader>
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} method="POST" className="space-y-5">
                    {/* Display form-level errors or general alerts */}
                    {alert.type && <AuthAlert type={alert.type} message={alert.message} />}

                    <FormField
                        icon={<Mail />}
                        type="email"
                        name="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
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
                        onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                        error={errors.password}
                        disabled={isLoading}
                        aria-label="Mot de passe"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <ArrowRight size={20} className="mr-2 order-last ml-2" /> // Use mr-2 to space icon, order-last/ml-2 for right side
                        )}
                        <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
                    </button>
                    <div className="text-center pt-2"> {/* Adjusted spacing */}
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <button
                                type="button"
                                onClick={onToggleMode}
                                disabled={isLoading}
                                className="font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:underline disabled:opacity-70"
                            >
                                S'inscrire
                            </button>
                        </p>
                    </div>
                </form>
            </CardContent>
        </>
    );
};

export default SignInForm;