import React, { useState, useEffect } from 'react';
import { Shield, Eye, Download, Trash2, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { adminAuthService, SecurityLog } from '../../lib/adminAuthService';

const AdminSecurityDashboard: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    loadSecurityLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [securityLogs, filterAction, filterMethod, searchTerm]);

  const loadSecurityLogs = () => {
    const logs = adminAuthService.getSecurityLogs();
    setSecurityLogs(logs.reverse()); // Show newest first
  };

  const filterLogs = () => {
    let filtered = [...securityLogs];

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterMethod !== 'all') {
      filtered = filtered.filter(log => log.method === filterMethod);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address.includes(searchTerm) ||
        log.user_agent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Email', 'Action', 'Method', 'Success', 'IP Address', 'User Agent'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.email,
        log.action,
        log.method,
        log.additional_info?.success ? 'Yes' : 'No',
        log.ip_address,
        log.user_agent
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-security-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearOldLogs = () => {
    if (confirm('Clear logs older than 30 days? This action cannot be undone.')) {
      adminAuthService.clearOldLogs(30);
      loadSecurityLogs();
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login_success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'login_failure': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'access_denied': return <Shield className="w-4 h-4 text-orange-500" />;
      case 'logout': return <User className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMethodBadge = (method: string) => {
    return method === 'bypass' ? (
      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
        Bypass
      </span>
    ) : (
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
        Standard
      </span>
    );
  };

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const stats = {
    totalLogs: securityLogs.length,
    successfulLogins: securityLogs.filter(log => log.action === 'login_success').length,
    failedAttempts: securityLogs.filter(log => log.action === 'login_failure').length,
    bypassUsage: securityLogs.filter(log => log.method === 'bypass').length
  };

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
            </div>
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successful Logins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successfulLogins}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failedAttempts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bypass Usage</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bypassUsage}</p>
            </div>
            <Eye className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by email, IP, or user agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             autoComplete="off"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Actions</option>
              <option value="login_attempt">Login Attempts</option>
              <option value="login_success">Successful Logins</option>
              <option value="login_failure">Failed Logins</option>
              <option value="access_denied">Access Denied</option>
              <option value="logout">Logouts</option>
            </select>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Methods</option>
              <option value="standard">Standard Auth</option>
              <option value="bypass">Bypass Auth</option>
            </select>
            <button
              onClick={exportLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={clearOldLogs}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Old</span>
            </button>
          </div>
        </div>

        {/* Security Logs Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-gray-900 capitalize">
                        {log.action.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMethodBadge(log.method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.additional_info?.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.additional_info?.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No security logs found</h3>
            <p className="text-gray-600">
              {searchTerm || filterAction !== 'all' || filterMethod !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Security logs will appear here as admin activities occur'
              }
            </p>
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Bypass Authentication Usage</h4>
              <p className="text-sm text-yellow-700">
                Monitor bypass authentication usage. Consider implementing time-based restrictions for production environments.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Regular Security Audits</h4>
              <p className="text-sm text-blue-700">
                Review security logs regularly and implement additional security measures as needed.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Environment Variables</h4>
              <p className="text-sm text-green-700">
                Bypass credentials are stored in environment variables for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurityDashboard;