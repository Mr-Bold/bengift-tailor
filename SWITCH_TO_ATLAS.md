# Switch to MongoDB Atlas (Cloud Database) - Complete Guide

## Current Status
- ✅ Backend configured for MongoDB Atlas
- ✅ Migration script ready
- ✅ Connection string updated in .env

## Option 1: Use Your Existing Atlas Cluster

Your existing cluster credentials are already in the `.env` file. However, you mentioned you want Mumbai region. Let's check if your current cluster is in Mumbai:

### Check Your Cluster Region:
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Click on your cluster name
4. Check the region - if it's NOT Mumbai, follow Option 2 below

### If Already in Mumbai Region:
Your `.env` is already configured! Just:
1. Make sure your cluster is active in MongoDB Atlas
2. Verify Network Access allows your IP (or 0.0.0.0/0 for development)
3. Run the migration script (see Step 3 below)

## Option 2: Create New Cluster in Mumbai Region

If your current cluster is NOT in Mumbai, create a new one:

### Step 1: Create Mumbai Cluster
Follow the detailed guide in `MONGODB_ATLAS_SETUP.md`

Key points:
- Choose **Mumbai (ap-south-1)** region
- Use **M0 FREE** tier
- Save your username and password

### Step 2: Update Connection String
After creating the cluster, update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/bengift_tailor?retryWrites=true&w=majority
```

Replace:
- `YOUR_USERNAME` - Your Atlas database username
- `YOUR_PASSWORD` - Your Atlas database password  
- `YOUR_CLUSTER` - Your cluster name (e.g., bengiftcluster.xxxxx)

## Step 3: Migrate Your Data

### A. Check What Data You Have Locally
```bash
cd backend
node view-data.js
```

This shows all your local data (customers, workers, fabrics, jobs).

### B. Run Migration Script
```bash
node migrate-to-atlas.js
```

This will:
- Connect to your local MongoDB
- Fetch all data
- Upload it to MongoDB Atlas
- Show progress for each collection

### C. Verify Migration
After migration, check Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see all your data!

## Step 4: Restart Backend

```bash
npm run dev
```

The backend will now connect to MongoDB Atlas instead of local MongoDB.

## Step 5: Test the Connection

### Test 1: Check Backend Logs
You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

### Test 2: View Data
```bash
node view-data.js
```

Should show the same data as before.

### Test 3: Create a Test Job
1. Open your app: http://localhost:3001
2. Create a new job card
3. Save it
4. Check MongoDB Atlas dashboard - the job should appear!

## Benefits of MongoDB Atlas

### 1. Access from Anywhere
- Work from home, office, or anywhere with internet
- No need to run local MongoDB

### 2. Automatic Backups
- Your data is automatically backed up
- Can restore if something goes wrong

### 3. Better Performance
- Mumbai region = low latency for Indian users
- Professional-grade infrastructure

### 4. Scalability
- Start with free tier (512MB)
- Upgrade as your business grows
- No code changes needed

### 5. Security
- Encrypted connections
- User authentication
- IP whitelisting

### 6. Monitoring
- See database performance
- Track queries
- Get alerts

## Troubleshooting

### Error: "Could not connect to any servers"
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Wait 2-3 minutes for changes to apply

### Error: "Authentication failed"
**Solution:**
1. Check username and password in `.env`
2. Make sure there are no extra spaces
3. If password has special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`

### Error: "Connection timeout"
**Solution:**
1. Check your internet connection
2. Try pinging: `ping cluster0.felrvux.mongodb.net`
3. Check if firewall is blocking MongoDB ports
4. Try using mobile hotspot to test

### Migration Script Fails
**Solution:**
1. Make sure local MongoDB is running
2. Check if you have data locally: `node view-data.js`
3. If no local data, skip migration - just use Atlas directly

## Switching Back to Local (If Needed)

If you need to work offline, edit `backend/.env`:

```env
# Comment out Atlas
# MONGODB_URI=mongodb+srv://...

# Uncomment local
MONGODB_URI=mongodb://localhost:27017/bengift_tailor
```

Then restart the backend.

## Production Deployment

When deploying to production (Vercel, Heroku, etc.):

1. **Never commit `.env` file** - it has your password!
2. Add environment variables in your hosting platform
3. Use strong passwords for production
4. Restrict Network Access to specific IPs (not 0.0.0.0/0)
5. Enable MongoDB Atlas monitoring and alerts

## Cost

- **Free Tier (M0)**: 512MB storage - FREE forever
- Perfect for:
  - Development
  - Small businesses
  - Up to ~10,000 jobs
  - Multiple users

- **Paid Tiers**: Start at $9/month for more storage and features

## Support

If you face issues:
1. Check MongoDB Atlas status: https://status.mongodb.com
2. MongoDB Atlas documentation: https://docs.atlas.mongodb.com
3. Check backend logs for detailed error messages

## Summary

✅ Your backend is now configured for MongoDB Atlas
✅ Migration script is ready to transfer your data
✅ Connection string is set for cloud database
✅ Mumbai region for low latency

**Next Step:** Run the migration script and restart your backend!
