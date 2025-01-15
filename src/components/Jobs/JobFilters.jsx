import PropTypes from 'prop-types';

export default function JobFilters({ searchParams, setSearchParams }) {
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="space-y-4">
                {/* Job Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type
                    </label>
                    <select
                        name="category"
                        value={searchParams.category}
                        onChange={handleFilterChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                    </select>
                </div>

                {/* Remote Only */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remote"
                        name="remote"
                        checked={searchParams.remote}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
                        Remote Only
                    </label>
                </div>
            </div>
        </div>
    );
}

JobFilters.propTypes = {
    searchParams: PropTypes.shape({
        category: PropTypes.string,
        remote: PropTypes.bool,
        keyword: PropTypes.string,
        location: PropTypes.string
    }).isRequired,
    setSearchParams: PropTypes.func.isRequired
};

JobFilters.defaultProps = {
    searchParams: {
        category: '',
        remote: false,
        keyword: '',
        location: ''
    }
};