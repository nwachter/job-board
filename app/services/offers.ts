import axios from "axios";
import { Offer } from "../types/offer";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const fetchAllOffers = async () => {
  try {
    const response = await api.get("/offers");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    throw error;
  }
};


export const getOffersByAdminId = async (admin_id : number) => {
  try {
    const response = await api.get(`/offers/by-admin/${admin_id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch offers of admin #${admin_id}:`, error);
    throw error;
  }
};


export const getOfferById = async (id : number) => {
  try {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch offer by id:", error);
    throw error;
  }
};

export const createOffer = async (data : Omit<Offer, "id">) => {
  try {

    const response = await api.post("/offers", data);
    return response.data;
    
  } catch (error) {
    console.error("Failed to create offer:", error);
    throw error;
  }
};

export const updateOffer = async (id: number, data: Omit<Offer, "id">) => {
  try {
    const response = await api.patch(`/offers/${id}`, data); //Attention, avant : put
    return response.data;
  } catch (error) {
    console.error("Failed to update offer:", error);
    throw error;
  }
};



export const deleteOffer = async (id : number) => {
  try {
    const response = await api.delete(`/offers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete offer:", error);
    throw error;
  }
};
