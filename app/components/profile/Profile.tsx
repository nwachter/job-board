"use client";
// import React, { useState, useEffect } from "react";
// import {
//   User,
//   Briefcase,
//   Mail,
//   Lock,
//   Upload,
//   FileText,
//   Calendar,
//   Award,
//   Sparkles,
//   ChevronRight,
//   PenSquare,
//   X,
//   Check,
// } from "lucide-react";
// import Image from "next/image";
// import { User as UserType } from "@/app/types/user";

// import { motion } from "framer-motion";
// import { Role } from "@/app/types/user";

// // Types
// type ProfileProps = {
//   user: Omit<UserType, "password"> | null;
// };

// // Fade in animation variant
// const fadeIn = {
//   hidden: { opacity: 0, y: 10 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// export const Profile: React.FC<ProfileProps> = ({ user }) => {
//   // States for form data
//   const [firstname, setFirstname] = useState(
//     user?.username.split(" ")[0] || "",
//   );
//   const [lastname, setLastname] = useState(user?.username.split(" ")[1] || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [avatar, setAvatar] = useState<File | null>(null);
//   const [resume, setResume] = useState<File | null>(null);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [isEditing, setIsEditing] = useState(false);
//   const [notification, setNotification] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState(
//     user?.avatar || "/default-avatar.png",
//   );

//   // User role
//   const isRecruiter = user?.role === Role.RECRUITER;

//   // Stats
//   const applicationCount = user?.applications?.length || 0;
//   const pendingApplications =
//     user?.applications?.filter((app) => !app?.offer?.recruiter_id).length || 0;
//   const offersPosted = user?.offers?.length || 0;

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Form validation
//     if (newPassword && newPassword !== confirmPassword) {
//       setNotification({
//         type: "error",
//         message: "Les mots de passe ne correspondent pas",
//       });
//       return;
//     }

//     // Create form data for file uploads
//     const formData = new FormData();
//     formData.append("firstname", firstname);
//     formData.append("lastname", lastname);
//     formData.append("email", email);

//     if (currentPassword && newPassword) {
//       formData.append("currentPassword", currentPassword);
//       formData.append("newPassword", newPassword);
//     }

//     if (avatar) {
//       formData.append("avatar", avatar);
//     }

//     if (resume) {
//       formData.append("resume", resume);
//     }

//     try {
//       // Simulating API call
//       // In a real application, this would be an actual API call:
//       // const response = await fetch('/api/user/update', {
//       //   method: 'POST',
//       //   body: formData
//       // })

//       // For this example, we'll just simulate success
//       setTimeout(() => {
//         setNotification({
//           type: "success",
//           message: "Profil mis à jour avec succès",
//         });
//         setIsEditing(false);

//         // Reset password fields after successful update
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");

//         // Clear notification after 3 seconds
//         setTimeout(() => setNotification(null), 3000);
//       }, 800);
//     } catch (error) {
//       setNotification({
//         type: "error",
//         message: "Erreur lors de la mise à jour du profil",
//       });
//     }
//   };

//   // Handle file changes
//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setAvatar(file);

//       // Create a preview URL
//       const reader = new FileReader();
//       reader.onload = () => {
//         let updatedAvatarPreview = avatarPreview;
//         if (typeof reader.result === "string") {
//           updatedAvatarPreview = reader.result;
//         }
//         setAvatarPreview(updatedAvatarPreview);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setResume(e.target.files[0]);
//       setNotification({
//         type: "success",
//         message: "CV téléchargé avec succès",
//       });
//       setTimeout(() => setNotification(null), 3000);
//     }
//   };
//   if (!user)
//     return (
//       <div>
//         <p>Chargement...</p>
//       </div>
//     );
//   return (
//     <div className="flex h-full w-full">
//       <main className="ml-20 flex-1 p-8">
//         <div className="mx-auto max-w-7xl">
//           <header className="mb-8 flex items-center justify-between">
//             <h1 className="font-merriweather-sans text-4xl font-bold text-white">
//               Mon Profil
//             </h1>
//           </header>

