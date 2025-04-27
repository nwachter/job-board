"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Briefcase, Users, Building2, FileText, ShieldAlert, Home, ChevronRight, Menu, X } from "lucide-react"
import { useGetUserInfo } from "@/app/hooks/useUserInfo"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Role } from "@/app/types/user"

type NavItem = {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  title: string
  path: string
  roles?: string[]
  showAlways?: boolean
}

const navItems: NavItem[] = [
  {
    icon: <Home size={20} />,
    activeIcon: <Home size={20} />,
    title: "Dashboard",
    path: "/dashboard",
    roles: [Role.RECRUITER, Role.USER],
  },
  {
    icon: <Briefcase size={20} />,
    activeIcon: <Briefcase size={20} />,
    title: "Offres d'emploi",
    path: "/jobs",
    showAlways: true,
  },
  {
    icon: <Users size={20} />,
    activeIcon: <Users size={20} />,
    title: "Candidatures",
    path: "/dashboard/applications",
    roles: [Role.RECRUITER, Role.USER],
  },
  {
    icon: <Building2 size={20} />,
    activeIcon: <Building2 size={20} />,
    title: "Entreprises",
    path: "/companies",
    roles: [Role.USER],
  },
  {
    icon: <FileText size={20} />,
    activeIcon: <FileText size={20} />,
    title: "Blog",
    path: "/blog",
    showAlways: true,
  },
  {
    icon: <ShieldAlert size={20} />,
    activeIcon: <ShieldAlert size={20} />,
    title: "Administration",
    path: "/admin",
    roles: [Role.RECRUITER, Role.ADMIN],
  },
]

type NavItemProps = {
  item: NavItem
  isExpanded: boolean
  isActive: boolean
  onClick: () => void
}

const NavItemComponent = ({ item, isExpanded, isActive, onClick }: NavItemProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 my-1 cursor-pointer rounded-lg transition-all relative group",
        isActive
          ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white"
          : "text-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
      )}
      whileHover={{
        x: isExpanded ? 4 : 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        {isActive ? item.activeIcon || item.icon : item.icon}
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.span
            className="ml-3 font-medium whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
              delay: 0.1, // Increased delay to ensure background expands first
            }}
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>

      {!isExpanded && !isActive && (
        <motion.div
          className="absolute left-14 px-3 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg text-sm font-medium z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.title}
        </motion.div>
      )}

      {isExpanded && !isActive && (
        <motion.div
          className="ml-auto opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} />
        </motion.div>
      )}
    </motion.div>
  )
}

export const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { data: userInfo } = useGetUserInfo()
  const userRole = useMemo(() => (userInfo?.role || "GUEST"), [userInfo])



  // Handle window resize for mobile/desktop view
  useEffect(() => {
    console.log("USERROLE", userInfo?.role)
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavExpanded(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.showAlways || (item.roles && item.roles.includes(userRole)))

  // Toggle mobile nav
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  // Navigate to a path
  const navigateTo = (path: string) => {
    router.push(path)
    if (window.innerWidth < 768) {
      setIsMobileNavOpen(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <motion.button
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-gray-700"
          onClick={toggleMobileNav}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main navigation */}
      <motion.nav
        className={cn(
          "fixed h-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-r border-gray-200/50 dark:border-gray-700/30",
          "transition-all duration-300 ease-in-out",
          "md:block",
          isMobileNavOpen ? "left-0" : "-left-full md:left-0",
        )}
        initial={false}
        animate={{
          width: isNavExpanded ? 240 : 80,
          transition: { type: "spring", stiffness: 800, damping: 20 }, // Much higher stiffness, lower damping
        }}
        onMouseEnter={() => window.innerWidth >= 768 && setIsNavExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsNavExpanded(false)}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/30">
          <div className="flex items-center">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              JB
            </motion.div>

            <AnimatePresence mode="wait">
              {isNavExpanded && (
                <motion.h1
                  className="ml-3 font-bold font-merriweather-sans text-xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, delay: 0.1 }} // Increased delay
                >
                  JobBoard
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation items */}
        <div className="mt-6 px-2 font-dm-sans">
          {filteredNavItems.map((item) => (
            <NavItemComponent
              key={item.path}
              item={item}
              isExpanded={isNavExpanded}
              isActive={pathname === item.path}
              onClick={() => navigateTo(item.path)}
            />
          ))}
        </div>

        {/* Bottom section - can be used for user profile, settings, etc. */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/30">
          <motion.div
            className={cn(
              "flex items-center rounded-lg p-2",
              "bg-gray-100/80 dark:bg-gray-800/50",
              "hover:bg-gray-200/80 dark:hover:bg-gray-700/50",
              "cursor-pointer transition-colors",
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
              {userInfo?.username?.charAt(0) || "U"}
            </div>

            <AnimatePresence mode="wait">
              {isNavExpanded && (
                <motion.div
                  className="ml-3 overflow-hidden"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15, delay: 0.1 }} // Match the same delay
                >
                  <p className="text-sm font-medium truncate">{userInfo?.username || "Utilisateur"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}

export default Navbar
