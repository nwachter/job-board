// "use client"
// import React, { ChangeEvent, useState } from 'react';
// import {
//     Mail,
//     Lock,
//     User,
//     Building2,
//     ArrowRight,
//     ChevronLeft
// } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { login } from '../services/auth';

// type FormErrors = {
//     email: string;
//     password: string;
//     password_confirmation: string;
//     firstname: string;
//     lastname: string;
//     username: string;
// }
// const SignPages = () => {
//     const [isSignUp, setIsSignUp] = useState(true);
//     const [inputs, setInputs] = useState([{ email: "" }, { password: "" }]);
//     const [errors, setErrors] = useState({ email: "" }, { password: "" });
  
//     console.log();
  
//     const [alert, setAlert] = useState({ type: "", message: "" });
  
//     const alertData = {
//       danger: {
//         type: "error",
//         name: "Erreur !",
//         message: "Erreur lors de la connexion",
//         css: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all",
//       },
//       success: {
//         type: "success",
//         name: "Succès !",
//         message: "Connexion reussie",
//         css: "p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 transition-all",
//       },
//     };
  
//     const validateInput = (value : string, min : number, max : number, regex: RegExp, name: string) => {
//       const translatedName = name === "password" ? "mot de passe" : "pseudo";
//       if (value.length < min) {
//         return `Le ${translatedName} doit contenir au moins ${min} caractères`;
//       }
//       if (value.length > max) {
//         return `Le ${translatedName} doit contenir au plus ${max} caractères`;
//       }
//       if (!regex.test(value)) {
//         return name === "password"
//           ? `Le ${translatedName} doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre`
//           : `Le ${translatedName} ne doit pas contenir de caractères spéciaux`;
//       }
//       return "";
//     };
  
//     const handleChange = (event, fieldName, min, max, regex) => {
//       const value = event.target.value;
//       const error = validateInput(value, min, max, regex, fieldName);
  
//       setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
//       setInputs((prevInputs) => ({ ...prevInputs, [fieldName]: value }));
//     };
  
//     const handleChangeUsername = (event : React.ChangeEvent<HTMLInputElement>) => {
//       const usernameRegex = /^[a-zA-Z0-9]+$/;
//       handleChange(event, "username", 3, 20, usernameRegex);
//     };
  
//     const handleChangePassword = (event : React.ChangeEvent<HTMLInputElement>) => {
//       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
//       handleChange(event, "password", 8, 20, passwordRegex);
//     };
  
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
  
//       const email = e.target.email.value;
//       const password = e.target.password.value;
  
//       try {
//         const data = await login(email, password); // Correct call
  
//         console.log("Data signin : ", data);
  
//         if (data && data.token) {
//           localStorage.setItem("isConnected", "true");
//         }
  
//         const alertType = data?.user ? "success" : "danger";
//         setAlert({
//           type: alertType,
//           message: alertData[alertType].message,
//         });
  
//         // setTimeout(() => {
//         //   if (data?.user) {
//         //     window.location.href = '/';
  
//         //   }
//         // }, 4000);
//       } catch (error) {
//         console.error("Error:", error);
//         window.alert("Server error, please try again later.");
//       }
//     };
  


//     //   if (!userType) {
//     //     return <UserTypeSelection onSelect={setUserType} />;
//     //   }

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
//                         transform="translate(30, 30)"
//                             fontFamily="DM Sans"
//                             fontSize="24"
//                             fill="#4B5563"
//                             y="80"
//                         >
//                          Prêt(e) à trouver le job de vos rêves ?
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
//                             {isSignUp === true
//                                 ? "Renseignez vos informations afin de pouvoir vous inscrire"
//                                 : 'Entrez vos identifiants afin de pouvoir vous connecter'}
//                         </p>
//                     </CardHeader>

//                     <CardContent className="pt-6">
//                         <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//                             {isSignUp && (
//                                 <div className="space-y-4">
//                                     <FormField
//                                         icon={<User size={20} />}
//                                         type="text"
//                                         name="lastname"
//                                         placeholder="Nom"
//                                     />
//                                     {isSignUp && (
//                                         <FormField
//                                             icon={<Building2 size={20} />}
//                                             type="text"
//                                             name="firstname"
//                                             placeholder="Prénom"
//                                         />
//                                     )}
//                                                      {isSignUp && (
//                                         <FormField
//                                             icon={<User size={20} />}
//                                             type="text"
//                                             name="username"
//                                             placeholder="Pseudo"
//                                         />
//                                     )}
//                                 </div>
//                             )}

//                             <FormField
//                                 icon={<Mail size={20} />}
//                                 type="email"
//                                 placeholder="Adresse email"
//                             />

//                             <FormField
//                                 icon={<Lock size={20} />}
//                                 type="password"
//                                 placeholder="Mot de passe"
//                             />

