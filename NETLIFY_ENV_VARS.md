# Netlify Environment Variables

Quick reference for setting up environment variables in Netlify.

## 📍 Where to Set

1. Go to your Netlify site dashboard
2. Click **Site settings**
3. Navigate to **Environment variables** (under "Build & deploy")
4. Click **Add a variable**

## 🔑 Required Variables

### Backend API URL

```env
Key: VITE_API_URL
Value: https://your-backend-url.onrender.com/api
```

**Important**: 
- Replace `your-backend-url` with your actual Render backend URL
- Must include `/api` at the end
- Must use `https://` (not `http://`)

## 📝 Example Values

### Development Backend (Render Free Tier)
```
VITE_API_URL=https://bengift-backend.onrender.com/api
```

### Production Backend (Custom Domain)
```
VITE_API_URL=https://api.bengiftclothing.com/api
```

## ✅ Verification

After setting environment variables:

1. **Trigger new deployment**:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

2. **Check build logs**:
   - Look for: "Environment variables loaded"
   - Verify `VITE_API_URL` is set

3. **Test in browser**:
   - Open browser console (F12)
   - Try logging in
   - Check Network tab for API calls
   - Verify calls go to correct backend URL

## 🐛 Troubleshooting

### API calls go to localhost

**Problem**: Frontend still calling `http://localhost:5000/api`

**Solution**:
1. Verify `VITE_API_URL` is set in Netlify
2. Clear cache and redeploy
3. Check build logs for environment variable

### CORS errors

**Problem**: Backend rejects requests from frontend

**Solution**:
1. Update backend `CORS_ORIGIN` to match Netlify URL
2. Redeploy backend on Render
3. Verify both URLs use `https://`

### Build fails

**Problem**: Build fails with environment variable error

**Solution**:
1. Check variable name is exactly `VITE_API_URL` (case-sensitive)
2. Verify value has no trailing spaces
3. Ensure value starts with `https://`

## 🔄 Updating Variables

To change environment variables:

1. Go to Site settings → Environment variables
2. Click on the variable to edit
3. Update the value
4. Save changes
5. **Important**: Trigger new deployment for changes to take effect

## 📋 Complete Setup Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL noted (e.g., `https://bengift-backend.onrender.com`)
- [ ] `VITE_API_URL` set in Netlify with `/api` suffix
- [ ] New deployment triggered
- [ ] Build completed successfully
- [ ] Login tested and working
- [ ] API calls verified in Network tab
- [ ] Backend CORS updated with Netlify URL

## 🎯 Quick Commands

### Get Backend URL from Render
```bash
# Your backend URL will be shown in Render dashboard
# Format: https://[service-name].onrender.com
```

### Test Backend is Running
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Test Frontend API Configuration
```javascript
// Open browser console on your Netlify site
console.log(import.meta.env.VITE_API_URL)
// Should show: https://your-backend-url.onrender.com/api
```

## 📞 Need Help?

If environment variables aren't working:

1. **Check Netlify build logs**: Look for environment variable errors
2. **Check browser console**: Look for API call errors
3. **Check Network tab**: Verify API calls go to correct URL
4. **Verify backend**: Test backend URL directly with curl

---

**Remember**: Environment variables only take effect after a new deployment!
