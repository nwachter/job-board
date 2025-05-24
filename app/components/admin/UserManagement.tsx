"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import Image from "next/image";
import { useGetUsers, useUpdateUser, useDeleteUser } from "@/app/hooks/useUser";
import { useRegister } from "@/app/hooks/useAuth";
import { Role, User as UserType } from "@/app/types/user";

type NotificationType = {
  type: "success" | "error";
  message: string;
} | null;

type NewUserType = {
  username: string;
  email: string;
  role: Role;
  password: string;
  confirmPassword: string;
};

type EditUserType = {
  id: number | null;
  username: string;
  email: string;
  role: Role;
  password: string;
  confirmPassword: string;
};
type FormType = NewUserType | EditUserType;

const UserManagement = () => {
  const { data: users, isLoading } = useGetUsers();
  const { mutateAsync: registerUser } = useRegister();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users ?? []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "all" | Role.USER | Role.RECRUITER | Role.ADMIN
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null,
  );
  const [notification, setNotification] = useState<NotificationType>(null);

  // New user form state
  const [newUser, setNewUser] = useState<NewUserType>({
    username: "",
    email: "",
    role: Role.USER,
    password: "",
    confirmPassword: "",
  });

  // Edit user form state
  const [editForm, setEditForm] = useState<EditUserType>({
    id: null,
    username: "",
    email: "",
    role: Role.USER,
    password: "",
    confirmPassword: "",
  });

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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle form input changes
  // Handle form input changes

  const handleInputChange = <T extends FormType>(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formSetter: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    const { name, value } = e.target;
    formSetter((prev: T) => ({ ...prev, [name]: value }));
  };
  // Handle add user form submission
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUser.password !== newUser.confirmPassword) {
      setNotification({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      await registerUser({
        data: {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          avatar: "none",
        },
      });

      setNotification({
        type: "success",
        message: "Utilisateur créé avec succès",
      });

      setIsAddingUser(false);
      setNewUser({
        username: "",
        email: "",
        role: Role.USER,
        password: "",
        confirmPassword: "",
      });

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          (error as Error).message ||
          "Erreur lors de la création de l'utilisateur",
      });
    }
  };

  // Handle edit user
  const handleEditClick = (user: UserType) => {
    setEditingUser(user.id);
    setEditForm({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as Role.ADMIN | Role.RECRUITER | Role.USER,
      password: "",
      confirmPassword: "",
    });
  };

  // Handle update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      setNotification({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      const updateData = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role,
        ...(editForm.password && { password: editForm.password }),
      };

      if (!editForm.id) {
        throw new Error("User ID is missing");
      }

      await updateUser({
        id: editForm.id,
        data: updateData,
      });

      setNotification({
        type: "success",
        message: "Utilisateur mis à jour avec succès",
      });

      setEditingUser(null);

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          (error as Error).message ||
          "Erreur lors de la mise à jour de l'utilisateur",
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);

      setNotification({
        type: "success",
        message: "Utilisateur supprimé avec succès",
      });

      setShowDeleteConfirm(null);

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          (error as Error).message ||
          "Erreur lors de la suppression de l'utilisateur",
      });
    }
  };

  // Get role badge style
  const getRoleBadgeStyle = (role: Role.USER | Role.RECRUITER | Role.ADMIN) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800";
      case Role.RECRUITER:
        return "bg-blue-100 text-blue-800";
      case Role.USER:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-electric-purple"></div>
        <span className="ml-3 font-medium text-electric-purple">
          Chargement des utilisateurs...
        </span>
      </div>
    );
  }
  if (!users || users.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500">Aucun utilisateur trouvé</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600">Gérez les utilisateurs de la plateforme</p>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 flex items-center justify-between rounded-lg p-4 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="mr-2 h-5 w-5" />
              ) : (
                <AlertTriangle className="mr-2 h-5 w-5" />
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
      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Role Filter */}
            <div className="relative">
              <select
                className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(
                    e.target.value as
                      | "all"
                      | Role.USER
                      | Role.RECRUITER
                      | Role.ADMIN,
                  )
                }
              >
                <option value="all">Tous les rôles</option>
                <option value={Role.USER}>Candidats</option>
                <option value={Role.RECRUITER}>Recruteurs</option>
                <option value={Role.ADMIN}>Admins</option>
              </select>
              <Filter
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              />
            </div>

            {/* Add USER Button */}
            <button
              className="flex items-center gap-2 rounded-lg bg-electric-purple px-4 py-2 text-white transition-colors hover:bg-electric-purple/90"
              onClick={() => setIsAddingUser(true)}
            >
              <UserPlus size={18} />
              Ajouter un utilisateur
            </button>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Rôle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Activité
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 flex-shrink-0">
                        {user.avatar ? (
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="rounded-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-purple/10">
                            <User size={20} className="text-electric-purple" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getRoleBadgeStyle(user.role as Role.ADMIN | Role.RECRUITER | Role.USER)}`}
                    >
                      {user.role === Role.USER
                        ? "Candidat"
                        : user.role === Role.RECRUITER
                          ? "Recruteur"
                          : user.role === Role.ADMIN
                            ? Role.ADMIN
                            : user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.role === Role.USER
                      ? `${user.applications?.length || 0} candidature${user.applications?.length !== 1 ? "s" : ""}`
                      : user.role === Role.RECRUITER
                        ? `${user.offers?.length || 0} offre${user.offers?.length !== 1 ? "s" : ""}`
                        : "Administrateur"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-electric-purple hover:text-electric-purple/80"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setShowDeleteConfirm(user.id)}
                      >
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
          <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
            <div className="text-sm text-gray-700">
              Affichage de{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredUsers.length)}
              </span>{" "}
              sur <span className="font-medium">{filteredUsers.length}</span>{" "}
              utilisateurs
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded p-1 ${currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`rounded p-1 ${currentPage === totalPages ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-200"}`}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsAddingUser(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="text"
                        name="username"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.username}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.email}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Rôle
                    </label>
                    <div className="relative">
                      <Shield
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <select
                        name="role"
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.role}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      >
                        <option value={Role.USER}>Candidat</option>
                        <option value={Role.RECRUITER}>Recruteur</option>
                        <option value={Role.ADMIN}>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.password}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={newUser.confirmPassword}
                        onChange={(e) => handleInputChange(e, setNewUser)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsAddingUser(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-electric-purple px-4 py-2 text-white hover:bg-electric-purple/90"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setEditingUser(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser}>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="text"
                        name="username"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.username}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.email}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Rôle
                    </label>
                    <div className="relative">
                      <Shield
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <select
                        name="role"
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.role}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      >
                        <option value={Role.USER}>Candidat</option>
                        <option value={Role.RECRUITER}>Recruteur</option>
                        <option value={Role.ADMIN}>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nouveau mot de passe (laisser vide pour ne pas changer)
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                      />
                      <input
                        type="password"
                        name="password"
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
                        value={editForm.password}
                        onChange={(e) => handleInputChange(e, setEditForm)}
                      />
                    </div>
                  </div>

                  {editForm.password && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-electric-purple"
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
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setEditingUser(null)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-electric-purple px-4 py-2 text-white hover:bg-electric-purple/90"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h2 className="mb-2 text-xl font-bold">
                  Confirmer la suppression
                </h2>
                <p className="mb-6 text-center text-gray-600">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette
                  action ne peut pas être annulée.
                </p>

                <div className="flex w-full justify-center space-x-3">
                  <button
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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
  );
};

export default UserManagement;
