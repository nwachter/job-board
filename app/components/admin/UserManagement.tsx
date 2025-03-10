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
// import { Offer } from '@/app/types/offer'
// import { motion } from 'framer-motion'

// // Mock data
// // const mockUsers = [
// //   { 
// //     id: '1', 
// //     username: 'Thomas Martin', 
// //     email: 'thomas.martin@example.com', 
// //     role: 'CANDIDATE',
// //     status: 'active',
// //     createdAt: '2025-01-15T10:30:00Z',
// //     avatar: '/avatars/user1.jpg',
// //     applications: 8
// //   },
// //   { 
// //     id: '2', 
// //     username: 'Marie Dupont', 
// //     email: 'marie.dupont@example.com', 
// //     role: 'CANDIDATE',
// //     status: 'active',
// //     createdAt: '2025-02-02T14:15:00Z',
// //     avatar: '/avatars/user2.jpg',
// //     applications: 3
// //   },
// //   { 
// //     id: '3', 
// //     username: 'Jean Durand', 
// //     email: 'jean.durand@techcorp.com', 
// //     role: 'RECRUITER',
// //     status: 'active',
// //     createdAt: '2025-01-20T09:45:00Z',
// //     avatar: '/avatars/user3.jpg',
// //     offers: 5
// //   },
// //   { 
// //     id: '4', 
// //     username: 'Sophie Bernard', 
// //     email: 'sophie.bernard@example.com', 
// //     role: 'CANDIDATE',
// //     status: 'inactive',
// //     createdAt: '2025-01-10T11:20:00Z',
// //     avatar: '/avatars/user4.jpg',
// //     applications: 0
// //   },
// //   { 
// //     id: '5', 
// //     username: 'Pierre Moreau', 
// //     email: 'pierre.moreau@digitalcompany.com', 
// //     role: 'RECRUITER',
// //     status: 'active',
// //     createdAt: '2025-02-05T16:30:00Z',
// //     avatar: '/avatars/user5.jpg',
// //     offers: 2
// //   },
// // ]

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

//   const {data: usersData} = 
  
//   // New user form state
//   const [newUser, setNewUser] = useState({
//     username: '',
//     email: '',
//     role: 'CANDIDATE',
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
//       offers: Offer
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
//                 <option value="active">Actifs</option>
//                 <option value="inactive">Inactifs</option>
//                 <option value="suspended">Suspendus</option>
//               </select>
//               <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
          
//           {/* Add User Button */}
//           <button 
//             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//             onClick={() => setIsAddingUser(true)}
//           >
//             <UserPlus size={18} />
//             <span>Ajouter un utilisateur</span>
//           </button>
//         </div>
//       </div>
      
//       {/* Users Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Utilisateur
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Rôle
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Statut
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date de création
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Activité
//               </th>
//               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentUsers.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10 relative">
//                       <Image 
//                         src={user.avatar || '/avatars/default.jpg'} 
//                         alt={user.username}
//                         className="rounded-full object-cover"
//                         width={40}
//                         height={40}
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{user.username}</div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(user.role)}`}>
//                     {user.role === 'CANDIDATE' ? 'Candidat' : 
//                      user.role === 'RECRUITER' ? 'Recruteur' : 
//                      user.role === 'ADMIN' ? 'Admin' : user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(user.status)}`}>
//                     {user.status === 'active' ? 'Actif' : 
//                      user.status === 'inactive' ? 'Inactif' : 
//                      user.status === 'suspended' ? 'Suspendu' : user.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.createdAt).toLocaleDateString('fr-FR')}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {user.role === 'CANDIDATE' ? 
//                     `${user.applications || 0} candidature${user.applications !== 1 ? 's' : ''}` : 
//                     `${user.offers || 0} offre${user.offers !== 1 ? 's' : ''}`
//                   }
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <div className="flex items-center justify-end space-x-2">
//                     <button 
//                       className="text-indigo-600 hover:text-indigo-900"
//                       onClick={() => setEditingUser(user.id)}
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button 
//                       className="text-red-600 hover:text-red-900"
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
        
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
//             <div className="text-sm text-gray-700">
//               Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
//               <span className="font-medium">
//                 {Math.min(indexOfLastItem, filteredUsers.length)}
//               </span>{' '}
//               sur <span className="font-medium">{filteredUsers.length}</span> utilisateurs
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
//               >
//                 <ChevronLeft size={20} />
//               </button>
//               <div className="text-sm text-gray-700">
//                 {currentPage} / {totalPages}
//               </div>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Add User Modal */}
//       {isAddingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
//               <button 
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsAddingUser(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <form onSubmit={handleAddUser}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Nom d'utilisateur
//                   </label>
//                   <input 
//                     type="text" 
//                     name="username" 
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     value={newUser.username}
//                     onChange={handleInputChange}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input 
//                     type="email" 
//                     name="email" 
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     value={newUser.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rôle
//                   </label>
//                   <select 
//                     name="role" 
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     value={newUser.role}
//                     onChange={handleInputChange}
//                   >
//                     <option value="CANDIDATE">Candidat</option>
//                     <option value="RECRUITER">Recruteur</option>
//                     <option value="ADMIN">Admin</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Mot de passe
//                   </label>
//                   <input 
//                     type="password" 
//                     name="password" 
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     value={newUser.password}
//                     onChange={handleInputChange}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Confirmer le mot de passe
//                   </label>
//                   <input 
//                     type="password" 
//                     name="confirmPassword" 
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     value={newUser.confirmPassword}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
              
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button 
//                   type="button"
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   onClick={() => setIsAddingUser(false)}
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   type="submit"
//                   className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//                 >
//                   Ajouter
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
      
//       {/* Edit User Modal */}
//       {editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
//               <button 
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setEditingUser(null)}
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="mt-6 flex justify-end space-x-3">
//               <button 
//                 type="button"
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 onClick={() => setEditingUser(null)}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//                 onClick={() => {
//                   // Simulating user edit - we would implement actual edit functionality here
//                   setEditingUser(null)
//                 }}
//               >
//                 Enregistrer
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
      
//       {/* Delete Confirmation */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
//           >
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                 <Trash2 size={32} className="text-red-600" />
//               </div>
//               <h2 className="text-xl font-bold mb-2">Confirmer la suppression</h2>
//               <p className="text-gray-600 text-center mb-6">
//                 Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.
//               </p>
              
//               <div className="flex justify-center space-x-3 w-full">
//                 <button 
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   onClick={() => setShowDeleteConfirm(null)}
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   onClick={() => handleDeleteUser(showDeleteConfirm)}
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default UserManagement