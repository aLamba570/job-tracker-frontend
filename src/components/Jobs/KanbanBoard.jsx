// src/components/jobs/KanbanBoard.jsx
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import ApplicationModal from './ApplicationModal';
import { JobService } from '../../services/job.service';
import { toast } from 'react-hot-toast';

const COLUMN_NAMES = {
    APPLIED: 'Applied',
    SCREENING: 'Screening',
    INTERVIEW: 'Interview',
    OFFER: 'Offer',
    REJECTED: 'Rejected'
};

export default function KanbanBoard() {
    const [applications, setApplications] = useState([]);
    const [columns, setColumns] = useState({});
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await JobService.getApplications();
            console.log('API Response:', response); // Debug log
            
            // Ensure we have an array of applications
            const apps = Array.isArray(response.data) ? response.data : [];
            console.log('Applications:', apps); // Debug log
            
            // Initialize all columns with empty arrays
            const columnData = Object.keys(COLUMN_NAMES).reduce((acc, status) => {
                acc[status] = [];
                return acc;
            }, {});
            
            // Distribute applications to columns
            apps.forEach(app => {
                const status = app.status || 'APPLIED'; // Default to APPLIED if status is missing
                if (columnData[status]) {
                    columnData[status].push(app);
                } else {
                    columnData['APPLIED'].push(app); // Default column if status doesn't match
                }
            });

            console.log('Column Data:', columnData); // Debug log
            
            setApplications(apps);
            setColumns(columnData);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error.message || 'Failed to fetch applications');
            toast.error('Failed to fetch applications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        try {
            // Create new columns object
            const newColumns = { ...columns };
            
            // Remove from source column
            const sourceColumn = [...(newColumns[source.droppableId] || [])];
            const [movedApplication] = sourceColumn.splice(source.index, 1);
            newColumns[source.droppableId] = sourceColumn;
            
            // Add to destination column
            const destColumn = [...(newColumns[destination.droppableId] || [])];
            destColumn.splice(destination.index, 0, {
                ...movedApplication,
                status: destination.droppableId
            });
            newColumns[destination.droppableId] = destColumn;

            // Update state optimistically
            setColumns(newColumns);

            // Update backend
            await JobService.updateApplicationStatus(draggableId, destination.droppableId);
            toast.success('Application status updated');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
            // Revert changes by refetching
            fetchApplications();
        }
    };

    const handleApplicationClick = (application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchApplications}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Applications Tracker</h2>
                <div className="flex space-x-4">
                    <span className="text-gray-600">
                        Total Applications: {applications.length}
                    </span>
                    <button
                        onClick={fetchApplications}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(COLUMN_NAMES).map(([status, title]) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <KanbanColumn
                                    title={title}
                                    applications={columns[status] || []}
                                    provided={provided}
                                    onApplicationClick={handleApplicationClick}
                                />
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {selectedApplication && (
                <ApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedApplication(null);
                    }}
                    application={selectedApplication}
                    onUpdate={fetchApplications}
                />
            )}
        </div>
    );
}