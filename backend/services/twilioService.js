import twilio from 'twilio'

// Initialize Twilio client
let twilioClient = null

const initializeTwilio = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  
  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken)
    console.log('✅ Twilio SMS service initialized')
    return true
  } else {
    console.log('⚠️  Twilio credentials not configured - SMS will run in simulation mode')
    return false
  }
}

// Send SMS via Twilio
export const sendSMS = async (to, message) => {
  try {
    // Initialize Twilio if not already done
    if (!twilioClient) {
      const initialized = initializeTwilio()
      if (!initialized) {
        // Simulation mode
        console.log('📱 SMS Simulation:', { to, message })
        return {
          success: true,
          simulated: true,
          message: 'SMS sent (simulation mode)',
          to,
          content: message
        }
      }
    }
    
    // Format phone number (ensure it has country code)
    let formattedPhone = to.trim()
    
    // If phone starts with 0, replace with Ghana country code +233
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+233' + formattedPhone.substring(1)
    }
    
    // If no + prefix, add it
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }
    
    // Send SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    })
    
    return {
      success: true,
      simulated: false,
      message: 'SMS sent successfully',
      messageId: result.sid,
      status: result.status,
      to: formattedPhone
    }
  } catch (error) {
    console.error('Twilio SMS Error:', error.message)
    throw new Error(`Failed to send SMS: ${error.message}`)
  }
}

// Send bulk SMS
export const sendBulkSMS = async (recipients, message) => {
  const results = []
  
  for (const phone of recipients) {
    try {
      const result = await sendSMS(phone, message)
      results.push({ 
        phone, 
        success: true, 
        messageId: result.messageId 
      })
    } catch (error) {
      results.push({ 
        phone, 
        success: false, 
        error: error.message 
      })
    }
  }
  
  return {
    success: true,
    message: 'Bulk SMS processing completed',
    total: recipients.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }
}

// Initialize on module load
initializeTwilio()

export default {
  sendSMS,
  sendBulkSMS
}
