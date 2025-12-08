import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    organizationId: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.organizationId, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/50 mb-4 animate-float">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Infra<span className="text-cyan-400">Track</span>
          </h1>
          <p className="text-gray-400 text-sm">Enterprise Cloud Infrastructure Monitor</p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Secure Access Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Professional Login</h2>
            <p className="text-gray-400 text-sm">Access restricted to authorized personnel only</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3 animate-shake">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-sm font-medium">Authentication Failed</p>
                <p className="text-red-300/80 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organization ID / Company Code
              </label>
              <div className="relative group">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={formData.organizationId}
                  onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                  placeholder="e.g., SA-GOV-001"
                  className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-11 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professional Email
              </label>
              <div className="relative group">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.name@enterprise.sa"
                  className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-11 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <LockClosedIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-11 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Secure Login</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Request Access Link */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              Don't have access?{' '}
              <Link
                to="/request-access"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Request Access
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              🔒 This is a secure government enterprise system. All access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300 font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Org ID: <span className="text-white">SA-GOV-001</span></p>
            <p>Email: <span className="text-white">admin@enterprise.sa</span></p>
            <p>Password: <span className="text-white">admin123</span></p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 InfraTrack Enterprise. Kingdom of Saudi Arabia.
        </p>
      </div>
    </div>
  );
};

export default Login;
