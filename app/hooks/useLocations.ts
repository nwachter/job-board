"use client"
import { useState, useEffect } from "react";
import { getLocations } from "../services/locations";
import { Location } from "../types/location";

export const useLocations = () => {
    const [locations, setLocations] = useState<Location[]>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        const fetchAllLocations = async () => {
            try {
                const locationsData = await getLocations();
                setLocations(locationsData);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des lieux", error);
                setError("Erreur lors de la récupération des lieux");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchAllLocations();

    }, []);

    return { data: locations, isLoading: isLoading, error: error };
}