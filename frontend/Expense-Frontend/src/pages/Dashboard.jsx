import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Dashboard.css';

const Dashboard = () => {
  // State variables
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    remaining_balance: 0,
    category_breakdown: []
  });
  const [transactions, setTransactions] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'Expense',
    category: 'Food & Dining',
    date: '2026-09-16'
  });

  const token = localStorage.getItem('access_token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Summary & Transactions from Django Backend
  const fetchData = async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/transaction/summary/', axiosConfig),
        axios.get('http://127.0.0.1:8000/api/transaction/', axiosConfig)
      ]);
      setSummary(summaryRes.data);
      setTransactions(txRes.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Transaction Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/transaction/', formData, axiosConfig);
      // Form Reset & Reload Data
      setFormData({
        title: '',
        amount: '',
        type: 'Expense',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Delete Transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/transaction/${id}/`, axiosConfig);
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((item) => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-container">
      

      {/* 2. TOP SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-title">💵 Total Income</div>
          <div className="card-value income">₹{summary.total_income}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">💸 Total Expenses</div>
          <div className="card-value expense">₹{summary.total_expense}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">🏦 Remaining Balance</div>
          <div className="card-value balance">₹{summary.remaining_balance}</div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: ADD FORM + CATEGORY BREAKDOWN */}
      <div className="middle-grid">
        {/* Left Box: Add Transaction Form */}
        <div className="panel-box">
          <h2 className="panel-title">➕ Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Dinner with friends"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                placeholder="₹1,200"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="Expense"
                    checked={formData.type === 'Expense'}
                    onChange={handleInputChange}
                  />
                  Expense
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="Income"
                    checked={formData.type === 'Income'}
                    onChange={handleInputChange}
                  />
                  Income
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Rent & Bills">Rent & Bills</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Salary/Income">Salary/Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit">Add Transaction</button>
          </form>
        </div>

        {/* Right Box: Category-wise Breakdown */}
        <div className="panel-box">
          <h2 className="panel-title">📊 Category-wise Breakdown</h2>
          <div className="category-list">
            {summary.category_breakdown.length === 0 ? (
              <p className="text-gray">No expenses recorded yet.</p>
            ) : (
              summary.category_breakdown.map((item, index) => (
                <div key={index} className="category-item">
                  <div className="category-row-header">
                    <span>{item.category}</span>
                    <span>₹{item.total} ({item.percentage}%)</span>
                  </div>
                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: RECENT TRANSACTIONS TABLE */}
      <div className="panel-box">
        <div className="table-header-bar">
          <h2 className="panel-title" style={{ margin: 0 }}>📜 Recent Transactions</h2>
          <div className="table-filters">
            <select
              className="dropdown-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">Filter: All ▾</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Rent & Bills">Rent & Bills</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Title</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.category}</td>
                <td>{tx.title}</td>
                <td>{tx.date}</td>
                <td className={tx.type === 'Income' ? 'amount-income' : 'amount-expense'}>
                  {tx.type === 'Income' ? '+' : '-'}₹{tx.amount}
                </td>
                <td>
                  <button className="action-btn" title="Edit">✏️</button>
                  <button className="action-btn" title="Delete" onClick={() => handleDelete(tx.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;