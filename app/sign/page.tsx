// "use client";

// import React, { useEffect, useState } from 'react';
// import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { useRouter } from 'next/navigation';
// import { useLogin, useRegister } from '../hooks/useAuth';

// type FormFieldProps = {
//     icon: React.ReactNode;
//     error?: string;
//     setInputs:
//      React.Dispatch<React.SetStateAction<{
//         email: string,
//         password: string,
//         password_confirmation: string,
//         username: string
//     }>>
// } & React.InputHTMLAttributes<HTMLInputElement>;

// export const FormField: React.FC<FormFieldProps> = ({ icon, error, setInputs, ...props }) => (
//     <div className="flex flex-col">
//         <div className="relative">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 {icon}
//             </div>
//             <input
//                 {...props}
//                 onChange={e => setInputs((prev: any) => ({...prev, [e.target.name]: e.target.value}))}
//                 className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//             />
//         </div>
//         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
// );

// const SignPages = () => {

//  const { mutateAsync: login } = useLogin();
//  const { mutateAsync: register } = useRegister();

//     const [isSignUp, setIsSignUp] = useState(true);
//     const [inputs, setInputs] = useState({
//         email: "",
//         password: "",
//         password_confirmation: "",
//         // firstname: "",
//         // lastname: "",
//         username: ""
//     });
//     const [errors, setErrors] = useState({
//         email: "",
//         password: "",
//         password_confirmation: "",
//         // firstname: "",
//         // lastname: "",
//         username: ""
//     });
//     const [alert, setAlert] = useState({ type: "", message: "" });
//     const [message, setMessage] = useState("Prêt à trouver le job de vos rêves ?");

//     const alertData: any = {
//         danger: {
//             type: "error",
//             name: "Erreur !",
//             message: "Erreur lors de l'inscription",
//             css: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all",
//         },
//         success: {
//             type: "success",
//             name: "Succès !",
//             message: "Inscription réussie",
//             css: "p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 transition-all",
//         },
//     };
//     const router = useRouter();

//     useEffect(() => {
//         const url = new URL(window.location.href);
//         const appRootUrl = `${url.protocol}//${url.host}`;
//         if (window.location.origin === appRootUrl) {
//             setMessage("Prêt à trouver l'employé de vos rêves ?");
//         } else {
//             setMessage("Prêt à trouver le job de vos rêves ?");
//         }
//     }, []);

//     useEffect(() => {
//       setInputs((prev) => ({
//         ...prev,
//         username: "",
//         password_confirmation: "",
//       }));

//     }, [isSignUp])

//     const validateInput = (value: string, min: number, max: number, regex: RegExp, name: string) => {
//         const translatedName = name === "password" || name === "password_confirmation" ? "mot de passe" : name;
//         if ((inputs.password !== "" && inputs.password_confirmation !== "") && ((name === "password_confirmation" && value !== inputs.password))) {
//             return "Les mots de passe ne correspondent pas";
//         }
//         if (value.length < min) {
//             return `Le ${translatedName} doit contenir au moins ${min} caractères`;
//         }
//         if (value.length > max) {
//             return `Le ${translatedName} doit contenir au plus ${max} caractères`;
//         }
//         if (!regex.test(value)) {
//             return name === "password"
//                 ? `Le ${translatedName} doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre`
//                 : `Le ${translatedName} ne doit pas contenir de caractères spéciaux`;
//         }

