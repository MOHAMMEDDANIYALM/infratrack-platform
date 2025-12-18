import { useEffect, useMemo, useState } from 'react';
import { ServerIcon, PlayIcon, StopIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { azureAPI } from '../services/api';

const Servers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchServers = async () => {
      try {
        setLoading(true);
        const data = await azureAPI.getServers();
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.servers)
          ? data.servers
          : [];
        setServers(list);
        setError('');
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to fetch servers', err);
        setError(err.message || 'Failed to fetch servers');
        setServers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServers();
    const interval = setInterval(fetchServers, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMetricColor = (value) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = (server.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || server.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [servers, searchTerm, filterStatus]);

  const total = servers.length;
  const running = servers.filter((s) => s.status === 'running' || s.status === 'healthy').length;
  const stopped = servers.filter((s) => s.status === 'stopped').length;
  const warning = servers.filter((s) => s.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Server Management</h1>
        <p className="text-gray-400">Monitor and manage your virtual machines and cloud servers. Data from Azure Virtual Machines and Azure Resource Graph.</p>
      </div>
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Servers</p>
          <p className="text-3xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Running</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{running}</p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Stopped</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{stopped}</p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Warning</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{warning}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 text-white placeholder-gray-500 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>

      {/* Servers Table */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden min-h-[200px]">
        {loading ? (
          <div className="p-6 text-gray-400">Loading servers...</div>
        ) : filteredServers.length === 0 ? (
          <div className="p-6 text-gray-400">No servers match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Server</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Resources</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Uptime</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredServers.map((server, idx) => (
                  <tr key={server.id || server.name || idx} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <ServerIcon className="w-5 h-5 text-cyan-400" />
                          <span className="text-white font-medium">{server.name || 'Unnamed server'}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{server.ip || 'N/A'}</p>
                        <p className="text-gray-500 text-xs">{server.type || 'Server'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)} animate-pulse`}></div>
                        <span className="text-white capitalize">{server.status || 'unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-400">CPU: </span>
                          <span className={getMetricColor(server.cpu || 0)}>{server.cpu ?? 0}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">RAM: </span>
                          <span className={getMetricColor(server.ram || 0)}>{server.ram ?? 0}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Disk: </span>
                          <span className={getMetricColor(server.disk || 0)}>{server.disk ?? 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{server.location || server.region || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{server.uptime || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {server.status === 'running' || server.status === 'healthy' ? (
                          <>
                            <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all" title="Stop">
                              <StopIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all" title="Restart">
                              <ArrowPathIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all" title="Start">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servers;
