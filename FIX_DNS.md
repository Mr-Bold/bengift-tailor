# Fix DNS Issue for MongoDB Atlas

## Problem
Your local DNS server (10.104.3.133) can't resolve MongoDB Atlas hostnames.

## Solution 1: Mobile Hotspot (FASTEST - 1 minute)

1. Turn on mobile hotspot on your phone
2. Connect your laptop to the hotspot
3. Run: `node backend/test-atlas-connection.js`
4. Should connect immediately!

---

## Solution 2: Change Windows DNS to Google (5 minutes)

### Step-by-Step:

1. **Open Network Connections**
   - Press `Windows + R`
   - Type: `ncpa.cpl`
   - Press Enter

2. **Find Your WiFi Connection**
   - Look for "WiFi" or your network name
   - Right-click it
   - Click "Properties"

3. **Open IPv4 Settings**
   - Scroll down and find "Internet Protocol Version 4 (TCP/IPv4)"
   - Double-click it

4. **Change DNS Servers**
   - Select "Use the following DNS server addresses"
   - Preferred DNS server: `8.8.8.8`
   - Alternate DNS server: `8.8.4.4`
   - Click "OK"
   - Click "OK" again

5. **Flush DNS Cache**
   - Open Command Prompt (Windows + R, type `cmd`)
   - Run: `ipconfig /flushdns`
   - Close Command Prompt

6. **Test Connection**
   ```bash
   cd "ben-gift clothings/backend"
   node test-atlas-connection.js
   ```

7. **Should see:**
   ```
   ✅ SUCCESS! Connected to MongoDB Atlas!
   ```

---

## Solution 3: Wait (30-60 minutes)

Sometimes DNS just needs time to propagate. Try again later.

---

## After DNS Works:

1. Your backend will automatically connect to Atlas
2. You can deploy your app online
3. Access from anywhere!

---

## Verify DNS is Working:

Run this command:
```bash
nslookup clusterbengift.dhbgshn.mongodb.net 8.8.8.8
```

Should show IP addresses, not errors.
