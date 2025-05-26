"use client";
// import JobBoardLanding from '@/app/components/JobBoardLanding';

// export default function Home() {
//   return <JobBoardLanding />;
// }

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

export default function JobBoardDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } flex h-full flex-col bg-white p-4 shadow-lg transition-all duration-300`}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="mb-6">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="flex flex-col gap-4">
          <SidebarItem text="Jobs" isOpen={isOpen} />
          <SidebarItem text="Candidatures" isOpen={isOpen} />
          <SidebarItem text="Profil" isOpen={isOpen} />
          <SidebarItem text="Paramètres" isOpen={isOpen} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Jobs Dashboard</h1>

        {/* Search Section */}
        <div className="mt-6 flex items-center gap-4 rounded-lg bg-white p-4 shadow-lg">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un emploi..."
            className="flex-1 text-lg outline-none"
          />
          <button className="bg-purple-600 text-white">Rechercher</button>
        </div>

        {/* Job Cards */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <JobCard
            title="Développeur Full Stack"
            company="Google"
            location="Paris, France"
          />
          <JobCard
            title="UI/UX Designer"
            company="Apple"
            location="Lyon, France"
          />
          <JobCard
            title="Product Manager"
            company="Microsoft"
            location="Remote"
          />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ isOpen, text }: { isOpen: boolean; text: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg p-2 hover:bg-gray-200">
      {isOpen && <span className="text-lg font-medium">{text}</span>}
    </div>
  );
}

function JobCard({
  title,
  company,
  location,
}: {
  title: string;
  company: string;
  location: string;
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{company}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <button className="mt-4 w-full bg-purple-600 text-white">
          Postuler
        </button>
      </div>
    </div>
  );
}
