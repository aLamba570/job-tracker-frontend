import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';

export default function UpcomingInterviews({ interviews }) {
    if (!interviews.length) {
        return (
            <div className="text-center text-gray-500 py-4">
                No upcoming interviews
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {interviews.map((interview) => (
                <div key={interview.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{interview.company}</h4>
                        <p className="text-sm text-gray-500">{interview.position}</p>
                        <div className="mt-1 flex items-center">
                            <span className="text-xs text-gray-500">
                                {new Date(interview.date).toLocaleString()}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {interview.type}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

UpcomingInterviews.propTypes = {
    interviews: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            company: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired
        })
    ).isRequired
};

UpcomingInterviews.defaultProps = {
    interviews: []
};