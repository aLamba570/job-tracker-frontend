// src/components/jobs/SavedJobs.jsx
import { useState, useEffect } from 'react';
import { JobService } from '../../services/job.service';
import { toast } from 'react-hot-toast';
import { BookmarkX, ExternalLink } from 'lucide-react';

export default function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const jobs = await JobService.getSavedJobs();
            setSavedJobs(jobs);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            await JobService.unsaveJob(jobId);
            setSavedJobs(jobs => jobs.filter(job => job.id !== jobId));
            toast.success('Job removed from saved jobs');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove job');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>

            {savedJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No saved jobs found</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {savedJobs.map(job => (
                        <div
                            key={job.id}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-600">{job.company}</p>
                                    <p className="text-gray-500 text-sm">{job.location}</p>

                                    {(job.salaryMin || job.salaryMax) && (
                                        <p className="text-gray-600 mt-2">
                                            {job.salaryMin && `$${job.salaryMin.toLocaleString()}`}
                                            {job.salaryMin && job.salaryMax && ' - '}
                                            {job.salaryMax && `$${job.salaryMax.toLocaleString()}`}
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <a
                                        href={job.applicationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-500"
                                    >
                                        <ExternalLink className="h-6 w-6" />
                                    </a>
                                    <button
                                        onClick={() => handleUnsave(job.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <BookmarkX className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {job.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-600">{job.notes}</p>
                                </div>
                            )}

                            <div className="mt-4 flex justify-between items-center">
                                <a
                                    href={job.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Apply Now →
                                </a>
                                <span className="text-gray-500 text-sm">
                                    Saved on {new Date(job.savedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}