//                             {isSignUp && (
//                                 <FormField
//                                     icon={<Lock size={20} />}
//                                     type="password_confirmation"
//                                     placeholder="Confirmer le mot de passe"
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

// // type UserTypeSelectionProps = { 
// //     onSelect: (type: 'candidate' | 'recruiter') => void 
// // }
// // const UserTypeSelection : React.FC<UserTypeSelectionProps> = ({ onSelect }) => (
// //   <div className="min-h-screen flex items-center justify-center p-4">
// //     <div className="w-full max-w-2xl">
// //       <div className="text-center mb-8">
// //         <h1 className="text-3xl font-bold mb-4">Bienvenue sur JobBoard</h1>
// //         <p className="text-gray-600">Sélectionnez votre profil pour continuer</p>
// //       </div>

// //       <div className="grid md:grid-cols-2 gap-6">
// //         <UserTypeCard
// //           title="Je suis candidat"
// //           description="Trouvez l'emploi de vos rêves parmi des milliers d'offres"
// //           icon={<User size={24} />}
// //           onClick={() => onSelect('candidate')}
// //         />
// //         <UserTypeCard
// //           title="Je suis recruteur"
// //           description="Publiez vos offres et trouvez les meilleurs talents"
// //           icon={<Building2 size={24} />}
// //           onClick={() => onSelect('recruiter')}
// //         />
// //       </div>
// //     </div>
// //   </div>
// // );

// type UserTypeCardProps = {
//     title: string;
//     description: string;
//     icon: React.ReactNode;
//     onClick: () => void;
// };
// const UserTypeCard: React.FC<UserTypeCardProps> = ({ title, description, icon, onClick }) => (
//     <Card
//         className="cursor-pointer hover:shadow-md transition-shadow"
//         onClick={onClick}
//     >
//         <CardContent className="p-6">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
//                 {icon}
//             </div>
//             <h2 className="text-xl font-semibold mb-2">{title}</h2>
//             <p className="text-gray-600">{description}</p>
//             <div className="mt-4 flex items-center text-purple-600 font-medium">
//                 <span>Continuer</span>
//                 <ArrowRight size={20} className="ml-2" />
//             </div>
//         </CardContent>
//     </Card>
// );

// type FormFieldProps = {
//     icon: React.ReactNode
// } & React.InputHTMLAttributes<HTMLInputElement>;

// const FormField: React.FC<FormFieldProps> = ({ icon, ...props }) => (
//     <div className="relative">
//         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             {icon}
//         </div>
//         <input
//             {...props}
//             className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//         />
//     </div>
// );

// export default SignPages;

"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { login, register } from '../services/auth';

