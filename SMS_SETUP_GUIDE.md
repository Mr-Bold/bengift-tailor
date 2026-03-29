# SMS Setup Guide for BenGift Clothing Tailor Master

## Overview
The system now automatically sends SMS notifications to customers when a new job is saved. This guide will help you configure your SMS provider.

## How It Works

When you click the **Save** button in the New Job Card:
1. The system saves the job to the database
2. It checks if the customer has a phone number
3. If yes, it sends an SMS with job details (Job ID, Delivery Date, Amount, etc.)
4. You get a confirmation message whether the SMS was sent successfully or not

## SMS Message Template

The default message sent to customers:
```
Dear [Customer Name],

Your order has been received at BenGift Clothing.

Job ID: [Job Number]
Delivery Date: [Date]
Total Amount: ₵[Amount]
Advance Paid: ₵[Amount]
Balance: ₵[Amount]

Thank you for your business!

BenGift Clothing
```

## Setup Instructions

### Step 1: Choose an SMS Provider

Popular SMS providers in Ghana:
- **Hubtel** (https://hubtel.com) - Recommended for Ghana
- **Africa's Talking** (https://africastalking.com) - Works across Africa
- **Twilio** (https://twilio.com) - Global provider
- Any other SMS gateway with API access

### Step 2: Get API Credentials

1. Sign up with your chosen SMS provider
2. Get your API credentials:
   - API Key
   - API Secret (if required)
   - Sender ID (your business name that appears on SMS)

### Step 3: Configure the System

Open the file: `src/config/sms.config.js`

Update these settings:

```javascript
export const SMS_CONFIG = {
  provider: 'hubtel', // Change to your provider
  apiKey: 'YOUR_ACTUAL_API_KEY',
  apiSecret: 'YOUR_ACTUAL_API_SECRET',
  senderId: 'BenGift',
  // ... rest of config
}
```

### Step 4: Uncomment Provider Code

In the same file (`sms.config.js`), find the section for your provider and uncomment it:

#### For Hubtel (Ghana):
```javascript
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
```

#### For Africa's Talking:
```javascript
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
```

### Step 5: Add Customer Phone Numbers

For SMS to work, customers must have phone numbers:

1. Go to **Masters** > **Clients**
2. Click on a client or add a new one
3. Fill in the **Mobile** field with the customer's phone number
4. Format: Use international format (e.g., +233201234567 for Ghana)
5. Click **Save**

## Testing

### Test Mode (Current Setup)
The system is currently in test mode. When you save a job:
- It will show a success message
- Check the browser console (F12) to see the SMS details
- No actual SMS is sent yet

### Production Mode
After configuring your SMS provider:
1. Save a test job with a customer who has a phone number
2. Check if the SMS is received
3. Monitor the console for any errors
4. Check your SMS provider dashboard for delivery status

## Troubleshooting

### SMS Not Sending
1. **Check customer phone number**: Make sure it's in the correct format
2. **Check API credentials**: Verify your API key and secret are correct
3. **Check console**: Open browser console (F12) to see error messages
4. **Check SMS balance**: Ensure you have SMS credits with your provider
5. **Check provider status**: Visit your SMS provider's status page

### Phone Number Format
- Ghana: +233XXXXXXXXX (e.g., +233201234567)
- Remove spaces and special characters
- Include country code

### Common Errors
- "Customer phone number not available" - Add phone number in Masters > Clients
- "SMS simulation" - You haven't configured a real SMS provider yet
- "API authentication failed" - Check your API credentials

## SMS Templates

You can customize SMS messages in `src/config/sms.config.js`:

```javascript
templates: {
  newOrder: (data) => `Your custom message here...`,
  trialReminder: (data) => `Trial reminder message...`,
  deliveryReady: (data) => `Delivery ready message...`,
  birthday: (data) => `Birthday message...`
}
```

## Cost Considerations

- SMS costs vary by provider (typically ₵0.03 - ₵0.10 per SMS in Ghana)
- Buy SMS credits in bulk for better rates
- Monitor your SMS usage regularly
- Consider setting up alerts when credits are low

## Security Best Practices

1. **Never commit API keys to version control**
2. Use environment variables for sensitive data
3. Restrict API key permissions to SMS only
4. Monitor API usage for unusual activity
5. Rotate API keys periodically

## Support

For SMS provider specific issues:
- **Hubtel**: support@hubtel.com
- **Africa's Talking**: support@africastalking.com
- **Twilio**: support@twilio.com

For application issues, check the browser console for error messages.

## Future Enhancements

Planned features:
- SMS for trial date reminders
- SMS for delivery ready notifications
- SMS for birthday wishes
- Bulk SMS sending
- SMS delivery reports
- SMS templates management UI
