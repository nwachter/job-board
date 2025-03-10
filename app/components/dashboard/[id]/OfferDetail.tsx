"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Briefcase, Clock } from 'lucide-react';
import { Offer } from '@/app/types/offer';

interface OfferDetailProps {
  offer: Partial<Offer>;
  setIsApplicationOpen : any;
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer, setIsApplicationOpen }) => {
 const router = useRouter();
  return (
    <div className="flex w-full h-full flex-col items-center justify-center text-white">
      <div className="max-w-4xl w-full p-6 sm:min-h-96 bg-white text-black rounded-xl shadow-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 text-purple-500 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Retour aux offres
        </button>
        <h1 className="text-4xl font-bold mb-4">{offer.title}</h1>
        <p className="text-lg mb-6">{offer.description}</p>

        <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-6">
          {offer?.location?.city && <div className="flex items-center">
            <MapPin className="mr-2" />
            <span className="font-semibold">{offer.location?.city}, {offer.location?.country}</span>
          </div>}
          <div className="flex items-center">
            <Briefcase className="mr-2" />
            <span className="font-semibold">{offer.company_name}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" />
            <span className="font-semibold">{offer.contract_type}</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">Salaire :</span>
            <span className="ml-2">{offer.salary} €</span>
          </div>
        </div>

        <button onClick={() => {setIsApplicationOpen(true)}} className="mt-8 self-end bg-electric-purple text-white px-6 py-3 rounded-lg hover:bg-electric-purple/80 transition-colors">
          Postuler
        </button>
      </div>
    </div>
  );
};

export default OfferDetail;
