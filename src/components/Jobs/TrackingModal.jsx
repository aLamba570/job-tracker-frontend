import { useState } from 'react';
import PropTypes from 'prop-types';

function TrackingModal({ isOpen, onClose, onConfirm, job, isLoading }) {
    const [notes, setNotes] = useState('');
    const [applicationDate, setApplicationDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            notes,
            applicationDate
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-md p-6">
                    <h3 className="text-lg font-medium mb-4">
                        Track Application - {job.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                        Track this application before being redirected to the external application page
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Application Date
                            </label>
                            <input
                                type="date"
                                value={applicationDate}
                                onChange={(e) => setApplicationDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Add any notes about your application..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Tracking...' : 'Track & Continue to Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

TrackingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    job: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        applicationUrl: PropTypes.string.isRequired
    }).isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default TrackingModal;