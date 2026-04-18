# Vercel Environment Variables - Quick Reference

## 🎨 FRONTEND Environment Variables

Add these in Vercel Dashboard → Your Frontend Project → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

**Note**: Update this after deploying the backend!

---

## 🔧 BACKEND Environment Variables

Add these in Vercel Dashboard → Your Backend Project → Settings → Environment Variables:

### Required Variables:

```env
NODE_ENV=production
PORT=5000
```

### Supabase Configuration:
```env
SUPABASE_URL=https://ewnaxjfovtgnalpmqwht.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Get your Supabase keys:**
1. Go to https://supabase.com/dashboard
2. Select project: `ewnaxjfovtgnalpmqwht`
3. Settings → API
4. Copy the "anon/public" key

### JWT Secrets:
```env
JWT_SECRET=generate_a_random_64_character_string
JWT_REFRESH_SECRET=generate_another_random_64_character_string
```

**Generate secrets using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run this command twice to get two different secrets.

### CORS Configuration:
```env
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Note**: Update this with your actual frontend URL after deployment!

### Twilio (Optional - for SMS):
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Get Twilio credentials:**
1. Go to https://www.twilio.com/console
2. Copy Account SID and Auth Token
3. Get a Twilio phone number

---

## 📋 DEPLOYMENT ORDER

### Step 1: Deploy Backend First
1. Import project to Vercel
2. Set Root Directory: `backend`
3. Add all backend environment variables above
4. Deploy
5. **Copy the backend URL** (e.g., `https://bengift-backend.vercel.app`)

### Step 2: Deploy Frontend
1. Import same project to Vercel (as new project)
2. Set Root Directory: `frontend`
3. Add frontend environment variable with backend URL
4. Deploy
5. **Copy the frontend URL** (e.g., `https://bengift-tailor.vercel.app`)

### Step 3: Update CORS
1. Go back to backend project in Vercel
2. Update `CORS_ORIGIN` with the frontend URL
3. Redeploy backend (or it will auto-redeploy)

---

## ✅ VERIFICATION

### Test Backend:
```
https://your-backend-url.vercel.app/api/health
```
Should return: `{"status":"ok","message":"Server is running"}`

### Test Frontend:
```
https://your-frontend-url.vercel.app
```
Should show the login page.

### Test Login:
- Username: `admin`
- Password: `Admin123`

---

## 🔐 SECURITY CHECKLIST

- [ ] JWT secrets are random and at least 64 characters
- [ ] Supabase anon key is correct
- [ ] CORS_ORIGIN matches frontend URL exactly (with https://)
- [ ] No sensitive data in frontend environment variables
- [ ] Twilio credentials are kept secret

---

## 🚨 COMMON MISTAKES

1. **Wrong CORS_ORIGIN format**
   - ❌ Wrong: `bengift-tailor.vercel.app`
   - ❌ Wrong: `https://bengift-tailor.vercel.app/`
   - ✅ Correct: `https://bengift-tailor.vercel.app`

2. **Wrong VITE_API_URL format**
   - ❌ Wrong: `bengift-backend.vercel.app`
   - ❌ Wrong: `https://bengift-backend.vercel.app/`
   - ✅ Correct: `https://bengift-backend.vercel.app`

3. **Forgetting to update after deployment**
   - Deploy backend → Get URL → Update frontend `VITE_API_URL`
   - Deploy frontend → Get URL → Update backend `CORS_ORIGIN`

4. **Using wrong Supabase key**
   - Use the "anon/public" key, NOT the "service_role" key
   - The service_role key should NEVER be exposed to the frontend

---

## 📞 NEED HELP?

If deployment fails:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test Supabase connection from Supabase dashboard
4. Check GitHub repository is up to date

---

**Quick Tip**: Copy this file and fill in your actual values before deploying!
