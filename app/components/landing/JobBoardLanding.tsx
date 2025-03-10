'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetUserInfo } from '@/app/hooks/useUserInfo';

const JobBoardLanding = () => {

  const router = useRouter();
  const {data: userInfo } = useGetUserInfo();

  useEffect(() => {
    if(userInfo) {
    
      router.push("/dashboard");
    }

  }, [userInfo])
  

  return (
    <div className="w-full h-full">
   
      <div className="flex-1 h-full w-full relative overflow-hidden">
        <div className="absolute inset-0" />

        <div className="relative h-full font-merriweather-sans flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl">
            <span className="text-cyan-100">Découvrez des centaines</span>
            <br />
            <span className="text-cyan-100">d'offres d'emploi,</span>
          </h1>
          <p className="text-3xl font-semibold text-white mb-12">
            et postulez après inscription
          </p>

  
          <div className="bg-white bg-opacity-40 font-merriweather-sans backdrop-blur-md p-2 rounded-full flex space-x-4 max-w-2xl w-full">
          <Link href="/sign" className='flex-1'><button className="w-full bg-white py-4 px-6 rounded-full text-gray-600 hover:bg-slate-200 transition-colors">
              Je suis recruteur
            </button></Link>
            <Link href="/jobs" className='flex-1'><button className="w-full bg-gray-700 py-4 px-6 rounded-full text-white hover:bg-gray-600 transition-colors">
              Je cherche un emploi
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoardLanding;