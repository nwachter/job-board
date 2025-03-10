// "use client"
// import React, { useState } from 'react'
// import {
//   Search,
//   Filter,
//   User,
//   Briefcase,
//   MoreVertical,
//   Edit,
//   Trash2,
//   UserPlus,
//   Shield,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Check
// } from 'lucide-react'
// import Image from 'next/image'
// import { motion } from 'framer-motion'

// // Mock data
// const mockUsers = [
//   {
//     id: '1',
//     username: 'Thomas Martin',
//     email: 'thomas.martin@example.com',
//     role: 'CANDIDATE',
//     status: 'active',
//     createdAt: '2025-01-15T10:30:00Z',
//     avatar: '/avatars/user1.jpg',
//     applications: 8
//   },
//   {
//     id: '2',
//     username: 'Marie Dupont',
//     email: 'marie.dupont@example.com',
//     role: 'CANDIDATE',
//     status: 'active',
//     createdAt: '2025-02-02T14:15:00Z',
//     avatar: '/avatars/user2.jpg',
//     applications: 3
//   },
//   {
//     id: '3',
//     username: 'Jean Durand',
//     email: 'jean.durand@techcorp.com',
//     role: 'RECRUITER',
//     status: 'active',
//     createdAt: '2025-01-20T09:45:00Z',
//     avatar: '/avatars/user3.jpg',
//     offers: 5
//   },
//   {
//     id: '4',
//     username: 'Sophie Bernard',
//     email: 'sophie.bernard@example.com',
//     role: 'CANDIDATE',
//     status: 'inactive',
//     createdAt: '2025-01-10T11:20:00Z',
//     avatar: '/avatars/user4.jpg',
//     applications: 0
//   },
//   {
//     id: '5',
//     username: 'Pierre Moreau',
//     email: 'pierre.moreau@digitalcompany.com',
//     role: 'RECRUITER',
//     status: 'active',
//     createdAt: '2025-02-05T16:30:00Z',
//     avatar: '/avatars/user5.jpg',
//     offers: 2
//   },
// ]

// const UserManagement: React.FC = () => {
//   // States
//   const [users, setUsers] = useState(mockUsers)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedRole, setSelectedRole] = useState('all')
//   const [selectedStatus, setSelectedStatus] = useState('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)
//   const [isAddingUser, setIsAddingUser] = useState(false)
//   const [editingUser, setEditingUser] = useState<string | null>(null)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

//   // New user form state
//   const [newUser, setNewUser] = useState({
//     username: '',
//     email: '',
//     role: 'user',
//     password: '',
//     confirmPassword: ''
//   })

//   // Filter users
//   const filteredUsers = users.filter(user => {
//     // Search term filter
//     const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase())

//     // Role filter
//     const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole.toLowerCase()

//     // Status filter
//     const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

//     return matchesSearch && matchesRole && matchesStatus
//   })

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

//   // Handle role badge style
//   const getRoleBadgeStyle = (role: string) => {
//     switch(role) {
//       case 'ADMIN':
//         return 'bg-purple-100 text-purple-800'
//       case 'RECRUITER':
//         return 'bg-blue-100 text-blue-800'
//       case 'CANDIDATE':
//         return 'bg-green-100 text-green-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   // Handle status badge style
//   const getStatusBadgeStyle = (status: string) => {
//     switch(status) {
//       case 'active':
//         return 'bg-green-100 text-green-800'
//       case 'inactive':
//         return 'bg-gray-100 text-gray-800'
//       case 'suspended':
//         return 'bg-red-100 text-red-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setNewUser(prev => ({ ...prev, [name]: value }))
//   }

//   // Handle add user form submission
//   const handleAddUser = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (newUser.password !== newUser.confirmPassword) {
//       alert("Les mots de passe ne correspondent pas")
//       return
//     }

//     // Simulate adding new user
//     const newUserObj = {
//       id: `${users.length + 1}`,
//       username: newUser.username,
//       email: newUser.email,
//       role: newUser.role,
//       status: 'active',
//       createdAt: new Date().toISOString(),
//       avatar: '/avatars/default.jpg',
//       applications: 0,
//       offers: 0
//     }

//     setUsers([...users, newUserObj])
//     setIsAddingUser(false)
//     setNewUser({
//       username: '',
//       email: '',
//       role: 'CANDIDATE',
//       password: '',
//       confirmPassword: ''
//     })
//   }

//   // Handle delete user
//   const handleDeleteUser = (userId: string) => {
//     setUsers(users.filter(user => user.id !== userId))
//     setShowDeleteConfirm(null)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Action Bar */}
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         {/* Search */}
//         <div className="relative w-full md:w-96">
//           <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="search"
//             placeholder="Rechercher un utilisateur..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex gap-4">
//           {/* Filters */}
//           <div className="flex gap-2">
//             <div className="relative">
//               <select
//                 className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//               >
//                 <option value="all">Tous les rôles</option>
//                 <option value="CANDIDATE">Candidats</option>
//                 <option value="RECRUITER">Recruteurs</option>
//                 <option value="ADMIN">Admins</option>
//               </select>
//               <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//             <div className="relative">
//               <select
//                 className="appearance-none pl-4 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//               >
//                 <option value="all">Tous les statuts</option>
//                 <option value="active">Actif</option>
//                 <option value="inactive">Inactif</option>
//                 <option value="suspended">Suspendu</option>
//               </select>
//               <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
//           {/* Add User Button */}
//           <button
//             className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
//             onClick={() => setIsAddingUser(true)}
//           >
//             <UserPlus size={18} />
//             Ajouter un utilisateur
//           </button>
//         </div>
//       </div>

//       {/* User Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Avatar</th>
//               <th className="py-2 px-4 border-b">Nom d'utilisateur</th>
//               <th className="py-2 px-4 border-b">Email</th>
//               <th className="py-2 px-4 border-b">Rôle</th>
//               <th className="py-2 px-4 border-b">Statut</th>
//               <th className="py-2 px-4 border-b">Date de création</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentUsers.map(user => (
//               <tr key={user.id}>
//                 <td className="py-2 px-4">
//                   <Image src={user.avatar} alt={user.username} width={40} height={40} className="rounded-full" />
//                 </td>
//                 <td className="py-2 px-4">{user.username}</td>
//                 <td className="py-2 px-4">{user.email}</td>
//                 <td className="py-2 px-4">
//                   <span className={`py-1 px-2 rounded-full ${getRoleBadgeStyle(user.role)}`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4">
//                   <span className={`py-1 px-2 rounded-full ${getStatusBadgeStyle(user.status)}`}>
//                     {user.status}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
//                 <td className="py-2 px-4">
//                   <div className="flex gap-2">
//                     <button
//                       className="p-2 rounded-full hover:bg-gray-200"
//                       onClick={() => setEditingUser(user.id)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       className="p-2 rounded-full hover:bg-gray-200"
//                       onClick={() => setShowDeleteConfirm(user.id)}
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center">
//         <button
//           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(prev => prev - 1)}
//         >
//           <ChevronLeft size={18} />
//         </button>
//         <span>
//           Page {currentPage} de {totalPages}
//         </span>
//         <button
//           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage(prev => prev + 1)}
//         >
//           <ChevronRight size={18} />
//         </button>
//       </div>

//       {/* Add User Form */}
//       {isAddingUser && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
//         >
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Ajouter un utilisateur</h2>
//             <form onSubmit={handleAddUser}>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Nom d'utilisateur</label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={newUser.username}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={newUser.email}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Rôle</label>
//                 <select
//                   name="role"
//                   value={newUser.role}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="CANDIDATE">Candidat</option>
//                   <option value="RECRUITER">Recruteur</option>
//                   <option value="ADMIN">Admin</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Mot de passe</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={newUser.password}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Confirmer le mot de passe</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={newUser.confirmPassword}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                   onClick={() => setIsAddingUser(false)}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
//                 >
//                   Ajouter
//                 </button>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       )}

//       {/* Delete Confirmation */}
//       {showDeleteConfirm && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
//         >
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
//             <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 onClick={() => setShowDeleteConfirm(null)}
//               >
//                 Annuler
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                 onClick={() => handleDeleteUser(showDeleteConfirm)}
//               >
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }

// const AdminDashboard: React.FC = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">Tableau de bord administrateur</h1>
//       <div className="space-y-6">
//         <UserManagement />
//         {/* Integrate userManagement and offerManagement components here */}
//         {/* <UserManagement /> */}
//         {/* <OfferManagement /> */}
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard
