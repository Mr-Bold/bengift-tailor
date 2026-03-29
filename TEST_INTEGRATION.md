# Testing Backend Integration

## How to Verify Data is Saving to MongoDB

### Test 1: Create a New Customer

1. **In your app**: Go to Masters > Clients
2. Click "Add New"
3. Fill in:
   - Name: "John Doe"
   - Phone: "+233200000001"
   - Email: "john@example.com"
4. Click "Save"
5. You should see alert: "Client added successfully!"

**Check MongoDB:**
- Open MongoDB Compass
- Click refresh button (top right)
- Go to `bengift_tailor` database → `customers` collection
- You should see "John Doe" appear

### Test 2: Create a New Job

1. **In your app**: Go to New Job Card
2. Fill in:
   - Client Name: "John Doe" (or any name)
   - Delivery Date: (pick a future date)
3. Click "Add Item"
4. Select an item, enter measurements
5. Click "OK"
6. Click "Save"

**Check MongoDB:**
- Refresh MongoDB Compass
- Go to `jobs` collection
- You should see the new job appear

### Test 3: Update Job Status

1. **In your app**: Go to JOB Register
2. Find a job in the table
3. Change its status dropdown (e.g., Pending → In Progress)

**Check MongoDB:**
- Refresh MongoDB Compass
- Go to `jobs` collection
- Find that job - status should be updated

### Test 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Create a customer or job
4. Look for:
   - ✅ Success messages
   - ❌ Error messages (if API fails)

If you see errors like "Network Error" or "Failed to fetch", the API isn't being called.

## Troubleshooting

**If data is NOT saving to MongoDB:**

1. **Check backend is running:**
   - Look for terminal with "Server running on port 5000"
   - If not running, start it: `cd backend && npm run dev`

2. **Check browser console for errors:**
   - Press F12
   - Look for red error messages
   - Common: "Network Error" means backend isn't running

3. **Verify API URL:**
   - Check `.env` file in root folder
   - Should have: `VITE_API_URL=http://localhost:5000/api`
   - If you changed it, restart frontend: `npm run dev`

4. **Test API directly:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"status":"ok","message":"BenGift Clothing API is running"}`

## Current Status

Based on the code:
- ✅ NewJobCard saves to API (jobsAPI.create)
- ✅ Masters > Clients saves to API (customersAPI.create)
- ✅ JobRegister status updates save to API (jobsAPI.updateStatus)
- ✅ JobRegister delete saves to API (jobsAPI.delete)
- ✅ Masters > Clients delete saves to API (customersAPI.delete)

If it's not working, check the browser console for errors!
