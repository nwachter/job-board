"use client";
import { useState, useEffect } from "react";
import { getOfferById } from "../services/offers";
import { Offer } from "../types/offer";

export const useOffer = (id: number) => {
  const [offer, setOffer] = useState<Partial<Offer> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOffer = async (id: number) => {
      try {
        const {data} = await getOfferById(id);
        console.log("offerData : ", data);
        setOffer(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'offre", error);
        setError("Erreur lors de la récupération de l'offre");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer(id);
  }, [id]);

  return { data: offer, isLoading, error };
};
