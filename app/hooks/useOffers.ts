import { useState, useEffect } from "react";
import { getOffers } from "../services/offers";
import { Offer } from "../types/offer";

export const useOffers = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [contractTypes, setContractTypes] = useState<string[]>([])
    const [applicationsNumber, setApplicationsNumber] = useState<number>(0);

    useEffect(() => {
        const fetchAllOffers = async () => {
            try {
                const offersData = await getOffers();
                console.log("offersData : ", offersData);
                setOffers(offersData);
                const contractTypes : string[] = offersData?.length > 0 ? Array.from(new Set(offersData.map((offer : Offer) => offer.contract_type))) : [];
                const applicationsNumber : number = offersData?.reduce((acc : number, offer : Offer) => acc + (offer.applications ? offer.applications.length : 0), 0) || 0;
                setContractTypes(contractTypes);
                setApplicationsNumber(applicationsNumber);      
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

    return { data: offers, contractTypes: contractTypes, isLoading: isLoading, applicationsNumber: applicationsNumber, error: error };
}