//           {/* Notification */}
//           {notification && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className={`mb-6 flex items-center justify-between rounded-lg p-4 text-sm ${
//                 notification.type === "success"
//                   ? "border border-green-200 bg-green-50 text-green-800"
//                   : "border border-red-200 bg-red-50 text-red-800"
//               }`}
//             >
//               <div className="flex items-center">
//                 {notification.type === "success" ? (
//                   <Check size={18} className="mr-2" />
//                 ) : (
//                   <X size={18} className="mr-2" />
//                 )}
//                 {notification.message}
//               </div>
//               <button onClick={() => setNotification(null)}>
//                 <X size={18} />
//               </button>
//             </motion.div>
//           )}

//           {/* Tab Navigation */}
//           <div className="rounded-t-[30px] border-b border-purple-100 bg-white/70 p-4 backdrop-blur-sm">
//             <div className="flex space-x-8">
//               <button
//                 onClick={() => setActiveTab("profile")}
//                 className={`flex items-center px-1 py-2 ${activeTab === "profile" ? "border-b-2 border-purple-600 font-medium text-purple-600" : "text-gray-500 hover:text-purple-500"}`}
//               >
//                 <User className="mr-2" size={18} />
//                 Informations Personnelles
//               </button>
//               <button
//                 onClick={() => setActiveTab("applications")}
//                 className={`flex items-center px-1 py-2 ${activeTab === "applications" ? "border-b-2 border-purple-600 font-medium text-purple-600" : "text-gray-500 hover:text-purple-500"}`}
//               >
//                 <Briefcase className="mr-2" size={18} />
//                 {isRecruiter ? "Offres Publiées" : "Mes Candidatures"}
//               </button>
//               <button
//                 onClick={() => setActiveTab("stats")}
//                 className={`flex items-center px-1 py-2 ${activeTab === "stats" ? "border-b-2 border-purple-600 font-medium text-purple-600" : "text-gray-500 hover:text-purple-500"}`}
//               >
//                 <Sparkles className="mr-2" size={18} />
//                 Statistiques
//               </button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="mb-8 rounded-b-[30px] bg-white/70 p-6 shadow-md backdrop-blur-sm">
//             {/* Profile Information */}
//             {activeTab === "profile" && (
//               <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//                 <div className="mb-6 flex items-center justify-between">
//                   <h2 className="text-2xl font-medium text-gray-800">
//                     Informations Personnelles
//                   </h2>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-all hover:bg-purple-500"
//                   >
//                     {isEditing ? (
//                       <>
//                         <X size={16} className="mr-2" />
//                         Annuler
//                       </>
//                     ) : (
//                       <>
//                         <PenSquare size={16} className="mr-2" />
//                         Modifier
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Avatar Section */}
//                   <div className="flex flex-col items-center gap-8 md:flex-row">
//                     <div className="group relative">
//                       <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-purple-200 shadow-md">
//                         <Image
//                           src={avatarPreview}
//                           alt="Avatar de profil"
//                           width={128}
//                           height={128}
//                           className="h-full w-full object-cover"
//                         />
//                       </div>
//                       {isEditing && (
//                         <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity group-hover:opacity-100">
//                           <Upload size={24} />
//                           <input
//                             type="file"
//                             className="hidden"
//                             accept="image/*"
//                             onChange={handleAvatarChange}
//                           />
//                         </label>
//                       )}
//                     </div>
//                     <div className="flex-1 space-y-6">
//                       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                         <div>
//                           <label className="mb-1 block text-sm font-medium text-gray-700">
//                             Prénom
//                           </label>
//                           <input
//                             type="text"
//                             value={firstname}
//                             onChange={(e) => setFirstname(e.target.value)}
//                             disabled={!isEditing}
//                             className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? "bg-gray-50" : ""}`}
//                           />
//                         </div>
//                         <div>
//                           <label className="mb-1 block text-sm font-medium text-gray-700">
//                             Nom
//                           </label>
//                           <input
//                             type="text"
//                             value={lastname}
//                             onChange={(e) => setLastname(e.target.value)}
//                             disabled={!isEditing}
//                             className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? "bg-gray-50" : ""}`}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="mb-1 block text-sm font-medium text-gray-700">
//                           Email
//                         </label>
//                         <div className="relative">
//                           <Mail
//                             className="absolute left-3 top-3 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={!isEditing}
//                             className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? "bg-gray-50" : ""}`}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Resume Upload */}
//                   {!isRecruiter && (
//                     <div className="mt-6">
//                       <h3 className="mb-3 text-lg font-medium text-gray-800">
//                         Mon CV
//                       </h3>
//                       <div
//                         className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${isEditing ? "cursor-pointer border-purple-300 hover:border-purple-500" : "border-gray-200"}`}
//                       >
//                         {isEditing ? (
//                           <label className="w-full cursor-pointer">
//                             <div className="flex flex-col items-center">
//                               <FileText
//                                 size={36}
//                                 className="mb-2 text-purple-500"
//                               />
//                               <p className="mb-1 text-sm text-gray-600">
//                                 {resume
//                                   ? resume.name
//                                   : "Glissez-déposez votre CV ou cliquez pour parcourir"}
//                               </p>
//                               <p className="text-xs text-gray-400">
//                                 PDF, DOCX, maximum 5MB
//                               </p>
//                             </div>
//                             <input
//                               type="file"
//                               className="hidden"
//                               accept=".pdf,.docx"
//                               onChange={handleResumeChange}
//                             />
//                           </label>
//                         ) : (
//                           <div className="flex items-center">
//                             <FileText
//                               size={28}
//                               className="mr-3 text-gray-500"
//                             />
//                             <div>
//                               <p className="text-sm font-medium">mon-cv.pdf</p>
//                               <p className="text-xs text-gray-500">
//                                 Téléchargé le 15/02/2025
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Password Change Section */}
//                   {isEditing && (
//                     <div className="mt-8 border-t border-gray-200 pt-6">
//                       <h3 className="mb-3 text-lg font-medium text-gray-800">
//                         Changer de mot de passe
//                       </h3>
//                       <div className="space-y-4">
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-3 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             type="password"
//                             placeholder="Mot de passe actuel"
//                             value={currentPassword}
//                             onChange={(e) => setCurrentPassword(e.target.value)}
//                             className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                           />
//                         </div>
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-3 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             type="password"
//                             placeholder="Nouveau mot de passe"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                           />
//                         </div>
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-3 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             type="password"
//                             placeholder="Confirmer le nouveau mot de passe"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Submit Button */}
//                   {isEditing && (
//                     <div className="flex justify-end">
//                       <button
//                         type="submit"
//                         className="flex items-center rounded-lg bg-purple-600 px-6 py-2 text-white transition-all hover:bg-purple-500"
//                       >
//                         <Check size={18} className="mr-2" />
//                         Enregistrer les modifications
//                       </button>
//                     </div>
//                   )}
//                 </form>
//               </motion.div>
//             )}

