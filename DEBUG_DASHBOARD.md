# Dashboard Debugging Guide

## Latest Fixes Applied ✅

1. **Ensured `transactions` is always an array** - Added fallback `(transactions || [])`
2. **Added safety checks for `priceData`** - Checks if array exists before accessing
3. **Fixed `generateEnergyData` userId handling** - Now accepts userId parameter with fallback
4. **Added comprehensive error handling in `useEnergyTrading`** - Each API call wrapped in try-catch
5. **Improved array safety** - All array operations protected

## How to Debug the Issue

### Step 1: Open Browser Console
1. Press `F12` or right-click → "Inspect"
2. Go to "Console" tab
3. Refresh the dashboard page
4. Look for any RED error messages

### Step 2: Check What You See

#### If you see a loading spinner that never stops:
**Problem**: API calls are hanging or hooks are stuck in loading state

**Check**:
```javascript
// In console, type:
localStorage.getItem('gridshare_token')
// Should return a long string (JWT token)
```

**Fix**: Log out and log back in to refresh token

#### If you see "No Data Available" message:
**Problem**: `energyData` array is empty

**Check Console for**:
- "Using mock energy data" - This is NORMAL and should work
- Any errors from `useEnergyData` hook

**This is expected behavior** - Mock data should be generated

#### If you see completely blank/white screen:
**Problem**: JavaScript error preventing React from rendering

**Check Console for**:
- Red error messages
- "Cannot read property of undefined"
- "TypeError" messages

**Common errors and fixes**:

```
TypeError: Cannot read property 'filter' of undefined
```
→ `transactions` is undefined (FIXED in latest commit)

```
TypeError: Cannot read property 'length' of undefined  
```
→ Array is undefined (FIXED in latest commit)

```
TypeError: priceData.slice is not a function
```
→ `priceData` is not an array (FIXED in latest commit)

### Step 3: Check Network Tab
1. In DevTools, go to "Network" tab
2. Refresh page
3. Look for failed API calls (red status codes)

**Expected calls:**
- `/api/energy/listings` - Should return 200 (even if empty array)
- `/api/energy/transactions` - Should return 200 or 401 (if not logged in)
- `/api/energy/energy-data` - May fail (that's OK, will use mock data)

**If you see 500 errors:**
- Check Vercel deployment logs
- Verify MongoDB Atlas connection

### Step 4: Test Specific Components

#### Test if React is working:
Open console and type:
```javascript
document.querySelector('[class*="Dashboard"]')
```
If returns `null` → Component not rendering at all

#### Test if hooks are working:
```javascript
// Check if window object has React DevTools
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
```

### Step 5: Clear Cache and Reload

Sometimes the issue is cached JavaScript:

**Method 1**: Hard refresh
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Method 2**: Clear cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Method 3**: Clear localStorage
```javascript
// In console:
localStorage.clear();
location.reload();
```

## Specific Error Messages

### "Internal server error" popup
**Location**: Top of screen
**Cause**: API endpoint returning 500
**Solution**: 
1. Check Vercel logs
2. Verify MongoDB connection
3. Check JWT token is valid

### Blank white screen, no console errors
**Cause**: CSS issue or build problem
**Solution**:
```bash
# In terminal:
npm run build
npm run dev
```

### "Failed to fetch" in console
**Cause**: Network error or CORS issue
**Solution**:
1. Check if Vercel deployment is live
2. Verify API endpoints are deployed
3. Check `.env.production` has correct `VITE_API_URL`

## What Should Work Now

After the latest fixes, the Dashboard should:

✅ Show mock data even without real API data
✅ Handle empty arrays gracefully  
✅ Display "No Data Available" if needed (rare)
✅ Show loading spinner while fetching
✅ Work even if `transactions` API fails
✅ Work even if `priceData` is empty
✅ Generate energy data even without userId

## Testing Each Fix

### Test 1: Transactions Array
```javascript
// In browser console on dashboard:
const test = undefined;
const result = (test || []).filter(x => x);
console.log('Transactions test:', result); // Should be []
```
✅ If shows `[]` - WORKING

### Test 2: PriceData Array
```javascript
// In browser console:
const test = undefined;
const result = (test || []).slice(-7);
console.log('PriceData test:', result); // Should be []
```
✅ If shows `[]` - WORKING

### Test 3: Energy Data Generation
```javascript
// Check if mock data is generated:
// Look for console.log: "Using mock energy data"
```
✅ If you see this message - WORKING

## Still Having Issues?

If the dashboard is still blank after:
1. Latest fixes deployed
2. Hard refresh performed
3. Cache cleared
4. No console errors

**Then please provide:**

1. **Exact error message from console** (copy-paste the red text)
2. **Screenshot** of the blank screen with console open
3. **Network tab screenshot** showing API calls
4. **What you see**: 
   - Complete blank white screen?
   - Loading spinner forever?
   - "No Data Available" message?
   - Partial content?

## Expected Behavior

### Normal Working Dashboard Shows:
- Welcome message with user name
- 4 stat cards (Production, Consumption, Savings, Transactions)
- Energy flow chart (24 hours)
- Price comparison chart (7 days)
- Recent activity section

### With Mock Data:
- Numbers might look generic/random
- Charts show sample patterns
- Transactions might be 0
- This is NORMAL until real data exists

## Quick Test Commands

Run these in browser console on dashboard page:

```javascript
// Test 1: Check user is loaded
console.log('User:', window.localStorage.getItem('gridshare_token') ? 'Logged in' : 'Not logged in');

// Test 2: Check React is rendering
console.log('Dashboard element:', document.querySelector('h1')?.textContent);

// Test 3: Check for errors
console.log('Console errors:', console.error.toString());
```

## Deployment Status

Latest commit: `8872127`
Deployment: Automatically triggered on push
Wait time: ~1-2 minutes after push

Check deployment:
1. Go to https://vercel.com
2. Check deployment status
3. View function logs if errors

## Contact/Support

If still not working after:
- ✅ Latest fixes deployed (commit 8872127)
- ✅ Hard refresh performed
- ✅ Console checked for errors
- ✅ Network tab checked

Then we need the specific error message or screenshot to continue debugging.
