import PropTypes from 'prop-types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function ApplicationTimeline({ activities }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {activities.map((activity) => (
                    <li key={activity.id}>
                        <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full flex items-center justify-center">
                                        {getStatusIcon(activity.status)}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5">
                                    <p className="text-sm text-gray-500">
                                        {activity.company} - {activity.position}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

ApplicationTimeline.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            company: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.oneOf(['completed', 'pending', 'rejected']).isRequired
        })
    ).isRequired
};

ApplicationTimeline.defaultProps = {
    activities: []
};