//             {/* Applications/Offers Tab */}
//             {activeTab === "applications" && (
//               <motion.div
//                 initial="hidden"
//                 animate="visible"
//                 variants={fadeIn}
//                 className="space-y-6"
//               >
//                 <h2 className="mb-4 text-2xl font-medium text-gray-800">
//                   {isRecruiter ? "Offres Publiées" : "Mes Candidatures"}
//                 </h2>

//                 {/* For normal users - Applications */}
//                 {!isRecruiter &&
//                 user.applications &&
//                 user.applications.length > 0 ? (
//                   <div className="space-y-4">
//                     {user.applications.map((application) => (
//                       <motion.div
//                         key={application.id}
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-lg font-medium">
//                               {application?.offer?.title}
//                             </h3>
//                             <p className="text-gray-600">
//                               {application?.offer?.company_name}
//                             </p>
//                             <div className="mt-2 flex items-center gap-2">
//                               <span className="rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
//                                 {application?.offer?.contract_type}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 Postulé le 28/02/2025
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
//                               En attente
//                             </span>
//                           </div>
//                         </div>
//                         <div className="mt-3 flex items-center justify-between">
//                           <p className="line-clamp-1 text-sm italic text-gray-500">
//                             "{application.content.substring(0, 80)}..."
//                           </p>
//                           <button className="flex items-center text-sm text-purple-600 transition-colors hover:text-purple-500">
//                             Voir les détails
//                             <ChevronRight size={16} className="ml-1" />
//                           </button>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 ) : !isRecruiter ? (
//                   <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
//                     <Briefcase
//                       size={48}
//                       className="mx-auto mb-3 text-gray-300"
//                     />
//                     <p className="text-gray-500">
//                       Vous n'avez pas encore postulé à des offres
//                     </p>
//                   </div>
//                 ) : null}

