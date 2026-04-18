import express from 'express'
import { sendSMS, sendBulkSMS } from '../services/twilioService.js'

const router = express.Router()

// Send single SMS
router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number and message are required' 
      })
    }
    
    const result = await sendSMS(to, message)
    
    res.json(result)
  } catch (error) {
    console.error('SMS Error:', error.message)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Send bulk SMS
router.post('/send-bulk', async (req, res) => {
  try {
    const { recipients, message } = req.body
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Recipients array is required' 
      })
    }
    
    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: 'Message is required' 
      })
    }
    
    const result = await sendBulkSMS(recipients, message)
    
    res.json(result)
  } catch (error) {
    console.error('Bulk SMS Error:', error.message)
    res.status(500).json({ 
      success: false,
      message: error.message 
    })
  }
})

export default router
