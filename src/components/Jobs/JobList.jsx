import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import { JobService } from '../../services/job.service';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function JobList({ jobs, onSave, onUnsave, totalResults, currentPage, onPageChange }) {
    // Track which jobs are currently being applied to
    const [applyingJobs, setApplyingJobs] = useState(new Set());

    const handleApply = async (job) => {
        // Add job to applying set
        setApplyingJobs(prev => new Set([...prev, job.id]));

        try {
            // Track the application
            await JobService.trackApplication({
                jobId: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                applicationUrl: job.applicationUrl
            });

            // Show success message
            toast.success('Application tracked successfully');
            
            // Open application URL in new tab
            window.open(job.applicationUrl, '_blank');
        } catch (error) {
            console.error(error);
            toast.error('Failed to track application');
        } finally {
            // Remove job from applying set
            setApplyingJobs(prev => {
                const next = new Set(prev);
                next.delete(job.id);
                return next;
            });
        }
    };

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                    {totalResults} results found
                </p>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                    <option value="relevance">Most Relevant</option>
                    <option value="recent">Most Recent</option>
                    <option value="salary">Highest Salary</option>
                </select>
            </div>

            <div className="space-y-4">
                {jobs.map(job => (
                    <div
                        key={job.id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {job.title}
                                </h3>
                                <p className="text-gray-600">{job.company}</p>
                                <p className="text-gray-500 text-sm flex items-center">
                                    {job.location}
                                    {job.remote && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Remote
                                        </span>
                                    )}
                                </p>
                                
                                {(job.salaryMin || job.salaryMax) && (
                                    <p className="text-gray-600 mt-2">
                                        {job.salaryMin && `$${job.salaryMin.toLocaleString()}`}
                                        {job.salaryMin && job.salaryMax && ' - '}
                                        {job.salaryMax && `$${job.salaryMax.toLocaleString()}`}
                                        <span className="text-gray-500 text-sm ml-1">per year</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => job.isSaved ? onUnsave(job.id) : onSave(job)}
                                    className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50"
                                >
                                    {job.isSaved ? (
                                        <BookmarkCheck className="h-6 w-6" />
                                    ) : (
                                        <Bookmark className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600 line-clamp-2">
                                {job.description}
                            </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className="space-x-3">
                                <button
                                    onClick={() => handleApply(job)}
                                    disabled={applyingJobs.has(job.id)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applyingJobs.has(job.id) ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Apply Now
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => window.open(job.applicationUrl, '_blank')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    View Details
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 text-sm">
                                    {new Date(job.postedDate).toLocaleDateString()}
                                </span>
                                {job.urgent && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Urgent
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalResults > 0 && (
                <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: Math.ceil(totalResults / 10) }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => onPageChange(idx + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === idx + 1
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}

JobList.propTypes = {
    jobs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            company: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            salaryMin: PropTypes.number,
            salaryMax: PropTypes.number,
            applicationUrl: PropTypes.string.isRequired,
            postedDate: PropTypes.string.isRequired,
            isSaved: PropTypes.bool.isRequired,
            remote: PropTypes.bool,
            urgent: PropTypes.bool
        })
    ).isRequired,
    onSave: PropTypes.func.isRequired,
    onUnsave: PropTypes.func.isRequired,
    totalResults: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

JobList.defaultProps = {
    jobs: [],
    totalResults: 0,
    currentPage: 1
};