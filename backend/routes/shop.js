import express from 'express'
import Shop from '../models/Shop.js'

const router = express.Router()

// Get shop info
router.get('/', async (req, res) => {
  try {
    let shop = await Shop.findOne()
    
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
    let shop = await Shop.findOne()
    
    if (!shop) {
      shop = new Shop(req.body)
    } else {
      Object.assign(shop, req.body)
    }
    
    const savedShop = await shop.save()
    res.json(savedShop)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
