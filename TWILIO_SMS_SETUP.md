# Twilio SMS Setup Guide

Complete guide to set up Twilio SMS for BenGift Clothing application.

## Why Twilio?

- **Global Coverage**: Works worldwide, including Ghana
- **Reliable**: 99.95% uptime SLA
- **Affordable**: Pay-as-you-go pricing
- **Easy Integration**: Simple API
- **Free Trial**: $15 credit to test

## Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number
4. You'll receive $15 free credit

## Step 2: Get Your Credentials

### Account SID and Auth Token

1. Go to [Twilio Console](https://console.twilio.com/)
2. On the dashboard, you'll see:
   - **Account SID**: Starts with "AC..."
   - **Auth Token**: Click "Show" to reveal it
3. Copy both values

### Get a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Select your country (or use a US number for testing)
3. Choose a number with SMS capability
4. Click "Buy" (uses your free credit)

**Note**: For Ghana, you can use a US number to send SMS to Ghanaian numbers.

## Step 3: Configure Backend

### Update .env File

Edit `backend/.env`:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Important**: 
- Replace with your actual credentials
- Phone number must include country code (e.g., +1 for US)
- Keep Auth Token secret - never commit to Git

### Verify Installation

The Twilio package is already installed. If you need to reinstall:

```bash
cd backend
npm install twilio
```

## Step 4: Test SMS Functionality

### Test with Simulation Mode (No Credentials)

If you don't add Twilio credentials, the app runs in simulation mode:
- SMS functions work but don't actually send
- Useful for development without spending credits

### Test with Real SMS

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Test the API endpoint:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/sms/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "to": "+233201234567",
    "message": "Test message from BenGift Clothing"
  }'
```

**Using Postman:**
- Method: POST
- URL: `http://localhost:5000/api/sms/send`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- Body (JSON):
```json
{
  "to": "+233201234567",
  "message": "Test message from BenGift Clothing"
}
```

## Step 5: Verify Phone Numbers (Trial Account)

With a trial account, you can only send SMS to verified numbers:

1. Go to **Phone Numbers** → **Manage** → **Verified Caller IDs**
2. Click "Add a new number"
3. Enter the phone number you want to test with
4. Verify via SMS or call

**Note**: Upgrade to a paid account to send to any number.

## Step 6: Using SMS in the Application

### Send Order Confirmation

```javascript
import { sendSMSNotification, SMS_TEMPLATES } from '../utils/sms'

// In your component
const sendOrderConfirmation = async (customer, jobNo, deliveryDate) => {
  const message = SMS_TEMPLATES.ORDER_CONFIRMATION(
    customer.name,
    jobNo,
    deliveryDate
  )
  
  const result = await sendSMSNotification(customer.phone, message)
  
  if (result.success) {
    console.log('SMS sent successfully')
  } else {
    console.error('Failed to send SMS:', result.message)
  }
}
```

### Available SMS Templates

- `ORDER_CONFIRMATION` - When order is created
- `ORDER_READY` - When order is ready for pickup
- `TRIAL_REMINDER` - Reminder for trial fitting
- `DELIVERY_REMINDER` - Reminder for delivery date
- `PAYMENT_REMINDER` - Reminder for pending payment
- `CUSTOM` - Custom message

## Pricing

### Trial Account
- $15 free credit
- Can send ~500 SMS (depending on destination)
- Must verify recipient numbers

### Paid Account
- Pay-as-you-go
- SMS to Ghana: ~$0.04 per message
- No monthly fees
- Volume discounts available

### Cost Estimation

For 100 customers:
- 1 SMS per order: ~$4/month
- 3 SMS per order (confirmation, reminder, ready): ~$12/month

## Best Practices

### 1. Message Length
- Keep messages under 160 characters
- Longer messages cost more (split into multiple)

### 2. Timing
- Send between 9 AM - 8 PM local time
- Avoid weekends for business messages

### 3. Content
- Include business name
- Keep it professional and concise
- Add opt-out option for marketing

### 4. Rate Limiting
- Don't send too many messages at once
- Implement delays for bulk SMS

### 5. Error Handling
- Always check response status
- Log failed messages
- Retry failed sends

## Troubleshooting

### Error: "The number is unverified"
- **Solution**: Verify the number in Twilio Console or upgrade account

### Error: "Invalid phone number"
- **Solution**: Ensure number has country code (+233 for Ghana)

### Error: "Insufficient funds"
- **Solution**: Add credit to your Twilio account

### SMS not received
- Check phone number format
- Verify number is not blocked
- Check Twilio logs in Console

### Simulation mode active
- **Solution**: Add Twilio credentials to .env file

## Security

### Protect Your Credentials
- Never commit .env file to Git
- Use environment variables in production
- Rotate Auth Token periodically

### .gitignore Entry
```
# Environment variables
.env
.env.local
.env.production
```

## Production Deployment

### Environment Variables

Set these in your hosting platform (Render, Heroku, etc.):

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Upgrade Account

1. Go to Twilio Console
2. Click "Upgrade" button
3. Add payment method
4. Remove trial restrictions

## Monitoring

### Check SMS Logs

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor** → **Logs** → **Messages**
3. View all sent messages, status, and errors

### Set Up Alerts

1. Go to **Monitor** → **Alerts**
2. Set up alerts for:
   - Failed messages
   - Low balance
   - High usage

## Alternative: Hubtel (Ghana-specific)

If you prefer a Ghana-based provider:

1. Sign up at [https://hubtel.com](https://hubtel.com)
2. Get API credentials
3. Update backend to use Hubtel API

Hubtel advantages:
- Local support
- Better rates for Ghana
- Sender ID customization

## Support

### Twilio Support
- Documentation: [https://www.twilio.com/docs/sms](https://www.twilio.com/docs/sms)
- Support: [https://support.twilio.com](https://support.twilio.com)

### BenGift Support
- Phone: +233209609002
- Email: info@bengiftclothing.com

---

**SMS integration complete! 📱**
