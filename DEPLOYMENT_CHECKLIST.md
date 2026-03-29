# Deployment Checklist - BenGift Clothing

## Before You Start:

- [ ] MongoDB Atlas cluster created (Europe) ✅
- [ ] GitHub account ready
- [ ] Render account created (https://render.com)

---

## Quick Deployment Steps:

### 1. Push to GitHub (5 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/bengift-tailor.git
git push -u origin main
```

### 2. Deploy Backend (10 min)
- Go to Render → New Web Service
- Connect GitHub repo
- Root Directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Add environment variables:
  - `MONGODB_URI`: Your Atlas connection string
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `JWT_SECRET`: Your secret key

### 3. Deploy Frontend (10 min)
- Render → New Static Site
- Build: `npm install && npm run build`
- Publish: `dist`
- Add environment variable:
  - `VITE_API_URL`: Your backend URL from step 2

### 4. Test Everything
- [ ] Backend health check works
- [ ] Frontend loads
- [ ] Can create jobs
- [ ] MongoDB Atlas connection works
- [ ] All features functional

---

## Your URLs:

**Backend:** https://bengift-backend.onrender.com  
**Frontend:** https://bengift-frontend.onrender.com  
**Database:** MongoDB Atlas Europe

---

## Important:

✅ `.env` file is NOT pushed to GitHub (protected by `.gitignore`)  
✅ MongoDB Atlas will work perfectly on Render (no DNS issues!)  
✅ Everything is FREE tier  

---

**Ready to deploy? Follow the detailed guide in `DEPLOY_TO_RENDER.md`!**
