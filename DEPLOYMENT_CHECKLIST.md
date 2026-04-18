# Deployment Checklist ✅

Use this checklist to ensure smooth deployment to production.

## 📋 Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials or secrets
- [ ] .env files not committed (check .gitignore)
- [ ] All dependencies in package.json
- [ ] Build tested locally (`npm run build`)

### Database Setup
- [ ] Supabase project created
- [ ] Database schema applied (COMPLETE_SETUP.sql)
- [ ] Admin user created (username: admin)
- [ ] Supabase URL and keys noted
- [ ] Row Level Security (RLS) configured (optional)

### Documentation
- [ ] README.md updated
- [ ] Environment variables documented
- [ ] API endpoints documented

## 🔧 Backend Deployment (Render)

### Setup
- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_ANON_KEY` set
- [ ] `JWT_SECRET` set (min 32 chars)
- [ ] `JWT_REFRESH_SECRET` set (min 32 chars)
- [ ] `CORS_ORIGIN` set (will update after frontend deploy)
- [ ] `TWILIO_ACCOUNT_SID` set (optional)
- [ ] `TWILIO_AUTH_TOKEN` set (optional)
- [ ] `TWILIO_PHONE_NUMBER` set (optional)

### Verification
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `https://__________.onrender.com`
- [ ] Health check works: `curl https://your-backend.onrender.com/api/health`
- [ ] Logs show no errors
- [ ] Database connection successful

## 🌐 Frontend Deployment (Netlify)

### Setup
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Site created
- [ ] Build settings auto-detected from netlify.toml
- [ ] Base directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` set to backend URL + `/api`
  - Example: `https://bengift-backend.onrender.com/api`

### Verification
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `https://__________.netlify.app`
- [ ] Site loads without errors
- [ ] All routes work (no 404 on refresh)
- [ ] Login page accessible

## 🔗 Integration

### Backend CORS Update
- [ ] Update backend `CORS_ORIGIN` with Netlify URL
- [ ] Redeploy backend on Render
- [ ] Verify CORS allows frontend requests

### Frontend API Connection
- [ ] Login works from frontend
- [ ] API calls successful (check Network tab)
- [ ] No CORS errors in console
- [ ] Data loads correctly

## 🧪 Testing

### Authentication
- [ ] Login works with admin credentials
- [ ] Token refresh works
- [ ] Logout works
- [ ] Protected routes redirect to login

### Core Features
- [ ] Dashboard loads with data
- [ ] Create new job card
- [ ] View job register
- [ ] Create customer
- [ ] Create worker
- [ ] Create fabric
- [ ] Update shop info
- [ ] Export to Excel
- [ ] Generate reports

### Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] PWA install prompt shows
- [ ] App installable on mobile

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No console errors
- [ ] Lighthouse score > 80

## 🔐 Security

### Credentials
- [ ] Default admin password changed
- [ ] Strong JWT secrets used (32+ chars)
- [ ] Supabase keys secured
- [ ] No secrets in frontend code
- [ ] Environment variables not exposed

### Configuration
- [ ] HTTPS enabled (automatic)
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Security headers set (Helmet)
- [ ] Input validation working

## 📊 Monitoring

### Setup Monitoring
- [ ] Render monitoring enabled
- [ ] Netlify analytics enabled
- [ ] Supabase monitoring checked
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring (optional)

### Alerts
- [ ] Email alerts for downtime
- [ ] Database usage alerts
- [ ] Error rate alerts

## 📱 SMS Configuration (Optional)

- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] Credentials added to backend
- [ ] Test SMS sent successfully
- [ ] SMS templates verified

## 🎯 Post-Deployment

### Documentation
- [ ] Deployment URLs documented
- [ ] Admin credentials shared securely
- [ ] User guide updated
- [ ] Support contact updated

### Backup
- [ ] Database backup strategy defined
- [ ] Backup schedule configured
- [ ] Backup restoration tested

### Training
- [ ] Admin user trained
- [ ] User documentation provided
- [ ] Support process defined

## 🚨 Rollback Plan

In case of issues:

1. **Frontend Issues**:
   - [ ] Rollback to previous Netlify deployment
   - [ ] Check deploy logs for errors
   - [ ] Verify environment variables

2. **Backend Issues**:
   - [ ] Rollback to previous Render deployment
   - [ ] Check logs for errors
   - [ ] Verify database connection

3. **Database Issues**:
   - [ ] Restore from backup
   - [ ] Check Supabase status
   - [ ] Verify connection strings

## ✅ Final Verification

- [ ] All features tested in production
- [ ] No errors in browser console
- [ ] No errors in backend logs
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] Users can access the app
- [ ] Data persists correctly
- [ ] Backups working

## 🎉 Go Live!

- [ ] Announce to users
- [ ] Monitor for first 24 hours
- [ ] Collect user feedback
- [ ] Address any issues quickly

---

**Deployment Date**: __________
**Deployed By**: __________
**Frontend URL**: __________
**Backend URL**: __________
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

## 📞 Emergency Contacts

- **Developer**: +233209609002
- **Render Support**: https://render.com/support
- **Netlify Support**: https://www.netlify.com/support
- **Supabase Support**: https://supabase.com/support
