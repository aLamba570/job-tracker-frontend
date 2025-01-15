import PropTypes from 'prop-types';
import { 
    BriefcaseIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    CalendarIcon
} from 'lucide-react';

export default function RecentActivities({ activities }) {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'application':
                return BriefcaseIcon;
            case 'interview':
                return CalendarIcon;
            case 'offer':
                return CheckCircleIcon;
            case 'rejection':
                return XCircleIcon;
            default:
                return BriefcaseIcon;
        }
    };

    if (!activities?.length) {
        return (
            <div className="text-center text-gray-500 py-4">
                No recent activities
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                        <li key={activity.id}>
                            <div className="relative pb-8">
                                {index !== activities.length - 1 && (
                                    <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Icon className="h-5 w-5 text-blue-500" />
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {activity.type === 'application' ? 'Applied to ' : 'Interview scheduled for '}
                                                <span className="font-medium text-gray-900">
                                                    {activity.position}
                                                </span>
                                                {' at '}
                                                <span className="font-medium text-gray-900">
                                                    {activity.company}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                            {new Date(activity.date).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

RecentActivities.propTypes = {
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            type: PropTypes.oneOf(['application', 'interview', 'offer', 'rejection']).isRequired,
            company: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.string
        })
    )
};

RecentActivities.defaultProps = {
    activities: []
};