//                 {/* For recruiters - Job Offers */}
//                 {isRecruiter && user.offers && user.offers.length > 0 ? (
//                   <div className="space-y-4">
//                     {user.offers.map((offer) => (
//                       <motion.div
//                         key={offer.id}
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="text-lg font-medium">
//                               {offer.title}
//                             </h3>
//                             <p className="text-gray-600">
//                               {offer.company_name}
//                             </p>
//                             <div className="mt-2 flex items-center gap-2">
//                               <span className="rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
//                                 {offer.contract_type}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 Publié le 05/02/2025
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
//                               Active
//                             </span>
//                             <span className="mt-2 text-sm text-gray-600">
//                               8 candidatures
//                             </span>
//                           </div>
//                         </div>
//                         <div className="mt-3 flex items-center justify-between">
//                           <p className="line-clamp-1 text-sm text-gray-500">
//                             {offer.description.substring(0, 80)}...
//                           </p>
//                           <button className="flex items-center text-sm text-purple-600 transition-colors hover:text-purple-500">
//                             Gérer les candidatures
//                             <ChevronRight size={16} className="ml-1" />
//                           </button>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 ) : isRecruiter ? (
//                   <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
//                     <Briefcase
//                       size={48}
//                       className="mx-auto mb-3 text-gray-300"
//                     />
//                     <p className="text-gray-500">
//                       Vous n'avez pas encore publié d'offres
//                     </p>
//                   </div>
//                 ) : null}
//               </motion.div>
//             )}

//             {/* Stats Tab */}
//             {activeTab === "stats" && (
//               <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//                 <h2 className="mb-6 text-2xl font-medium text-gray-800">
//                   Mes Statistiques
//                 </h2>

//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//                   {/* Stat Card 1 */}
//                   <motion.div
//                     whileHover={{ y: -5 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg"
//                   >
//                     <div className="absolute bottom-0 right-0 opacity-10">
//                       <Briefcase size={80} />
//                     </div>
//                     <h3 className="mb-2 text-lg font-medium">
//                       {isRecruiter ? "Offres Publiées" : "Candidatures"}
//                     </h3>
//                     <p className="mb-1 text-4xl font-bold">
//                       {isRecruiter ? offersPosted : applicationCount}
//                     </p>
//                     <p className="text-sm text-purple-200">
//                       {isRecruiter
//                         ? "Offres actives pour votre entreprise"
//                         : "Candidatures soumises au total"}
//                     </p>
//                   </motion.div>

//                   {/* Stat Card 2 */}
//                   <motion.div
//                     whileHover={{ y: -5 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white shadow-lg"
//                   >
//                     <div className="absolute bottom-0 right-0 opacity-10">
//                       <Calendar size={80} />
//                     </div>
//                     <h3 className="mb-2 text-lg font-medium">
//                       {isRecruiter ? "Candidatures Reçues" : "En Attente"}
//                     </h3>
//                     <p className="mb-1 text-4xl font-bold">
//                       {isRecruiter ? "24" : pendingApplications}
//                     </p>
//                     <p className="text-sm text-blue-200">
//                       {isRecruiter
//                         ? "Candidatures à traiter"
//                         : "Candidatures en cours de traitement"}
//                     </p>
//                   </motion.div>

