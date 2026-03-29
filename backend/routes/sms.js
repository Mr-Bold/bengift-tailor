import express from 'express'
import axios from 'axios'

const router = express.Router()

// Send SMS via Hubtel (Ghana)
router.post('/send', async (req, res) => {
  try {
    const { to, message } = req.body
    
    if (!to || !message) {
      return res.status(400).json({ message: 'Phone number and message are required' })
    }
    
    // Check if Hubtel credentials are configured
    if (!process.env.HUBTEL_CLIENT_ID || !process.env.HUBTEL_CLIENT_SECRET) {
      console.log('SMS simulation mode - credentials not configured')
      return res.json({
        success: true,
        simulated: true,
        message: 'SMS sent (simulation mode)',
        to,
        content: message
      })
    }
    
    // Hubtel API call
    const response = await axios.post(
      'https://sms.hubtel.com/v1/messages/send',
      {
        From: process.env.HUBTEL_SENDER_ID || 'BenGift',
        To: to,
        Content: message
      },
      {
        auth: {
          username: process.env.HUBTEL_CLIENT_ID,
          password: process.env.HUBTEL_CLIENT_SECRET
        }
      }
    )
    
    res.json({
      success: true,
      simulated: false,
      message: 'SMS sent successfully',
      data: response.data
    })
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
      return res.status(400).json({ message: 'Recipients array is required' })
    }
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }
    
    const results = []
    
    for (const phone of recipients) {
      try {
        // Send individual SMS
        const result = await axios.post(`${req.protocol}://${req.get('host')}/api/sms/send`, {
          to: phone,
          message
        })
        results.push({ phone, success: true })
      } catch (error) {
        results.push({ phone, success: false, error: error.message })
      }
    }
    
    res.json({
      success: true,
      message: 'Bulk SMS processing completed',
      results
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
