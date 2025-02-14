import axios from 'axios';
import { User } from '../types/user';



const api = axios.create({
    baseURL: '/api/auth',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true  //Ajouter après url des get si besoin a la place
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


const register = async (data: Omit<User, "id" | "role">) => {
    try {
        const response = await api.post('/register', data);
        console.log("Registered ! Info : ", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to register:', error);
        throw error;
    }
};

const login = async (data : {email: string, password: string}) : Promise<User> => {
    const { email, password } = data;
    if(!email || !password) {
        throw new Error('Il manque l\'email ou le mot de passe');
    }
    try {
        const response = await api.post<User>('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
};

export const updateUser = async (id: number, data: Partial<Omit<User, "id">>) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Échec de la mise à jour de l'utilisateur avec l'ID #${id} :`, error);
      throw error;
    }
  };
  
  export const deleteUser = async (id: number) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Échec de la suppression de l'utilisateur avec l'ID #${id} :`, error);
      throw error;
    }
  };

const logout = async () => {
    try {
        const response = await api.post('/logout');
        // if(response.ok)
        localStorage.clear();
        return response.data;
    } catch (error) {
        console.error('Failed to logout:', error);
        throw error;
    }
};

const getUserInfo = async () => {
    try {
        const response = await api.get('/get-user-info');
        return response.data;
    } catch (error) {
        console.error('Failed to verify token and get user info:', error);
        throw error;
    }
}
export { register, login, logout, getUserInfo };