//                   {/* Stat Card 3 */}
//                   <motion.div
//                     whileHover={{ y: -5 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 p-6 text-white shadow-lg"
//                   >
//                     <div className="absolute bottom-0 right-0 opacity-10">
//                       <Award size={80} />
//                     </div>
//                     <h3 className="mb-2 text-lg font-medium">
//                       {isRecruiter ? "Taux de Réponse" : "Taux de Complétion"}
//                     </h3>
//                     <p className="mb-1 text-4xl font-bold">
//                       {isRecruiter ? "87%" : "100%"}
//                     </p>
//                     <p className="text-sm text-teal-200">
//                       {isRecruiter
//                         ? "Candidatures avec une réponse"
//                         : "Profil complété à 100%"}
//                     </p>
//                   </motion.div>
//                 </div>

//                 {/* Activity Timeline */}
//                 <div className="mt-10">
//                   <h3 className="mb-4 text-xl font-medium text-gray-800">
//                     Activité Récente
//                   </h3>
//                   <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-purple-100">
//                     {/* Activity Item 1 */}
//                     <div className="flex items-start">
//                       <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
//                       <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
//                         <div className="flex justify-between">
//                           <p className="font-medium">
//                             {isRecruiter
//                               ? 'Nouvelle candidature reçue pour "Développeur Full Stack"'
//                               : 'Candidature soumise pour "Développeur Full Stack"'}
//                           </p>
//                           <span className="text-sm text-gray-500">
//                             Il y a 2 jours
//                           </span>
//                         </div>
//                         <p className="mt-1 text-sm text-gray-600">
//                           {isRecruiter
//                             ? "Un nouveau candidat a postulé à votre offre"
//                             : "Votre candidature a été reçue par le recruteur"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Activity Item 2 */}
//                     <div className="flex items-start">
//                       <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
//                       <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
//                         <div className="flex justify-between">
//                           <p className="font-medium">
//                             {isRecruiter
//                               ? 'Offre "Product Owner" publiée'
//                               : "Profil mis à jour"}
//                           </p>
//                           <span className="text-sm text-gray-500">
//                             Il y a 5 jours
//                           </span>
//                         </div>
//                         <p className="mt-1 text-sm text-gray-600">
//                           {isRecruiter
//                             ? "Votre offre est maintenant visible par les candidats"
//                             : "Vous avez mis à jour vos informations personnelles"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Activity Item 3 */}
//                     <div className="flex items-start">
//                       <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
//                       <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
//                         <div className="flex justify-between">
//                           <p className="font-medium">
//                             {isRecruiter ? "Compte créé" : "CV téléchargé"}
//                           </p>
//                           <span className="text-sm text-gray-500">
//                             Il y a 3 semaines
//                           </span>
//                         </div>
//                         <p className="mt-1 text-sm text-gray-600">
//                           {isRecruiter
//                             ? "Bienvenue sur la plateforme!"
//                             : "Vous avez mis à jour votre CV"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profile;

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  Briefcase,
  Mail,
  Lock,
  Upload,
  FileText,
  Calendar,
  Award,
  Sparkles,
  ChevronRight,
  PenSquare,
  X,
  Check,
} from "lucide-react";
import Image from "next/image";

import { Role, User as UserType } from "@/app/types/user";
import { motion } from "framer-motion";
import UserSkillsSelector from "@/app/components/general/SkillSelector";
import { Skill } from "@/app/types/skill";
import { useGetSkills } from "@/app/hooks/useSkills";
import { useGetUserById, useUpdateUser } from "@/app/hooks/useUser";

// Types
type ProfileProps = {
  user: Omit<UserType, "password">;
};

