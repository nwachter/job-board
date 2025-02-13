import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const FixedNavbar = () => {
  const [activeSection, setActiveSection] = useState('jobs');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'jobs', icon: '✳', color: 'bg-indigo-600', activeColor: 'bg-indigo-50' },
    { id: 'categories', icon: '👤', color: 'bg-red-400' },
    { id: 'about', icon: '↓', color: 'bg-green-400' },
    { id: 'blog', icon: '📝', color: 'bg-pink-400' }
  ];

  const filters = [
    { id: 'web-dev', label: 'Développeur web', active: true },
    { id: 'ui-ux', label: 'UI/UX', active: false },
    { id: 'web', label: 'Web', active: false }
  ];

  const jobs = [
    { id: 'lw', initials: 'LW', title: 'Développeur Full Stack (Pau, France)', color: 'bg-blue-100' },
    { id: 'eh', initials: 'EH', title: 'Développeur Full Stack (Pau, France)', color: 'bg-red-100' },
    { id: 'gw', initials: 'GW', title: 'Développeur Full Stack (Pau, France)', color: 'bg-green-100' }
  ];

  //Insérer deuxième menu à droite pour le "discover/chercher/jobs"

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">JobBoard</h1>
        
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <div className={activeSection === item.id ? "flex flex-col gap-6" : ""}>
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                ${activeSection === item.id ? 'bg-indigo-50' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white`}>
                {item.icon}
              </div>
              <span className="capitalize">{item.id}</span>
            </div>
            {activeSection === 'jobs' && item.id === activeSection && (
            <div className="mt-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-2 pl-8 border rounded-lg"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <X
                    className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>

              <div className="space-y-2">
                <p className="font-medium">Filters</p>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <span
                      key={filter.id}
                      className={`px-3 py-1 rounded-full text-sm
                        ${filter.active ? 'bg-black text-white' : 'bg-gray-100'}`}
                    >
                      {filter.label}
                      {filter.active && <X className="inline-block ml-1 h-4 w-4" />}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Results</p>
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center space-x-3 p-2">
                      <div className={`w-8 h-8 ${job.color} rounded flex items-center justify-center`}>
                        {job.initials}
                      </div>
                      <span className="text-sm">{job.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full border rounded-lg py-2 text-center">
                Tous les Résultats
              </button>

              <div className="space-y-2 flex gap-1 items-center flex-wrap">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked id="cdi" className="rounded" />
                  <label htmlFor="cdi">CDI</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked id="cdd" className="rounded" />
                  <label htmlFor="cdd">CDD</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="freelance" className="rounded" />
                  <label htmlFor="freelance">Freelance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="alternance" className="rounded" />
                  <label htmlFor="alternance">Alternance</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autres" className="rounded" />
                  <label htmlFor="autres">Autres</label>
                </div>
              </div>
            </div>
          )}
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default FixedNavbar;