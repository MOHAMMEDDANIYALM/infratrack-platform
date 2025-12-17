import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import MainLayout from '../components/layout/MainLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import RequestAccess from '../pages/RequestAccess';
import AccountDisabled from '../pages/AccountDisabled';
import Dashboard from '../pages/Dashboard';
import Servers from '../pages/Servers';
import Kubernetes from '../pages/Kubernetes';
import Logs from '../pages/Logs';
import CostMonitoring from '../pages/CostMonitoring';
import Alerts from '../pages/Alerts';
import CICD from '../pages/CICD';
import Users from '../pages/Users';
import AIops from '../pages/AIops';
import HelpCenter from '../pages/HelpCenter';

function AppRoutes() {
  const ProtectedRoute = ({ children }) => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin"></div>
            <span>Verifying access...</span>
          </div>
        </div>
      );
    }

    if (!token) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/account-disabled" element={<AccountDisabled />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><ErrorBoundary><MainLayout /></ErrorBoundary></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/kubernetes" element={<Kubernetes />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/cost" element={<CostMonitoring />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/cicd" element={<CICD />} />
            <Route path="/users" element={<Users />} />
            <Route path="/aiops" element={<AIops />} />
            <Route path="/help" element={<HelpCenter />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;

