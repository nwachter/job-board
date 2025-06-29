import axios from "axios";
import { Application } from "../types/application";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export type ChartDataPoint = {
  date: string;
  [status: string]: string | number; // Allow for dynamic status fields
};

export const getApplications = async () => {
  try {
    const response = await api.get("/applications");
    return response.data;
  } catch (error) {
    console.error("Échec de la récupération des candidatures :", error);
    throw error;
  }
};

export const getApplicationById = async (id: number) => {
  try {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Échec de la récupération de la candidature avec l'ID #${id} :`,
      error,
    );
    throw error;
  }
};

export const getApplicationsByUserId = async (userId: number) => {
  try {
    const response = await api.get(`/applications/by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Échec de la récupération de la candidature de l'utilisateur #${userId} :`,
      error,
    );
    throw error;
  }
};

export const searchApplications = async (searchQuery: string) => {
  try {
    const response = await api.post("/applications/search", { searchQuery });
    return response.data;
  } catch (error) {
    console.error("Échec de la recherche des offres :", error);
    throw error;
  }
};

export const createApplication = async (data: Omit<Application, "id">) => {
  try {
    const response = await api.post("/applications", data);
    return response.data;
  } catch (error) {
    console.error("Échec de la création de la candidature :", error);
    throw error;
  }
};

export const updateApplication = async (
  id: number,
  data: Partial<Application>,
) => {
  try {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      `Échec de la mise à jour de la candidature avec l'ID #${id} :`,
      error,
    );
    throw error;
  }
};

export const deleteApplication = async (id: number) => {
  try {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Échec de la suppression de la candidature avec l'ID #${id} :`,
      error,
    );
    throw error;
  }
};

export const getRecruiterApplicationsStatisticsForChart = async (
  recruiterId: number,
): Promise<{ chartData: ChartDataPoint[]; data: Application[] }> => {
  try {
    const response = await api.get(
      `/applications/by-recruiter/${recruiterId}/chart`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Échec de la récupération des statistiques avec le recruiterId #${recruiterId} :`,
      error,
    );
    throw error;
  }
};
