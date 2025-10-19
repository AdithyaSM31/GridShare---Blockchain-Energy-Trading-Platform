# GridShare - Complete Setup Instructions

## 🎯 Quick Start (Read This First!)

Your application now has a **COMPLETE BACKEND** with real data persistence! Here's what's been added:

### ✅ What's New:
1. **Backend API Server** (Node.js + Express)
2. **MongoDB Database** for storing all data
3. **User Authentication** with JWT tokens and password hashing
4. **Real Data Persistence** - All registrations, logins, and transactions are saved permanently
5. **API Integration** - Frontend now communicates with the backend

---

## 📋 Step-by-Step Setup

### Step 1: Install MongoDB

**You MUST install MongoDB for the application to work properly.**

#### Option A: Local MongoDB (Recommended for Development)

**Windows Installation:**

1. Download MongoDB Community Server:
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Click "Download"

2. Run the installer:
   - Double-click the `.msi` file
   - Choose "Complete" installation
   - **IMPORTANT**: Check "Install MongoDB as a Service"
   - Keep default settings

3. Verify installation:
   ```powershell
   mongosh --version
   ```

4. Check if MongoDB is running:
   ```powershell
   net start | findstr MongoDB
   ```

   If not running, start it:
   ```powershell
   net start MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud - No Installation Needed)

If you don't want to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new FREE cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update `server/.env` file:
   ```env
   MONGODB_URI=your_connection_string_here
   ```

---

### Step 2: Start the Backend Server

Open a **NEW PowerShell terminal**:

```powershell
# Navigate to the server directory
cd c:\Users\adith\Downloads\GridShare-Blockchain-Energy-Trading-Platform-main\server

# Start the backend server
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

**Keep this terminal open!** The backend needs to run continuously.

---

### Step 3: Start the Frontend

The frontend is already running on http://localhost:5173

If not, open **ANOTHER PowerShell terminal**:

```powershell
# Navigate to the project root
cd c:\Users\adith\Downloads\GridShare-Blockchain-Energy-Trading-Platform-main

# Start the frontend
npm run dev
```

---

### Step 4: Test the Application

1. **Open your browser** to http://localhost:5173

2. **Register a New Account**:
   - Click "Sign up here"
   - Fill in ALL fields:
     - Name: John Doe
     - Email: john@example.com
     - Account Type: Both (can buy and sell)
     - Address: 123 Main St, New York
     - Password: password123
   - Click "Create Account"

3. **You're logged in!** Your account is now saved in MongoDB

4. **Test the Marketplace**:
   - Go to "Marketplace" tab
   - You should see energy listings
   - Try purchasing energy

5. **Logout and Login Again**:
   - Click your name → Logout
   - Login with the same credentials
   - ✅ Your data persists!

---

## 🔧 Configuration Files

### Backend Configuration (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/gridshare
JWT_SECRET=gridshare_secret_key_2025_change_in_production
PORT=5000
NODE_ENV=development
```

### Frontend Configuration (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎭 How It Works Now

### Before (Old System):
- ❌ Data stored in browser's localStorage
- ❌ Data lost when browser cache cleared
- ❌ No real authentication
- ❌ No password security

### After (New System):
- ✅ Data stored in MongoDB database
- ✅ Data persists permanently
- ✅ Secure JWT authentication
- ✅ Passwords encrypted with bcrypt
- ✅ Real API backend
- ✅ Multiple users can register independently

---

## 📊 Database Structure

Your data is organized in MongoDB collections:

1. **Users Collection**
   - Stores: name, email, hashed password, role, preferences, location
   - Each user has a unique ID

2. **EnergyListings Collection**
   - Stores: energy amount, price, source, location, availability
   - Linked to prosumer users

3. **Transactions Collection**
   - Stores: buyer, seller, amount, price, timestamp, status
   - Complete transaction history

4. **EnergyData Collection**
   - Stores: production, consumption, grid import/export
   - Hourly energy metrics per user

---

## 🚀 API Endpoints Available

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update profile

### Energy Trading
- `GET /api/energy/listings` - View all energy listings
- `POST /api/energy/listings` - Create new listing
- `POST /api/energy/purchase/:id` - Purchase energy
- `GET /api/energy/transactions` - View your transactions

### Energy Data
- `GET /api/energy-data` - Get your energy data
- `POST /api/energy-data` - Add energy data

---

## 🐛 Troubleshooting

### Error: "Failed to connect to MongoDB"

**Problem**: Backend can't connect to database

**Solution**:
```powershell
# Check if MongoDB is running
net start | findstr MongoDB

# If not running, start it:
net start MongoDB
```

### Error: "Port 5000 already in use"

**Problem**: Another application is using port 5000

**Solution**: Change the port in `server/.env`:
```env
PORT=5001
```
Then update `.env` in the root:
```env
VITE_API_URL=http://localhost:5001/api
```

### Error: "Network Error" or "Failed to fetch"

**Problem**: Backend server is not running

**Solution**: Make sure you started the backend server (Step 2)

### Can't see any data after login

**Problem**: Database is empty or API connection failed

**Solution**: 
1. Check browser console for errors (F12)
2. Verify backend is running and shows "MongoDB connected"
3. Try creating a new listing if you're a prosumer

---

## 🎯 Next Steps

Now that you have a fully functional app:

1. **Create Multiple Users**: Register different accounts to test buying/selling
2. **Create Listings**: If you're a prosumer, create energy listings
3. **Make Purchases**: Buy energy from the marketplace
4. **View Analytics**: Check your energy data and transaction history

---

## 📝 Important Notes

### For Development:
- Keep BOTH terminals open (backend AND frontend)
- Backend runs on port 5000
- Frontend runs on port 5173
- MongoDB runs as a Windows service (always on)

### For Production:
- Change `JWT_SECRET` to a secure random string
- Use MongoDB Atlas instead of local MongoDB
- Enable HTTPS
- Add proper error handling and logging
- Implement rate limiting

---

## ✨ Features You Can Now Use

1. **Secure Registration** - Passwords are encrypted
2. **Persistent Login** - Stay logged in across sessions
3. **Real Marketplace** - Buy/sell energy with real data
4. **Transaction History** - View all past transactions
5. **User Profiles** - Update your preferences
6. **Data Analytics** - Track your energy usage

---

## 🎉 You're All Set!

Your GridShare application is now a **full-stack application** with:
- ✅ Real database
- ✅ Secure authentication
- ✅ Persistent data
- ✅ RESTful API
- ✅ Modern React frontend

Enjoy trading energy! 🌱⚡

---

**Need Help?** Check the troubleshooting section above or review the main `SETUP_GUIDE.md` file.
