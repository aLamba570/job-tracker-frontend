// src/components/jobs/ApplicationModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { JobService } from '../../services/job.service';
import { toast } from 'react-hot-toast';
import { X, Calendar, Building2, MapPin, DollarSign, Link } from 'lucide-react';

export default function ApplicationModal({ isOpen, onClose, application, onUpdate }) {
    const [notes, setNotes] = useState(application.notes || '');
    const [interview, setInterview] = useState(application.interview || {
        type: '',
        scheduledDate: '',
        location: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleUpdateNotes = async () => {
        setLoading(true);
        try {
            await JobService.updateApplicationNotes(application.id, notes);
            toast.success('Notes updated successfully');
            onUpdate();
        } catch (error) {
            console.log(error);
            toast.error('Failed to update notes');
        }
        setLoading(false);
    };

    const handleScheduleInterview = async () => {
        if (!interview.type || !interview.scheduledDate) {
            toast.error('Please fill in required interview details');
            return;
        }

        setLoading(true);
        try {
            await JobService.scheduleInterview(application.id, interview);
            toast.success('Interview scheduled successfully');
            onUpdate();
        } catch (error) {
            console.log(error);
            toast.error('Failed to schedule interview');
        }
        setLoading(false);
    };

    const handleDeleteApplication = async () => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            setLoading(true);
            try {
                await JobService.deleteApplication(application.id);
                toast.success('Application deleted successfully');
                onUpdate();
                onClose();
            } catch (error) {
                console.log(error);
                toast.error('Failed to delete application');
            }
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-start p-4 border-b">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{application.title}</h2>
                            <p className="text-gray-600">{application.company}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Application Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center text-gray-600">
                                    <Building2 className="h-5 w-5 mr-2" />
                                    <span>{application.company}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{application.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {(application.salaryMin || application.salaryMax) && (
                                    <div className="flex items-center text-gray-600">
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        <span>
                                            {application.salaryMin && `$${application.salaryMin.toLocaleString()}`}
                                            {application.salaryMin && application.salaryMax && ' - '}
                                            {application.salaryMax && `$${application.salaryMax.toLocaleString()}`}
                                        </span>
                                    </div>
                                )}
                                {application.applicationUrl && (
                                    <div className="flex items-center text-gray-600">
                                        <Link className="h-5 w-5 mr-2" />
                                        <a
                                            href={application.applicationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Application Link
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interview Section */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Interview Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Interview Type</label>
                                    <select
                                        value={interview.type}
                                        onChange={(e) => setInterview({ ...interview, type: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="PHONE_SCREEN">Phone Screen</option>
                                        <option value="TECHNICAL">Technical</option>
                                        <option value="BEHAVIORAL">Behavioral</option>
                                        <option value="ONSITE">Onsite</option>
                                        <option value="FINAL">Final</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={interview.scheduledDate}
                                        onChange={(e) => setInterview({ ...interview, scheduledDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location/Link</label>
                                    <input
                                        type="text"
                                        value={interview.location}
                                        onChange={(e) => setInterview({ ...interview, location: e.target.value })}
                                        placeholder="Enter location or meeting link"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Interview Notes</label>
                                    <textarea
                                        value={interview.notes}
                                        onChange={(e) => setInterview({ ...interview, notes: e.target.value })}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add any preparation notes or requirements..."
                                    />
                                </div>
                                <button
                                    onClick={handleScheduleInterview}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? 'Scheduling...' : 'Schedule Interview'}
                                </button>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-4">Application Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add your notes here..."
                            />
                            <button
                                onClick={handleUpdateNotes}
                                disabled={loading}
                                className="mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t px-6 py-4 flex justify-between">
                        <button
                            onClick={handleDeleteApplication}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            Delete Application
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ApplicationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    application: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        applicationUrl: PropTypes.string,
        salaryMin: PropTypes.number,
        salaryMax: PropTypes.number,
        appliedDate: PropTypes.string.isRequired,
        notes: PropTypes.string,
        interview: PropTypes.shape({
            type: PropTypes.string,
            scheduledDate: PropTypes.string,
            location: PropTypes.string,
            notes: PropTypes.string,
        }),
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
};