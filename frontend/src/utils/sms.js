import { smsAPI } from '../services/api'

// SMS Templates
export const SMS_TEMPLATES = {
  ORDER_CONFIRMATION: (customerName, jobNo, deliveryDate) => 
    `Hello ${customerName}, your order #${jobNo} has been confirmed. Expected delivery: ${deliveryDate}. Thank you for choosing BenGift Clothing!`,
  
  ORDER_READY: (customerName, jobNo) => 
    `Hello ${customerName}, your order #${jobNo} is ready for pickup! Please visit us at your convenience. BenGift Clothing.`,
  
  TRIAL_REMINDER: (customerName, trialDate) => 
    `Hello ${customerName}, reminder: Your trial fitting is scheduled for ${trialDate}. See you soon! BenGift Clothing.`,
  
  DELIVERY_REMINDER: (customerName, deliveryDate) => 
    `Hello ${customerName}, your order will be ready on ${deliveryDate}. We look forward to serving you! BenGift Clothing.`,
  
  PAYMENT_REMINDER: (customerName, balance) => 
    `Hello ${customerName}, you have a pending balance of ₵${balance}. Please settle at your convenience. Thank you! BenGift Clothing.`,
  
  CUSTOM: (message) => message
}

// Send SMS notification
export const sendSMSNotification = async (phoneNumber, message) => {
  try {
    const response = await smsAPI.send(phoneNumber, message)
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.simulated 
          ? 'SMS sent (simulation mode)' 
          : 'SMS sent successfully',
        simulated: response.data.simulated
      }
    } else {
      throw new Error(response.data.message || 'Failed to send SMS')
    }
  } catch (error) {
    console.error('SMS Error:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to send SMS'
    }
  }
}

// Send bulk SMS
export const sendBulkSMS = async (phoneNumbers, message) => {
  try {
    const response = await smsAPI.sendBulk(phoneNumbers, message)
    
    if (response.data.success) {
      return {
        success: true,
        message: `Sent ${response.data.successful}/${response.data.total} messages`,
        results: response.data.results
      }
    } else {
      throw new Error(response.data.message || 'Failed to send bulk SMS')
    }
  } catch (error) {
    console.error('Bulk SMS Error:', error)
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to send bulk SMS'
    }
  }
}

// Format phone number for Ghana
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  
  // If starts with 233, it's already formatted
  if (cleaned.startsWith('233')) {
    return '+' + cleaned
  }
  
  // If starts with 0, replace with 233
  if (cleaned.startsWith('0')) {
    return '+233' + cleaned.substring(1)
  }
  
  // If 9 digits, assume it's Ghana number without 0
  if (cleaned.length === 9) {
    return '+233' + cleaned
  }
  
  // Return as is with + prefix
  return '+' + cleaned
}

// Validate phone number
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false
  
  const cleaned = phone.replace(/\D/g, '')
  
  // Ghana numbers are 10 digits (with leading 0) or 9 digits (without)
  // Or 12 digits with country code (233)
  return cleaned.length === 9 || cleaned.length === 10 || 
         (cleaned.length === 12 && cleaned.startsWith('233'))
}

export default {
  SMS_TEMPLATES,
  sendSMSNotification,
  sendBulkSMS,
  formatPhoneNumber,
  isValidPhoneNumber
}
