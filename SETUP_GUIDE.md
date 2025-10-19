# GridShare - Blockchain Energy Trading Platform

GridShare is a modern, full-stack web application that enables homeowners with solar panels (prosumers) to sell their excess electricity directly to neighbors (consumers) using a blockchain-simulated peer-to-peer marketplace.

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 💰 **Energy Marketplace** - Buy and sell energy in real-time
- 📊 **Analytics Dashboard** - Track energy production, consumption, and savings
- 🔄 **Real-time Transactions** - Instant blockchain-simulated transactions
- 💾 **Data Persistence** - MongoDB database for storing all user data
- 🌱 **Renewable Energy Focus** - Filter by energy source (solar, wind, hydro)

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GridShare-Blockchain-Energy-Trading-Platform-main
```

### 2. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows service automatically

To verify MongoDB is running:
```powershell
mongosh
```

If not running, start it:
```powershell
net start MongoDB
```

#### Alternative: Use MongoDB Atlas (Cloud)
If you prefer not to install MongoDB locally, you can use MongoDB Atlas (free tier):
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `server/.env` with your connection string

### 3. Setup Backend Server

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env

# Edit .env file if needed (optional)
# The default settings should work for local MongoDB

# Start the server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 4. Setup Frontend Application

Open a **NEW terminal window** and run:

```powershell
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration (`server/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/gridshare
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Frontend Configuration (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Using the Application

### 1. Register a New Account
1. Navigate to `http://localhost:5173`
2. Click "Sign up here"
3. Fill in your details:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Account Type**: Choose Consumer, Prosumer, or Both
   - **Address**: Your physical address
   - **Password**: Choose a secure password (min 6 characters)
   - **Preferences**: Set your energy preferences
4. Click "Create Account"

### 2. Login
1. Use your registered email and password
2. Click "Sign In"
3. You'll be redirected to the dashboard

### 3. Explore Features

#### Dashboard
- View your energy production and consumption
- See recent transactions
- Monitor your energy balance

#### Marketplace
- Browse available energy listings
- Filter by energy source, price, and location
- Purchase energy from other users
- Create your own listings (if you're a prosumer)

#### Analytics
- View detailed charts and graphs
- Track your energy savings
- Analyze price trends
- Monitor your carbon footprint

#### Profile
- Update your preferences
- Manage your account settings
- View your wallet information

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Energy Trading
- `GET /api/energy/listings` - Get all available listings
- `POST /api/energy/listings` - Create new listing
- `POST /api/energy/purchase/:listingId` - Purchase energy
- `GET /api/energy/transactions` - Get user transactions
- `GET /api/energy/transactions/all` - Get all transactions

### Energy Data
- `GET /api/energy-data` - Get user's energy data
- `POST /api/energy-data` - Create energy data entry

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB
```
**Solution**: Make sure MongoDB is running
```powershell
net start MongoDB
# or
mongosh
```

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change the port in `server/.env`
```env
PORT=5001
```
And update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### CORS Error
```
Access to fetch at 'http://localhost:5000/api/...' has been blocked by CORS policy
```
**Solution**: Make sure the backend server is running and CORS is properly configured

## 📦 Project Structure

```
GridShare-Blockchain-Energy-Trading-Platform-main/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── auth/                # Authentication components
│   │   ├── Dashboard.tsx        # Dashboard component
│   │   ├── Marketplace.tsx      # Marketplace component
│   │   ├── Analytics.tsx        # Analytics component
│   │   └── Profile.tsx          # Profile component
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   ├── hooks/                   # Custom React hooks
│   │   ├── useEnergyData.ts     # Energy data hook
│   │   └── useEnergyTrading.ts  # Energy trading hook
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utility functions
│   │   └── api.ts               # API client
│   └── App.tsx                  # Main app component
├── server/                      # Backend source code
│   ├── models/                  # MongoDB models
│   │   ├── User.js              # User model
│   │   ├── EnergyListing.js     # Energy listing model
│   │   ├── Transaction.js       # Transaction model
│   │   └── EnergyData.js        # Energy data model
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── energy.js            # Energy trading routes
│   │   └── energyData.js        # Energy data routes
│   ├── server.js                # Main server file
│   ├── package.json             # Server dependencies
│   └── .env                     # Server configuration
├── package.json                 # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## 🔒 Security Notes

⚠️ **Important for Production:**
1. Change `JWT_SECRET` in `server/.env` to a strong, random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Add rate limiting to API endpoints
5. Implement proper input validation
6. Use MongoDB Atlas for production database
7. Add proper error logging and monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub

---

Built with ❤️ using React, Node.js, and MongoDB
