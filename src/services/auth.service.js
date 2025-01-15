
import api from '../utils/api';

export const AuthService = {
    login: async (credentials) => {
        const response = await api.post('/auth/authenticate', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
    },
    
    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        return token ? { token } : null;
    }
};