# Vercel Deployment Guide - BenGift Clothing

## Overview
This guide covers deploying both the frontend (React + Vite) and backend (Node.js + Express) to Vercel.

---

## 🎨 FRONTEND DEPLOYMENT

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository: `Mr-Bold/bengift-tailor`
3. Vercel will detect it as a Vite project

### Step 3: Configure Build Settings
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Environment Variables
Add these in Vercel dashboard (Settings → Environment Variables):

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

**Note**: Replace `your-backend-url` with your actual backend Vercel URL after deploying the backend.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your frontend will be live at: `https://bengift-tailor.vercel.app` (or similar)

---

## 🔧 BACKEND DEPLOYMENT

### Step 1: Import Backend as Separate Project
1. Click "Add New..." → "Project"
2. Select the same repository: `Mr-Bold/bengift-tailor`
3. This time configure it for the backend

### Step 2: Configure Build Settings
```
Framework Preset: Other
Root Directory: backend
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### Step 3: Environment Variables
Add these in Vercel dashboard (Settings → Environment Variables):

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://ewnaxjfovtgnalpmqwht.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
CORS_ORIGIN=https://your-frontend-url.vercel.app
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Important**: 
- Get `SUPABASE_ANON_KEY` from your Supabase dashboard
- Generate strong secrets for JWT keys
- Update `CORS_ORIGIN` with your actual frontend URL after frontend deployment

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your backend will be live at: `https://bengift-backend.vercel.app` (or similar)

### Step 5: Update Frontend Environment Variable
1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your backend URL
4. Redeploy frontend

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deploying:
- [ ] Supabase database is set up and running
- [ ] All tables created (users, customers, jobs, workers, fabrics, etc.)
- [ ] Twilio account configured (optional, for SMS)
- [ ] GitHub repository is up to date

### Backend Deployment:
- [ ] Backend deployed to Vercel
- [ ] All environment variables added
- [ ] Backend URL noted down
- [ ] Test backend API: `https://your-backend.vercel.app/api/health`

### Frontend Deployment:
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` points to backend URL
- [ ] PWA manifest configured
- [ ] Test login functionality
- [ ] Test data loading (jobs, customers, workers)

### Post-Deployment:
- [ ] Create admin user in Supabase (username: admin, password: Admin123)
- [ ] Test login on production
- [ ] Test creating a new job
- [ ] Test PWA install functionality
- [ ] Test on mobile devices

---

## 🔑 GETTING YOUR SUPABASE KEYS

1. Go to https://supabase.com/dashboard
2. Select your project: `ewnaxjfovtgnalpmqwht`
3. Go to Settings → API
4. Copy:
   - **Project URL**: `https://ewnaxjfovtgnalpmqwht.supabase.co`
   - **anon/public key**: This is your `SUPABASE_ANON_KEY`

---

## 🔐 GENERATING JWT SECRETS

Run these commands in your terminal to generate secure secrets:

```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated strings and use them as your JWT secrets.

---

## 🌐 CUSTOM DOMAIN (Optional)

### For Frontend:
1. Go to your frontend project in Vercel
2. Settings → Domains
3. Add your custom domain (e.g., `app.bengiftclothing.com`)
4. Follow DNS configuration instructions

### For Backend:
1. Go to your backend project in Vercel
2. Settings → Domains
3. Add your custom domain (e.g., `api.bengiftclothing.com`)
4. Update `CORS_ORIGIN` in backend environment variables
5. Update `VITE_API_URL` in frontend environment variables

---

## 🐛 TROUBLESHOOTING

### Frontend Issues:

**Build fails with "vite: not found"**
- Solution: Vercel should auto-detect and install devDependencies. If not, contact Vercel support.

**Blank page after deployment**
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Check if backend is responding

**PWA not working**
- Ensure HTTPS is enabled (Vercel provides this by default)
- Check manifest.json is being served
- Clear browser cache and try again

### Backend Issues:

**502 Bad Gateway**
- Check Vercel function logs
- Verify all environment variables are set
- Check Supabase connection

**CORS errors**
- Verify `CORS_ORIGIN` matches your frontend URL exactly
- Include protocol (https://)
- No trailing slash

**Database connection fails**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify network access in Supabase settings

---

## 📊 MONITORING

### Vercel Dashboard:
- View deployment logs
- Monitor function execution
- Check bandwidth usage
- View error logs

### Supabase Dashboard:
- Monitor database queries
- Check API usage
- View authentication logs
- Monitor storage usage

---

## 💰 PRICING

### Vercel Free Tier Includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function execution
- Automatic HTTPS
- Preview deployments

### Supabase Free Tier Includes:
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth

**Note**: Both services have paid plans if you exceed free tier limits.

---

## 🔄 CONTINUOUS DEPLOYMENT

Vercel automatically deploys when you push to GitHub:

1. Push code to GitHub: `git push origin main`
2. Vercel detects the push
3. Automatically builds and deploys
4. New version goes live in 2-3 minutes

**Preview Deployments**: Every pull request gets its own preview URL for testing.

---

## 📱 TESTING PRODUCTION

### Test URLs:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app/api/health`

### Test Checklist:
1. Open frontend URL
2. Login with: username=`admin`, password=`Admin123`
3. Create a test customer
4. Create a test job
5. Test PWA install (Settings → Install App)
6. Test on mobile device
7. Test offline functionality

---

## 📞 SUPPORT

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: https://github.com/Mr-Bold/bengift-tailor/issues

---

## ✅ QUICK START COMMANDS

```bash
# Clone repository
git clone https://github.com/Mr-Bold/bengift-tailor.git
cd bengift-tailor

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Test locally
# Terminal 1 (Backend)
cd backend && npm start

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

**Last Updated**: April 18, 2026
**Repository**: https://github.com/Mr-Bold/bengift-tailor
