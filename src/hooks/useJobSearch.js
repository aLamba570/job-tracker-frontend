
import { useState } from 'react';
import { JobService } from '../services/job.service';
import { toast } from 'react-hot-toast';

export const useJobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const searchJobs = async (searchParams) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Search params:', searchParams); // Debug log
            const response = await JobService.searchJobs({
                ...searchParams,
                page: currentPage
            });
            console.log('API Response:', response); // Debug log
            setJobs(response.jobs);
            setTotalResults(response.totalResults);
            return response;
        } catch (err) {
            console.error('Search error:', err); // Debug log
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveJob = async (jobData) => {
        try {
            await JobService.saveJob(jobData);
            setJobs(prevJobs => 
                prevJobs.map(job => 
                    job.id === jobData.id ? { ...job, isSaved: true } : job
                )
            );
            toast.success('Job saved successfully');
        } catch (err) {
            console.log(err);
            toast.error('Failed to save job');
        }
    };

    const unsaveJob = async (jobId) => {
        try {
            await JobService.unsaveJob(jobId);
            setJobs(prevJobs => 
                prevJobs.map(job => 
                    job.id === jobId ? { ...job, isSaved: false } : job
                )
            );
            toast.success('Job removed from saved jobs');
        } catch (err) {
            console.log(err);
            toast.error('Failed to remove job');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return {
        jobs,
        loading,
        error,
        totalResults,
        currentPage,
        searchJobs,
        saveJob,
        unsaveJob,
        handlePageChange
    };
};