// Fade in animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const {
    data: skills = [],
    isLoading: isLoadingSkills,
    error: errorSkills,
  } = useGetSkills();

  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: errorUserDetails,
  } = useGetUserById(Number(user.id));

  // let userSkills = useMemo(() => {
  //   return userDetails?.skills ? userDetails.skills : [];
  // }, [userDetails]);

  // States for form data
  const [firstname, setFirstname] = useState(
    user?.username.split(" ")[0] || "",
  );
  const [lastname, setLastname] = useState(user?.username.split(" ")[1] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "/default-avatar.png",
  );
  const [userSkills, setUserSkills] = useState<Skill[]>(
    userDetails?.skills || [],
  );

  useEffect(() => {
    if (userDetails?.skills) {
      setUserSkills(userDetails.skills);
    }
  }, [userDetails]);

  // User role
  const isRecruiter = user?.role === Role.RECRUITER;

  // Stats
  const applicationCount = user?.applications?.length || 0;
  const pendingApplications =
    user?.applications?.filter((app) => !app?.offer?.recruiter_id).length || 0;
  const offersPosted = user?.offers?.length || 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (newPassword && newPassword !== confirmPassword) {
      setNotification({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    // Create form data for file uploads
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);

    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    // Add skills
    formData.append("skills", JSON.stringify(userSkills));

    try {
      // Simulating API call
      // In a real application, this would be an actual API call:
      // const response = await fetch('/api/user/update', {
      //   method: 'POST',
      //   body: formData
      // })

      // For this example, we'll just simulate success
      setTimeout(() => {
        setNotification({
          type: "success",
          message: "Profil mis à jour avec succès",
        });
        setIsEditing(false);

        // Reset password fields after successful update
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
      }, 800);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Erreur lors de la mise à jour du profil",
      });
    }
  };

  // Handle file changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        let updatedAvatarPreview = avatarPreview;
        if (typeof reader.result === "string") {
          updatedAvatarPreview = reader.result;
        }
        setAvatarPreview(updatedAvatarPreview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setNotification({
        type: "success",
        message: "CV téléchargé avec succès",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const updateUserMutation = useUpdateUser();
  // Handle skills change
  const handleSkillsChange = async (changedSkills: Skill[]) => {
    // userSkills = changedSkills;
    console.log("Skills changed:", changedSkills);
    const response = await updateUserMutation.mutateAsync(
      {
        id: user.id,
        data: { skills: changedSkills },
      },
      {
        onSuccess: (result) => {
          console.log("Skills updated successfully");
          setUserSkills(result.skills ?? changedSkills);
        },
        onError: (error) => {
          console.error("Error updating skills:", error);
        },
      },
    );
  };

  if (!user)
    return (
      <div>
        <p>Chargement...</p>
      </div>
    );

  return (
    <div className="flex h-full w-full">
      <main className="ml-20 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="font-merriweather-sans text-4xl font-bold text-white">
              Mon Profil
            </h1>
          </header>

          {/* Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 flex items-center justify-between rounded-lg p-4 text-sm ${
                notification.type === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {notification.type === "success" ? (
                  <Check size={18} className="mr-2" />
                ) : (
                  <X size={18} className="mr-2" />
                )}
                {notification.message}
              </div>
              <button onClick={() => setNotification(null)}>
                <X size={18} />
              </button>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="rounded-t-[30px] border-b border-purple-100 bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center px-1 py-2 ${
                  activeTab === "profile"
                    ? "border-b-2 border-purple-600 font-medium text-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
              >
                <User className="mr-2" size={18} />
                Informations Personnelles
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`flex items-center px-1 py-2 ${
                  activeTab === "applications"
                    ? "border-b-2 border-purple-600 font-medium text-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
              >
                <Briefcase className="mr-2" size={18} />
                {isRecruiter ? "Offres Publiées" : "Mes Candidatures"}
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex items-center px-1 py-2 ${
                  activeTab === "stats"
                    ? "border-b-2 border-purple-600 font-medium text-purple-600"
                    : "text-gray-500 hover:text-purple-500"
                }`}
              >
                <Sparkles className="mr-2" size={18} />
                Statistiques
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="mb-8 rounded-b-[30px] bg-white/70 p-6 shadow-md backdrop-blur-sm">
            {/* Profile Information */}
            {activeTab === "profile" && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-medium text-gray-800">
                    Informations Personnelles
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-all hover:bg-purple-500"
                  >
                    {isEditing ? (
                      <>
                        <X size={16} className="mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <PenSquare size={16} className="mr-2" />
                        Modifier
                      </>
                    )}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="group relative">
                      <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-purple-200 shadow-md">
                        <Image
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Avatar de profil"
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <Upload size={24} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Pseudo
                          </label>
                          <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              !isEditing ? "bg-gray-50" : ""
                            }`}
                          />
                        </div>
                        {/* <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              !isEditing ? "bg-gray-50" : ""
                            }`}
                          />
                        </div> */}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              !isEditing ? "bg-gray-50" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {errorSkills && (
                    <p className="mt-8 border-t border-gray-200 pt-6 text-sm text-slate-700">
                      Erreur lors du chargement des compétences
                    </p>
                  )}
                  {!isLoadingSkills && !isLoadingUserDetails && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <UserSkillsSelector
                        userSkills={userDetails?.skills ?? []}
                        onSkillsChange={handleSkillsChange}
                        allSkills={skills}
                        // className={
                        //   !isEditing ? "pointer-events-none opacity-80" : ""
                        // }
                      />
                    </div>
                  )}

                  {/* Resume Upload */}
                  {!isRecruiter && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg font-medium text-gray-800">
                        Mon CV
                      </h3>
                      <div
                        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${
                          isEditing
                            ? "cursor-pointer border-purple-300 hover:border-purple-500"
                            : "border-gray-200"
                        }`}
                      >
                        {isEditing ? (
                          <label className="w-full cursor-pointer">
                            <div className="flex flex-col items-center">
                              <FileText
                                size={36}
                                className="mb-2 text-purple-500"
                              />
                              <p className="mb-1 text-sm text-gray-600">
                                {resume
                                  ? resume.name
                                  : "Glissez-déposez votre CV ou cliquez pour parcourir"}
                              </p>
                              <p className="text-xs text-gray-400">
                                PDF, DOCX, maximum 5MB
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx"
                              onChange={handleResumeChange}
                            />
                          </label>
                        ) : (
                          <div className="flex items-center">
                            <FileText
                              size={28}
                              className="mr-3 text-gray-500"
                            />
                            <div>
                              <p className="text-sm font-medium">mon-cv.pdf</p>
                              <p className="text-xs text-gray-500">
                                Téléchargé le 15/02/2025
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Password Change Section */}
                  {isEditing && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h3 className="mb-3 text-lg font-medium text-gray-800">
                        Changer de mot de passe
                      </h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                          />
                          <input
                            type="password"
                            placeholder="Mot de passe actuel"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                          />
                          <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                          />
                          <input
                            type="password"
                            placeholder="Confirmer le nouveau mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center rounded-lg bg-purple-600 px-6 py-2 text-white transition-all hover:bg-purple-500"
                      >
                        <Check size={18} className="mr-2" />
                        Enregistrer les modifications
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* Applications/Offers Tab */}
            {activeTab === "applications" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="space-y-6"
              >
                <h2 className="mb-4 text-2xl font-medium text-gray-800">
                  {isRecruiter ? "Offres Publiées" : "Mes Candidatures"}
                </h2>

                {/* For normal users - Applications */}
                {!isRecruiter &&
                user.applications &&
                user.applications.length > 0 ? (
                  <div className="space-y-4">
                    {user.applications.map((application) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {application?.offer?.title}
                            </h3>
                            <p className="text-gray-600">
                              {application?.offer?.company_name}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
                                {application?.offer?.contract_type}
                              </span>
                              <span className="text-xs text-gray-500">
                                Postulé le 28/02/2025
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                              En attente
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="line-clamp-1 text-sm italic text-gray-500">
                            "{application.content.substring(0, 80)}..."
                          </p>
                          <button className="flex items-center text-sm text-purple-600 transition-colors hover:text-purple-500">
                            Voir les détails
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : !isRecruiter ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
                    <Briefcase
                      size={48}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">
                      Vous n'avez pas encore postulé à des offres
                    </p>
                  </div>
                ) : null}

                {/* For recruiters - Job Offers */}
                {isRecruiter && user.offers && user.offers.length > 0 ? (
                  <div className="space-y-4">
                    {user.offers.map((offer) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl border border-purple-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {offer.title}
                            </h3>
                            <p className="text-gray-600">
                              {offer.company_name}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="rounded-full bg-purple-500 px-2 py-1 text-xs text-white">
                                {offer.contract_type}
                              </span>
                              <span className="text-xs text-gray-500">
                                Publié le 05/02/2025
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                              Active
                            </span>
                            <span className="mt-2 text-sm text-gray-600">
                              8 candidatures
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="line-clamp-1 text-sm text-gray-500">
                            {offer.description.substring(0, 80)}...
                          </p>
                          <button className="flex items-center text-sm text-purple-600 transition-colors hover:text-purple-500">
                            Gérer les candidatures
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : isRecruiter ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 py-10 text-center">
                    <Briefcase
                      size={48}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">
                      Vous n'avez pas encore publié d'offres
                    </p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <h2 className="mb-6 text-2xl font-medium text-gray-800">
                  Mes Statistiques
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Stat Card 1 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg"
                  >
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Briefcase size={80} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">
                      {isRecruiter ? "Offres Publiées" : "Candidatures"}
                    </h3>
                    <p className="mb-1 text-4xl font-bold">
                      {isRecruiter ? offersPosted : applicationCount}
                    </p>
                    <p className="text-sm text-purple-200">
                      {isRecruiter
                        ? "Offres actives pour votre entreprise"
                        : "Candidatures soumises au total"}
                    </p>
                  </motion.div>

                  {/* Stat Card 2 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white shadow-lg"
                  >
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Calendar size={80} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">
                      {isRecruiter ? "Candidatures Reçues" : "En Attente"}
                    </h3>
                    <p className="mb-1 text-4xl font-bold">
                      {isRecruiter ? "24" : pendingApplications}
                    </p>
                    <p className="text-sm text-blue-200">
                      {isRecruiter
                        ? "Candidatures à traiter"
                        : "Candidatures en cours de traitement"}
                    </p>
                  </motion.div>

                  {/* Stat Card 3 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 p-6 text-white shadow-lg"
                  >
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Award size={80} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">
                      {isRecruiter ? "Taux de Réponse" : "Taux de Complétion"}
                    </h3>
                    <p className="mb-1 text-4xl font-bold">
                      {isRecruiter ? "87%" : "100%"}
                    </p>
                    <p className="text-sm text-teal-200">
                      {isRecruiter
                        ? "Candidatures avec une réponse"
                        : "Profil complété à 100%"}
                    </p>
                  </motion.div>
                </div>

                {/* Activity Timeline */}
                <div className="mt-10">
                  <h3 className="mb-4 text-xl font-medium text-gray-800">
                    Activité Récente
                  </h3>
                  <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-purple-100">
                    {/* Activity Item 1 */}
                    <div className="flex items-start">
                      <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
                      <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter
                              ? 'Nouvelle candidature reçue pour "Développeur Full Stack"'
                              : 'Candidature soumise pour "Développeur Full Stack"'}
                          </p>
                          <span className="text-sm text-gray-500">
                            Il y a 2 jours
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {isRecruiter
                            ? "Un nouveau candidat a postulé à votre offre"
                            : "Votre candidature a été reçue par le recruteur"}
                        </p>
                      </div>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="flex items-start">
                      <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
                      <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter
                              ? 'Offre "Product Owner" publiée'
                              : "Profil mis à jour"}
                          </p>
                          <span className="text-sm text-gray-500">
                            Il y a 5 jours
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {isRecruiter
                            ? "Votre offre est maintenant visible par les candidats"
                            : "Vous avez mis à jour vos informations personnelles"}
                        </p>
                      </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="flex items-start">
                      <div className="z-10 ml-[18px] mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-purple-500"></div>
                      <div className="ml-6 w-full rounded-lg border border-purple-50 bg-white p-4 shadow-sm">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter ? "Compte créé" : "CV téléchargé"}
                          </p>
                          <span className="text-sm text-gray-500">
                            Il y a 3 semaines
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {isRecruiter
                            ? "Bienvenue sur la plateforme!"
                            : "Vous avez mis à jour votre CV"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
