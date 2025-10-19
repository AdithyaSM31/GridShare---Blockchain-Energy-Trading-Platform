# 🚀 Quick Deployment Checklist

Use this checklist to deploy GridShare to GitHub and Vercel.

## ✅ Pre-Deployment Checklist

- [x] .gitignore file created/updated
- [x] vercel.json configuration created
- [x] .env.example files created
- [x] DEPLOYMENT.md guide created
- [ ] MongoDB Atlas database created
- [ ] Environment variables prepared
- [ ] GitHub repository created

## 📋 Step-by-Step Deployment

### Step 1: MongoDB Atlas (10 minutes)

1. **Create Account & Cluster**
   - Visit https://cloud.mongodb.com
   - Sign up (free)
   - Create a free cluster (M0)
   - Wait 1-3 minutes for deployment

2. **Add Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `gridshare_admin` (or your choice)
   - Generate a secure password (SAVE IT!)
   - Privileges: "Read and write to any database"

3. **Configure Network**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Vercel

4. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://gridshare_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gridshare?retryWrites=true&w=majority`
   - **Save this for Vercel!**

### Step 2: GitHub Repository (5 minutes)

1. **Create Repository on GitHub**
   ```
   Repository Name: gridshare-energy-platform
   Description: Blockchain-based energy trading platform
   Visibility: Public (or Private)
   DO NOT initialize with README
   ```

2. **Push Local Code**
   ```powershell
   # In your project directory
   cd c:\Users\adith\Downloads\GridShare-Blockchain-Energy-Trading-Platform-main
   
   # Initialize git (if needed)
   git init
   
   # Add files
   git add .
   
   # Commit
   git commit -m "Initial commit: Full-stack energy trading platform"
   
   # Add remote (REPLACE with your username/repo)
   git remote add origin https://github.com/YOUR_USERNAME/gridshare-energy-platform.git
   
   # Push
   git branch -M main
   git push -u origin main
   ```

### Step 3: Vercel Deployment (10 minutes)

1. **Import Project**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Import your `gridshare-energy-platform` repository

2. **Configure Build**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   
   Click "Environment Variables" and add these **one by one**:
   
   ```
   Name: VITE_API_URL
   Value: https://YOUR_PROJECT_NAME.vercel.app/api
   (You'll update this after first deployment)
   
   Name: MONGODB_URI
   Value: mongodb+srv://gridshare_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gridshare?retryWrites=true&w=majority
   
   Name: JWT_SECRET
   Value: (Generate a secure random string - use https://randomkeygen.com)
   
   Name: NODE_ENV
   Value: production
   
   Name: PORT
   Value: 5000
   ```
   
   **Apply to**: Production, Preview, Development (check all three)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your deployment URL (e.g., `https://gridshare-energy-platform.vercel.app`)

5. **Update API URL**
   - Go back to Vercel dashboard
   - Settings → Environment Variables
   - Edit `VITE_API_URL`
   - Change to: `https://YOUR_ACTUAL_URL.vercel.app/api`
   - Redeploy (Deployments tab → three dots → Redeploy)

### Step 4: Verify Deployment (5 minutes)

Visit your Vercel URL and test:

- [ ] Homepage loads correctly
- [ ] Register a new user
- [ ] Login with credentials
- [ ] Dark mode toggle works
- [ ] Dashboard displays (may have no data yet)
- [ ] Marketplace loads
- [ ] Check browser console for errors

## 🔧 Troubleshooting

### "Failed to fetch" or API errors
→ Check `VITE_API_URL` matches your actual Vercel URL
→ Ensure it ends with `/api` (no trailing slash)

### MongoDB connection errors
→ Verify connection string password is correct
→ Check MongoDB Atlas network access allows 0.0.0.0/0
→ Ensure database user has read/write permissions

### Build fails on Vercel
→ Check build logs in Vercel dashboard
→ Ensure all dependencies are in package.json
→ Verify no TypeScript errors locally first

### Dark mode not working
→ Check browser console for errors
→ Clear cache and reload
→ Dark mode preference saves per browser/domain

## 📝 Important URLs to Save

```
GitHub Repository: https://github.com/YOUR_USERNAME/gridshare-energy-platform
Vercel Dashboard: https://vercel.com/YOUR_USERNAME/gridshare-energy-platform
Live Application: https://gridshare-energy-platform.vercel.app
MongoDB Atlas: https://cloud.mongodb.com
```

## 🎉 Success!

Once deployed, you can:
- Share your live URL with anyone
- Every git push to `main` auto-deploys
- Monitor usage in Vercel dashboard
- View database in MongoDB Atlas

## 📚 Additional Resources

- Full guide: See `DEPLOYMENT.md`
- Setup instructions: See `SETUP_GUIDE.md`
- Quick start: See `QUICK_START.md`

---

**Need help?** Check the full DEPLOYMENT.md guide for detailed troubleshooting.
