# BenGift Clothing - Complete Installation Guide

## Current Status

✅ Backend code created
✅ Backend dependencies installed (npm packages)
✅ Frontend dependencies installed
✅ Environment files configured
❌ MongoDB not installed yet

## MongoDB Installation Options

### OPTION 1: MongoDB Atlas (Cloud) - RECOMMENDED & EASIEST

**Advantages:**
- No installation needed
- Free forever (512MB)
- Automatic backups
- Access from anywhere
- No maintenance

**Steps:**

1. Go to: https://www.mongodb.com/cloud/atlas/register

2. Create free account

3. Create a FREE cluster:
   - Choose "M0 Sandbox" (FREE)
   - Select region closest to you
   - Click "Create Cluster"

4. Create database user:
   - Click "Database Access"
   - Add new user
   - Username: `bengift_admin`
   - Password: (create strong password)
   - Save password somewhere safe!

5. Allow network access:
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

6. Get connection string:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://bengift_admin:<password>@cluster0.xxxxx.mongodb.net/bengift_tailor`

7. Update backend/.env:
   ```
   MONGODB_URI=mongodb+srv://bengift_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bengift_tailor
   ```
   (Replace YOUR_PASSWORD with your actual password)

8. Done! Skip to "Starting the Application" section below.

---

### OPTION 2: Local MongoDB (Windows)

**Advantages:**
- Works offline
- Full control
- Faster for development

**Steps:**

1. Download MongoDB Community Server:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest (7.0+)
   - Package: MSI
   - Click "Download"

2. Install MongoDB:
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install as Windows Service (check the box)
   - Install MongoDB Compass (optional GUI tool)

3. Verify installation:
   ```bash
   mongod --version
   ```

4. MongoDB will automatically run on: `mongodb://localhost:27017`

5. Your backend/.env is already configured for local MongoDB!

---

## Starting the Application

### 1. Start Backend Server

Open terminal in project folder:

```bash
cd "ben-gift clothings/backend"
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost (or cluster address)
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

**Keep this terminal running!**

### 2. Start Frontend (New Terminal)

Open NEW terminal:

```bash
cd "ben-gift clothings"
npm run dev
```

Frontend will run on: http://localhost:5173

**Keep this terminal running too!**

### 3. Test Connection

Open browser: http://localhost:5000/api/health

Should show:
```json
{
  "status": "ok",
  "message": "BenGift Clothing API is running"
}
```

## Verifying Everything Works

1. Backend running: http://localhost:5000/api/health ✅
2. Frontend running: http://localhost:5173 ✅
3. MongoDB connected (check backend terminal) ✅

## What's Next?

After installation, I'll help you:
1. Connect frontend to backend (update React components)
2. Replace localStorage with API calls
3. Test all features
4. Set up SMS notifications

## Troubleshooting

**"Cannot connect to MongoDB"**
- If using Atlas: Check connection string, password, and network access
- If using local: Make sure MongoDB service is running

**"Port 5000 already in use"**
- Change PORT in backend/.env to 5001
- Update VITE_API_URL in frontend .env to http://localhost:5001/api

**"CORS error"**
- Make sure backend is running
- Check VITE_API_URL in frontend .env

## Quick Commands Reference

```bash
# Install backend dependencies
cd "ben-gift clothings/backend"
npm install

# Start backend (development mode with auto-reload)
npm run dev

# Start backend (production mode)
npm start

# Start frontend
cd "ben-gift clothings"
npm run dev

# Build frontend for production
npm run build
```

---

**Need Help?** Contact: +233209609002
