import express from 'express'
import Worker from '../models/Worker.js'

const router = express.Router()

// Get all workers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    let query = {}
    
    if (status && status !== 'All') {
      query.status = status
    }
    
    const workers = await Worker.find(query).sort({ name: 1 })
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
    const worker = new Worker(req.body)
    const savedWorker = await worker.save()
    res.status(201).json(savedWorker)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update worker
router.put('/:id', async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
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
    const worker = await Worker.findByIdAndDelete(req.params.id)
    
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' })
    }
    
    res.json({ message: 'Worker deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
