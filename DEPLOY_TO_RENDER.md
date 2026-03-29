# Deploy BenGift Clothing to Render - Complete Guide

## What You'll Deploy:

- **Backend:** Node.js API on Render (FREE tier)
- **Frontend:** React app on Render Static Site (FREE tier)
- **Database:** MongoDB Atlas Europe (already set up!)

**Total Cost:** $0/month (FREE) 🎉

---

## Prerequisites:

1. ✅ GitHub account
2. ✅ Render account (sign up at https://render.com)
3. ✅ MongoDB Atlas cluster (already created!)
4. ✅ Your code pushed to GitHub

---

## STEP 1: Push Code to GitHub (5 minutes)

### 1A. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `bengift-tailor`
3. Description: "BenGift Clothing - Tailor Shop Management System"
4. Choose **Private** (recommended) or Public
5. **DO NOT** initialize with README (you already have one)
6. Click "Create repository"

### 1B. Push Your Code

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - BenGift Clothing Tailor Shop"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bengift-tailor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**IMPORTANT:** Make sure `.env` is in `.gitignore` (it already is) so your passwords don't get uploaded!

---

## STEP 2: Deploy Backend to Render (10 minutes)

### 2A. Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if first time)
4. Find and select your `bengift-tailor` repository
5. Click **"Connect"**

### 2B. Configure Backend Service

Fill in these settings:

**Basic Settings:**
- **Name:** `bengift-backend` (or any name)
- **Region:** Choose closest to Europe (e.g., Frankfurt)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

**Instance Type:**
- Select **"Free"** ($0/month)

### 2C. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://bengift_admin1:sJtltpkfHjCQ12eJ@bengiftclothing.wb9jxds.mongodb.net/bengift_tailor?retryWrites=true&w=majority&appName=BenGiftclothing` |
| `JWT_SECRET` | `bengift_secret_key_2026_change_in_production` |

**Optional (for SMS):**
| Key | Value |
|-----|-------|
| `HUBTEL_CLIENT_ID` | (your Hubtel ID if you have one) |
| `HUBTEL_CLIENT_SECRET` | (your Hubtel secret) |
| `HUBTEL_SENDER_ID` | `BenGift` |

### 2D. Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll see build logs
4. When done, you'll get a URL like: `https://bengift-backend.onrender.com`

### 2E. Test Backend

Open your backend URL in browser:
```
https://bengift-backend.onrender.com/api/health
```

Should see: `{"status":"ok","message":"Server is running"}`

**Save this URL!** You'll need it for the frontend.

---

## STEP 3: Deploy Frontend to Render (10 minutes)

### 3A. Update Frontend API URL

Before deploying frontend, update the API URL to point to your deployed backend.

Edit `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://bengift-backend.onrender.com/api'
```

Commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 3B. Create Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your `bengift-tailor` repository
4. Click **"Connect"**

### 3C. Configure Frontend

**Basic Settings:**
- **Name:** `bengift-frontend` (or any name)
- **Branch:** `main`
- **Root Directory:** (leave empty - root of repo)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Environment Variables:**

Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://bengift-backend.onrender.com/api` |

(Replace with YOUR actual backend URL from Step 2)

### 3D. Deploy!

1. Click **"Create Static Site"**
2. Wait 3-5 minutes
3. You'll get a URL like: `https://bengift-frontend.onrender.com`

### 3E. Test Frontend

1. Open your frontend URL
2. You should see your tailor shop app!
3. Try creating a job - it should save to MongoDB Atlas!

---

## STEP 4: Configure CORS (Important!)

Your backend needs to allow requests from your frontend domain.

### 4A. Update Backend CORS

Edit `backend/server.js` and update CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://bengift-frontend.onrender.com', // Add your frontend URL
    'https://your-custom-domain.com' // If you add custom domain later
  ],
  credentials: true
}))
```

### 4B. Commit and Push

```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy your backend!

---

## STEP 5: Verify Everything Works

### Test Checklist:

✅ Backend health check works  
✅ Frontend loads  
✅ Can create new job  
✅ Can view jobs  
✅ Can add customers  
✅ Can add workers  
✅ Dashboard shows data  
✅ Charts display  
✅ PDF generation works  

---

## STEP 6: Custom Domain (Optional)

### Add Your Own Domain:

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Render Dashboard → Your service → Settings
3. Click "Custom Domain"
4. Add your domain
5. Update DNS records as instructed
6. Wait for SSL certificate (automatic)

---

## Important Notes:

### Free Tier Limitations:

**Render Free Tier:**
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month (enough for one service 24/7)

**Solution for slow first load:**
- Upgrade to paid tier ($7/month) for always-on
- Or use a service like UptimeRobot to ping your backend every 14 minutes

**MongoDB Atlas Free Tier:**
- 512MB storage
- Unlimited bandwidth
- Perfect for your needs!

### Security:

✅ Never commit `.env` file  
✅ Use strong passwords in production  
✅ Enable MongoDB Atlas IP whitelist (or use 0.0.0.0/0 for Render)  
✅ Change JWT_SECRET to something more secure  

---

## Troubleshooting:

### Backend won't start:
- Check environment variables are set correctly
- Check build logs for errors
- Verify MongoDB Atlas network access allows Render IPs

### Frontend can't connect to backend:
- Check CORS configuration
- Verify VITE_API_URL is correct
- Check browser console for errors

### MongoDB connection fails:
- Verify connection string is correct
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Confirm username/password are correct

---

## Monitoring:

### Render Dashboard:
- View logs in real-time
- Monitor CPU/memory usage
- See deployment history

### MongoDB Atlas:
- View database metrics
- Monitor queries
- Check storage usage

---

## Costs:

**Current Setup (FREE):**
- Render Backend: $0/month
- Render Frontend: $0/month
- MongoDB Atlas: $0/month
- **Total: $0/month** 🎉

**If You Upgrade:**
- Render Backend (always-on): $7/month
- Render Frontend: Still FREE
- MongoDB Atlas M10: $9/month (when you need more storage)
- **Total: $7-16/month**

---

## Next Steps After Deployment:

1. ✅ Test all features thoroughly
2. ✅ Add your shop logo and branding
3. ✅ Set up custom domain
4. ✅ Configure SMS notifications (Hubtel)
5. ✅ Train your staff
6. ✅ Start using it!

---

## Support:

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Your app is ready for production! 🚀

---

**Congratulations! Your tailor shop is now online!** 🎉
