# Quick Fix - Use Local MongoDB

The MongoDB Atlas connection has a DNS issue (common on some networks/firewalls). 

## Fastest Solution: Install Local MongoDB (10 minutes)

### Step 1: Download MongoDB

Go to: https://www.mongodb.com/try/download/community

- Select: Windows
- Version: 7.0.x (latest)
- Package: msi
- Click Download

### Step 2: Install

1. Run the downloaded .msi file
2. Choose "Complete" installation
3. **IMPORTANT:** Check "Install MongoDB as a Service"
4. **IMPORTANT:** Check "Run service as Network Service user"
5. You can uncheck "Install MongoDB Compass" (optional GUI)
6. Click Install
7. Wait for installation to complete

### Step 3: Update Backend Config

The `.env` file is already configured for local MongoDB!

Just restart the backend and it will work.

### Step 4: Restart Backend

The backend will automatically restart (nodemon is watching).

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

---

## Alternative: Fix Atlas DNS Issue

If you want to keep using Atlas, try:

1. **Flush DNS cache:**
   ```powershell
   ipconfig /flushdns
   ```

2. **Change DNS servers to Google DNS:**
   - Open Network Settings
   - Change adapter options
   - Right-click your network → Properties
   - Select IPv4 → Properties
   - Use these DNS servers:
     - Preferred: 8.8.8.8
     - Alternate: 8.8.4.4
   - Click OK

3. **Restart backend**

---

## Recommendation

Install local MongoDB now to get started. You can always switch back to Atlas later for production deployment.

Local MongoDB advantages:
- Works offline
- Faster for development
- No network issues
- Free and unlimited storage

