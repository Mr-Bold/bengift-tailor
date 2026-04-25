import { useState, useMemo } from 'react'
import './JobRegister.css'
import { jobsAPI } from '../services/api'
import logo from '../assets/logo.png'

function JobRegister({ ctx, setPage }) {
  const { jobs, setJobs, workers } = ctx

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [findRangeBy, setFindRangeBy] = useState('jobDate')
  const [workerFilter, setWorkerFilter] = useState('All')
  const [sortBy, setSortBy] = useState('All')
  const [jobIdSearch, setJobIdSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs]

    // Filter by date range
    if (fromDate && toDate) {
      filtered = filtered.filter(job => {
        const dateToCheck = findRangeBy === 'jobDate' ? job.orderDate : job.deliveryDate
        return dateToCheck >= fromDate && dateToCheck <= toDate
      })
    }

    // Filter by worker
    if (workerFilter !== 'All') {
      filtered = filtered.filter(job => job.workerId === workerFilter)
    }

    // Filter by job ID
    if (jobIdSearch) {
      filtered = filtered.filter(job => 
        job.jobNo.toLowerCase().includes(jobIdSearch.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'Date') {
      filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    } else if (sortBy === 'Status') {
      filtered.sort((a, b) => a.status.localeCompare(b.status))
    }

    return filtered
  }, [jobs, fromDate, toDate, findRangeBy, workerFilter, sortBy, jobIdSearch])

  const totalJobs = filteredJobs.length
  const totalBalance = filteredJobs.reduce((sum, job) => sum + (job.balance || 0), 0)

  const handleRowClick = (job) => {
    setSelectedJob(job)
  }

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      // Find the job to get its _id (MongoDB ID)
      const job = jobs.find(j => j.id === jobId || j._id === jobId)
      if (job && job._id) {
        await jobsAPI.updateStatus(job._id, newStatus)
      }
      // Update local state
      setJobs(jobs.map(job => 
        (job.id === jobId || job._id === jobId) ? { ...job, status: newStatus } : job
      ))
    } catch (error) {
      console.error('Error updating status:', error)
      // Still update locally even if API fails
      setJobs(jobs.map(job => 
        (job.id === jobId || job._id === jobId) ? { ...job, status: newStatus } : job
      ))
    }
  }

  const handleDelete = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const job = jobs.find(j => j.id === jobId || j._id === jobId)
        if (job && job._id) {
          await jobsAPI.delete(job._id)
        }
        setJobs(jobs.filter(job => job.id !== jobId && job._id !== jobId))
        setSelectedJob(null)
      } catch (error) {
        console.error('Error deleting job:', error)
        // Still delete locally
        setJobs(jobs.filter(job => job.id !== jobId && job._id !== jobId))
        setSelectedJob(null)
      }
    }
  }

  const handlePrint = (job) => {
    // Simple print functionality
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Card - ${job.jobNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Job Card #${job.jobNo}</h1>
          <p><strong>Customer:</strong> ${job.customerName}</p>
          <p><strong>Order Date:</strong> ${job.orderDate}</p>
          <p><strong>Delivery Date:</strong> ${job.deliveryDate}</p>
          <p><strong>Status:</strong> ${job.status}</p>
          <table>
            <thead>
              <tr><th>Item</th><th>Remark</th><th>QTY</th><th>Fees</th><th>Amount</th></tr>
            </thead>
            <tbody>
              ${job.items?.map(item => `
                <tr>
                  <td>${item.item}</td>
                  <td>${item.remark}</td>
                  <td>${item.qty}</td>
                  <td>${item.fees}</td>
                  <td>${item.amount}</td>
                </tr>
              `).join('') || '<tr><td colspan="5">No items</td></tr>'}
            </tbody>
          </table>
          <p><strong>Total Amount:</strong> ₵${job.totalAmount}</p>
          <p><strong>Advance Paid:</strong> ₵${job.advancePaid}</p>
          <p><strong>Balance:</strong> ₵${job.balance}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getWorkerName = (workerId) => {
    const worker = workers.find(w => w.id === workerId)
    return worker ? worker.name : '-'
  }

  return (
    <div className="job-register">
      <div className="register-title">
        <div className="title-content">
          <img src={logo} alt="BenGift Logo" className="title-logo" />
          <span>Job Register - BenGift Clothing v1.0 - Quality Tailoring Solutions</span>
        </div>
        <button className="register-close-btn" onClick={() => setPage('dashboard')} title="Close">✕</button>
      </div>
      
      <div className="register-filters">
        <div className="filter-row">
          <div className="date-filters">
            <label>From</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label>to</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="range-options">
            <label>
              <input 
                type="radio" 
                value="jobDate"
                checked={findRangeBy === 'jobDate'}
                onChange={(e) => setFindRangeBy(e.target.value)}
              />
              Find Range : Job Date
            </label>
            <label>
              <input 
                type="radio" 
                value="deliveryDate"
                checked={findRangeBy === 'deliveryDate'}
                onChange={(e) => setFindRangeBy(e.target.value)}
              />
              Find Range : Delivery Date
            </label>
          </div>

          <div className="worker-filter">
            <label>Worker :</label>
            <select value={workerFilter} onChange={(e) => setWorkerFilter(e.target.value)}>
              <option value="All">All</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="sort-filter">
            <label>Sort :</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="All">All</option>
              <option value="Date">Date</option>
              <option value="Status">Status</option>
            </select>
          </div>

          <div className="job-id-search">
            <label>Job ID #</label>
            <input 
              type="text" 
              value={jobIdSearch}
              onChange={(e) => setJobIdSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      <div className="register-table-container">
        <table className="register-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Job ID</th>
              <th>Client Name</th>
              <th>Item Name</th>
              <th>Remark</th>
              <th>Del. Date</th>
              <th>Worker</th>
              <th>Cut...</th>
              <th>Status</th>
              <th>Location</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="total-row">
              <td colSpan="10">Total JOBS: {totalJobs}</td>
              <td>₵{totalBalance.toFixed(2)}</td>
              <td></td>
            </tr>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">No jobs found</td>
              </tr>
            ) : (
              filteredJobs.map(job => (
                <tr 
                  key={job.id} 
                  onClick={() => handleRowClick(job)}
                  className={selectedJob?.id === job.id ? 'selected' : ''}
                >
                  <td>{job.orderDate}</td>
                  <td>{job.jobNo}</td>
                  <td>{job.customerName}</td>
                  <td>{job.items?.[0]?.item || '-'}</td>
                  <td>{job.items?.[0]?.remark || '-'}</td>
                  <td>{job.deliveryDate}</td>
                  <td>{getWorkerName(job.workerId)}</td>
                  <td>-</td>
                  <td>
                    <select 
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`status-select status-${job.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Trial">Trial</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>-</td>
                  <td>₵{job.balance?.toFixed(2) || '0.00'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePrint(job); }}
                        className="btn-print"
                        title="Print"
                      >
                        🖨
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div className="job-details">
          <h3>Job Details - #{selectedJob.jobNo}</h3>
          <div className="details-grid">
            <div><strong>Customer:</strong> {selectedJob.customerName}</div>
            <div><strong>Order Date:</strong> {selectedJob.orderDate}</div>
            <div><strong>Delivery Date:</strong> {selectedJob.deliveryDate}</div>
            <div><strong>Trial Date:</strong> {selectedJob.trialDate || '-'}</div>
            <div><strong>Status:</strong> {selectedJob.status}</div>
            <div><strong>Total Amount:</strong> ₵{selectedJob.totalAmount}</div>
            <div><strong>Advance Paid:</strong> ₵{selectedJob.advancePaid}</div>
            <div><strong>Balance:</strong> ₵{selectedJob.balance}</div>
          </div>
          {selectedJob.items && selectedJob.items.length > 0 && (
            <div className="items-details">
              <h4>Items:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Remark</th>
                    <th>QTY</th>
                    <th>Fees</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJob.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.item}</td>
                      <td>{item.remark}</td>
                      <td>{item.qty}</td>
                      <td>₵{item.fees}</td>
                      <td>₵{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobRegister
