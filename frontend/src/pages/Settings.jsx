import { useState, useEffect } from 'react'
import './Settings.css'
import { jobsAPI, customersAPI, workersAPI, fabricsAPI } from '../services/api'
import { showToast } from '../utils/toast'
import * as XLSX from 'xlsx'

function Settings({ ctx }) {
  const { jobs, setJobs, customers, setCustomers, workers, setWorkers } = ctx
  const [showHelp, setShowHelp] = useState(false)

  const exportData = () => {
    const data = {
      jobs,
      customers,
      workers,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tailor-master-backup-${Date.now()}.json`
    a.click()
  }

  const exportToExcel = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Prepare Jobs data
      const jobsData = jobs.map(job => ({
        'Job ID': job.jobId || job._id,
        'Customer Name': job.clientName,
        'Phone': job.clientPhone || '',
        'Delivery Date': job.deliveryDate ? new Date(job.deliveryDate).toLocaleDateString() : '',
        'Trial Date': job.trialDate ? new Date(job.trialDate).toLocaleDateString() : '',
        'Status': job.status || 'Pending',
        'Worker': job.assignedWorker || '',
        'Total Amount': job.totalAmount || 0,
        'Advance Paid': job.advancePaid || 0,
        'Balance': (job.totalAmount || 0) - (job.advancePaid || 0),
        'Items Count': job.items?.length || 0,
        'Created Date': job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''
      }))

      // Prepare Customers data
      const customersData = customers.map(customer => ({
        'Name': customer.name,
        'Address': customer.address || '',
        'City': customer.city || '',
        'State': customer.state || '',
        'Mobile': customer.mobile || '',
        'Email': customer.email || '',
        'Date of Birth': customer.dob ? new Date(customer.dob).toLocaleDateString() : '',
        'Total Jobs': jobs.filter(j => j.clientName === customer.name).length,
        'Pending Jobs': jobs.filter(j => j.clientName === customer.name && j.status !== 'Delivered').length
      }))

      // Prepare Workers data
      const workersData = workers.map(worker => ({
        'Name': worker.name,
        'Address': worker.address || '',
        'City': worker.city || '',
        'State': worker.state || '',
        'Mobile': worker.mobile || '',
        'Skill': worker.skill || '',
        'Salary': worker.salary || 0,
        'Assigned Jobs': jobs.filter(j => j.assignedWorker === worker.name).length,
        'Completed Jobs': jobs.filter(j => j.assignedWorker === worker.name && j.status === 'Delivered').length
      }))

      // Prepare Job Items details
      const jobItemsData = []
      jobs.forEach(job => {
        if (job.items && job.items.length > 0) {
          job.items.forEach(item => {
            jobItemsData.push({
              'Job ID': job.jobId || job._id,
              'Customer': job.clientName,
              'Item Name': item.itemName || '',
              'Quantity': item.quantity || 1,
              'Chest': item.measurements?.chest || '',
              'Waist': item.measurements?.waist || '',
              'Hip': item.measurements?.hip || '',
              'Shoulder': item.measurements?.shoulder || '',
              'Arm Length': item.measurements?.armLength || '',
              'Neck Size': item.measurements?.neckSize || '',
              'Fees': item.fees || 0,
              'Worker Fees': item.workerFees || 0,
              'Discount': item.discount || 0,
              'Color': item.clothColor || '',
              'Remarks': item.clothRemarks || ''
            })
          })
        }
      })

      // Prepare Financial Summary
      const totalRevenue = jobs
        .filter(j => j.status === 'Delivered')
        .reduce((sum, j) => sum + (j.totalAmount || 0), 0)
      
      const totalAdvance = jobs.reduce((sum, j) => sum + (j.advancePaid || 0), 0)
      const totalBalance = jobs
        .filter(j => j.status !== 'Delivered')
        .reduce((sum, j) => sum + ((j.totalAmount || 0) - (j.advancePaid || 0)), 0)

      const financialData = [
        { 'Metric': 'Total Jobs', 'Value': jobs.length },
        { 'Metric': 'Pending Jobs', 'Value': jobs.filter(j => j.status !== 'Delivered').length },
        { 'Metric': 'Delivered Jobs', 'Value': jobs.filter(j => j.status === 'Delivered').length },
        { 'Metric': 'Total Revenue (Delivered)', 'Value': `₵${totalRevenue.toFixed(2)}` },
        { 'Metric': 'Total Advance Collected', 'Value': `₵${totalAdvance.toFixed(2)}` },
        { 'Metric': 'Total Outstanding Balance', 'Value': `₵${totalBalance.toFixed(2)}` },
        { 'Metric': 'Total Customers', 'Value': customers.length },
        { 'Metric': 'Total Workers', 'Value': workers.length },
        { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() }
      ]

      // Create worksheets
      const jobsSheet = XLSX.utils.json_to_sheet(jobsData)
      const customersSheet = XLSX.utils.json_to_sheet(customersData)
      const workersSheet = XLSX.utils.json_to_sheet(workersData)
      const itemsSheet = XLSX.utils.json_to_sheet(jobItemsData)
      const summarySheet = XLSX.utils.json_to_sheet(financialData)

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
      XLSX.utils.book_append_sheet(workbook, jobsSheet, 'Jobs')
      XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customers')
      XLSX.utils.book_append_sheet(workbook, workersSheet, 'Workers')
      XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Job Items Details')

      // Generate filename with timestamp
      const filename = `BenGift-Export-${new Date().toISOString().split('T')[0]}-${Date.now()}.xlsx`

      // Write the file
      XLSX.writeFile(workbook, filename)

      showToast.success('Excel file exported successfully!')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      showToast.error('Error exporting to Excel. Please try again.')
    }
  }

  const importData = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (window.confirm('This will replace all current data. Continue?')) {
          // Import to API
          try {
            if (data.customers) {
              for (const customer of data.customers) {
                await customersAPI.create(customer)
              }
            }
            if (data.workers) {
              for (const worker of data.workers) {
                await workersAPI.create(worker)
              }
            }
            if (data.jobs) {
              for (const job of data.jobs) {
                await jobsAPI.create(job)
              }
            }
            
            // Reload data from API
            const [jobsRes, customersRes, workersRes] = await Promise.all([
              jobsAPI.getAll(),
              customersAPI.getAll(),
              workersAPI.getAll()
            ])
            
            setJobs(jobsRes.data)
            setCustomers(customersRes.data)
            setWorkers(workersRes.data)
            
            showToast.success('Data imported successfully to database!')
          } catch (error) {
            console.error('Error importing to API:', error)
            showToast.error('Error importing to database. Imported to localStorage only.')
            if (data.jobs) setJobs(data.jobs)
            if (data.customers) setCustomers(data.customers)
            if (data.workers) setWorkers(data.workers)
          }
        }
      } catch (error) {
        showToast.error('Error importing data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = async () => {
    if (window.confirm('This will delete ALL data from the database. This cannot be undone. Are you sure?')) {
      if (window.confirm('Final confirmation: Delete everything?')) {
        try {
          // Delete all jobs
          for (const job of jobs) {
            if (job._id) await jobsAPI.delete(job._id)
          }
          // Delete all customers
          for (const customer of customers) {
            if (customer._id) await customersAPI.delete(customer._id)
          }
          // Delete all workers
          for (const worker of workers) {
            if (worker._id) await workersAPI.delete(worker._id)
          }
          
          setJobs([])
          setCustomers([])
          setWorkers([])
          localStorage.clear()
          showToast.success('All data cleared from database and localStorage')
        } catch (error) {
          console.error('Error clearing data:', error)
          showToast.error('Error clearing database. Cleared localStorage only.')
          setJobs([])
          setCustomers([])
          setWorkers([])
          localStorage.clear()
        }
      }
    }
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Application settings and data management</p>
      </div>

      <div className="settings-section">
        <h2>Help & Documentation</h2>
        
        <div className="setting-item">
          <div>
            <h3>User Guide</h3>
            <p>Learn how to use all features of Tailor Master</p>
          </div>
          <button onClick={() => setShowHelp(true)} className="btn-primary">
            📖 Open Help Guide
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Data Management</h2>
        
        <div className="setting-item">
          <div>
            <h3>Export to Excel</h3>
            <p>Download all data in Excel format with multiple sheets</p>
          </div>
          <button onClick={exportToExcel} className="btn-primary">
            📊 Export to Excel
          </button>
        </div>

        <div className="setting-item">
          <div>
            <h3>Export Data (JSON)</h3>
            <p>Download all your data as a backup file</p>
          </div>
          <button onClick={exportData} className="btn-primary">
            📥 Export Data
          </button>
        </div>

        <div className="setting-item">
          <div>
            <h3>Import Data</h3>
            <p>Restore data from a backup file</p>
          </div>
          <label className="btn-primary">
            📤 Import Data
            <input type="file" accept=".json" onChange={importData} style={{display: 'none'}} />
          </label>
        </div>

        <div className="setting-item danger">
          <div>
            <h3>Clear All Data</h3>
            <p>Delete all jobs, customers, and workers</p>
          </div>
          <button onClick={clearAllData} className="btn-danger">
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Statistics</h2>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total Jobs:</span>
            <span className="stat-value">{jobs.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Customers:</span>
            <span className="stat-value">{customers.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Workers:</span>
            <span className="stat-value">{workers.length}</span>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>📖 Tailor Master - User Guide</h2>
              <button className="help-close-btn" onClick={() => setShowHelp(false)}>✕</button>
            </div>
            
            <div className="help-modal-content">
              <div className="help-section">
                <h3>🏠 Dashboard</h3>
                <p><strong>Purpose:</strong> Overview of your business performance</p>
                <ul>
                  <li><strong>Total Revenue:</strong> Shows total income from all delivered jobs</li>
                  <li><strong>Pending Jobs:</strong> Number of jobs not yet delivered</li>
                  <li><strong>Total Customers:</strong> Number of registered clients</li>
                  <li><strong>Recent Jobs:</strong> List of latest job cards with status</li>
                </ul>
                <p><strong>How to use:</strong> View at a glance to monitor business health and recent activities</p>
              </div>

              <div className="help-section">
                <h3>➕ New Job Card</h3>
                <p><strong>Purpose:</strong> Create new orders for customers</p>
                <ul>
                  <li><strong>Job ID:</strong> Auto-generated unique identifier</li>
                  <li><strong>Client Name:</strong> Type to search existing customers or add new</li>
                  <li><strong>Quick Find:</strong> Search customers by name, address, city, or mobile</li>
                  <li><strong>Pending Orders Status:</strong> View customer's pending orders</li>
                  <li><strong>Delivery Date:</strong> When the order should be ready</li>
                  <li><strong>Trial Date:</strong> Optional fitting appointment date</li>
                  <li><strong>Assign Worker:</strong> Select which worker will handle this job</li>
                  <li><strong>Add Button:</strong> Opens measurement modal to add items</li>
                  <li><strong>Remove/Clear/Copy:</strong> Manage items in the order</li>
                </ul>
                <p><strong>Adding Items:</strong></p>
                <ol>
                  <li>Click "Add" button (requires client name first)</li>
                  <li>Select item from dropdown (garment types or fabrics)</li>
                  <li>Upload reference images if needed</li>
                  <li>Enter measurements (Chest, Waist, Hip, Shoulder, Arm Length, Neck Size)</li>
                  <li>Set quantity, fees, and optional discount</li>
                  <li>Add cloth remarks and client notes</li>
                  <li>Select cloth color from palette</li>
                  <li>Click OK to add item to order</li>
                </ol>
                <p><strong>Saving:</strong> Click Save to create the job. System automatically sends SMS to customer if phone number is available.</p>
              </div>

              <div className="help-section">
                <h3>📋 Job Register</h3>
                <p><strong>Purpose:</strong> View and manage all job cards</p>
                <ul>
                  <li><strong>Filter by Status:</strong> All, Pending, In Progress, Trial, Ready, Delivered</li>
                  <li><strong>Search:</strong> Find jobs by customer name or job ID</li>
                  <li><strong>Job Details:</strong> Click any job to view full details</li>
                  <li><strong>Edit Status:</strong> Update job progress</li>
                  <li><strong>View Items:</strong> See all items in the order with measurements</li>
                  <li><strong>Payment Info:</strong> Total amount, advance paid, balance</li>
                </ul>
                <p><strong>How to use:</strong> Monitor all orders, update status as work progresses, track payments</p>
              </div>

              <div className="help-section">
                <h3>📈 Reports</h3>
                <p><strong>Purpose:</strong> Generate business reports and analytics</p>
                
                <p><strong>Account Book:</strong></p>
                <ul>
                  <li>View all financial transactions</li>
                  <li>Filter by date range and client</li>
                  <li>See debit (charges) and credit (payments)</li>
                  <li>Print or export reports</li>
                </ul>

                <p><strong>Day Book:</strong></p>
                <ul>
                  <li>Daily transaction summary</li>
                  <li>Filter by date range</li>
                  <li>Total vouchers and amounts</li>
                </ul>

                <p><strong>Wages Register:</strong></p>
                <ul>
                  <li>Track worker wages</li>
                  <li>Filter by worker and date</li>
                  <li>View paid/unpaid status</li>
                  <li>Calculate total wages due</li>
                </ul>

                <p><strong>Dues Register:</strong></p>
                <ul>
                  <li>See all outstanding customer balances</li>
                  <li>Total dues summary</li>
                </ul>

                <p><strong>Trial Reminder:</strong></p>
                <ul>
                  <li>View upcoming trial dates</li>
                  <li>Select customers to send SMS reminders</li>
                  <li>Customize SMS template</li>
                </ul>

                <p><strong>Birthday Reminder:</strong></p>
                <ul>
                  <li>Find customers with birthdays</li>
                  <li>Send birthday wishes via SMS</li>
                </ul>

                <p><strong>Ratings:</strong></p>
                <ul>
                  <li>Worker performance rankings</li>
                  <li>Business statistics (revenue, completion rate)</li>
                  <li>Job status breakdown</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>⚙️ Masters</h3>
                <p><strong>Purpose:</strong> Manage core data (clients, workers, items, garments)</p>
                
                <p><strong>Clients:</strong></p>
                <ul>
                  <li>Add/Edit/Delete customer information</li>
                  <li>Fields: Name, Address, City, State, DOB, Mobile, Email</li>
                  <li>Mobile number required for SMS notifications</li>
                </ul>

                <p><strong>Workers:</strong></p>
                <ul>
                  <li>Manage your staff</li>
                  <li>Fields: Name, Address, City, State, Mobile, Skill, Salary</li>
                  <li>Assign workers to jobs</li>
                </ul>

                <p><strong>Items (Fabrics):</strong></p>
                <ul>
                  <li>Define items you offer</li>
                  <li>Set measurement fields (e.g., Height=100, Pocket=Yes)</li>
                  <li>Set fees and worker fees</li>
                  <li>Track production capacity and pending orders</li>
                </ul>

                <p><strong>Garment Types:</strong></p>
                <ul>
                  <li>Add standard garment categories</li>
                  <li>Examples: Shirt, Pant, Suit, Dress, etc.</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>🏪 Shop Info</h3>
                <p><strong>Purpose:</strong> Configure your business details</p>
                <ul>
                  <li><strong>Shop Name:</strong> Your business name</li>
                  <li><strong>Phone:</strong> Contact number (appears on documents)</li>
                  <li><strong>Email:</strong> Business email address</li>
                  <li><strong>Address:</strong> Physical location</li>
                  <li><strong>GST/Tax No:</strong> Registration number</li>
                  <li><strong>Logo:</strong> Upload your business logo</li>
                </ul>
                <p><strong>How to use:</strong> Fill in once, appears on all documents and reports</p>
              </div>

              <div className="help-section">
                <h3>🔧 Settings</h3>
                <p><strong>Purpose:</strong> Application settings and data management</p>
                
                <p><strong>Export Data:</strong></p>
                <ul>
                  <li>Download backup of all data (jobs, customers, workers)</li>
                  <li>Saves as JSON file</li>
                  <li>Recommended: Export regularly for backup</li>
                </ul>

                <p><strong>Import Data:</strong></p>
                <ul>
                  <li>Restore from backup file</li>
                  <li>Replaces all current data</li>
                  <li>Use when moving to new device or recovering data</li>
                </ul>

                <p><strong>Clear All Data:</strong></p>
                <ul>
                  <li>Delete everything (use with caution!)</li>
                  <li>Cannot be undone</li>
                  <li>Export data first before clearing</li>
                </ul>

                <p><strong>Statistics:</strong></p>
                <ul>
                  <li>View total counts of jobs, customers, workers</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>ℹ️ About Tailor Master</h3>
                <p><strong>Purpose:</strong> Information about the application</p>
                <ul>
                  <li>Version information</li>
                  <li>Developer details</li>
                  <li>Support contact</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>📱 SMS Notifications</h3>
                <p><strong>Automatic SMS Features:</strong></p>
                <ul>
                  <li><strong>New Order:</strong> Sent when job is saved (includes Job ID, delivery date, amount)</li>
                  <li><strong>Trial Reminder:</strong> Send from Reports &gt; Trial Reminder</li>
                  <li><strong>Birthday Wishes:</strong> Send from Reports &gt; Birthday Reminder</li>
                </ul>
                <p><strong>Requirements:</strong></p>
                <ul>
                  <li>Customer must have phone number in Masters &gt; Clients</li>
                  <li>SMS provider must be configured (see SMS_SETUP_GUIDE.md)</li>
                  <li>SMS credits must be available</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>💡 Tips & Best Practices</h3>
                <ul>
                  <li><strong>Regular Backups:</strong> Export data weekly to prevent loss</li>
                  <li><strong>Customer Phone Numbers:</strong> Always collect for SMS notifications</li>
                  <li><strong>Worker Assignment:</strong> Assign workers to track performance</li>
                  <li><strong>Trial Dates:</strong> Set trial dates to send automatic reminders</li>
                  <li><strong>Status Updates:</strong> Keep job status current in Job Register</li>
                  <li><strong>Measurements:</strong> Save detailed measurements for repeat orders</li>
                  <li><strong>Reports:</strong> Review weekly to monitor business health</li>
                  <li><strong>Item Master:</strong> Define items with fees for faster order entry</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>🆘 Troubleshooting</h3>
                <p><strong>SMS Not Sending:</strong></p>
                <ul>
                  <li>Check customer has phone number</li>
                  <li>Verify SMS provider is configured</li>
                  <li>Check SMS credits balance</li>
                </ul>

                <p><strong>Data Not Saving:</strong></p>
                <ul>
                  <li>Check browser local storage is enabled</li>
                  <li>Try clearing browser cache</li>
                  <li>Export data before troubleshooting</li>
                </ul>

                <p><strong>Reports Not Showing Data:</strong></p>
                <ul>
                  <li>Check date range filters</li>
                  <li>Ensure jobs have required data</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>📞 Support</h3>
                <p><strong>Need Help?</strong></p>
                <ul>
                  <li>Phone: +233209609002</li>
                  <li>Email: support@bengiftclothing.com</li>
                  <li>Check SMS_SETUP_GUIDE.md for SMS configuration</li>
                </ul>
              </div>
            </div>

            <div className="help-modal-footer">
              <button onClick={() => setShowHelp(false)} className="btn-close-help">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings

