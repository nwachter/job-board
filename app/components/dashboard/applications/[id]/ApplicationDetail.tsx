"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Briefcase, Clock } from 'lucide-react';
import { Application } from '@/app/types/application';

interface ApplicationDetailProps {
  application: Partial<Application>;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application }) => {
 const router = useRouter();
  return (
    <div className="flex w-full h-full flex-col items-center justify-center  text-white">
      <div className="max-w-4xl w-full p-6 sm:min-h-96 bg-white text-black rounded-xl shadow-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 text-purple-500 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Retour aux offres
        </button>
        <h1 className="text-4xl font-bold mb-4">{application?.offer?.title}</h1>
        <p className="text-lg mb-6">{application.content}</p>

        <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-6">
          {application?.offer?.location?.city && <div className="flex items-center">
            <MapPin className="mr-2" />
            <span className="font-semibold">{application?.offer?.location?.city}, {application?.offer?.location?.country}</span>
          </div>}
          <div className="flex items-center">
            <Briefcase className="mr-2" />
            <span className="font-semibold">{application?.offer?.company_name}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span className="font-semibold">{application?.offer?.contract_type}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">Salaire :</span>
            <span className="ml-2">{application?.offer?.salary} €</span>
          </div>
        </div>

        <button className="mt-8 self-end bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
          Postuler
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
