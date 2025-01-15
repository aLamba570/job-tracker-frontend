import { useState } from 'react';
import PropTypes from 'prop-types';
import { BookmarkCheck, Bookmark } from 'lucide-react';
import { JobService } from '../../services/job.service';
import { toast } from 'react-hot-toast';
import TrackingModal from './TrackingModal';

export default function JobCard({ job, onSave, onUnsave }) {
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const handleApplyClick = async () => {
        setShowTrackingModal(true);
    };

    const handleConfirmTracking = async (trackingData) => {
        setIsTracking(true);
        try {
            await JobService.createApplication({
                jobId: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                applicationUrl: job.applicationUrl,
                status: 'APPLIED',
                notes: trackingData.notes,
                applicationDate: trackingData.applicationDate
            });
            
            toast.success('Application tracked successfully');
            window.open(job.applicationUrl, '_blank');
        } catch (error) {
            console.log('Tracking error:', error);
            toast.error('Failed to track application');
        } finally {
            setIsTracking(false);
            setShowTrackingModal(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={handleApplyClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Track & Apply
                </button>
                
                <button
                    onClick={() => job.isSaved ? onUnsave(job.id) : onSave(job)}
                    className="text-gray-400 hover:text-blue-500"
                >
                    {job.isSaved ? <BookmarkCheck className="h-6 w-6" /> : <Bookmark className="h-6 w-6" />}
                </button>
            </div>

            {showTrackingModal && (
                <TrackingModal
                    isOpen={showTrackingModal}
                    onClose={() => setShowTrackingModal(false)}
                    onConfirm={handleConfirmTracking}
                    job={job}
                    isLoading={isTracking}
                />
            )}
        </div>
    );
}

JobCard.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        description: PropTypes.string,
        salaryMin: PropTypes.number,
        salaryMax: PropTypes.number,
        applicationUrl: PropTypes.string.isRequired,
        isSaved: PropTypes.bool
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onUnsave: PropTypes.func.isRequired
};