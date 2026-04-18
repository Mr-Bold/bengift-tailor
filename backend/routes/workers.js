import express from 'express'
import Worker from '../models/supabase/Worker.js'

const router = express.Router()

// Get all workers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    const workers = await Worker.findAll({ status: status !== 'All' ? status : undefined })
    res.json(workers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' })
    }
    
    res.json(worker)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create worker
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/workers - Received request')
    console.log('📦 Request body:', req.body)
    
    // Convert camelCase to snake_case for PostgreSQL
    const workerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || null,
      address: req.body.address || null,
      city: req.body.city || null,
      state: req.body.state || null,
      pincode: req.body.pincode || null,
      salary: req.body.salary || null,
      joining_date: req.body.joiningDate || req.body.joining_date || null,
      status: req.body.status || 'Active',
      notes: req.body.notes || null
    }
    
    const savedWorker = await Worker.create(workerData)
    console.log('✅ Worker saved successfully:', savedWorker.id)
    res.status(201).json(savedWorker)
  } catch (error) {
    console.error('❌ Error creating worker:', error.message)
    res.status(400).json({ message: error.message })
  }
})

// Update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.update(req.params.id, req.body)
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' })
    }
    
    res.json(worker)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete worker
router.delete('/:id', async (req, res) => {
  try {
    await Worker.delete(req.params.id)
    res.json({ message: 'Worker deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
