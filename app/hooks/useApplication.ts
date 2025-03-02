"use client";
import { useState, useEffect } from "react";
import { getApplicationById } from "../services/applications";
import { Application } from "../types/application";

export const useApplication = (id: number) => {
  const [application, setApplication] = useState<Partial<Application> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplication = async (id: number) => {
      try {
        const {data} = await getApplicationById(id);
        console.log("applicationData : ", data);
        setApplication(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'offre", error);
        setError("Erreur lors de la récupération de l'offre");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication(id);
  }, [id]);

  return { data: application, isLoading, error };
};
