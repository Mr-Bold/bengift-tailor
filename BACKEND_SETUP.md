# BenGift Clothing - Backend Setup Guide

Complete guide to set up and connect the backend to your frontend.

## Architecture Overview

```
Frontend (React + Vite) → Backend (Express API) → Database (MongoDB)
     Port 5173              Port 5000              Port 27017
```

## Step 1: Install MongoDB

### Option A: MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a FREE cluster
5. Click "Connect" → "Connect your application"
6. Copy connection string
7. Replace `<password>` with your password

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bengift_tailor`

### Option B: Local MongoDB (Windows)

1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will run on: `mongodb://localhost:27017`

## Step 2: Install Backend Dependencies

```bash
cd "ben-gift clothings/backend"
npm install
```

This installs:
- express (web framework)
- mongoose (MongoDB driver)
- cors (cross-origin requests)
- dotenv (environment variables)
- axios (HTTP client for SMS)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)

## Step 3: Configure Backend

Create `.env` file in `backend/` folder:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bengift_tailor
JWT_SECRET=change_this_to_random_string_abc123xyz
HUBTEL_CLIENT_ID=your_hubtel_client_id
HUBTEL_CLIENT_SECRET=your_hubtel_client_secret
HUBTEL_SENDER_ID=BenGift
```

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

## Step 5: Configure Frontend

Create `.env` file in root folder:

```
VITE_API_URL=http://localhost:5000/api
```

## Step 6: Test API Connection

Open browser: http://localhost:5000/api/health

Should return:
```json
{
  "status": "ok",
  "message": "BenGift Clothing API is running"
}
```

## Step 7: Migrate Existing Data (Optional)

If you have data in localStorage:

1. Open browser console on your app
2. Run:
```javascript
console.log(JSON.stringify({
  jobs: JSON.parse(localStorage.getItem('tm_jobs') || '[]'),
  customers: JSON.parse(localStorage.getItem('tm_customers') || '[]'),
  workers: JSON.parse(localStorage.getItem('tm_workers') || '[]'),
  fabrics: JSON.parse(localStorage.getItem('tm_fabrics') || '[]'),
  shop: JSON.parse(localStorage.getItem('tm_shop') || '{}')
}))
```
3. Copy the output
4. Paste into `backend/utils/migration.js` (replace `localStorageData`)
5. Run: `node utils/migration.js`

## API Endpoints Reference

### Jobs
- `GET /api/jobs?status=Pending&fromDate=2024-01-01&toDate=2024-12-31`
- `POST /api/jobs` - Body: job object
- `PUT /api/jobs/:id` - Body: updated fields
- `DELETE /api/jobs/:id`

### Customers
- `GET /api/customers?search=john`
- `POST /api/customers/search` - Body: { name, phone, city }

### Workers
- `GET /api/workers?status=Active`

### SMS
- `POST /api/sms/send` - Body: { to: "+233209609002", message: "Hello" }

## Hubtel SMS Setup (Ghana)

1. Go to https://developers.hubtel.com
2. Create account
3. Get API credentials
4. Add to `.env` file
5. Test SMS: `POST /api/sms/send`

## Troubleshooting

**MongoDB Connection Failed:**
- Check if MongoDB is running
- Verify MONGODB_URI in `.env`
- Check firewall settings

**CORS Error:**
- Backend must run on different port than frontend
- CORS is already configured in server.js

**Port Already in Use:**
- Change PORT in `.env` to 5001 or 5002
- Update VITE_API_URL in frontend `.env`

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Both should run simultaneously
4. Frontend will connect to backend automatically

## Production Deployment

**Backend:**
- Deploy to: Railway, Render, Heroku, or DigitalOcean
- Use MongoDB Atlas for database
- Set environment variables on hosting platform

**Frontend:**
- Update VITE_API_URL to production backend URL
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or Cloudflare Pages

---

**Support:** +233209609002