const SignPages = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        password_confirmation: "",
        firstname: "",
        lastname: "",
        username: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        password_confirmation: "",
        firstname: "",
        lastname: "",
        username: ""
    });
    const [alert, setAlert] = useState({ type: "", message: "" });

    const alertData : any = {
        danger: {
            type: "error",
            name: "Erreur !",
            message: "Erreur lors de l'inscription",
            css: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all",
        },
        success: {
            type: "success",
            name: "Succès !",
            message: "Inscription réussie",
            css: "p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 transition-all",
        },
    };

    const validateInput = (value : string, min : number, max : number, regex : RegExp, name : string) => {
        const translatedName = name === "password" || name === "password_confirmation" ? "mot de passe" : name;
        if (value.length < min) {
            return `Le ${translatedName} doit contenir au moins ${min} caractères`;
        }
        if (value.length > max) {
            return `Le ${translatedName} doit contenir au plus ${max} caractères`;
        }
        if (!regex.test(value)) {
            return name === "password"
                ? `Le ${translatedName} doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre`
                : `Le ${translatedName} ne doit pas contenir de caractères spéciaux`;
        }
        return "";
    };

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>, fieldName: string, min: number, max: number, regex: RegExp) => {
        const value = event.target.value;
        const error = validateInput(value, min, max, regex, fieldName);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
        setInputs((prevInputs) => ({ ...prevInputs, [fieldName]: value }));
    };

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        const { email, password, password_confirmation, username } = inputs;


        try {
            const data = isSignUp
                ? await register({ email, password, username }) //last/first name est juste pour les candidatures
                : await login({ email, password });

            if (data && data.token) {
                localStorage.setItem("isConnected", "true");
            }

            const alertType = data?.user ? "success" : "danger";
            setAlert({
                type: alertType,
                message: alertData[alertType].message,
            });

        } catch (error) {
            console.error("Error:", error);
            window.alert("Server error, please try again later.");
        }
    };

    return (
        <div className="relative flex w-full h-full items-center justify-center">
            <div className='w-1/2 m-0 h-full relative'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className='z-0 absolute w-full bottom-0 inset-x-0'>
                    <path
                        d="M0 150C150 100 250 200 400 150C550 100 650 200 800 150V600H0V150Z"
                        fill="url(#gradient1)"
                        fillOpacity="0.1"
                    />
                    <path
                        d="M0 200C200 150 300 250 500 200C700 150 750 250 800 200V600H0V200Z"
                        fill="url(#gradient2)"
                        fillOpacity="0.08"
                    />
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#9333EA' }} />
                            <stop offset="100%" style={{ stopColor: '#7C3AED' }} />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#7C3AED' }} />
                            <stop offset="100%" style={{ stopColor: '#9333EA' }} />
                        </linearGradient>
                    </defs>
                    <g fill="#9333EA" fillOpacity="0.15">
                        <circle cx="150" cy="250" r="4" />
                        <circle cx="300" cy="200" r="6" />
                        <circle cx="450" cy="300" r="5" />
                        <circle cx="600" cy="250" r="4" />
                    </g>
                    <path
                        d="M100 200L200 150L300 200L400 150L500 200L600 150"
                        stroke="#9333EA"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.2"
                    />
                    <g transform="translate(250, 0)">
                        <text
                            fontFamily="Merriweather Sans"
                            fontSize="48"
                            fontWeight="bold"
                            fill="#1F2937"
                            y="40"
                            className='font-merriweather-sans'
                        >
                            Bienvenue
                        </text>
                        <text
                            transform="translate(30, 30)"
                            fontFamily="DM Sans"
                            fontSize="24"
                            fill="#4B5563"
                            y="80"
                        >
                            Prêt(e) à trouver le job de vos rêves ?
                        </text>
                    </g>
                </svg>
            </div>
            <div className="w-full font-dm-sans flex-1 h-full rounded-ss-3xl bg-white/50 flex items-center justify-center">
                <Card className="w-full mx-auto my-auto max-w-xl" color='#ffffff'>
                    <CardHeader className="text-center pb-2">
                        <h1 className="text-2xl font-merriweather-sans font-bold mb-2">
                            {isSignUp ? 'Créer un compte' : 'Connexion'}
                        </h1>
                        <p className="text-gray-600 font-dm-sans">
                            {isSignUp
                                ? "Renseignez vos informations afin de pouvoir vous inscrire"
                                : 'Entrez vos identifiants afin de pouvoir vous connecter'}
                        </p>
                        {alert.type && alertData[alert.type] && (
              <div className={alertData[alert.type].css} role="alert">
                <span className="font-semibold">
                  {alertData[alert.type].name}
                </span>{" "}
                {alert.message}
              </div>
            )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isSignUp && (
                                <div className="space-y-4">
                                    <FormField
                                        icon={<User size={20} />}
                                        type="text"
                                        name="lastname"
                                        placeholder="Nom"
                                        onChange={(e) => handleChange(e, "lastname", 2, 50, /^[a-zA-Z]+$/)}
                                        error={errors.lastname}
                                    />
                                    <FormField
                                        icon={<User size={20} />}
                                        type="text"
                                        name="firstname"
                                        placeholder="Prénom"
                                        onChange={(e) => handleChange(e, "firstname", 2, 50, /^[a-zA-Z]+$/)}
                                        error={errors.firstname}
                                    />
                                    <FormField
                                        icon={<User size={20} />}
                                        type="text"
                                        name="username"
                                        placeholder="Pseudo"
                                        onChange={(e) => handleChange(e, "username", 3, 20, /^[a-zA-Z0-9]+$/)}
                                        error={errors.username}
                                    />
                                </div>
                            )}
                            <FormField
                                icon={<Mail size={20} />}
                                type="email"
                                name="email"
                                placeholder="Adresse email"
                                onChange={(e) => handleChange(e, "email", 5, 100, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
                                error={errors.email}
                            />
                            <FormField
                                icon={<Lock size={20} />}
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                onChange={(e) => handleChange(e, "password", 8, 20, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)}
                                error={errors.password}
                            />
                            {isSignUp && (
                                <FormField
                                    icon={<Lock size={20} />}
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="Confirmer le mot de passe"
                                    onChange={(e) => handleChange(e, "password_confirmation", 8, 20, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)}
                                    error={errors.password_confirmation}
                                />
                            )}
                            <button className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                                <span>{isSignUp ? 'Créer mon compte' : 'Se connecter'}</span>
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    {isSignUp
                                        ? 'Déjà inscrit ?'
                                        : 'Pas encore de compte ?'
                                    }
                                    {' '}
                                    <button
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        className="text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        {isSignUp ? 'Se connecter' : "S'inscrire"}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

type FormFieldProps = {
    icon: React.ReactNode;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormField: React.FC<FormFieldProps> = ({ icon, error, ...props }) => (
    <div className="flex flex-col">
           <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
        </div>
        <input
            {...props}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
    </div> 
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>

);

export default SignPages;
