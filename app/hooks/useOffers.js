import { useState, useEffect } from "react";
import { getOffers } from "../services/offers";

export const useOffers = () => {
    const [offers, setOffers] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState();

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