//         return "";
//     };

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, min: number, max: number, regex: RegExp) => {
//         const value = event.target.value;
//         const error = validateInput(value, min, max, regex, fieldName);
//         setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
//         setInputs((prevInputs) => ({ ...prevInputs, [fieldName]: value }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         let updatedAlert = alert;
//         let alertType;
//         const { email, password, password_confirmation, username } = inputs;
//         const dataToSend = {
//             avatar: "",
//             email,
//             password,
//             username,
//             role: "USER"
//         }

//         if (password !== password_confirmation && isSignUp === true) {
//             alertType = "danger";
//             console.error("Les mots de passe ne correspondent pas");
//             updatedAlert = {
//                 type: alertType,
//                 message: alertData[alertType].message,
//             };
//                // setAlert(updatedAlert)
//         }

//         console.log("Infos envoyées : ", email, password, password_confirmation, username);

//         try {
//             const data = isSignUp
//                 ? await register({data: dataToSend}) //last/first name est juste pour les candidatures
//                 : await login({ email, password });

//             if (!isSignUp && data?.user) {
//                 const userInfo = {
//                     id: data?.user?.id,
//                     role: data?.user?.role,
//                     username: data?.user?.username,
//                     email: data?.user?.email,
//                 }
//                 // const userInfo = {
//                 //     id: data?.user?.id,
//                 //     role: data?.user?.role,
//                 //     username: data?.user?.username,
//                 //     email: data?.user?.email,
//                 // }
//                 localStorage.setItem("jobboard_user_info", JSON.stringify(userInfo));
//                 // localStorage.setItem("token", data?.token); //Token is set in cookie in the backend
//                 console.log("Successful connexion. Adding data to LS")
//             }

//             alertType = data?.user ? "success" : "danger"; //testerror a modif
//           updatedAlert = {
//             type: alertType,
//             message: alertData[alertType].message,
//           };

//             if (isSignUp === false && data?.user) {
//                 setTimeout(() => {
//                     router.push('/dashboard');
//                 }, 2000);
//             }

//             setAlert(updatedAlert);
//         } catch (error) {
//             console.error("Error:", error);
//             window.alert("Server error, please try again later.");
//         }
//     };

//     return (
//         <div className="relative flex w-full h-full items-center justify-center">
//             <div className='w-1/2 m-0 h-full relative'>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className='z-0 absolute w-full bottom-0 inset-x-0'>
//                     <path
//                         d="M0 150C150 100 250 200 400 150C550 100 650 200 800 150V600H0V150Z"
//                         fill="url(#gradient1)"
//                         fillOpacity="0.1"
//                     />
//                     <path
//                         d="M0 200C200 150 300 250 500 200C700 150 750 250 800 200V600H0V200Z"
//                         fill="url(#gradient2)"
//                         fillOpacity="0.08"
//                     />
//                     <defs>
//                         <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
//                             <stop offset="0%" style={{ stopColor: '#9333EA' }} />
//                             <stop offset="100%" style={{ stopColor: '#7C3AED' }} />
//                         </linearGradient>
//                         <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
//                             <stop offset="0%" style={{ stopColor: '#7C3AED' }} />
//                             <stop offset="100%" style={{ stopColor: '#9333EA' }} />
//                         </linearGradient>
//                     </defs>
//                     <g fill="#9333EA" fillOpacity="0.15">
//                         <circle cx="150" cy="250" r="4" />
//                         <circle cx="300" cy="200" r="6" />
//                         <circle cx="450" cy="300" r="5" />
//                         <circle cx="600" cy="250" r="4" />
//                     </g>
//                     <path
//                         d="M100 200L200 150L300 200L400 150L500 200L600 150"
//                         stroke="#9333EA"
//                         strokeWidth="1.5"
//                         fill="none"
//                         strokeOpacity="0.2"
//                     />
//                     <g transform="translate(250, 0)">
//                         <text
//                             fontFamily="Merriweather Sans"
//                             fontSize="48"
//                             fontWeight="bold"
//                             fill="#1F2937"
//                             y="40"
//                             className='font-merriweather-sans'
//                         >
//                             Bienvenue
//                         </text>
//                         <text
//                             transform="translate(30, 30)"
//                             fontFamily="DM Sans"
//                             fontSize="24"
//                             fill="#4B5563"
//                             y="80"
//                         >
//                             {message}
//                         </text>
//                     </g>
//                 </svg>
//             </div>
//             <div className="w-full font-dm-sans flex-1 h-full rounded-ss-3xl bg-white/50 flex items-center justify-center">
//                 <Card className="w-full mx-auto my-auto max-w-xl" color='#ffffff'>
//                     <CardHeader className="text-center pb-2">
//                         <h1 className="text-2xl font-merriweather-sans font-bold mb-2">
//                             {isSignUp ? 'Créer un compte' : 'Connexion'}
//                         </h1>
//                         <p className="text-gray-600 font-dm-sans">
//                             {isSignUp
//                                 ? "Renseignez vos informations afin de pouvoir vous inscrire"
//                                 : 'Entrez vos identifiants afin de pouvoir vous connecter'}
//                         </p>
//                         {alert.type && alertData[alert.type] && (
//                             <div className={alertData[alert.type].css} role="alert">
//                                 <span className="font-semibold">
//                                     {alertData[alert.type].name}
//                                 </span>{" "}
//                                 {alert.message}
//                             </div>
//                         )}
//                     </CardHeader>
//                     <CardContent className="pt-6">
//                         <form onSubmit={handleSubmit} method="POST" className="space-y-4">
//                             {isSignUp && (
//                                 <div className="space-y-4">

//                                     <FormField
//                                         icon={<User size={20} />}
//                                         type="text"
//                                         name="username"
//                                         placeholder="Pseudo"
//                                         onChange={(e) => handleChange(e, "username", 3, 20, /^[a-zA-Z0-9]+$/)}
//                                         error={errors.username}
//                                         setInputs={setInputs}
//                                     />
//                                 </div>
//                             )}
//                             <FormField
//                                 icon={<Mail size={20} />}
//                                 type="email"
//                                 name="email"
//                                 placeholder="Adresse email"
//                                 onChange={(e) => handleChange(e, "email", 5, 100, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
//                                 error={errors.email}
//                                 setInputs={setInputs}
//                             />
//                             <FormField
//                                 icon={<Lock size={20} />}
//                                 type="password"
//                                 name="password"
//                                 placeholder="Mot de passe"
//                                 onChange={(e) => handleChange(e, "password", 8, 20, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)}
//                                 error={errors.password}
//                                 setInputs={setInputs}
//                             />
//                             {isSignUp && (
//                                 <FormField
//                                     icon={<Lock size={20} />}
//                                     type="password"
//                                     name="password_confirmation"
//                                     placeholder="Confirmer le mot de passe"
//                                     onChange={(e) => handleChange(e, "password_confirmation", 8, 20, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)}
//                                     error={errors.password_confirmation}
//                                     setInputs={setInputs}
//                                 />
//                             )}
//                             <button className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
//                                 <span>{isSignUp ? 'Créer mon compte' : 'Se connecter'}</span>
//                                 <ArrowRight size={20} className="ml-2" />
//                             </button>
//                             <div className="text-center mt-6">
//                                 <p className="text-gray-600">
//                                     {isSignUp
//                                         ? 'Déjà inscrit ?'
//                                         : 'Pas encore de compte ?'
//                                     }
//                                     {' '}
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsSignUp(!isSignUp)}
//                                         className="text-purple-600 hover:text-purple-700 font-medium"
//                                     >
//                                         {isSignUp ? 'Se connecter' : "S'inscrire"}
//                                     </button>
//                                 </p>
//                             </div>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default SignPages;

import React, { Suspense } from "react";
import AuthLayout from "../components/auth/AuthLayout";

const SignPage = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AuthLayout />
    </Suspense>
  );
};

export default SignPage;
