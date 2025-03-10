"use client"
import React, { useState, useEffect } from 'react'
import { User, Briefcase, Mail, Lock, Upload, FileText, Calendar, Award, Sparkles, ChevronRight, PenSquare, X, Check } from 'lucide-react'
import Image from 'next/image'
import { User as UserType } from '@/app/types/user'

import { motion } from 'framer-motion';

// Types
type ProfileProps = {
  user: Omit<UserType, 'password'> | null
}

// Fade in animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  // States for form data
  const [firstname, setFirstname] = useState(user?.username.split(' ')[0] || '')
  const [lastname, setLastname] = useState(user?.username.split(' ')[1] || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/default-avatar.png')

  // User role
  const isRecruiter = user?.role === 'recruiter'

  // Stats
  const applicationCount = user?.applications?.length || 0
  const pendingApplications = user?.applications?.filter(app => !app?.offer?.recruiter_id).length || 0
  const offersPosted = user?.offers?.length || 0

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (newPassword && newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'Les mots de passe ne correspondent pas' })
      return
    }

    // Create form data for file uploads
    const formData = new FormData()
    formData.append('firstname', firstname)
    formData.append('lastname', lastname)
    formData.append('email', email)
    
    if (currentPassword && newPassword) {
      formData.append('currentPassword', currentPassword)
      formData.append('newPassword', newPassword)
    }
    
    if (avatar) {
      formData.append('avatar', avatar)
    }
    
    if (resume) {
      formData.append('resume', resume)
    }

    try {
      // Simulating API call
      // In a real application, this would be an actual API call:
      // const response = await fetch('/api/user/update', {
      //   method: 'POST',
      //   body: formData
      // })
      
      // For this example, we'll just simulate success
      setTimeout(() => {
        setNotification({ type: 'success', message: 'Profil mis à jour avec succès' })
        setIsEditing(false)
        
        // Reset password fields after successful update
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000)
      }, 800)
    } catch (error) {
      setNotification({ type: 'error', message: 'Erreur lors de la mise à jour du profil' })
    }
  }

  // Handle file changes
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatar(file)
      
      // Create a preview URL
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0])
      setNotification({ type: 'success', message: 'CV téléchargé avec succès' })
      setTimeout(() => setNotification(null), 3000)
    }
  }
 if(!user) return <div><p>Chargement...</p></div>
  return (
    <div className="flex h-full w-full">
      <main className="flex-1 ml-20 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-white text-4xl font-merriweather-sans font-bold">Mon Profil</h1>
          </header>

          {/* Notification */}
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 mb-6 text-sm rounded-lg flex items-center justify-between ${
                notification.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? <Check size={18} className="mr-2" /> : <X size={18} className="mr-2" />}
                {notification.message}
              </div>
              <button onClick={() => setNotification(null)}>
                <X size={18} />
              </button>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white/70 backdrop-blur-sm rounded-t-[30px] p-4 border-b border-purple-100">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center py-2 px-1 ${activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500 hover:text-purple-500'}`}
              >
                <User className="mr-2" size={18} />
                Informations Personnelles
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`flex items-center py-2 px-1 ${activeTab === 'applications' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500 hover:text-purple-500'}`}
              >
                <Briefcase className="mr-2" size={18} />
                {isRecruiter ? 'Offres Publiées' : 'Mes Candidatures'}
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex items-center py-2 px-1 ${activeTab === 'stats' ? 'text-purple-600 border-b-2 border-purple-600 font-medium' : 'text-gray-500 hover:text-purple-500'}`}
              >
                <Sparkles className="mr-2" size={18} />
                Statistiques
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white/70 backdrop-blur-sm rounded-b-[30px] p-6 shadow-md mb-8">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium text-gray-800">Informations Personnelles</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all"
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
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-md">
                        <Image 
                          src={avatarPreview} 
                          alt="Avatar de profil" 
                          width={128} 
                          height={128} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {isEditing && (
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={24} />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                      )}
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                          <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                          <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${!isEditing ? 'bg-gray-50' : ''}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  {!isRecruiter && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Mon CV</h3>
                      <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${isEditing ? 'border-purple-300 hover:border-purple-500 cursor-pointer' : 'border-gray-200'}`}>
                        {isEditing ? (
                          <label className="w-full cursor-pointer">
                            <div className="flex flex-col items-center">
                              <FileText size={36} className="text-purple-500 mb-2" />
                              <p className="text-sm text-gray-600 mb-1">{resume ? resume.name : 'Glissez-déposez votre CV ou cliquez pour parcourir'}</p>
                              <p className="text-xs text-gray-400">PDF, DOCX, maximum 5MB</p>
                            </div>
                            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleResumeChange} />
                          </label>
                        ) : (
                          <div className="flex items-center">
                            <FileText size={28} className="text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium">mon-cv.pdf</p>
                              <p className="text-xs text-gray-500">Téléchargé le 15/02/2025</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Password Change Section */}
                  {isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Changer de mot de passe</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="password"
                            placeholder="Mot de passe actuel"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="password"
                            placeholder="Confirmer le nouveau mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all flex items-center"
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
            {activeTab === 'applications' && (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
                className="space-y-6"
              >
                <h2 className="text-2xl font-medium text-gray-800 mb-4">
                  {isRecruiter ? 'Offres Publiées' : 'Mes Candidatures'}
                </h2>

                {/* For normal users - Applications */}
                {!isRecruiter && user.applications && user.applications.length > 0 ? (
                  <div className="space-y-4">
                    {user.applications.map((application) => (
                      <motion.div 
                        key={application.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{application?.offer?.title}</h3>
                            <p className="text-gray-600">{application?.offer?.company_name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full">{application?.offer?.contract_type}</span>
                              <span className="text-xs text-gray-500">Postulé le 28/02/2025</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              En attente
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <p className="text-sm text-gray-500 italic line-clamp-1">
                            "{application.content.substring(0, 80)}..."
                          </p>
                          <button className="text-purple-600 text-sm flex items-center hover:text-purple-500 transition-colors">
                            Voir les détails
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : !isRecruiter ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Vous n'avez pas encore postulé à des offres</p>
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
                        className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{offer.title}</h3>
                            <p className="text-gray-600">{offer.company_name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full">{offer.contract_type}</span>
                              <span className="text-xs text-gray-500">Publié le 05/02/2025</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                            <span className="text-sm mt-2 text-gray-600">8 candidatures</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {offer.description.substring(0, 80)}...
                          </p>
                          <button className="text-purple-600 text-sm flex items-center hover:text-purple-500 transition-colors">
                            Gérer les candidatures
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : isRecruiter ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Vous n'avez pas encore publié d'offres</p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={fadeIn}
              >
                <h2 className="text-2xl font-medium text-gray-800 mb-6">Mes Statistiques</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stat Card 1 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-6 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute right-0 bottom-0 opacity-10">
                      <Briefcase size={80} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {isRecruiter ? 'Offres Publiées' : 'Candidatures'}
                    </h3>
                    <p className="text-4xl font-bold mb-1">
                      {isRecruiter ? offersPosted : applicationCount}
                    </p>
                    <p className="text-purple-200 text-sm">
                      {isRecruiter 
                        ? 'Offres actives pour votre entreprise' 
                        : 'Candidatures soumises au total'}
                    </p>
                  </motion.div>

                  {/* Stat Card 2 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute right-0 bottom-0 opacity-10">
                      <Calendar size={80} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {isRecruiter ? 'Candidatures Reçues' : 'En Attente'}
                    </h3>
                    <p className="text-4xl font-bold mb-1">
                      {isRecruiter ? '24' : pendingApplications}
                    </p>
                    <p className="text-blue-200 text-sm">
                      {isRecruiter 
                        ? 'Candidatures à traiter' 
                        : 'Candidatures en cours de traitement'}
                    </p>
                  </motion.div>

                  {/* Stat Card 3 */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-xl p-6 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute right-0 bottom-0 opacity-10">
                      <Award size={80} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {isRecruiter ? 'Taux de Réponse' : 'Taux de Complétion'}
                    </h3>
                    <p className="text-4xl font-bold mb-1">
                      {isRecruiter ? '87%' : '100%'}
                    </p>
                    <p className="text-teal-200 text-sm">
                      {isRecruiter 
                        ? 'Candidatures avec une réponse' 
                        : 'Profil complété à 100%'}
                    </p>
                  </motion.div>
                </div>
                
                {/* Activity Timeline */}
                <div className="mt-10">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Activité Récente</h3>
                  <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-purple-100">
                    {/* Activity Item 1 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-500 w-3 h-3 mt-2 rounded-full ml-[18px] z-10"></div>
                      <div className="ml-6 bg-white p-4 rounded-lg border border-purple-50 shadow-sm w-full">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter 
                              ? 'Nouvelle candidature reçue pour "Développeur Full Stack"' 
                              : 'Candidature soumise pour "Développeur Full Stack"'}
                          </p>
                          <span className="text-sm text-gray-500">Il y a 2 jours</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {isRecruiter 
                            ? 'Un nouveau candidat a postulé à votre offre' 
                            : 'Votre candidature a été reçue par le recruteur'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Activity Item 2 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-500 w-3 h-3 mt-2 rounded-full ml-[18px] z-10"></div>
                      <div className="ml-6 bg-white p-4 rounded-lg border border-purple-50 shadow-sm w-full">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter 
                              ? 'Offre "Product Owner" publiée' 
                              : 'Profil mis à jour'}
                          </p>
                          <span className="text-sm text-gray-500">Il y a 5 jours</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {isRecruiter 
                            ? 'Votre offre est maintenant visible par les candidats' 
                            : 'Vous avez mis à jour vos informations personnelles'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Activity Item 3 */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-purple-500 w-3 h-3 mt-2 rounded-full ml-[18px] z-10"></div>
                      <div className="ml-6 bg-white p-4 rounded-lg border border-purple-50 shadow-sm w-full">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {isRecruiter 
                              ? 'Compte créé' 
                              : 'CV téléchargé'}
                          </p>
                          <span className="text-sm text-gray-500">Il y a 3 semaines</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {isRecruiter 
                            ? 'Bienvenue sur la plateforme!' 
                            : 'Vous avez mis à jour votre CV'}
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
  )
}

export default Profile