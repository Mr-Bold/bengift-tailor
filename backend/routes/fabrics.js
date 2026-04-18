import express from 'express'
import Fabric from '../models/supabase/Fabric.js'

const router = express.Router()

// Get all fabrics
router.get('/', async (req, res) => {
  try {
    const fabrics = await Fabric.findAll()
    res.json(fabrics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single fabric
router.get('/:id', async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id)
    
    if (!fabric) {
      return res.status(404).json({ message: 'Fabric not found' })
    }
    
    res.json(fabric)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create fabric
router.post('/', async (req, res) => {
  try {
    const savedFabric = await Fabric.create(req.body)
    res.status(201).json(savedFabric)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update fabric
router.put('/:id', async (req, res) => {
  try {
    const fabric = await Fabric.update(req.params.id, req.body)
    
    if (!fabric) {
      return res.status(404).json({ message: 'Fabric not found' })
    }
    
    res.json(fabric)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete fabric
router.delete('/:id', async (req, res) => {
  try {
    await Fabric.delete(req.params.id)
    res.json({ message: 'Fabric deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
