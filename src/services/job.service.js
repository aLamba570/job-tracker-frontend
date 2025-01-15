import api from '../utils/api';

export const JobService = {
    searchJobs: async (params) => {
        try {
            const response = await api.get('/jobs/search', { params });
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch jobs');
        }
    },

    saveJob: async (jobData) => {
        try {
            const response = await api.post('/jobs/saved', jobData);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to save job');
        }
    },

    unsaveJob: async (jobId) => {
        try {
            await api.delete(`/jobs/saved/${jobId}`);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to unsave job');
        }
    },

    getSavedJobs: async () => {
        try {
            const response = await api.get('/jobs/saved');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to fetch saved jobs');
        }
    },
    trackApplication: async (applicationData) => {
        try {
            const response = await api.post('/applications/track', applicationData);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to track application');
        }
    },

    getApplications: async () => {
        try {
            const response = await api.get('/applications');
            return response.data || []; // Ensure we always return an array
        } catch (error) {
            throw new Error('Failed to fetch applications');
        }
    },

    updateApplicationStatus: async (applicationId, status) => {
        try {
            const response = await api.patch(`/applications/${applicationId}/status`, { status });
            return response.data;
        } catch (error) {
            throw new Error('Failed to update application status');
        }
    },

    updateApplicationNotes: async (applicationId, notes) => {
        try {
            const response = await api.patch(`/applications/${applicationId}/notes`, { notes });
            return response.data;
        } catch (error) {
            throw new Error('Failed to update notes');
        }
    },

    scheduleInterview: async (applicationId, interviewData) => {
        try {
            const response = await api.post(`/applications/${applicationId}/interview`, interviewData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to schedule interview');
        }
    },

    deleteApplication: async (applicationId) => {
        try {
            await api.delete(`/applications/${applicationId}`);
        } catch (error) {
            throw new Error('Failed to delete application');
        }
    },

    createApplication: async (applicationData) => {
        try {
            const response = await api.post('/applications', applicationData);
            return response.data;
        } catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    },

    checkApplicationExists: async (jobId) => {
        try {
            const response = await api.get(`/applications/check/${jobId}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking application:', error);
            throw error;
        }
    }
};