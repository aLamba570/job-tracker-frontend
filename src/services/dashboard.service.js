// src/services/dashboard.service.js
import api from '../utils/api';

export const DashboardService = {
    getStats: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('DashboardService.getStats:', error);
            throw new Error('Failed to fetch dashboard stats');
        }
    },
    
    // Additional methods can be added here for specific dashboard actions
};