import { useEffect, useState } from 'react';
import { UsersIcon, PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { dashboardAPI } from '../services/api';

const Users = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getUsers();
        setUsers(Array.isArray(data?.users) ? data.users : []);
        setError('');
      } catch (e) {
        console.error('Failed to fetch users:', e);
        setError(e.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const activities = [];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'DevOps':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Viewer':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-500/20 text-green-400'
      : 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage users, roles, and access permissions</p>
        </div>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-400 mt-1">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-red-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Admins</p>
          <p className="text-3xl font-bold text-red-400 mt-1">
            {users.filter((u) => u.role === 'Admin').length}
          </p>
        </div>
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">DevOps</p>
          <p className="text-3xl font-bold text-cyan-400 mt-1">
            {users.filter((u) => u.role === 'DevOps').length}
          </p>
        </div>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
            <select className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none">
              <option>Select Role</option>
              <option>Admin</option>
              <option>DevOps</option>
              <option>Viewer</option>
            </select>
            <input
              type="text"
              placeholder="Organization ID"
              className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg">
              Create User
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center">
          <UsersIcon className="w-6 h-6 text-cyan-400 mr-2" />
          <h3 className="text-xl font-bold text-white">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{user.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">{user.email || 'No email'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs">
                        Edit
                      </button>
                      {user.status === 'active' ? (
                        <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs">
                          Disable
                        </button>
                      ) : (
                        <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs">
                          Enable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <ShieldCheckIcon className="w-6 h-6 mr-2 text-cyan-400" />
          Recent User Activities
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
              </div>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
