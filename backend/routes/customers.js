import express from 'express'
import Customer from '../models/supabase/Customer.js'

const router = express.Router()

// Get all customers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    const customers = await Customer.findAll({ search })
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create customer
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/customers - Received request')
    console.log('📦 Request body:', req.body)
    
    // Convert camelCase to snake_case for PostgreSQL
    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || null,
      address: req.body.address || null,
      city: req.body.city || null,
      state: req.body.state || null,
      pincode: req.body.pincode || null,
      birthday: req.body.birthday || null,
      notes: req.body.notes || null,
      total_orders: req.body.totalOrders || req.body.total_orders || 0,
      total_spent: req.body.totalSpent || req.body.total_spent || 0
    }
    
    const savedCustomer = await Customer.create(customerData)
    console.log('✅ Customer saved successfully:', savedCustomer.id)
    res.status(201).json(savedCustomer)
  } catch (error) {
    console.error('❌ Error creating customer:', error.message)
    res.status(400).json({ message: error.message })
  }
})

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.update(req.params.id, req.body)
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.json(customer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    await Customer.delete(req.params.id)
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Search customers (advanced)
router.post('/search', async (req, res) => {
  try {
    const { name, phone } = req.body
    const searchTerm = name || phone || ''
    const customers = await Customer.findAll({ search: searchTerm })
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
