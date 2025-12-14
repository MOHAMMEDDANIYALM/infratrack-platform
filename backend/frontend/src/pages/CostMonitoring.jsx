import { useState } from 'react';
import { CurrencyDollarIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CostMonitoring = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const costData = {
    total: 45678.50,
    daily: 1523.28,
    monthly: 45678.50,
    forecast: 48234.00,
    budgetLimit: 50000.00,
  };

  const servicesCost = [
    { name: 'Compute (EC2)', cost: 15234.50, percentage: 33.4, trend: '+5%' },
    { name: 'Storage (S3)', cost: 8976.20, percentage: 19.6, trend: '+2%' },
    { name: 'Database (RDS)', cost: 12345.80, percentage: 27.0, trend: '-3%' },
    { name: 'Network', cost: 4567.30, percentage: 10.0, trend: '+8%' },
    { name: 'Kubernetes', cost: 3245.60, percentage: 7.1, trend: '+12%' },
    { name: 'Other Services', cost: 1309.10, percentage: 2.9, trend: '+1%' },
  ];

  const anomalies = [
    {
      id: 1,
      service: 'Compute (EC2)',
      message: 'Unusual spike in EU-WEST region - 45% increase',
      amount: '+$2,345',
      severity: 'high',
      date: '2025-12-07',
    },
    {
      id: 2,
      service: 'Network',
      message: 'Data transfer costs exceeded normal threshold',
      amount: '+$876',
      severity: 'medium',
      date: '2025-12-06',
    },
    {
      id: 3,
      service: 'Storage (S3)',
      message: 'Increased storage usage in backup buckets',
      amount: '+$456',
      severity: 'low',
      date: '2025-12-05',
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Right-size Underutilized EC2 Instances',
      savings: '$3,245/month',
      impact: 'High',
      description: '12 instances running at less than 20% CPU utilization',
    },
    {
      id: 2,
      title: 'Use Reserved Instances',
      savings: '$1,890/month',
      impact: 'High',
      description: 'Save 40% by committing to 1-year reserved instances',
    },
    {
      id: 3,
      title: 'Enable S3 Lifecycle Policies',
      savings: '$876/month',
      impact: 'Medium',
      description: 'Move infrequently accessed data to cheaper storage tiers',
    },
    {
      id: 4,
      title: 'Delete Unused Snapshots',
      savings: '$234/month',
      impact: 'Low',
      description: '45 snapshots older than 90 days detected',
    },
  ];

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

  const budgetUsage = (costData.monthly / costData.budgetLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cost Monitoring & Optimization</h1>
        <p className="text-gray-400">Track cloud spending and optimize costs with AI recommendations</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-6">
          <p className="text-gray-300 text-sm mb-1">Monthly Cost</p>
          <p className="text-4xl font-bold text-white">${costData.monthly.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Daily Average</p>
          <p className="text-3xl font-bold text-green-400">${costData.daily.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Forecast (Month End)</p>
          <p className="text-3xl font-bold text-yellow-400">${costData.forecast.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Budget Remaining</p>
          <p className="text-3xl font-bold text-blue-400">
            ${(costData.budgetLimit - costData.monthly).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget Usage */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Budget Usage</h3>
            <p className="text-gray-400 text-sm">Monthly limit: ${costData.budgetLimit.toLocaleString()}</p>
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
          {servicesCost.map((service) => (
            <div key={service.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{service.name}</span>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${service.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                    {service.trend}
                  </span>
                  <span className="text-white font-semibold">${service.cost.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: `${service.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
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
        </div>

        {/* Recommendations */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Optimization Recommendations</h3>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default CostMonitoring;
