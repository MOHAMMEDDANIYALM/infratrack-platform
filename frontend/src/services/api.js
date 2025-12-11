const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios-like instance
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(method, url, data = null, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);

      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`HTTP ${response.status}: Invalid response format`);
      }

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(url, options) {
    return this.request('GET', url, null, options);
  }

  post(url, data, options) {
    return this.request('POST', url, data, options);
  }

  put(url, data, options) {
    return this.request('PUT', url, data, options);
  }

  delete(url, options) {
    return this.request('DELETE', url, null, options);
  }
}

const api = new APIClient(API_URL);

// Auth APIs
export const authAPI = {
  login: (organizationId, email, password) =>
    api.post('/auth/login', { organizationId, email, password }),

  loginWithMicrosoft: (token) =>
    api.post('/auth/microsoft', { token }),

  register: (organizationId, name, email, password, department, role) =>
    api.post('/auth/register', {
      organizationId,
      name,
      email,
      password,
      department,
      role,
    }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),

  getMe: () =>
    api.get('/auth/me'),
};

// Dashboard APIs
export const dashboardAPI = {
  getMetrics: () =>
    api.get('/dashboard/metrics'),

  getServers: () =>
    api.get('/servers'),

  createServer: (serverData) =>
    api.post('/servers', serverData),

  updateServer: (serverId, serverData) =>
    api.put(`/servers/${serverId}`, serverData),

  getLogs: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.skip) params.append('skip', filters.skip);
    return api.get(`/logs?${params.toString()}`);
  },

  createLog: (logData) =>
    api.post('/logs', logData),

  getAlerts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.skip) params.append('skip', filters.skip);
    return api.get(`/alerts?${params.toString()}`);
  },

  updateAlert: (alertId, status) =>
    api.put(`/alerts/${alertId}`, { status }),

  getCosts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.service) params.append('service', filters.service);
    return api.get(`/costs?${params.toString()}`);
  },

  getDeployments: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.environment) params.append('environment', filters.environment);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.skip) params.append('skip', filters.skip);
    return api.get(`/deployments?${params.toString()}`);
  },
};

export default api;
