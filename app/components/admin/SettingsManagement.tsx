"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Globe,
  Shield,
  Database,
  Layout,
  Bell,
  Users,
  Briefcase,
  FileText,
  ToggleLeft,
  ToggleRight,
  Info,
  HelpCircle,
} from "lucide-react"

type NotificationType = {
  type: "success" | "error"
  message: string
} | null

type SettingCategory = "general" | "appearance" | "notifications" | "security" | "advanced"

interface SettingItem {
  id: string
  label: string
  description: string
  type: "toggle" | "text" | "select" | "number" | "color"
  value: any
  options?: { value: string; label: string }[]
}

const SettingsManagement = () => {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>("general")
  const [notification, setNotification] = useState<NotificationType>(null)
  //fr/en
  // Site_name
  // Site tagline
  // Contact email
  //contact phone
  // Logo
  // Language
  const [settings, setSettings] = useState<Record<SettingCategory, SettingItem[]>>({
    general: [
      {
        id: "site_name",
        label: "Nom du site",
        description: "Le nom qui apparaît dans l'en-tête et les emails",
        type: "text",
        value: "JobBoard",
      },
      {
        id: "site_description",
        label: "Description du site",
        description: "Une brève description de votre plateforme",
        type: "text",
        value: "Plateforme de recherche d'emploi et de recrutement",
      },
      {
        id: "contact_email",
        label: "Email de contact",
        description: "Email utilisé pour les communications",
        type: "text",
        value: "contact@jobboard.com",
      },
      {
        id: "language",
        label: "Langue par défaut",
        description: "Langue principale du site",
        type: "select",
        value: "fr",
        options: [
          { value: "fr", label: "Français" },
          { value: "en", label: "English" },
          { value: "es", label: "Español" },
        ],
      },
      {
        id: "maintenance_mode",
        label: "Mode maintenance",
        description: "Activer le mode maintenance pour le site",
        type: "toggle",
        value: false,
      },
    ],
    appearance: [
      {
        id: "primary_color",
        label: "Couleur principale",
        description: "Couleur principale du thème",
        type: "color",
        value: "#672BFF",
      },
      {
        id: "secondary_color",
        label: "Couleur secondaire",
        description: "Couleur secondaire du thème",
        type: "color",
        value: "#5BC0EB",
      },
      {
        id: "font_size",
        label: "Taille de police",
        description: "Taille de police par défaut",
        type: "select",
        value: "medium",
        options: [
          { value: "small", label: "Petite" },
          { value: "medium", label: "Moyenne" },
          { value: "large", label: "Grande" },
        ],
      },
      {
        id: "dark_mode",
        label: "Mode sombre",
        description: "Activer le mode sombre par défaut",
        type: "toggle",
        value: false,
      },
      {
        id: "show_logo",
        label: "Afficher le logo",
        description: "Afficher le logo dans l'en-tête",
        type: "toggle",
        value: true,
      },
    ],
    notifications: [
      {
        id: "email_notifications",
        label: "Notifications par email",
        description: "Envoyer des notifications par email",
        type: "toggle",
        value: true,
      },
      {
        id: "new_application_notification",
        label: "Nouvelle candidature",
        description: "Notification lors d'une nouvelle candidature",
        type: "toggle",
        value: true,
      },
      {
        id: "new_offer_notification",
        label: "Nouvelle offre",
        description: "Notification lors d'une nouvelle offre",
        type: "toggle",
        value: true,
      },
      {
        id: "application_status_notification",
        label: "Changement de statut",
        description: "Notification lors d'un changement de statut d'une candidature",
        type: "toggle",
        value: true,
      },
    ],
    security: [
      {
        id: "require_email_verification",
        label: "Vérification d'email",
        description: "Exiger la vérification de l'email lors de l'inscription",
        type: "toggle",
        value: true,
      },
      {
        id: "password_min_length",
        label: "Longueur minimale du mot de passe",
        description: "Nombre minimum de caractères pour les mots de passe",
        type: "number",
        value: 8,
      },
      {
        id: "password_complexity",
        label: "Complexité du mot de passe",
        description: "Niveau de complexité requis pour les mots de passe",
        type: "select",
        value: "medium",
        options: [
          { value: "low", label: "Faible" },
          { value: "medium", label: "Moyen" },
          { value: "high", label: "Élevé" },
        ],
      },
      {
        id: "session_timeout",
        label: "Délai d'expiration de session",
        description: "Durée en minutes avant l'expiration de la session",
        type: "number",
        value: 60,
      },
    ],
    advanced: [
      {
        id: "max_file_size",
        label: "Taille maximale des fichiers",
        description: "Taille maximale des fichiers en Mo",
        type: "number",
        value: 5,
      },
      {
        id: "allowed_file_types",
        label: "Types de fichiers autorisés",
        description: "Types de fichiers autorisés pour les CV",
        type: "text",
        value: "pdf,doc,docx",
      },
      {
        id: "pagination_limit",
        label: "Limite de pagination",
        description: "Nombre d'éléments par page",
        type: "number",
        value: 10,
      },
      {
        id: "enable_api",
        label: "Activer l'API",
        description: "Activer l'accès à l'API",
        type: "toggle",
        value: false,
      },
      {
        id: "debug_mode",
        label: "Mode débogage",
        description: "Activer le mode débogage",
        type: "toggle",
        value: false,
      },
    ],
  })

  const handleSettingChange = (category: SettingCategory, id: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: (prev[category] as SettingItem[]).map((setting) => (setting.id === id ? { ...setting, value } : setting)),
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    // For now, we'll just show a success notification
    setNotification({
      type: "success",
      message: "Paramètres enregistrés avec succès",
    })

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  const getCategoryIcon = (category: SettingCategory) => {
    switch (category) {
      case "general":
        return <Globe size={20} />
      case "appearance":
        return <Layout size={20} />
      case "notifications":
        return <Bell size={20} />
      case "security":
        return <Shield size={20} />
      case "advanced":
        return <Database size={20} />
    }
  }

  const renderSettingInput = (setting: SettingItem, category: SettingCategory) => {
    switch (setting.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple"
            value={setting.value}
            onChange={(e) => handleSettingChange(category, setting.id, e.target.value)}
          />
        )
      case "number":
        return (
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple"
            value={setting.value}
            onChange={(e) => handleSettingChange(category, setting.id, Number.parseInt(e.target.value))}
          />
        )
      case "select":
        return (
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple"
            value={setting.value}
            onChange={(e) => handleSettingChange(category, setting.id, e.target.value)}
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case "toggle":
        return (
          <button
            type="button"
            className="focus:outline-none"
            onClick={() => handleSettingChange(category, setting.id, !setting.value)}
          >
            {setting.value ? (
              <ToggleRight size={28} className="text-electric-purple" />
            ) : (
              <ToggleLeft size={28} className="text-gray-400" />
            )}
          </button>
        )
      case "color":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              className="w-10 h-10 rounded border border-gray-300"
              value={setting.value}
              onChange={(e) => handleSettingChange(category, setting.id, e.target.value)}
            />
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple"
              value={setting.value}
              onChange={(e) => handleSettingChange(category, setting.id, e.target.value)}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-600">Configurez les paramètres de la plateforme</p>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 mb-6 rounded-lg flex items-center justify-between ${
              notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 bg-white rounded-xl shadow-md p-4">
          <nav className="space-y-1">
            {(Object.keys(settings) as SettingCategory[]).map((category) => (
              <button
                key={category}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === category ? "bg-electric-purple text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                <span className="mr-3">{getCategoryIcon(category)}</span>
                <span className="capitalize">{category.replace("_", " ")}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Info className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={18} />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Besoin d'aide ?</h3>
                <p className="text-xs text-blue-600 mt-1">
                  Consultez notre documentation pour plus d'informations sur les paramètres.
                </p>
                <a
                  href="#"
                  className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Voir la documentation
                  <HelpCircle size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold capitalize flex items-center">
                {getCategoryIcon(activeCategory)}
                <span className="ml-2">{activeCategory.replace("_", " ")}</span>
              </h2>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-4 py-2 bg-electric-purple text-white rounded-lg hover:bg-electric-purple/90 transition-colors"
              >
                <Save size={18} />
                Enregistrer
              </button>
            </div>

            <div className="space-y-8">
              {settings[activeCategory].map((setting: SettingItem) => (
                <div key={setting.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                    </div>
                    <div className="md:w-1/3">{renderSettingInput(setting, activeCategory)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Utilisateurs</h3>
                <Users className="text-electric-purple" size={24} />
              </div>
              <p className="text-3xl font-bold mt-2">254</p>
              <p className="text-sm text-gray-500 mt-1">Utilisateurs inscrits</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Offres</h3>
                <Briefcase className="text-electric-purple" size={24} />
              </div>
              <p className="text-3xl font-bold mt-2">128</p>
              <p className="text-sm text-gray-500 mt-1">Offres publiées</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Candidatures</h3>
                <FileText className="text-electric-purple" size={24} />
              </div>
              <p className="text-3xl font-bold mt-2">376</p>
              <p className="text-sm text-gray-500 mt-1">Candidatures soumises</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsManagement

