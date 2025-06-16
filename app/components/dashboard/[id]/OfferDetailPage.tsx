"use client";
import OfferDetail from "@/app/components/dashboard/[id]/OfferDetail";
import React, { useEffect, useState } from "react";
import NewApplication from "./NewApplication";
import { useDeleteOffer, useGetOfferById } from "@/app/hooks/useOffers";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";

const OfferDetailDashboardPage: React.FC<{
  params: {
    id: string;
  };
}> = ({ params }) => {
  const { id } = params;
  const deleteOfferMutation = useDeleteOffer();

  const { data: offer, isLoading, error } = useGetOfferById(Number(id));
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const { data: userInfo } = useGetUserInfo();

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteOfferMutation.mutateAsync(Number(id), {
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
          onError: () => console.log("Error deleting offer"),
        });
        // Redirect or handle successful deletion
      } catch (error) {
        console.error("Error deleting offer:", error);
        // Handle error (could add toast notification here)
      }
    }
  };

  if (isLoading || !offer) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-xl text-electric-purple">
        Chargement...
      </div>
    );
  }
  if (error || offer === null || !userInfo) {
    return (
      <div className="flex items-center justify-center p-4 text-xl text-red-500">
        Erreur lors de la récupération des informations.
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {!!userInfo && <OfferDetail offer={offer} onDelete={handleDelete} userInfo={userInfo} />}
      {isApplicationOpen && offer?.id && (
        <NewApplication offer_id={offer?.id} onCancel={() => setIsApplicationOpen(false)} />
      )}
    </div>
  );
};

export default OfferDetailDashboardPage;
