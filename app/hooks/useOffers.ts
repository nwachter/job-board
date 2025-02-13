import { useState, useEffect } from "react";
import { getOffers } from "../services/offers";
import { Offer } from "../types/offer";

export const useOffers = () => {
    const [offers, setOffers] = useState<Offer[]>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        const fetchAllOffers = async () => {
            try {
                const offersData = await getOffers();
                console.log("offersData : ", offersData);
                setOffers(offersData);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des offres", error);
                setError("Erreur lors de la récupération des offres");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchAllOffers();

    }, []);

    return { data: offers, isLoading: isLoading, error: error };
}