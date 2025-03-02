import axios from "axios";
import { Location } from "../types/location";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // allows to get the cookie
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export const getLocations = async () => {
  try {
    const response = await api.get("/locations");
    return response.data;
  } catch (error) {
    console.error("Échec de la récupération des locations :", error);
    throw error;
  }
};

export const getLocationById = async (id: number) => {
  try {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Échec de la récupération de la location avec l'ID #${id} :`, error);
    throw error;
  }
};

export const createLocation = async (data: Omit<Location, "id">) => {
  try {
    const response = await api.post("/locations", data);
    return response.data;
  } catch (error) {
    console.error("Échec de la création de la location :", error);
    throw error;
  }
};

export const updateLocation = async (id: number, data: Omit<Location, "id">) => {
  try {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Échec de la mise à jour de la location avec l'ID #${id} :`, error);
    throw error;
  }
};

export const deleteLocation = async (id: number) => {
  try {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Échec de la suppression de la location avec l'ID #${id} :`, error);
    throw error;
  }
};
