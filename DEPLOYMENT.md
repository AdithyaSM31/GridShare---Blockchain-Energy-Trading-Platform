# Deployment Guide - GridShare Platform

This guide will walk you through deploying the GridShare Energy Trading Platform to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (sign up at https://cloud.mongodb.com)

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Database

1. Go to https://cloud.mongodb.com and sign in
2. Click "Create" to create a new cluster (Free tier is sufficient)
3. Choose your cloud provider and region
4. Click "Create Cluster" (takes 1-3 minutes)

### 2. Configure Database Access

1. In MongoDB Atlas, go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Create a username and secure password (save these!)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Vercel deployment)
4. Click "Confirm"

### 4. Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gridshare?retryWrites=true&w=majority`

## Part 2: GitHub Repository Setup

### 1. Initialize Git Repository

```powershell
# Navigate to your project directory
cd c:\Users\adith\Downloads\GridShare-Blockchain-Energy-Trading-Platform-main

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Full-stack energy trading platform with dark mode"
```

### 2. Create GitHub Repository

1. Go to https://github.com
2. Click "+" in top right → "New repository"
3. Name: `gridshare-energy-platform` (or your choice)
4. Description: "Blockchain-based energy trading platform with React, Node.js, and MongoDB"
5. Keep it Public or Private (your choice)
6. **DO NOT** initialize with README (you already have one)
7. Click "Create repository"

### 3. Push to GitHub

```powershell
# Add your GitHub repository as remote (replace with your username/repo)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Part 3: Vercel Deployment

### 1. Import Project to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will detect it as a Vite project

### 2. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Configure Environment Variables

Click "Environment Variables" and add these variables:

#### Frontend Variables:
```
VITE_API_URL = https://your-project-name.vercel.app/api
```
(Replace `your-project-name` with your actual Vercel project name)

#### Backend Variables:
```
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gridshare?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-random-string-min-32-chars
NODE_ENV = production
PORT = 5000
```

**Important**: 
- Use your actual MongoDB Atlas connection string for `MONGODB_URI`
- Generate a strong random string for `JWT_SECRET` (use a password generator)
- Add all variables to **Production**, **Preview**, and **Development** environments

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://your-project-name.vercel.app`

### 5. Verify Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Test login functionality
4. Check if dark mode toggle works
5. Test energy trading features

## Part 4: Post-Deployment Updates

### Update Frontend API URL

After deployment, you need to create a `.env.production` file:

```env
VITE_API_URL=https://your-actual-vercel-url.vercel.app/api
```

Then commit and push:
```powershell
git add .env.production
git commit -m "Add production API URL"
git push
```

Vercel will automatically redeploy.

## Troubleshooting

### Issue: API calls failing
- **Solution**: Check that `VITE_API_URL` in Vercel matches your actual deployment URL
- Verify MongoDB connection string is correct
- Check Vercel function logs in dashboard

### Issue: Database connection errors
- **Solution**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database username/password are correct
- Ensure connection string has correct database name

### Issue: Dark mode not persisting
- **Solution**: This is expected - localStorage works per domain. Dark mode preference is saved per user's browser

### Issue: Build fails
- **Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_URL=https://your-vercel-url.vercel.app/api
```

### Backend (Vercel Environment Variables)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gridshare
JWT_SECRET=your-secure-random-string
NODE_ENV=production
PORT=5000
```

## Continuous Deployment

Once set up, every push to your `main` branch will automatically:
1. Trigger a new build on Vercel
2. Run tests (if configured)
3. Deploy to production
4. Update your live URL

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas monitoring
3. Inspect browser console for frontend errors
4. Check Network tab for API call failures

---

**Note**: Keep your `.env` files and secrets secure. Never commit them to GitHub!
