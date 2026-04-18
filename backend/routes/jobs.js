import express from 'express'
import Job from '../models/supabase/Job.js'
import Customer from '../models/supabase/Customer.js'
import Worker from '../models/supabase/Worker.js'

const router = express.Router()

// Helper function to convert snake_case to camelCase
const toCamelCase = (job) => {
  if (!job) return null
  return {
    id: job.id,
    jobNo: job.job_no,
    customerName: job.customer_name,
    customerId: job.customer_id,
    orderDate: job.order_date,
    deliveryDate: job.delivery_date,
    trialDate: job.trial_date,
    workerId: job.worker_id,
    items: job.items,
    totalAmount: job.total_amount,
    advancePaid: job.advance_paid,
    balance: job.balance,
    receiptAccount: job.receipt_account,
    status: job.status,
    cancelled: job.cancelled,
    cancelReason: job.cancel_reason,
    notes: job.notes,
    createdAt: job.created_at,
    updatedAt: job.updated_at
  }
}

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { status, workerId, fromDate, toDate, search } = req.query
    
    const filters = {}
    
    if (status && status !== 'All') {
      filters.status = status
    }
    
    if (workerId && workerId !== 'All') {
      filters.workerId = workerId
    }
    
    if (search) {
      filters.search = search
    }
    
    if (fromDate && toDate) {
      filters.startDate = fromDate
      filters.endDate = toDate
    }
    
    const jobs = await Job.findAll(filters)
    const camelCaseJobs = jobs.map(toCamelCase)
    res.json(camelCaseJobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(toCamelCase(job))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new job
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/jobs - Received request')
    
    // Convert MongoDB field names to PostgreSQL (snake_case)
    const jobData = {
      job_no: req.body.jobNo,
      customer_name: req.body.customerName,
      customer_id: req.body.customerId || null,
      order_date: req.body.orderDate || new Date().toISOString(),
      delivery_date: req.body.deliveryDate,
      trial_date: req.body.trialDate || null,
      worker_id: req.body.workerId || null,
      items: req.body.items || [],
      total_amount: req.body.totalAmount,
      advance_paid: req.body.advancePaid || 0,
      balance: req.body.balance,
      receipt_account: req.body.receiptAccount || 'Cash',
      status: req.body.status || 'Pending',
      cancelled: req.body.cancelled || false,
      cancel_reason: req.body.cancelReason || null,
      notes: req.body.notes || null
    }
    
    const savedJob = await Job.create(jobData)
    console.log('✅ Job saved successfully:', savedJob.id)
    
    // Update customer stats
    if (jobData.customer_id) {
      const customer = await Customer.findById(jobData.customer_id)
      if (customer) {
        await Customer.updateStats(
          jobData.customer_id,
          (customer.total_orders || 0) + 1,
          (customer.total_spent || 0) + parseFloat(jobData.total_amount)
        )
      }
    }
    
    res.status(201).json(toCamelCase(savedJob))
  } catch (error) {
    console.error('❌ Error creating job:', error.message)
    res.status(400).json({ message: error.message })
  }
})

// Update job
router.put('/:id', async (req, res) => {
  try {
    // Convert MongoDB field names to PostgreSQL
    const jobData = {}
    if (req.body.jobNo) jobData.job_no = req.body.jobNo
    if (req.body.customerName) jobData.customer_name = req.body.customerName
    if (req.body.customerId !== undefined) jobData.customer_id = req.body.customerId
    if (req.body.orderDate) jobData.order_date = req.body.orderDate
    if (req.body.deliveryDate) jobData.delivery_date = req.body.deliveryDate
    if (req.body.trialDate !== undefined) jobData.trial_date = req.body.trialDate
    if (req.body.workerId !== undefined) jobData.worker_id = req.body.workerId
    if (req.body.items) jobData.items = req.body.items
    if (req.body.totalAmount) jobData.total_amount = req.body.totalAmount
    if (req.body.advancePaid !== undefined) jobData.advance_paid = req.body.advancePaid
    if (req.body.balance !== undefined) jobData.balance = req.body.balance
    if (req.body.receiptAccount) jobData.receipt_account = req.body.receiptAccount
    if (req.body.status) jobData.status = req.body.status
    if (req.body.cancelled !== undefined) jobData.cancelled = req.body.cancelled
    if (req.body.cancelReason !== undefined) jobData.cancel_reason = req.body.cancelReason
    if (req.body.notes !== undefined) jobData.notes = req.body.notes
    
    const job = await Job.update(req.params.id, jobData)
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(toCamelCase(job))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update job status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const job = await Job.update(req.params.id, { status })
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(toCamelCase(job))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    await Job.delete(req.params.id)
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get next job number
router.get('/meta/next-job-number', async (req, res) => {
  try {
    const jobs = await Job.findAll()
    const jobNumbers = jobs.map(j => parseInt(j.job_no)).filter(n => !isNaN(n))
    const maxJobNo = jobNumbers.length > 0 ? Math.max(...jobNumbers) : 0
    const nextJobNo = String(maxJobNo + 1)
    res.json({ nextJobNo })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get dashboard stats
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Job.getStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
