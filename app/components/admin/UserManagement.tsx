"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Lock,
  X,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"
import { useGetUsers, useUpdateUser, useDeleteUser } from "@/app/hooks/useUser"
import { useRegister } from "@/app/hooks/useAuth"
import type { User as UserType } from "@/app/types/user"

type NotificationType = {
  type: "success" | "error";
  message: string;
} | null;

type NewUserType = {
  username: string;
  email: string;
  role: "user" | "recruiter" | "admin";
  password: string;
  confirmPassword: string;
};

type EditUserType = {
  id: number | null;
  username: string;
  email: string;
  role: "user" | "recruiter" | "admin";
  password: string;
  confirmPassword: string;
};
type FormType = NewUserType | EditUserType;


const UserManagement = () => {
  const { data: users, isLoading } = useGetUsers()
  const { mutateAsync: registerUser } = useRegister()
  const { mutateAsync: deleteUser } = useDeleteUser()
  const { mutateAsync: updateUser } = useUpdateUser()

  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users ?? [])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<"all" | "user" | "recruiter" | "admin">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [notification, setNotification] = useState<NotificationType>(null)

  // New user form state
  const [newUser, setNewUser] = useState<NewUserType>({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  })

  // Edit user form state
  const [editForm, setEditForm] = useState<EditUserType>({
    id: null,
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    let updatedUsers = users ?? [];
    if (users) {
      filterUsers();
    }
    setFilteredUsers(updatedUsers); // Initialize with fetched users

  }, [users]);

  const filterUsers = () => {
    // Ensure users is an array before spreading
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }
  
    // Create a safe copy of the users array
    let filtered = [...users];
  
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  
    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }
  
    setFilteredUsers(filtered);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  // Handle form input changes
// Handle form input changes

const handleInputChange = <T extends FormType>(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formSetter: React.Dispatch<React.SetStateAction<T>>
) => {
  const { name, value } = e.target;
  formSetter((prev: T) => ({ ...prev, [name]: value }));
}
  // Handle add user form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newUser.password !== newUser.confirmPassword) {
      setNotification({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      })
      return
    }

    try {
      await registerUser({
        data: {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          avatar: "none"
        },
      })

      setNotification({
        type: "success",
        message: "Utilisateur créé avec succès",
      })

      setIsAddingUser(false)
      setNewUser({
        username: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
      })

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la création de l'utilisateur",
      })
    }
  }

  // Handle edit user
  const handleEditClick = (user: UserType) => {
    setEditingUser(user.id)
    setEditForm({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as "admin" | "recruiter" | "user",
      password: "",
      confirmPassword: "",
    })
  }

  // Handle update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setNotification({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      })
      return
    }

    try {
      const updateData = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role,
        ...(editForm.password && { password: editForm.password }),
      }

      if (!editForm.id) {
        throw new Error("User ID is missing");
      }

      await updateUser({
        id: editForm.id,
        data: updateData,
      })

      setNotification({
        type: "success",
        message: "Utilisateur mis à jour avec succès",
      })

      setEditingUser(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la mise à jour de l'utilisateur",
      })
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId)

      setNotification({
        type: "success",
        message: "Utilisateur supprimé avec succès",
      })

      setShowDeleteConfirm(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification({
        type: "error",
        message: (error as Error).message || "Erreur lors de la suppression de l'utilisateur",
      })
    }
  }

  // Get role badge style
  const getRoleBadgeStyle = (role: "user" | "recruiter" | "admin") => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "recruiter":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-purple"></div>
        <span className="ml-3 text-electric-purple font-medium">Chargement des utilisateurs...</span>
      </div>
    )
  }
  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Aucun utilisateur trouvé</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Gérez les utilisateurs de la plateforme</p>
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

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Role Filter */}
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-electric-purple bg-white"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "all" | "user" | "recruiter" | "admin")}
              >
                <option value="all">Tous les rôles</option>
                <option value="user">Candidats</option>
                <option value="recruiter">Recruteurs</option>
                <option value="admin">Admins</option>
              </select>
              <Filter
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Add User Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-electric-purple text-white rounded-lg hover:bg-electric-purple/90 transition-colors"
              onClick={() => setIsAddingUser(true)}
            >
              <UserPlus size={18} />
              Ajouter un utilisateur
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rôle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Activité
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {user.avatar ? (
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="rounded-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-electric-purple/10 flex items-center justify-center">
                            <User size={20} className="text-electric-purple" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(user.role as "admin" | "recruiter" | "user")}`}
                    >
                      {user.role === "user"
                        ? "Candidat"
                        : user.role === "recruiter"
                          ? "Recruteur"
                          : user.role === "admin"
                            ? "Admin"
                            : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === "user"
                      ? `${user.applications?.length || 0} candidature${user.applications?.length !== 1 ? "s" : ""}`
                      : user.role === "recruiter"
                        ? `${user.offers?.length || 0} offre${user.offers?.length !== 1 ? "s" : ""}`
                        : "Administrateur"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-electric-purple hover:text-electric-purple/80"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => setShowDeleteConfirm(user.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> sur{" "}
              <span className="font-medium">{filteredUsers.length}</span> utilisateurs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsAddingUser(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.username}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.email}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <div className="relative">
                      <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="role"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.role}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      >
                        <option value="user">Candidat</option>
                        <option value="recruiter">Recruteur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.password}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.confirmPassword}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAddingUser(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-electric-purple text-white rounded-md hover:bg-electric-purple/90"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditingUser(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="username"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.username}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.email}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <div className="relative">
                      <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        name="role"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.role}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      >
                        <option value="user">Candidat</option>
                        <option value="recruiter">Recruteur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe (laisser vide pour ne pas changer)
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.password}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  {editForm.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-purple"
                          value={editForm.confirmPassword}
                          onChange={(e) => handleInputChange(e, setEditForm)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setEditingUser(null)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-electric-purple text-white rounded-md hover:bg-electric-purple/90"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
                <p className="text-gray-600 text-center mb-6">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
                </p>

                <div className="flex justify-center space-x-3 w-full">
                  <button
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserManagement

