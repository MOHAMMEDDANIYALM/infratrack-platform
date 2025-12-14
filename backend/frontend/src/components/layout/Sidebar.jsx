import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ServerIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BellIcon,
  RocketLaunchIcon,
  UsersIcon,
  CpuChipIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Servers & Cloud', path: '/servers', icon: ServerIcon },
    { name: 'Kubernetes', path: '/kubernetes', icon: CpuChipIcon },
    { name: 'Logs & Audit', path: '/logs', icon: DocumentTextIcon },
    { name: 'Cost Monitoring', path: '/cost', icon: CurrencyDollarIcon },
    { name: 'Alerts', path: '/alerts', icon: BellIcon },
    { name: 'CI/CD Pipeline', path: '/cicd', icon: RocketLaunchIcon },
    { name: 'User Management', path: '/users', icon: UsersIcon },
    { name: 'AI Ops', path: '/aiops', icon: ChartBarIcon },
    { name: 'Help Center', path: '/help', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-screen fixed left-0 top-0 transition-all duration-300 border-r border-cyan-500/20 shadow-2xl shadow-cyan-500/10 z-50`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-500/20">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">InfraTrack</h1>
              <p className="text-[10px] text-cyan-400">Enterprise Cloud Monitor</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50 mx-auto">
            <CpuChipIcon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-gray-800 border border-cyan-500/30 rounded-full p-1 hover:bg-gray-700 transition-colors shadow-lg"
      >
        {collapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-start'
              } px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400/50"></div>
              )}
              <Icon
                className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} ${
                  isActive ? 'text-white' : 'text-cyan-400 group-hover:text-cyan-300'
                }`}
              />
              {!collapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/20 bg-gray-900/90">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">System Operational</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">v2.5.1 Enterprise</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
