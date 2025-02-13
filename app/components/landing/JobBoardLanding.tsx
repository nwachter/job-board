'use client';
import React, { useState } from 'react';
import { Search, X, User } from 'lucide-react';
import TopButtons from '@/app/components/layout/TopButtons';

const JobBoardLanding = () => {


  return (
    <div className="w-full h-full flex">
   
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 old:bg-gradient-to-br from-pink-200 via-purple-300 to-cyan-200" />
  <TopButtons />

        <div className="relative h-full font-merriweather-sans flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl">
            <span className="text-cyan-100">Découvrez des centaines</span>
            <br />
            <span className="text-cyan-100">d'offres d'emploi,</span>
          </h1>
          <p className="text-3xl font-semibold text-white mb-12">
            et postulez sans inscription
          </p>

  
          <div className="bg-white bg-opacity-40 font-merriweather-sans backdrop-blur-md p-2 rounded-full flex space-x-4 max-w-2xl w-full">
            <button className="flex-1 bg-white py-4 px-6 rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
              Je suis recruteur
            </button>
            <button className="flex-1 bg-gray-700 py-4 px-6 rounded-full text-white hover:bg-gray-600 transition-colors">
              Je cherche un emploi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoardLanding;