import { Link } from 'react-router-dom';
import { ShieldExclamationIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AccountDisabled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl shadow-red-500/10 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
            <ShieldExclamationIcon className="w-10 h-10 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">Account Disabled</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your account has been temporarily disabled. This may be due to security reasons, policy violations, or administrative action.
          </p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-300">
              If you believe this is an error, please contact your system administrator immediately.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="mailto:support@enterprise.sa"
              className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all"
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span>Contact Support</span>
            </a>

            <Link
              to="/"
              className="block text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              Return to Login
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Support: support@enterprise.sa | +966-11-XXX-XXXX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDisabled;
