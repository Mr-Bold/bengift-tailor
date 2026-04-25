import { useState } from 'react'
import './Reports.css'
import logo from '/images/LOGO WINE.png'

function Reports({ ctx, setPage }) {
  const { jobs, customers, workers, shop } = ctx
  const [showMenu, setShowMenu] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  const totalJobs = jobs.length
  const delivered = jobs.filter(j => j.status === 'Delivered').length
  const pending = jobs.filter(j => j.status !== 'Delivered').length
  const totalRevenue = jobs.filter(j => j.status === 'Delivered').reduce((sum, j) => sum + parseFloat(j.totalAmount || 0), 0)
  const pendingRevenue = jobs.filter(j => j.status !== 'Delivered').reduce((sum, j) => sum + parseFloat(j.totalAmount || 0), 0)
  const completionRate = totalJobs > 0 ? Math.round((delivered / totalJobs) * 100) : 0

  const handleMenuClick = (reportType) => {
    setSelectedReport(reportType)
    setShowMenu(false)
  }

  const handleBack = () => {
    setShowMenu(true)
    setSelectedReport(null)
  }

  const handleCloseReports = () => {
    console.log('handleCloseReports called, setPage:', setPage)
    if (setPage) {
      console.log('Calling setPage with dashboard')
      setPage('dashboard')
    } else {
      console.log('setPage is not defined!')
    }
  }

  // Account Book Report
  const AccountBookReport = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [clientFilter, setClientFilter] = useState('All')

    // Filter transactions
    let transactions = jobs.map(job => ({
      date: job.orderDate,
      vcNo: job.jobNo,
      voucher: 'JOB',
      particulars: `${job.customerName} - ${job.items?.[0]?.item || 'Order'}`,
      debit: job.totalAmount,
      credit: job.advancePaid,
      remark: job.status
    }))

    // Apply date filter
    if (fromDate && toDate) {
      transactions = transactions.filter(t => t.date >= fromDate && t.date <= toDate)
    }

    // Apply client filter
    if (clientFilter !== 'All') {
      transactions = transactions.filter(t => t.particulars.includes(clientFilter))
    }

    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0)

    return (
      <div className="report-content">
        <div className="account-book-title-bar">Account Book</div>

        <div className="account-book-filters">
          <div className="filter-group">
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

          <div className="filter-group">
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
              <option value="All">Clients</option>
              {customers.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search..." />
          </div>

          <div className="action-buttons-right">
            <button className="btn-action-yellow">Add Entry</button>
            <button className="btn-action-yellow" onClick={() => handleMenuClick('dayBook')}>Day Book</button>
            <button className="btn-action-yellow">SMS Due Balance</button>
            <button className="btn-action-white" onClick={() => window.print()}>Print Report</button>
            <button className="btn-action-white" onClick={() => handleMenuClick('wagesRegister')}>Wages Register</button>
          </div>
        </div>

        <div className="account-book-table-container">
          <table className="account-book-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>VC #</th>
                <th>Voucher</th>
                <th>Particulars</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No transactions found</td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.date}</td>
                    <td>{t.vcNo}</td>
                    <td>{t.voucher}</td>
                    <td>{t.particulars}</td>
                    <td className="amount-debit">₵{t.debit.toFixed(2)}</td>
                    <td className="amount-credit">₵{t.credit.toFixed(2)}</td>
                    <td>{t.remark}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="4"><strong>Total:</strong></td>
                <td className="amount-debit"><strong>₵{totalDebit.toFixed(2)}</strong></td>
                <td className="amount-credit"><strong>₵{totalCredit.toFixed(2)}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Day Book Report
  const DayBookReport = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    // Filter transactions by date range
    let dayTransactions = jobs.map(job => ({
      date: job.orderDate,
      vcNo: job.jobNo,
      voucher: 'JOB',
      particulars: `${job.customerName} - ${job.items?.[0]?.item || 'Order'}`,
      amount: job.advancePaid || 0,
      remark: job.status
    }))

    // Apply date filter
    if (fromDate && toDate) {
      dayTransactions = dayTransactions.filter(t => t.date >= fromDate && t.date <= toDate)
    }

    const totalAmount = dayTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalVouchers = dayTransactions.length

    return (
      <div className="report-content">
        <div className="day-book-title-bar">Day Book</div>

        <div className="day-book-filters">
          <div className="filter-group">
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

          <button className="btn-view">View</button>
        </div>

        <div className="day-book-table-container">
          <table className="day-book-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>VC #</th>
                <th>Voucher</th>
                <th>Particulars</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {dayTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No transactions found for selected date range</td>
                </tr>
              ) : (
                <>
                  {dayTransactions.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.date}</td>
                      <td>{t.vcNo}</td>
                      <td>{t.voucher}</td>
                      <td>{t.particulars}</td>
                      <td className="amount-cell">₵{t.amount.toFixed(2)}</td>
                      <td>{t.remark}</td>
                    </tr>
                  ))}
                  <tr className="total-vouchers-row">
                    <td colSpan="6" className="total-vouchers-text">
                      Total Vouchers : {totalVouchers}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Wages Register Report
  const WagesRegisterReport = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [viewFilter, setViewFilter] = useState('All')
    const [workerFilter, setWorkerFilter] = useState('All')

    // Create wages data from jobs assigned to workers
    let wagesData = jobs.filter(job => job.workerId).map(job => {
      const worker = workers.find(w => w.id === job.workerId)
      const workerName = worker ? worker.name : 'Unknown Worker'
      
      // Calculate wages (assuming 20% of job amount as worker wages)
      const wagesDue = job.totalAmount * 0.2
      const isPaid = job.status === 'Delivered'
      const balance = isPaid ? 0 : wagesDue

      return {
        date: job.orderDate,
        jobId: job.jobNo,
        clientName: job.customerName,
        itemName: job.items?.[0]?.item || 'Order',
        wagesDue: wagesDue,
        balance: balance,
        complete: job.status === 'Delivered' ? 'Yes' : 'No',
        paidUnpaid: isPaid ? 'Paid' : 'Unpaid',
        workerName: workerName
      }
    })

    // Apply date filter
    if (fromDate && toDate) {
      wagesData = wagesData.filter(w => w.date >= fromDate && w.date <= toDate)
    }

    // Apply view filter
    if (viewFilter === 'Paid') {
      wagesData = wagesData.filter(w => w.paidUnpaid === 'Paid')
    } else if (viewFilter === 'Unpaid') {
      wagesData = wagesData.filter(w => w.paidUnpaid === 'Unpaid')
    }

    // Apply worker filter
    if (workerFilter !== 'All') {
      wagesData = wagesData.filter(w => w.workerName === workerFilter)
    }

    const totalWagesDue = wagesData.reduce((sum, w) => sum + w.wagesDue, 0)
    const totalBalance = wagesData.reduce((sum, w) => sum + w.balance, 0)

    return (
      <div className="report-content">
        <div className="wages-register-title-bar">WAGES REGISTER</div>

        <div className="wages-register-filters">
          <div className="filter-group">
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

          <div className="filter-group">
            <select value={workerFilter} onChange={(e) => setWorkerFilter(e.target.value)}>
              <option value="All">All Workers</option>
              {workers.map(w => (
                <option key={w.id} value={w.name}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="view-options">
            <label>
              <input 
                type="radio" 
                value="All"
                checked={viewFilter === 'All'}
                onChange={(e) => setViewFilter(e.target.value)}
              />
              View : All
            </label>
            <label>
              <input 
                type="radio" 
                value="Paid"
                checked={viewFilter === 'Paid'}
                onChange={(e) => setViewFilter(e.target.value)}
              />
              View : Paid
            </label>
            <label>
              <input 
                type="radio" 
                value="Unpaid"
                checked={viewFilter === 'Unpaid'}
                onChange={(e) => setViewFilter(e.target.value)}
              />
              View : Unpaid
            </label>
          </div>
        </div>

        <div className="wages-register-table-container">
          <table className="wages-register-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>JOB ID</th>
                <th>Client Name</th>
                <th>Item Name</th>
                <th>Wages Due</th>
                <th>Balance</th>
                <th>Complete</th>
                <th>Paid/Unpaid</th>
              </tr>
            </thead>
            <tbody>
              {wagesData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No wages data found for selected criteria</td>
                </tr>
              ) : (
                wagesData.map((w, idx) => (
                  <tr key={idx}>
                    <td>{w.date}</td>
                    <td>{w.jobId}</td>
                    <td>{w.clientName}</td>
                    <td>{w.itemName}</td>
                    <td className="wages-amount">₵{w.wagesDue.toFixed(2)}</td>
                    <td className="balance-amount">₵{w.balance.toFixed(2)}</td>
                    <td className={w.complete === 'Yes' ? 'complete-yes' : 'complete-no'}>
                      {w.complete}
                    </td>
                    <td className={w.paidUnpaid === 'Paid' ? 'status-paid' : 'status-unpaid'}>
                      {w.paidUnpaid}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="4"><strong>Total:</strong></td>
                <td className="wages-amount"><strong>₵{totalWagesDue.toFixed(2)}</strong></td>
                <td className="balance-amount"><strong>₵{totalBalance.toFixed(2)}</strong></td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Dues Register Report
  const DuesRegisterReport = () => {
    const dueJobs = jobs.filter(j => j.balance > 0)
    
    // Group by customer to get total dues per customer
    const customerDues = {}
    dueJobs.forEach(job => {
      if (!customerDues[job.customerName]) {
        customerDues[job.customerName] = 0
      }
      customerDues[job.customerName] += job.balance
    })

    const duesArray = Object.entries(customerDues).map(([client, dueAmount]) => ({
      client,
      dueAmount
    }))

    const totalDues = duesArray.reduce((sum, d) => sum + d.dueAmount, 0)

    return (
      <div className="report-content">
        <div className="dues-register-title-bar">Client Dues REGISTER</div>

        <div className="dues-register-table-container">
          <table className="dues-register-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Due Amount</th>
              </tr>
            </thead>
            <tbody>
              {duesArray.length === 0 ? (
                <tr>
                  <td colSpan="2" className="no-data">No outstanding dues</td>
                </tr>
              ) : (
                duesArray.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.client}</td>
                    <td className="due-amount-cell">₵{d.dueAmount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td><strong>Total Due:</strong></td>
                <td className="due-amount-cell"><strong>₵{totalDues.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Trial Reminder
  const TrialReminderReport = () => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectedRows, setSelectedRows] = useState([])

    const trialJobs = jobs.filter(j => j.trialDate && j.status !== 'Delivered')
    
    let upcomingTrials = trialJobs.map(job => ({
      id: job.id,
      name: job.customerName,
      trialDate: job.trialDate,
      status: job.status,
      jobId: job.jobNo,
      contact: job.customerPhone || '-',
      job: job
    }))

    // Apply date filter
    if (fromDate && toDate) {
      upcomingTrials = upcomingTrials.filter(t => t.trialDate >= fromDate && t.trialDate <= toDate)
    }

    const handleRowSelect = (id) => {
      setSelectedRows(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
    }

    const handleSelectAll = (e) => {
      if (e.target.checked) {
        setSelectedRows(upcomingTrials.map(t => t.id))
      } else {
        setSelectedRows([])
      }
    }

    return (
      <div className="report-content">
        <div className="trial-reminder-title-bar">Trial Date Reminders</div>

        <div className="trial-reminder-filters">
          <div className="filter-group">
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

          <button className="btn-show">Show</button>
        </div>

        <div className="trial-reminder-table-container">
          <table className="trial-reminder-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedRows.length === upcomingTrials.length && upcomingTrials.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>Trial Date</th>
                <th>Status</th>
                <th>Job ID</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTrials.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No upcoming trials</td>
                </tr>
              ) : (
                upcomingTrials.map(trial => (
                  <tr key={trial.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(trial.id)}
                        onChange={() => handleRowSelect(trial.id)}
                      />
                    </td>
                    <td>{trial.name}</td>
                    <td>{trial.trialDate}</td>
                    <td>{trial.status}</td>
                    <td>{trial.jobId}</td>
                    <td>{trial.contact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="trial-reminder-bottom">
          <div className="sms-template">
            <label>SMS Template:</label>
            <textarea 
              defaultValue="BenGift Clothing&#10;Dear Customer&#10;Your Trial Date is :&#10;Please don't forget visit our shop for a trial."
              rows="4"
            />
            <button className="btn-save-message">Save Message</button>
          </div>

          <div className="trial-reminder-actions">
            <button className="btn-send-sms">Send SMS to selected</button>
          </div>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Birthdays Reminder
  const BirthdaysReminderReport = () => {
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedRows, setSelectedRows] = useState([])

    // For now, we'll create sample birthday data from customers
    // In a real app, you'd have birthday info stored with customers
    let birthdayList = customers.map(c => ({
      id: c.id,
      name: c.name,
      dob: c.dob || '1990-01-15', // Placeholder DOB
      contact: c.phone || '-'
    }))

    // Filter by selected date (month and day)
    if (selectedDate) {
      const [month, day] = selectedDate.split('-').slice(1)
      birthdayList = birthdayList.filter(b => {
        const [bMonth, bDay] = b.dob.split('-').slice(1)
        return bMonth === month && bDay === day
      })
    }

    const handleRowSelect = (id) => {
      setSelectedRows(prev => 
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
    }

    const handleSelectAll = (e) => {
      if (e.target.checked) {
        setSelectedRows(birthdayList.map(b => b.id))
      } else {
        setSelectedRows([])
      }
    }

    return (
      <div className="report-content">
        <div className="birthday-reminder-title-bar">Birthday Reminders</div>

        <div className="birthday-reminder-filters">
          <label>Select Date</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn-show">Show</button>
        </div>

        <div className="birthday-reminder-table-container">
          <table className="birthday-reminder-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedRows.length === birthdayList.length && birthdayList.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>DOB</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {birthdayList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No birthdays found for selected date</td>
                </tr>
              ) : (
                birthdayList.map(birthday => (
                  <tr key={birthday.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(birthday.id)}
                        onChange={() => handleRowSelect(birthday.id)}
                      />
                    </td>
                    <td>{birthday.name}</td>
                    <td>{birthday.dob}</td>
                    <td>{birthday.contact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="birthday-reminder-bottom">
          <div className="sms-template">
            <label>Birthday Message:</label>
            <textarea 
              defaultValue="BenGift Clothing&#10;wishes you a very Happy Birthday..."
              rows="3"
            />
            <button className="btn-save-message">Save Message</button>
          </div>

          <div className="birthday-reminder-actions">
            <button className="btn-send-sms">Send SMS to selected</button>
          </div>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  // Ratings
  const RatingsReport = () => {
    const [workerRatings, setWorkerRatings] = useState([])

    // Create worker ratings from jobs
    const workerScores = {}
    jobs.forEach(job => {
      if (job.workerId) {
        if (!workerScores[job.workerId]) {
          workerScores[job.workerId] = { completed: 0, total: 0, rating: 0 }
        }
        workerScores[job.workerId].total++
        if (job.status === 'Delivered') {
          workerScores[job.workerId].completed++
        }
      }
    })

    // Calculate ratings based on completion rate
    const ratings = workers.map((worker, idx) => {
      const score = workerScores[worker.id] || { completed: 0, total: 0 }
      const completionRate = score.total > 0 ? (score.completed / score.total) * 100 : 0
      const rating = Math.round(completionRate / 20) // Convert to 5-star rating

      return {
        rank: idx + 1,
        workerName: worker.name,
        scorer: score.completed,
        rating: rating
      }
    }).sort((a, b) => b.rating - a.rating)

    const renderStars = (rating) => {
      return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
    }

    return (
      <div className="report-content">
        <div className="ratings-title-bar">Ratings</div>

        <div className="ratings-table-container">
          <table className="ratings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Worker Name</th>
                <th>Scorer</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">No worker ratings available</td>
                </tr>
              ) : (
                ratings.map((r, idx) => (
                  <tr key={idx}>
                    <td className="rank-cell">{r.rank}</td>
                    <td>{r.workerName}</td>
                    <td className="scorer-cell">{r.scorer}</td>
                    <td className="rating-cell">{renderStars(r.rating)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ratings-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">₵{totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-value">₵{pendingRevenue.toLocaleString()}</div>
                <div className="stat-label">Pending Revenue</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-value">{completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{delivered}/{totalJobs}</div>
                <div className="stat-label">Delivered Jobs</div>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h2>Job Status Breakdown</h2>
            <div className="status-breakdown">
              {['Pending', 'In Progress', 'Trial', 'Ready', 'Delivered'].map(status => {
                const count = jobs.filter(j => j.status === status).length
                const percentage = totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0
                return (
                  <div key={status} className="status-item">
                    <div className="status-name">{status}</div>
                    <div className="status-count">{count}</div>
                    <div className="status-percentage">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="report-back-button">
          <button onClick={handleBack} className="btn-back">← Back to Menu</button>
        </div>
      </div>
    )
  }

  return (
    <div className="reports">
      {showMenu && (
        <div className="reports-menu-overlay" onClick={() => handleCloseReports()}>
          <div className="reports-menu" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <div className="menu-logo">
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h2>{shop?.name || 'BenGift Clothing'}</h2>
              <button className="btn-close" onClick={() => handleCloseReports()}>✕</button>
            </div>
            <div className="menu-items">
              <button className="menu-item" onClick={() => handleMenuClick('accountBook')}>
                Account Book
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('dayBook')}>
                Day Book
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('wagesRegister')}>
                Wages Register
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('duesRegister')}>
                Dues Register
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('trialReminder')}>
                Trial Reminder
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('birthdaysReminder')}>
                Birthdays Reminder
              </button>
              <button className="menu-item" onClick={() => handleMenuClick('ratings')}>
                Ratings
              </button>
              <button className="menu-item menu-back" onClick={() => handleCloseReports()}>
                Back to Sidebar
              </button>
            </div>
          </div>
        </div>
      )}

      {!showMenu && (
        <div className="reports-overlay" onClick={() => handleCloseReports()}>
          <button className="reports-close-btn" onClick={() => handleCloseReports()} title="Back to Sidebar">✕</button>
          <div onClick={(e) => e.stopPropagation()}>
            {selectedReport === 'accountBook' && <AccountBookReport />}
            {selectedReport === 'dayBook' && <DayBookReport />}
            {selectedReport === 'wagesRegister' && <WagesRegisterReport />}
            {selectedReport === 'duesRegister' && <DuesRegisterReport />}
            {selectedReport === 'trialReminder' && <TrialReminderReport />}
            {selectedReport === 'birthdaysReminder' && <BirthdaysReminderReport />}
            {selectedReport === 'ratings' && <RatingsReport />}
            {!selectedReport && (
              <div className="report-content">
                <div className="report-header">
                  <h2>Reports</h2>
                  <button onClick={() => setShowMenu(true)} className="btn-menu">☰ Show Menu</button>
                </div>
                <p>Select a report from the menu</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
