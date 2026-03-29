import express from 'express'
import Job from '../models/Job.js'
import Customer from '../models/Customer.js'

const router = express.Router()

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { status, workerId, fromDate, toDate, dateType, search } = req.query
    
    let query = {}
    
    if (status && status !== 'All') {
      query.status = status
    }
    
    if (workerId && workerId !== 'All') {
      query.workerId = workerId
    }
    
    if (fromDate && toDate) {
      const dateField = dateType === 'deliveryDate' ? 'deliveryDate' : 'orderDate'
      query[dateField] = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      }
    }
    
    if (search) {
      query.$or = [
        { jobNo: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ]
    }
    
    const jobs = await Job.find(query)
      .populate('workerId', 'name')
      .sort({ orderDate: -1 })
    
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('workerId', 'name phone')
      .populate('customerId', 'name phone email')
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new job
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/jobs - Received request')
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
    
    // Clean up empty strings for ObjectId fields
    if (req.body.workerId === '') req.body.workerId = null
    if (req.body.customerId === '') req.body.customerId = null
    
    // If workerId looks like a name (not a valid ObjectId), try to find the worker
    if (req.body.workerId && req.body.workerId.length !== 24) {
      console.log('⚠️  workerId appears to be a name, searching for worker...')
      const Worker = (await import('../models/Worker.js')).default
      const worker = await Worker.findOne({ name: req.body.workerId })
      if (worker) {
        console.log('✅ Found worker by name:', worker._id)
        req.body.workerId = worker._id
      } else {
        console.log('❌ Worker not found, setting to null')
        req.body.workerId = null
      }
    }
    
    const job = new Job(req.body)
    console.log('🔨 Job model created, attempting to save...')
    
    const savedJob = await job.save()
    console.log('✅ Job saved successfully:', savedJob._id)
    
    // Update customer stats
    if (req.body.customerId) {
      await Customer.findByIdAndUpdate(req.body.customerId, {
        $inc: { totalOrders: 1, totalSpent: req.body.totalAmount }
      })
    }
    
    res.status(201).json(savedJob)
  } catch (error) {
    console.error('❌ Error creating job:', error.message)
    console.error('❌ Error details:', error)
    res.status(400).json({ message: error.message })
  }
})

// Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update job status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get next job number
router.get('/meta/next-job-number', async (req, res) => {
  try {
    const lastJob = await Job.findOne().sort({ jobNo: -1 })
    const nextJobNo = lastJob ? String(parseInt(lastJob.jobNo) + 1) : '1'
    res.json({ nextJobNo })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get dashboard stats
router.get('/meta/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments()
    const pendingJobs = await Job.countDocuments({ 
      status: { $in: ['Pending', 'In Progress'] } 
    })
    const readyJobs = await Job.countDocuments({ status: 'Ready' })
    const deliveredJobs = await Job.countDocuments({ status: 'Delivered' })
    
    const revenueResult = await Job.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    
    const pendingAmountResult = await Job.aggregate([
      { $match: { status: { $ne: 'Delivered' } } },
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ])
    
    res.json({
      totalJobs,
      pendingJobs,
      readyJobs,
      deliveredJobs,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingAmount: pendingAmountResult[0]?.total || 0
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
