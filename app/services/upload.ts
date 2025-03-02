import axios from "axios";
import { Offer } from "../types/offer";

const api = axios.create({
  baseURL: "/api/upload",
  headers: {
    "Content-Type": "application/pdf",
    Accept: "application/pdf",
  },
  withCredentials: true, //allows to get the cookie
});
//credentials: "include" for Fetch to get the cookie, so now the token existe dans le cookie

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export const uploadPdfFile = async (file: FileList) => {
    const data = new FormData();
    data.append('file', file[0]);

    try {

        const response = await api.post("/", data);
        return response?.data?.url;
        
      } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
      }

}
