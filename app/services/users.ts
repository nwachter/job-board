import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true 
});

api.interceptors.request.use( //testerror
    config => {
      console.log('Making request to:', config.url); // Log the request URL 
      return config;
    },
    error => Promise.reject(error)
  );
  

export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error);
        throw error;
    }
};
