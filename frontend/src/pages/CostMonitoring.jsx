import { useEffect, useMemo, useState } from 'react';
import { ChartBarIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { dashboardAPI } from '../services/api';

const CostMonitoring = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [costs, setCosts] = useState([]);
  const [budgetLimit] = useState(5000000); // 50 Lakh Rupees

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardAPI.getCosts({});
        console.log('[CostMonitoring] Received data:', data);
        if (data && Array.isArray(data.costs)) {
          setCosts(data.costs);
        } else {
          console.warn('[CostMonitoring] Invalid data format:', data);
          setCosts([]);
        }
      } catch (e) {
        console.error('[CostMonitoring] Error:', e);
        setError(e.message || 'Failed to fetch costs');
        setCosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCosts();
  }, []);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysElapsed = Math.max(1, Math.ceil((now - startOfMonth) / (1000 * 60 * 60 * 24)));

  const monthlyCosts = useMemo(() => costs.filter(c => new Date(c.date) >= startOfMonth), [costs]);
  const monthlyTotal = useMemo(() => monthlyCosts.reduce((sum, c) => sum + (c.cost || 0), 0), [monthlyCosts]);
  const dailyAverage = useMemo(() => monthlyTotal / daysElapsed, [monthlyTotal, daysElapsed]);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const forecast = useMemo(() => dailyAverage * daysInMonth, [dailyAverage, daysInMonth]);
  const servicesCost = useMemo(() => {
    const byService = monthlyCosts.reduce((acc, c) => {
      const key = c.service || 'Other';
      acc[key] = (acc[key] || 0) + (c.cost || 0);
      return acc;
    }, {});
    const total = Object.values(byService).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(byService)
      .map(([name, cost]) => ({ name, cost, percentage: Math.min(100, (cost / total) * 100), trend: '' }))
      .sort((a, b) => b.cost - a.cost);
  }, [monthlyCosts]);

  const anomalies = [];
  const recommendations = [];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const budgetUsage = budgetLimit ? (monthlyTotal / budgetLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-gray-400 text-xs mt-1">If this persists, ensure the app can reach the backend API and you are signed in.</p>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cost Monitoring & Optimization</h1>
        <p className="text-gray-400">Track cloud spending and optimize costs with AI recommendations</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-6">
          <p className="text-gray-300 text-sm mb-1">Monthly Cost</p>
          <p className="text-4xl font-bold text-white">₹ {monthlyTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Daily Average</p>
          <p className="text-3xl font-bold text-green-400">₹ {dailyAverage.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Forecast (Month End)</p>
          <p className="text-3xl font-bold text-yellow-400">₹ {forecast.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Budget Remaining</p>
          <p className="text-3xl font-bold text-blue-400">
            ₹ {(Math.max(0, budgetLimit - monthlyTotal)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Budget Usage */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Budget Usage</h3>
            <p className="text-gray-400 text-sm">Monthly limit: ₹ {budgetLimit.toLocaleString('en-IN')}</p>
          </div>
          <span className={`text-2xl font-bold ${budgetUsage > 90 ? 'text-red-400' : 'text-cyan-400'}`}>
            {budgetUsage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${
              budgetUsage > 90
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600'
            }`}
            style={{ width: `${budgetUsage}%` }}
          ></div>
        </div>
        {budgetUsage > 90 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">
              Warning: Budget usage exceeded 90%. Consider cost optimization strategies.
            </p>
          </div>
        )}
      </div>

      {/* Service Costs */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ChartBarIcon className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Cost by Service</h3>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-400">Loading cost data...</div>
          ) : servicesCost.length === 0 ? (
            <div className="text-gray-400">No cost data available.</div>
          ) : (
            servicesCost.map((service) => (
              <div key={service.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{service.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm ${service.trend?.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {service.trend || ''}
                    </span>
                    <span className="text-white font-semibold">₹ {service.cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cost Anomalies & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomalies */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Cost Anomalies</h3>
          </div>
          {anomalies.length === 0 ? (
            <div className="text-gray-400">No anomalies detected.</div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-white font-medium text-sm">{anomaly.service}</span>
                    <span className="text-red-400 font-bold">{anomaly.amount}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{anomaly.message}</p>
                  <p className="text-gray-500 text-xs">{anomaly.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Optimization Recommendations</h3>
          </div>
          {recommendations.length === 0 ? (
            <div className="text-gray-400">No recommendations yet.</div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-500/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-white font-medium text-sm">{rec.title}</span>
                    <span className="text-green-400 font-bold text-sm">{rec.savings}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{rec.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                    rec.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {rec.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostMonitoring;
