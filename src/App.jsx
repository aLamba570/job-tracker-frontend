// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add this import
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/layout/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import JobSearch from './components/Jobs/JobSearch';
import SavedJobs from './components/jobs/SavedJobs';
import { Toaster } from 'react-hot-toast';
import DashboardHome from './components/dashboard/DashboardHome';
import KanbanBoard from './components/jobs/KanbanBoard';
import ResumeAnalyzer from './components/resume/ResumeAnalyzer';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();



// Define PropTypes for AuthWrapper
AuthWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

function AuthWrapper({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (user && ['/login', '/register', '/'].includes(window.location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    
    <QueryClientProvider client={queryClient}>
    <Router>
    <Toaster position="top-right" />
      <AuthProvider>
        <AuthWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route index element={<DashboardHome />} />
              <Route path="applications" element={<KanbanBoard />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="/dashboard/resume-analysis/analyze" element={<ResumeAnalyzer />} />
          </Routes>
        </AuthWrapper>
      </AuthProvider>
    </Router>
    </QueryClientProvider>
  );
}