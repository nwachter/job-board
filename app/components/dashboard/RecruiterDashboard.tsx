import React from 'react'
import JobCard from '../general/JobCard';
import { Search } from 'lucide-react';
import { Offer } from '@/app/types/offer';

const RecruiterDashboard : React.FC<{offers: Offer[]}> = ({offers}) => {
    return (
        <div className="flex h-full w-full">
    
          {/* Main Content */}
          <main className="flex-1 ml-20 p-8">
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Tableau de Bord des Offres</h1>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Publier une offre
                </button>
              </header>
    
              {/* Search Section */}
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      type="text"
                      placeholder="Rechercher une offre..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Type de contrat</option>
                    <option>CDI</option>
                    <option>CDD</option>
                    <option>Freelance</option>
                  </select>
                  <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Localisation</option>
                    <option>Paris</option>
                    <option>Lyon</option>
                    <option>Marseille</option>
                  </select>
                </div>
              </div>
    
              {/* Job Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <JobCard offer={offer} />
                ))}
              </div>
            </div>
          </main>
        </div>
      );
}

export default RecruiterDashboard