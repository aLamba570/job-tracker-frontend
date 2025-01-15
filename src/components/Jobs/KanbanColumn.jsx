
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { Calendar, Building2, MapPin } from 'lucide-react';

export default function KanbanColumn({ title, applications, provided, onApplicationClick }) {
    const getColumnColor = (title) => {
        switch (title) {
            case 'Applied':
                return 'bg-blue-100';
            case 'Screening':
                return 'bg-yellow-100';
            case 'Interview':
                return 'bg-purple-100';
            case 'Offer':
                return 'bg-green-100';
            case 'Rejected':
                return 'bg-red-100';
            default:
                return 'bg-gray-100';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className={`p-4 rounded-t-lg ${getColumnColor(title)}`}>
                <h3 className="font-semibold text-gray-900">
                    {title} ({applications.length})
                </h3>
            </div>
            
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 bg-gray-50 p-4 rounded-b-lg min-h-[500px]"
            >
                <div className="space-y-3">
                    {applications.map((application, index) => (
                        <Draggable
                            key={application.id}
                            draggableId={application.id}
                            index={index}
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white p-4 rounded-lg shadow-sm 
                                        ${snapshot.isDragging ? 'shadow-lg' : ''}
                                        hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => onApplicationClick(application)}
                                >
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {application.title}
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Building2 className="h-4 w-4 mr-2" />
                                            {application.company}
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {application.location}
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(application.appliedDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {application.interview && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded-md">
                                            <p className="text-xs text-blue-700">
                                                Interview: {new Date(application.interview.scheduledDate).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            </div>
        </div>
    );
}

KanbanColumn.propTypes = {
    title: PropTypes.string.isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        appliedDate: PropTypes.string.isRequired,
        interview: PropTypes.shape({
            scheduledDate: PropTypes.string.isRequired,
        }),
    })).isRequired,
    provided: PropTypes.object.isRequired,
    onApplicationClick: PropTypes.func.isRequired,
};