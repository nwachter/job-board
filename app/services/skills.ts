import axios from "axios";
import { Skill } from "../types/skill";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const getSkills = async () => {
  try {
    const response = await api.get("/skills");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    throw error;
  }
};

// export const getSkillsByUserId = async (recruiter_id: number) => {
//   try {
//     const response = await api.get(`/skills/by-admin/${recruiter_id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch skills of admin #${recruiter_id}:`, error);
//     throw error;
//   }
// };

export const getSkillById = async (id: number) => {
  try {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch skill by id:", error);
    throw error;
  }
};

export const searchSkills = async (searchQuery: string) => {
  try {
    const response = await api.post("/skills/search", {
      searchQuery,
    });
    return response.data;
  } catch (error) {
    console.error("Échec de la recherche des compétences :", error);
    throw error;
  }
};

export const createSkill = async (data: Omit<Skill, "id">) => {
  try {
    const response = await api.post("/skills", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create skill:", error);
    throw error;
  }
};

export const updateSkill = async (
  id: number,
  data: Partial<Skill>,
  // Omit<Skill, "id">
) => {
  try {
    const response = await api.patch(`/skills/${id}`, data); //Attention, avant : put
    return response.data;
  } catch (error) {
    console.error("Failed to update skill:", error);
    throw error;
  }
};

export const deleteSkill = async (id: number) => {
  try {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete skill:", error);
    throw error;
  }
};
