// src/components/jobs/JobSearch.jsx
import { useState } from 'react';
import { useJobSearch } from '../../hooks/useJobSearch';
import { toast } from 'react-hot-toast';
import JobList from './JobList';
import JobFilters from './JobFilters';
import { Search, MapPin } from 'lucide-react';
import { useQueryClient } from 'react-query';

export default function JobSearch() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        location: '',
        category: '',
        remote: false
    });

    const {
        jobs,
        loading,
        error,
        totalResults,
        currentPage,
        searchJobs,
        saveJob,
        unsaveJob,
        handlePageChange
    } = useJobSearch();

    const handleSearch = (e) => {
        e.preventDefault();
        searchJobs(searchParams);
    };

    const handleApplicationTracked = () => {
        // Invalidate dashboard stats to trigger a refresh
        queryClient.invalidateQueries('dashboardStats');
        
        // Show success message
        toast.success('Application tracked successfully. Dashboard will update shortly.');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Job title, keywords, or company"
                                    value={searchParams.keyword}
                                    onChange={(e) => setSearchParams(prev => ({
                                        ...prev,
                                        keyword: e.target.value
                                    }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="City, state, or remote"
                                    value={searchParams.location}
                                    onChange={(e) => setSearchParams(prev => ({
                                        ...prev,
                                        location: e.target.value
                                    }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Search Jobs
                        </button>
                    </div>
                </form>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters */}
                    <div className="lg:w-64">
                        <JobFilters
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>

                    {/* Results */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 py-8">
                                {error}
                            </div>
                        ) : (
                            <JobList
                                jobs={jobs}
                                onSave={saveJob}
                                onUnsave={unsaveJob}
                                onApplicationTracked={handleApplicationTracked}
                                totalResults={totalResults}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}