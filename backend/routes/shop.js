import express from 'express'
import Shop from '../models/supabase/Shop.js'

const router = express.Router()

// Get shop info
router.get('/', async (req, res) => {
  try {
    let shop = await Shop.get()
    
    // Create default shop if none exists
    if (!shop) {
      shop = await Shop.create({
        name: 'BenGift Clothing',
        phone: '+233209609002',
        email: 'info@bengiftclothing.com',
        address: '',
        currency: '₵'
      })
    }
    
    res.json(shop)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update shop info
router.put('/', async (req, res) => {
  try {
    let shop = await Shop.get()
    
    if (!shop) {
      shop = await Shop.create(req.body)
    } else {
      shop = await Shop.update(shop.id, req.body)
    }
    
    res.json(shop)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
