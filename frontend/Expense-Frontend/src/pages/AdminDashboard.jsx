// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const BASE_URL = import.meta.env.VITE_EXPENSE_BACKEND_API_URL || 'https://expense-backend-5ewg.onrender.com';

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      
      const response = await axios.get(`${BASE_URL}//api/admin-dashboard/system_summary/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Access Denied: Aapke paas Admin / Superuser permissions nahi hain.');
      } else {
        setError('Admin dashboard ka data fetch nahi ho saka. Server verify karein.');
      }
    } finally {
      setLoading(false);
    }
  };

  // User search filter
  const filteredUsers = data?.users?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-status-container">
        <div className="admin-loader">Loading Admin Control Panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-status-container">
        <div className="admin-error-card">
          <h2>⚠️ Access Error</h2>
          <p>{error}</p>
          <button onClick={loadAdminData} className="admin-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      {/* Top Header */}
      <header className="admin-header">
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>System-wide user summaries and transaction analytics</p>
        </div>
        <button onClick={loadAdminData} className="admin-btn">
          🔄 Refresh Metrics
        </button>
      </header>

      {/* Top Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-title">👥 Total Users</span>
          <h2 className="stat-value text-blue">{data?.total_users || 0}</h2>
          <span className="stat-desc">Registered Accounts</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-title">💰 System Volume</span>
          <h2 className="stat-value text-green">
            ₹{data?.total_volume?.toLocaleString() || 0}
          </h2>
          <span className="stat-desc">Total Incomes & Expenses</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-title">📜 Total Transactions</span>
          <h2 className="stat-value text-cyan">{data?.total_transactions || 0}</h2>
          <span className="stat-desc">Logged on Platform</span>
        </div>
      </div>

      {/* Users Management Section */}
      <section className="admin-section">
        <div className="section-header">
          <h2>Registered Users</h2>
          <input
            type="text"
            placeholder="🔍 Search username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th className="text-right">Total Income</th>
                <th className="text-right">Total Expense</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="font-mono">#{user.id}</td>
                    <td className="font-bold">{user.username}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td className="text-right text-green">+₹{user.total_income?.toLocaleString()}</td>
                    <td className="text-right text-red">-₹{user.total_expense?.toLocaleString()}</td>
                    <td className="text-center">
                      <span className={`badge ${user.is_active ? 'badge-active' : 'badge-disabled'}`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;