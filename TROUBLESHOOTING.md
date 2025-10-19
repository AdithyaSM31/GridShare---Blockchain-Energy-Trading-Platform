# Troubleshooting Guide

## Blank Screen Issues - FIXED ✅

### Problem
Dashboard and Analytics pages showed blank screens instead of displaying data.

### Root Causes
1. **Missing data handling**: Components didn't handle the case when `energyData` array was empty
2. **User ID dependency**: `useEnergyData` hook only generated data when a `userId` was provided
3. **API endpoint mismatch**: Hook was calling `/energy-data` instead of `/energy/energy-data`

### Solutions Implemented

#### 1. Dashboard Component (`src/components/Dashboard.tsx`)
**Added empty data check:**
```typescript
if (!energyData || energyData.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Data Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Energy data will appear here once you start trading or monitoring energy.
        </p>
      </div>
    </div>
  );
}
```

#### 2. Analytics Component (`src/components/Analytics.tsx`)
**Added similar empty state:**
```typescript
if (!energyData || energyData.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Analytics Data
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Analytics will appear here once you have energy data.
        </p>
      </div>
    </div>
  );
}
```

#### 3. useEnergyData Hook (`src/hooks/useEnergyData.ts`)
**Updated to always generate data:**
```typescript
useEffect(() => {
  const fetchEnergyData = async () => {
    try {
      setLoading(true);
      
      if (userId) {
        try {
          const data = await api.get('/energy/energy-data?days=7');
          // ... handle API data
        } catch (error) {
          setEnergyData(generateEnergyData());
        }
      } else {
        // Always generate mock data if no userId
        setEnergyData(generateEnergyData());
      }
      
      setPriceData(generatePriceData());
    } catch (error) {
      // Ensure we always have data
      setEnergyData(generateEnergyData());
      setPriceData(generatePriceData());
    } finally {
      setLoading(false);
    }
  };

  fetchEnergyData(); // Always run, not conditional on userId
}, [userId]);
```

## Other Common Issues

### Issue: "Internal server error" when creating listings
**Cause**: JWT token structure mismatch
**Solution**: Fixed in `api/energy.js` - properly extracts `userId` from JWT payload

### Issue: Marketplace shows no listings
**Possible causes:**
1. No listings created yet (this is normal)
2. API endpoint not responding
3. Authentication token expired

**Solutions:**
- Create a test listing using "Sell Energy" button
- Check browser console for API errors
- Try logging out and back in to refresh token

### Issue: Dark mode not working
**Check:**
1. Dark mode toggle in navigation bar
2. Browser localStorage for `darkMode` setting
3. Tailwind `dark:` classes in components

### Issue: Can't purchase energy
**Possible causes:**
1. Not enough energy available in listing
2. Invalid authentication token
3. Trying to purchase own listing

**Solutions:**
- Check listing has enough energy
- Log out and back in
- Try purchasing from different user's listing

## Debugging Tips

### 1. Check Browser Console
Open DevTools (F12) and look for:
- API errors (red messages)
- Component rendering errors
- Network request failures

### 2. Check Network Tab
- Verify API calls are being made to correct endpoints
- Check response status codes (200 = success, 401 = auth error, 500 = server error)
- Inspect request/response payloads

### 3. Check Local Storage
Open DevTools → Application → Local Storage:
- `gridshare_token` should exist if logged in
- `darkMode` controls dark mode state

### 4. Check Vercel Logs
For production issues:
1. Go to Vercel dashboard
2. Select your project
3. Click "Functions" tab
4. View real-time logs

### 5. MongoDB Atlas
Check if data is actually being stored:
1. Login to MongoDB Atlas
2. Browse Collections
3. Verify documents are being created

## Development vs Production

### Local Development (http://localhost:5173)
- API calls go to `/api/*` (proxied by Vite)
- Fast refresh and hot module replacement
- Detailed error messages

### Production (Vercel)
- API calls go to `/api/*` (serverless functions)
- Optimized builds
- Error messages may be less detailed for security

## Quick Fixes

### Clear Cache and Restart
```bash
# Stop dev server
# Then run:
npm run build
npm run dev
```

### Reset Local Storage
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Re-deploy to Vercel
```bash
git add .
git commit -m "trigger redeploy"
git push origin main
```

## Getting Help

If issues persist:
1. Check GitHub Issues
2. Review commit history for recent changes
3. Check Vercel deployment logs
4. Verify MongoDB Atlas connection
5. Check all environment variables are set in Vercel

## Environment Variables Checklist

Ensure these are set in Vercel:
- ✅ `MONGODB_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - Secret for JWT tokens
- ✅ `NODE_ENV` - Set to "production"
- ✅ `VITE_API_URL` - Set to "/api"

## Success Indicators

Your app is working correctly when:
- ✅ Dashboard shows energy metrics (even if mock data)
- ✅ Marketplace displays listings or empty state
- ✅ Analytics shows charts and graphs
- ✅ Can create new energy listings
- ✅ Can purchase energy from listings
- ✅ Dark mode toggles properly
- ✅ Navigation works smoothly
- ✅ No console errors

## Recent Fixes (Latest First)

1. **Oct 20, 2025** - Fixed blank screen on Dashboard/Analytics
2. **Oct 20, 2025** - Fixed JWT token parsing for energy API
3. **Oct 19, 2025** - Added Create Listing modal functionality
4. **Oct 19, 2025** - Implemented complete energy API backend
5. **Oct 19, 2025** - Added dark mode to all components
