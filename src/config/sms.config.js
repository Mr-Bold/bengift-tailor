// SMS Configuration
// Update these settings with your SMS provider details

export const SMS_CONFIG = {
  // SMS Provider (options: 'twilio', 'africastalking', 'hubtel', 'custom')
  provider: 'custom',
  
  // API Credentials (replace with your actual credentials)
  apiKey: 'YOUR_API_KEY_HERE',
  apiSecret: 'YOUR_API_SECRET_HERE',
  senderId: 'BenGift', // Your sender ID/name
  
  // API Endpoints
  endpoints: {
    twilio: 'https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json',
    africastalking: 'https://api.africastalking.com/version1/messaging',
    hubtel: 'https://smsc.hubtel.com/v1/messages/send',
    custom: 'YOUR_SMS_API_ENDPOINT'
  },
  
  // SMS Templates
  templates: {
    newOrder: (data) => `Dear ${data.customerName},

Your order has been received at BenGift Clothing.

Job ID: ${data.jobNo}
Delivery Date: ${data.deliveryDate}
Total Amount: ₵${data.totalAmount}
Advance Paid: ₵${data.advancePaid}
Balance: ₵${data.balance}

Thank you for your business!

BenGift Clothing`,

    trialReminder: (data) => `Dear ${data.customerName},

Reminder: Your trial date is ${data.trialDate}.

Job ID: ${data.jobNo}

Please visit our shop for your trial fitting.

BenGift Clothing`,

    deliveryReady: (data) => `Dear ${data.customerName},

Your order is ready for delivery!

Job ID: ${data.jobNo}
Balance: ₵${data.balance}

Please visit us to collect your order.

BenGift Clothing`,

    birthday: (data) => `Dear ${data.customerName},

BenGift Clothing wishes you a very Happy Birthday!

May your day be filled with joy and happiness.

BenGift Clothing`
  }
}

// SMS Sending Function
export const sendSMS = async (phoneNumber, message) => {
  const { provider, apiKey, endpoints, senderId } = SMS_CONFIG
  
  try {
    // Format phone number (remove spaces, add country code if needed)
    const formattedPhone = phoneNumber.replace(/\s/g, '')
    
    // Log for debugging
    console.log('Sending SMS to:', formattedPhone)
    console.log('Message:', message)
    
    // Example implementation for different providers
    // Uncomment and modify based on your provider
    
    /*
    // TWILIO EXAMPLE
    if (provider === 'twilio') {
      const response = await fetch(endpoints.twilio, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${apiKey}:${apiSecret}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: senderId,
          Body: message
        })
      })
      
      if (!response.ok) {
        throw new Error('Twilio SMS failed')
      }
      
      return { success: true, message: 'SMS sent via Twilio' }
    }
    */
    
    /*
    // AFRICA'S TALKING EXAMPLE
    if (provider === 'africastalking') {
      const response = await fetch(endpoints.africastalking, {
        method: 'POST',
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: 'YOUR_USERNAME',
          to: formattedPhone,
          message: message,
          from: senderId
        })
      })
      
      if (!response.ok) {
        throw new Error('Africa\'s Talking SMS failed')
      }
      
      return { success: true, message: 'SMS sent via Africa\'s Talking' }
    }
    */
    
    /*
    // HUBTEL (GHANA) EXAMPLE
    if (provider === 'hubtel') {
      const response = await fetch(endpoints.hubtel, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${apiKey}:${apiSecret}`),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          From: senderId,
          To: formattedPhone,
          Content: message
        })
      })
      
      if (!response.ok) {
        throw new Error('Hubtel SMS failed')
      }
      
      return { success: true, message: 'SMS sent via Hubtel' }
    }
    */
    
    // For now, just simulate success
    // Remove this and uncomment your provider's code above
    console.log('SMS simulation - Message would be sent to:', formattedPhone)
    return { 
      success: true, 
      message: 'SMS simulated (configure SMS provider in src/config/sms.config.js)' 
    }
    
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { 
      success: false, 
      message: `Failed to send SMS: ${error.message}` 
    }
  }
}
