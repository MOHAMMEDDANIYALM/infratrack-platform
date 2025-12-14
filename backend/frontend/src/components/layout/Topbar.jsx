import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const notifications = [
    { id: 1, type: 'critical', message: 'Server EU-WEST-2 CPU at 95%', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Deployment failed on staging', time: '15 min ago' },
    { id: 3, type: 'info', message: 'Monthly cost exceeded threshold', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'Kubernetes cluster scaled successfully', time: '3 hours ago' },
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      case 'success': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-cyan-500/20 shadow-lg fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search servers, logs, deployments..."
              className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* System Status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden z-50">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-l-4 ${getNotificationColor(notif.type)} hover:bg-gray-700/50 transition-colors cursor-pointer`}
                    >
                      <p className="text-white text-sm">{notif.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/alerts"
                  className="block text-center py-2 bg-gray-900 text-cyan-400 hover:text-cyan-300 text-sm font-medium border-t border-gray-700"
                >
                  View All Alerts
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            <Cog6ToothIcon className="w-6 h-6" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-all"
            >
              <div>
                <p className="text-white text-sm font-medium text-right">{user?.name || 'Admin User'}</p>
                <p className="text-cyan-400 text-xs text-right flex items-center justify-end">
                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  {user?.role || 'Admin'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold">{user?.name || 'Admin User'}</p>
                  <p className="text-gray-400 text-sm">{user?.email || 'admin@enterprise.sa'}</p>
                  <p className="text-cyan-400 text-xs mt-1">Org: {user?.organizationId || 'SA-GOV-001'}</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
