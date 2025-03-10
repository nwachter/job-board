"use client";
import React, { useState } from "react";
import { Briefcase, Users, Building2, Info, FileText } from "lucide-react";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { useRouter } from "next/navigation";

type NavItemProps = {
  icon: React.ReactNode;
  title: string;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
};

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  title,
  isExpanded,
  isActive,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`
flex items-center px-4 py-3 cursor-pointer
${isActive ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-50"}
`}
  >
    <span className="w-6 h-6">{icon}</span>
    {isExpanded && <span className="ml-3 font-medium">{title}</span>}
  </div>
);

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const router = useRouter();
  const { data: userInfo } = useGetUserInfo();
  return (
    <nav
      className={`fixed h-full z-50 bg-white/70 transition-all rounded-r-2xl duration-300 ease-in-out shadow-lg ${
        isNavExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsNavExpanded(true)}
      onMouseLeave={() => setIsNavExpanded(false)}
    >
      <div className="p-4">
        <h1
          className={`font-bold  font-merriweather-sans text-xl ${
            !isNavExpanded && "hidden"
          }`}
        >
          JobBoard
        </h1>
        <span className={`text-xl font-bold ${isNavExpanded && "hidden"}`}>
          JB
        </span>
      </div>

      <div className="mt-8 font-dm-sans">
        <NavItem
          icon={<Briefcase />}
          title="Dashboard"
          isExpanded={isNavExpanded}
          isActive={activeSection === "dashboard"}
          onClick={() => {
            router.push("/dashboard");
            setActiveSection("dashboard");
          }}
        />
        {!userInfo && (
          <NavItem
            icon={<Briefcase />}
            title="Jobs"
            isExpanded={isNavExpanded}
            isActive={activeSection === "jobs"}
            onClick={() => {
              router.push("/jobs");
              setActiveSection("jobs");
            }} //pour les non connectés
          />
        )}
        {/* <NavItem
                    icon={<Briefcase />}
                    title="Dashboard"
                    isExpanded={isNavExpanded}
                    isActive={activeSection === 'dashboard'}
                    onClick={() => setActiveSection('dashboard')} //pour les admins et users
                /> */}
        {userInfo?.role === "recruiter" && (
          <NavItem
            icon={<Users />}
            title="Candidatures"
            isExpanded={isNavExpanded}
            isActive={activeSection === "candidats"}
            onClick={() => {
              router.push("/dashboard/applications");
              setActiveSection("candidatures");
            }}
          />
        )}
        {userInfo?.role === "user" && (
          <NavItem
            icon={<Building2 />}
            title="Entreprises"
            isExpanded={isNavExpanded}
            isActive={activeSection === "entreprises"}
            onClick={() => setActiveSection("entreprises")}
          />
        )}
        <NavItem
          icon={<FileText />}
          title="Blog"
          isExpanded={isNavExpanded}
          isActive={activeSection === "blog"}
          onClick={() => setActiveSection("blog")}
        />
        <NavItem
          icon={<Info />}
          title="À Propos"
          isExpanded={isNavExpanded}
          isActive={activeSection === "about"}
          onClick={() => setActiveSection("about")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
