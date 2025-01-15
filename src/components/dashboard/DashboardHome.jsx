import { DashboardService } from '../../services/dashboard.service';
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import {
    BriefcaseIcon,
    BookmarkIcon,
    CalendarIcon,
    TrendingUpIcon,
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';

export default function DashboardHome() {
    const { data: stats, isLoading, error, refetch } = useQuery(
        'dashboardStats',
        DashboardService.getStats,
        {
            refetchInterval: 300000, 
            onError: (err) => {
                console.error('DashboardHome:', err);
                toast.error('Failed to fetch dashboard data');
            }
        }
    );

    const statCards = stats ? [
        {
            name: 'Total Applications',
            value: stats.totalApplications,
            icon: BriefcaseIcon,
            color: 'bg-blue-500',
            change: `${stats.applicationsByMonth?.current || 0} this month`
        },
        {
            name: 'Active Applications',
            value: stats.activeApplications,
            icon: TrendingUpIcon,
            color: 'bg-green-500',
            change: `${stats.responseRate.toFixed(1)}% response rate`
        },
        {
            name: 'Saved Jobs',
            value: stats.savedJobs,
            icon: BookmarkIcon,
            color: 'bg-purple-500',
            change: 'Potential opportunities'
        },
        {
            name: 'Upcoming Interviews',
            value: stats.upcomingInterviews,
            icon: CalendarIcon,
            color: 'bg-yellow-500',
            change: stats.upcomingInterviewsList?.[0] 
                ? `Next: ${formatDistance(new Date(stats.upcomingInterviewsList[0].date), new Date(), { addSuffix: true })}`
                : 'No upcoming interviews'
        }
    ] : [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Error loading dashboard data. Please try again later.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <button
                    onClick={() => refetch()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Refresh Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <stat.icon className={`h-6 w-6 text-white ${stat.color} p-1 rounded`} />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {stat.name}
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {stat.value}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-500">
                                                {stat.change}
                                            </span>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Application Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(stats.applicationsByStatus || {}).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-500">{status}</span>
                                <span className="text-lg font-semibold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interviews</h2>
                    {stats.upcomingInterviewsList?.length > 0 ? (
                        <div className="space-y-4">
                            {stats.upcomingInterviewsList.map((interview) => (
                                <div key={interview.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-blue-500 mt-1" />
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">{interview.company}</h3>
                                        <p className="text-sm text-gray-500">{interview.position}</p>
                                        <div className="mt-1">
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(interview.date), 'PPP p')}
                                            </span>
                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {interview.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No upcoming interviews</p>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                    {stats.recentActivities?.length > 0 ? (
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {stats.recentActivities.map((activity, idx) => (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {idx !== stats.recentActivities.length - 1 && (
                                                <span
                                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                                                        {activity.type === 'INTERVIEW' ? (
                                                            <CalendarIcon className="h-5 w-5 text-blue-500" />
                                                        ) : (
                                                            <BriefcaseIcon className="h-5 w-5 text-green-500" />
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            {activity.description} at <span className="font-medium text-gray-900">{activity.company}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        {formatDistance(new Date(activity.date), new Date(), { addSuffix: true })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No recent activity</p>
                    )}
                </div>
            </div>
        </div>
    );
}