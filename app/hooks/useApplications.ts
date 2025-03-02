"use client";
import { useState, useEffect } from "react";
import { getApplications } from "../services/applications";
import { Application } from "../types/application";

export const useApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllApplications = async () => {
            try {
                const {data: applicationsData} = await getApplications();
                console.log("applicationsData : ", applicationsData);
                setApplications(applicationsData);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des offres", error);
                setError("Erreur lors de la récupération des offres");
            }
            finally {
                setIsLoading(false);
            }
        }

         fetchAllApplications();

    }, []);

    return { data: applications, isLoading: isLoading, error: error };
}