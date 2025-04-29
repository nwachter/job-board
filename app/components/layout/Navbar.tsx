"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Users,
  Building2,
  FileText,
  ShieldAlert,
  Home,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Role } from "@/app/types/user";

type NavItem = {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  title: string;
  path: string;
  roles?: string[];
  showAlways?: boolean;
};

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
];

type NavItemProps = {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
};

const NavItemComponent = ({
  item,
  isExpanded,
  isActive,
  onClick,
}: NavItemProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "group relative my-1 flex cursor-pointer items-center rounded-lg px-4 py-3 transition-all",
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
      <div className="relative z-10 flex h-6 w-6 items-center justify-center">
        {isActive ? item.activeIcon || item.icon : item.icon}
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.span
            className="ml-3 line-clamp-1 text-ellipsis whitespace-nowrap font-medium"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              duration: 0.65,
              ease: "easeInOut",
              delay: 0.2, // Increased delay to ensure background expands first
            }}
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>

      {!isExpanded && !isActive && (
        <motion.div
          className="invisible absolute left-14 z-50 rounded-md bg-white px-3 py-1 text-sm font-medium opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 dark:bg-gray-800"
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
  );
};

export const Navbar = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: userInfo } = useGetUserInfo();
  const userRole = useMemo(() => userInfo?.role || "GUEST", [userInfo]);

  // Handle window resize for mobile/desktop view
  useEffect(() => {
    console.log("USERROLE", userInfo?.role);
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => item.showAlways || (item.roles && item.roles.includes(userRole)),
  );

  // Toggle mobile nav
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  // Navigate to a path
  const navigateTo = (path: string) => {
    router.push(path);
    if (window.innerWidth < 768) {
      setIsMobileNavOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <motion.button
          className="rounded-full bg-white/80 p-2 text-gray-700 shadow-md backdrop-blur-sm"
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
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
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
          "fixed z-50 h-full border-r border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-md dark:border-gray-700/30 dark:bg-gray-900/80",
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
        <div className="border-b border-gray-200/50 p-4 dark:border-gray-700/30">
          <div className="flex items-center">
            <motion.div
              className="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              JB
            </motion.div>

            <AnimatePresence mode="wait">
              {isNavExpanded && (
                <motion.h1
                  className="ml-3 line-clamp-1 text-ellipsis bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text font-merriweather-sans text-xl font-bold text-transparent"
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
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200/50 p-4 dark:border-gray-700/30">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-medium text-white">
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
                  <p className="truncate text-sm font-medium">
                    {userInfo?.username || "Utilisateur"}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {userRole}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
