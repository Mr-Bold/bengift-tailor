import express from 'express'
import Customer from '../models/Customer.js'

const router = express.Router()

// Get all customers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query
    let query = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    const customers = await Customer.find(query).sort({ name: 1 })
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
    const customer = new Customer(req.body)
    const savedCustomer = await customer.save()
    res.status(201).json(savedCustomer)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
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
    const customer = await Customer.findByIdAndDelete(req.params.id)
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Search customers (advanced)
router.post('/search', async (req, res) => {
  try {
    const { name, address, city, state, phone } = req.body
    let query = {}
    
    if (name) query.name = { $regex: name, $options: 'i' }
    if (address) query.address = { $regex: address, $options: 'i' }
    if (city) query.city = { $regex: city, $options: 'i' }
    if (state) query.state = { $regex: state, $options: 'i' }
    if (phone) query.phone = { $regex: phone, $options: 'i' }
    
    const customers = await Customer.find(query).sort({ name: 1 })
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
