"use client";
import OfferDetail from "@/app/components/dashboard/[id]/OfferDetail";
import React, { useEffect, useState } from "react";
import NewApplication from "./NewApplication";
import { useGetOfferById } from "@/app/hooks/useOffers";


const OfferDetailDashboardPage: React.FC<{
  params: {
    id: any;
  };
}> = ({ params }) => {
  const { id } = params;
  const { data: offer, isLoading, error } = useGetOfferById(Number(id));
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);


  useEffect(() => {
    console.log("offer: ", offer);
  }, [id, offer]);

  if (isLoading || !offer) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-xl text-electric-purple">
        Chargement...
      </div>
    );
  }
  if (error || offer === null) {
    return (
      <div className="flex items-center justify-center p-4 text-xl text-red-500">
        Erreur
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <OfferDetail offer={offer} />
      {isApplicationOpen && offer?.id && (
        <NewApplication
          offer_id={offer?.id}
          onCancel={() => setIsApplicationOpen(false)}
        />
      )}
    </div>
  );
};

export default OfferDetailDashboardPage;
