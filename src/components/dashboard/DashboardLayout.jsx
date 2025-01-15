// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    BookmarkCheck,
    LayoutDashboard,
    UserCircle,
    Menu,
    LogOut,
    KanbanIcon,
    FileText
} from 'lucide-react';
import JobSearch from '../jobs/JobSearch';
import SavedJobs from '../jobs/SavedJobs';
import DashboardHome from '../dashboard/DashboardHome';
import KanbanBoard from '../jobs/KanbanBoard'; // Import KanbanBoard
import ResumeAnalyzer from '../resume/ResumeAnalyzer'; // Import ResumeAnalyzer

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout, user } = useAuth();
    const location = useLocation();

    // Updated navigation with Applications (Kanban Board)
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Job Search', href: '/dashboard/jobs', icon: Search },
        { name: 'Applications', href: '/dashboard/applications', icon: KanbanIcon },
        { name: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: BookmarkCheck },
        { name: 'Resume Analyzer', href: '/dashboard/resume-analyzer', icon: FileText }, // Added new route
    ];

    const isActive = (path) => location.pathname === path;

    const renderContent = () => {
        switch (location.pathname) {
            case '/dashboard':
                return <DashboardHome />;
            case '/dashboard/jobs':
                return <JobSearch />;
            case '/dashboard/applications':
                return <KanbanBoard />;
            case '/dashboard/saved-jobs':
                return <SavedJobs />;
            case '/dashboard/resume-analyzer':
                return <ResumeAnalyzer />;
            default:
                return <DashboardHome />;
        }
    };


    const renderMobileMenu = () => {
        if (!sidebarOpen) return null;
        
        return (
            <div className="fixed inset-0 z-50 lg:hidden">
                <div 
                    className="fixed inset-0 bg-gray-900/80"
                    onClick={() => setSidebarOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-64 bg-white">
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-xl font-bold">JobTracker</span>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="mt-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-2 text-sm ${
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu */}
            {renderMobileMenu()}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex items-center h-16 px-4 border-b border-gray-200">
                        <span className="text-xl font-bold">JobTracker</span>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden -m-2.5 p-2.5 text-gray-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center">
                            <div className="relative">
                                <button className="flex items-center text-gray-600 hover:text-gray-900">
                                    <UserCircle className="h-8 w-8 mr-2" />
                                    <span>{user?.email}</span>
                                </button>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <LogOut className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}