import { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  TicketIcon,
  SignalIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const HelpCenter = () => {
  const [selectedTab, setSelectedTab] = useState('guides');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    category: '',
    subject: '',
    description: '',
  });

  const guides = [
    {
      id: 1,
      title: 'Getting Started with InfraTrack',
      category: 'Login & Access',
      content: 'Learn how to log in and navigate the dashboard',
      icon: '🚀',
    },
    {
      id: 2,
      title: 'Understanding Dashboard Metrics',
      category: 'Dashboard',
      content: 'Comprehensive guide to real-time monitoring metrics',
      icon: '📊',
    },
    {
      id: 3,
      title: 'Managing Servers and Cloud Resources',
      category: 'Servers',
      content: 'Start, stop, restart, and monitor your servers',
      icon: '🖥️',
    },
    {
      id: 4,
      title: 'Kubernetes Cluster Management',
      category: 'Kubernetes',
      content: 'Monitor nodes, pods, and deployments effectively',
      icon: '☸️',
    },
    {
      id: 5,
      title: 'Viewing and Filtering Logs',
      category: 'Logs',
      content: 'Access application, security, and audit logs',
      icon: '📝',
    },
    {
      id: 6,
      title: 'Cost Monitoring and Optimization',
      category: 'Cost',
      content: 'Track spending and implement AI recommendations',
      icon: '💰',
    },
    {
      id: 7,
      title: 'Setting Up Alert Rules',
      category: 'Alerts',
      content: 'Configure alerts for critical system events',
      icon: '🔔',
    },
    {
      id: 8,
      title: 'CI/CD Pipeline Configuration',
      category: 'CI/CD',
      content: 'Monitor deployments and manage rollbacks',
      icon: '🚀',
    },
    {
      id: 9,
      title: 'User Management and Roles',
      category: 'Users',
      content: 'Add users, assign roles, and manage permissions',
      icon: '👥',
    },
    {
      id: 10,
      title: 'AI Ops Intelligence Features',
      category: 'AI Ops',
      content: 'Leverage AI for predictions and optimizations',
      icon: '🤖',
    },
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your registered email.',
    },
    {
      question: 'What are the different user roles?',
      answer: 'Admin: Full system access. DevOps: Manage infrastructure. Viewer: Read-only access.',
    },
    {
      question: 'How often are metrics updated?',
      answer: 'Dashboard metrics are updated every 5 seconds in real-time.',
    },
    {
      question: 'Can I export logs and reports?',
      answer: 'Yes, you can export logs in CSV/JSON format from the Logs page.',
    },
    {
      question: 'How do I contact support?',
      answer: 'Use the "Submit Ticket" section or email support@enterprise.sa',
    },
  ];

  const systemStatus = [
    { service: 'API Gateway', status: 'operational', uptime: '99.99%' },
    { service: 'Monitoring System', status: 'operational', uptime: '99.97%' },
    { service: 'Database Cluster', status: 'operational', uptime: '100%' },
    { service: 'Authentication Service', status: 'operational', uptime: '99.95%' },
    { service: 'Notification System', status: 'degraded', uptime: '98.50%' },
  ];

  const incidents = [
    {
      id: 1,
      title: 'Notification Delays',
      status: 'investigating',
      date: '2025-12-08',
      severity: 'minor',
      updates: 'Team is investigating email notification delays. ETA: 2 hours',
    },
    {
      id: 2,
      title: 'API Rate Limiting',
      status: 'resolved',
      date: '2025-12-07',
      severity: 'moderate',
      updates: 'Issue resolved. API rate limits restored to normal.',
    },
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    alert('Support ticket submitted successfully! Ticket ID: #TKT-' + Math.floor(Math.random() * 10000));
    setTicketForm({ category: '', subject: '', description: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-500/20';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'down':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'minor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredGuides = guides.filter((guide) =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-cyan-400" />
          Help Center
        </h1>
        <p className="text-gray-400">Get help, submit tickets, and check system status</p>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search help articles, guides, FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900/50 text-white placeholder-gray-500 pl-12 pr-4 py-4 rounded-xl border border-cyan-500/20 focus:border-cyan-500 focus:outline-none text-lg"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-900/50 border border-cyan-500/20 rounded-xl p-2">
        {[
          { id: 'guides', label: 'User Guides', icon: BookOpenIcon },
          { id: 'faqs', label: 'FAQs', icon: QuestionMarkCircleIcon },
          { id: 'ticket', label: 'Submit Ticket', icon: TicketIcon },
          { id: 'status', label: 'System Status', icon: SignalIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Guides */}
      {selectedTab === 'guides' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Step-by-Step Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{guide.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{guide.content}</p>
                    <span className="text-cyan-400 text-xs font-medium">
                      Category: {guide.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {selectedTab === 'faqs' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all"
              >
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center">
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-cyan-400" />
                  {faq.question}
                </h3>
                <p className="text-gray-400 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Ticket */}
      {selectedTab === 'ticket' && (
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <TicketIcon className="w-6 h-6 mr-2 text-cyan-400" />
            Submit Support Ticket
          </h2>
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Issue Category</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="login">Login & Access Issues</option>
                <option value="performance">Performance Issues</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                placeholder="Brief description of the issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                rows="6"
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                placeholder="Provide detailed information about your issue..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Attach Files (Optional)</label>
              <input
                type="file"
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                multiple
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
            >
              Submit Ticket
            </button>
          </form>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>Pro Tip:</strong> Include screenshots and error messages for faster resolution.
              Average response time: 2-4 hours.
            </p>
          </div>
        </div>
      )}

      {/* System Status */}
      {selectedTab === 'status' && (
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <SignalIcon className="w-6 h-6 mr-2 text-green-400" />
              System Status
            </h2>
            <div className="space-y-3">
              {systemStatus.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    } animate-pulse`}></div>
                    <span className="text-white font-medium">{service.service}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">Uptime: {service.uptime}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <DocumentTextIcon className="w-6 h-6 mr-2 text-yellow-400" />
              Incident History
            </h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold">{incident.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{incident.updates}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Date: {incident.date}</span>
                    <span>•</span>
                    <span className={incident.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'}>
                      Status: {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
