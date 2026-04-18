# Deployment Guide - BenGift Clothing

Complete guide for deploying the BenGift Clothing application to production.

## 📋 Overview

The application consists of two parts:
1. **Frontend** (React + Vite) → Deploy to Netlify
2. **Backend** (Node.js + Express) → Deploy to Render (or similar)

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

The backend is already configured for production. Ensure these files exist:
- `backend/server.js` - Main server file
- `backend/package.json` - Dependencies
- `backend/.env.example` - Environment template

### Step 2: Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `ben-gift clothings`

3. **Configure Service**
   ```
   Name: bengift-backend
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   
   In Render dashboard, add these environment variables:
   
   ```env
   NODE_ENV=production
   PORT=5000
   
   # Supabase Configuration
   SUPABASE_URL=https://ewnaxjfovtgnalpmqwht.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_min_32_chars
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # CORS Configuration
   CORS_ORIGIN=https://your-netlify-site.netlify.app
   
   # Twilio Configuration (Optional - for SMS)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://bengift-backend.onrender.com`

### Step 3: Test Backend

Test the backend is working:
```bash
curl https://bengift-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-14T..."
}
```

## 🌐 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

The frontend is already configured with `netlify.toml` in the repository root.

### Step 2: Deploy to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up or log in

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select the repository: `ben-gift clothings`

3. **Configure Build Settings**
   
   Netlify will automatically detect the `netlify.toml` file. Verify:
   ```
   Base directory: frontend
   Build command: npm install && npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**
   
   In Netlify dashboard, go to Site settings → Environment variables:
   
   ```env
   # Backend API URL (use your Render backend URL)
   VITE_API_URL=https://bengift-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at: `https://random-name-123.netlify.app`

6. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain: `bengiftclothing.com`
   - Follow DNS configuration instructions

### Step 3: Test Frontend

1. Visit your Netlify URL
2. Try logging in with: `admin` / `Admin123`
3. Test navigation (all routes should work)
4. Test API calls (create a job, customer, etc.)

## 🔧 Post-Deployment Configuration

### Update Backend CORS

After deploying frontend, update backend CORS_ORIGIN:

1. Go to Render dashboard
2. Select your backend service
3. Update environment variable:
   ```
   CORS_ORIGIN=https://your-actual-netlify-site.netlify.app
   ```
4. Save and redeploy

### Update Frontend API URL (if needed)

If you change backend URL:

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Update `VITE_API_URL`
4. Trigger new deployment

## 🔐 Security Checklist

Before going live:

- [ ] Change default admin password in production
- [ ] Set strong JWT secrets (min 32 characters)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Enable HTTPS (automatic on Netlify and Render)
- [ ] Set up Supabase Row Level Security (RLS)
- [ ] Review rate limiting settings
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

## 📊 Monitoring

### Backend Monitoring (Render)

1. **Logs**: Render dashboard → Logs tab
2. **Metrics**: Monitor CPU, memory, response times
3. **Alerts**: Set up email alerts for downtime

### Frontend Monitoring (Netlify)

1. **Analytics**: Netlify dashboard → Analytics
2. **Deploy logs**: Check build logs for errors
3. **Function logs**: If using Netlify Functions

### Database Monitoring (Supabase)

1. **Dashboard**: https://supabase.com/dashboard
2. **Database health**: Monitor connections, queries
3. **Storage**: Check database size and limits

## 🐛 Troubleshooting

### Frontend Shows "Page Not Found"

**Cause**: SPA routing not configured
**Fix**: Ensure `netlify.toml` has redirect rule:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Calls Fail (CORS Error)

**Cause**: Backend CORS not configured for frontend domain
**Fix**: Update backend `CORS_ORIGIN` environment variable

### Login Fails

**Cause**: Backend not connected to database
**Fix**: 
1. Check Supabase credentials in backend env vars
2. Verify database is accessible
3. Check backend logs for errors

### Build Fails on Netlify

**Cause**: Missing dependencies or build errors
**Fix**:
1. Check build logs in Netlify dashboard
2. Verify `package.json` has all dependencies
3. Test build locally: `cd frontend && npm run build`

### Backend Crashes on Render

**Cause**: Missing environment variables or database connection
**Fix**:
1. Check Render logs
2. Verify all environment variables are set
3. Test Supabase connection

## 💰 Cost Estimation

### Free Tier (Development/Testing)

- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Render**: 750 hours/month (1 free service)
- **Supabase**: 500MB database, 1GB file storage
- **Total**: $0/month

### Paid Tier (Production)

- **Netlify Pro**: $19/month (more bandwidth, better support)
- **Render Starter**: $7/month (always-on, no cold starts)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Twilio**: ~$0.04/SMS (pay as you go)
- **Total**: ~$51/month + SMS costs

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployments:

1. **Push to GitHub**: Commit and push changes
2. **Auto Deploy**: Services automatically detect changes
3. **Build & Deploy**: New version goes live automatically

### Branch Deployments

- **Production**: Deploy from `main` branch
- **Staging**: Deploy from `develop` branch (create separate services)
- **Preview**: Netlify creates preview for each PR

## 📱 PWA Deployment

The app is already configured as a PWA:

1. **Service Worker**: Automatically generated by Vite PWA plugin
2. **Manifest**: Configured in `vite.config.js`
3. **Icons**: Located in `frontend/images/`
4. **Install Prompt**: Shows on first visit

Users can install the app on mobile devices!

## 🎯 Next Steps After Deployment

1. **Test thoroughly**: Test all features in production
2. **Monitor**: Set up monitoring and alerts
3. **Backup**: Configure automated database backups
4. **SSL**: Verify HTTPS is working (automatic)
5. **Performance**: Run Lighthouse audit
6. **SEO**: Add meta tags and sitemap
7. **Analytics**: Set up Google Analytics or similar

## 📞 Support

If you encounter issues:

1. Check logs (Netlify, Render, Supabase)
2. Review this guide
3. Check backend/frontend README files
4. Contact support: +233209609002

---

**Deployment Guide Version**: 1.0
**Last Updated**: April 14, 2026
**Status**: ✅ Ready for Production
