import api from '../utils/api';

export const ResumeAnalyzerService = {
    analyzeResume: async (resumeText, jobDescription) => {
        try {
            console.log('Sending analysis request:', { resumeText, jobDescription });
            const response = await api.post('/api/resume-analyzer/analyze', {
                resume: resumeText,
                jobDescription: jobDescription
            });
            console.log('Analysis response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Resume analysis error:', error.response || error);
            throw new Error(error.response?.data?.message || 'Failed to analyze resume');
        }
    },

    parseResume: async (file) => {
        try {
            const formData = new FormData();
            formData.append('resume', file);
            
            const response = await api.post('/resume-analyzer/parse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Resume parsing error:', error);
            throw new Error('Failed to parse resume');
        }
    }
};