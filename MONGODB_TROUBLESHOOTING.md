# MongoDB Atlas Connection Troubleshooting

## Current Error: ECONNREFUSED

This means MongoDB Atlas is blocking the connection. Here's how to fix it:

## Fix Steps:

### 1. Allow Network Access (MOST COMMON ISSUE)

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click on your project
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Click "ALLOW ACCESS FROM ANYWHERE"
6. Click "Confirm"
7. Wait 1-2 minutes for changes to apply

**This is usually the problem!**

### 2. Verify Cluster is Active

1. Go to "Database" in left sidebar
2. Make sure your cluster shows "Active" status
3. If it says "Paused", click "Resume"

### 3. Check Username & Password

Your credentials:
- Username: `quamitheo_db_user`
- Password: `iHsBgnaU6rm6qHC6`

Verify these are correct in MongoDB Atlas:
1. Click "Database Access"
2. Check if user exists
3. If password is wrong, click "Edit" to reset

### 4. Test Connection String

Your connection string in `backend/.env`:
```
MONGODB_URI=mongodb+srv://quamitheo_db_user:iHsBgnaU6rm6qHC6@cluster0.felrvux.mongodb.net/bengift_tailor?retryWrites=true&w=majority&appName=Cluster0
```

### 5. Restart Backend

After fixing network access:

```bash
cd "ben-gift clothings/backend"
npm run dev
```

## Alternative: Use Local MongoDB

If Atlas doesn't work, install MongoDB locally:

1. Download: https://www.mongodb.com/try/download/community
2. Install (Complete setup, Run as Service)
3. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/bengift_tailor
   ```
4. Restart backend

## Check if Fixed

When backend starts successfully, you'll see:
```
✅ MongoDB Connected: cluster0.felrvux.mongodb.net
🚀 Server running on port 5000
```

## Still Not Working?

1. Check internet connection
2. Try different network (mobile hotspot)
3. Disable VPN if using one
4. Check Windows Firewall settings
5. Use local MongoDB instead

---

**Most likely fix: Step 1 (Allow Network Access)**
