import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { dashboardAPI, azureAPI } from '../../services/api';

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Fetch real alerts for notifications (prefer Azure)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingAlerts(true);
        let list = [];
        try {
          list = await azureAPI.getAlerts();
        } catch {}
        if (!Array.isArray(list) || list.length === 0) {
          const data = await dashboardAPI.getAlerts({ limit: 5 });
          list = Array.isArray(data?.alerts) ? data.alerts : [];
        }
        setAlerts(Array.isArray(list) ? list.slice(0,5) : []);
      } catch (e) {
        console.error('Failed to fetch alerts:', e);
        setAlerts([]);
      } finally {
        setLoadingAlerts(false);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Global search handler
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const [servers, logs, deployments] = await Promise.all([
        azureAPI.getServers?.().catch(() => ({ servers: [] })) || { servers: [] },
        dashboardAPI.getLogs?.({ search: term, limit: 3 }).catch(() => ({ logs: [] })) || { logs: [] },
        dashboardAPI.getDeployments?.({ limit: 3 }).catch(() => ({ deployments: [] })) || { deployments: [] },
      ]);

      const results = [];

      // Filter servers
      if (servers?.servers || servers) {
        const serverList = servers?.servers || servers || [];
        serverList.filter(s => (s.name || '').toLowerCase().includes(term.toLowerCase())).slice(0, 2).forEach(s => {
          results.push({ type: 'server', id: s.id, title: s.name, subtitle: s.status, link: '/servers' });
        });
      }

      // Filter logs
      if (logs?.logs) {
        logs.logs.slice(0, 2).forEach(l => {
          results.push({ type: 'log', id: l.id, title: l.message || 'Log entry', subtitle: l.severity, link: '/logs' });
        });
      }

      // Filter deployments
      if (deployments?.deployments) {
        deployments.deployments.filter(d => (d.name || '').toLowerCase().includes(term.toLowerCase())).slice(0, 2).forEach(d => {
          results.push({ type: 'deployment', id: d.id, title: d.name, subtitle: d.status, link: '/cicd' });
        });
      }

      setSearchResults(results);
    } catch (e) {
      console.error('Search error:', e);
      setSearchResults([]);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      case 'success': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-cyan-500/20 shadow-lg fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Bar with Results */}
        <div className="flex-1 max-w-2xl relative group">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search servers, logs, deployments..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
            />

            {/* Search Results Dropdown */}
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => {
                      navigate(result.link);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{result.title}</p>
                        <p className="text-gray-400 text-xs capitalize">{result.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${result.subtitle === 'success' || result.subtitle === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {result.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-cyan-500/30 rounded-lg p-4 text-gray-400 text-sm z-50">
                No results found
              </div>
            )}
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
              {alerts.length > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {alerts.length}
                  </span>
                </>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden z-50">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3">
                  <h3 className="text-white font-semibold">Active Alerts</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loadingAlerts ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">Loading alerts...</div>
                  ) : alerts.length === 0 ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">No active alerts</div>
                  ) : alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`px-4 py-3 border-l-4 ${getAlertColor(alert.severity)} hover:bg-gray-700/50 transition-colors cursor-pointer`}
                    >
                      <p className="text-white text-sm font-medium">{alert.message || alert.name}</p>
                      <p className="text-gray-400 text-xs mt-1">{alert.severity} • {alert.resource || 'System'}</p>
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
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden z-50">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3">
                  <h3 className="text-white font-semibold">Settings</h3>
                </div>
                <div className="py-3">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white text-sm font-medium mb-3">Display</p>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 px-2 py-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                        checked={theme === 'dark'}
                        onChange={(e)=>setTheme(e.target.checked ? 'dark' : 'light')}
                      />
                      <span className="text-gray-300 text-sm">Dark Mode</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 px-2 py-2 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600" defaultChecked />
                      <span className="text-gray-300 text-sm">Show System Status</span>
                    </label>
                  </div>

                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white text-sm font-medium mb-3">Notifications</p>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 px-2 py-2 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600" defaultChecked />
                      <span className="text-gray-300 text-sm">Critical Alerts</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 px-2 py-2 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600" defaultChecked />
                      <span className="text-gray-300 text-sm">Deployment Events</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 px-2 py-2 rounded transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600" />
                      <span className="text-gray-300 text-sm">Cost Alerts</span>
                    </label>
                  </div>

                  <div className="px-4 py-2">
                    <p className="text-white text-sm font-medium mb-3">Data Refresh</p>
                    <select className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-cyan-500">
                      <option>Every 10 seconds</option>
                      <option selected>Every 30 seconds</option>
                      <option>Every 60 seconds</option>
                      <option>Manual refresh</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

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
