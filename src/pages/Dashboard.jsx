import { useState } from 'react'
import './Dashboard.css'
import logo from '../assets/logo.png'
import { RevenueChart, OrderStatusChart, WorkerPerformanceChart } from '../components/Charts'

function Dashboard({ ctx, setPage }) {
  const { jobs, customers, workers } = ctx
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate statistics
  const totalJobs = jobs.length
  const pendingJobs = jobs.filter(j => j.status === 'Pending' || j.status === 'In Progress').length
  const readyJobs = jobs.filter(j => j.status === 'Ready').length
  const deliveredJobs = jobs.filter(j => j.status === 'Delivered').length
  const totalCustomers = customers.length
  const totalWorkers = workers.length

  // Calculate revenue
  const totalRevenue = jobs
    .filter(j => j.status === 'Delivered')
    .reduce((sum, j) => sum + (parseFloat(j.totalAmount) || 0), 0)

  const pendingAmount = jobs
    .filter(j => j.status !== 'Delivered')
    .reduce((sum, j) => sum + (parseFloat(j.totalAmount) - parseFloat(j.advancePaid || 0)), 0)

  // Recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 10)

  // Filter jobs
  const filteredJobs = recentJobs.filter(job =>
    job.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.item?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800'
      case 'In Progress': return '#2196f3'
      case 'Trial': return '#9c27b0'
      case 'Ready': return '#4caf50'
      case 'Delivered': return '#00bcd4'
      default: return '#757575'
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="header-logo">
          <img src={logo} alt="BenGift Clothing Logo" className="header-logo-image" />
        </div>
        <h1>Dashboard</h1>
        <p>Overview of your tailor shop</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{pendingJobs}</div>
            <div className="stat-label">Pending Jobs</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{readyJobs}</div>
            <div className="stat-label">Ready for Delivery</div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon">👔</div>
          <div className="stat-content">
            <div className="stat-value">{totalWorkers}</div>
            <div className="stat-label">Workers</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">₵{totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => setPage('newjob')}>
            <span className="action-icon">➕</span>
            <span>New Job Card</span>
          </button>
          <button className="action-btn" onClick={() => setPage('jobs')}>
            <span className="action-icon">📋</span>
            <span>View All Jobs</span>
          </button>
          <button className="action-btn" onClick={() => setPage('reports')}>
            <span className="action-icon">📈</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Charts Section */}
      {jobs.length > 0 && (
        <div className="charts-section">
          <div className="charts-grid">
            <RevenueChart jobs={jobs} />
            <OrderStatusChart jobs={jobs} />
          </div>
          {workers.length > 0 && (
            <WorkerPerformanceChart jobs={jobs} workers={workers} />
          )}
        </div>
      )}

      {/* Recent Jobs */}
      <div className="recent-jobs">
        <div className="section-header">
          <h2>Recent Jobs</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs found. Create your first job card!</p>
            <button className="btn-primary" onClick={() => setPage('newjob')}>
              Create New Job
            </button>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Job No</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td><strong>{job.jobNo}</strong></td>
                    <td>{job.customerName}</td>
                    <td>{job.item}</td>
                    <td>{formatDate(job.orderDate)}</td>
                    <td>{formatDate(job.deliveryDate)}</td>
                    <td>₵{parseFloat(job.totalAmount || 0).toLocaleString()}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(job.status) }}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
