# GridShare - Blockchain Energy Trading Platform

**A modern, full-stack peer-to-peer energy trading marketplace**

GridShare enables homeowners with solar panels (prosumers) to sell their excess electricity directly to neighbors (consumers) through a blockchain-simulated marketplace. Built with React, Node.js, MongoDB, and featuring a comprehensive dark mode.

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- 📊 **Real-time Dashboard** - View energy production, consumption, and trading statistics
- 🛒 **Energy Marketplace** - Buy and sell energy with dynamic pricing
- 📈 **Analytics & Insights** - Track your energy usage and earnings over time
- 🌓 **Dark Mode** - System-wide dark mode with smooth transitions
- 💾 **Persistent Data** - MongoDB database for reliable data storage
- ⚡ **Real-time Updates** - Live energy data and transaction tracking

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/gridshare-energy-platform.git
cd gridshare-energy-platform

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install

# 4. Configure environment variables
# Copy .env.example to .env in both root and server directories
cp .env.example .env
cd server
cp .env.example .env

# 5. Start MongoDB (if using local installation)
# MongoDB should be running on mongodb://localhost:27017

# 6. Start the backend server (from server directory)
npm run dev
# Backend runs on http://localhost:5000

# 7. Start the frontend (from root directory)
cd ..
npm run dev
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` and create an account to get started!

📖 **For detailed setup instructions**, see [QUICK_START.md](./QUICK_START.md)

## 🌐 Deployment

### Deploy to Vercel & MongoDB Atlas

**Quick Deploy**: Follow the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a step-by-step guide.

**Key Steps**:
1. Set up MongoDB Atlas (free tier)
2. Push code to GitHub
3. Connect Vercel to your repository
4. Configure environment variables
5. Deploy!

📖 **For complete deployment guide**, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with dark mode
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
gridshare-energy-platform/
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Login/Register pages
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Marketplace.tsx
│   │   └── ...
│   ├── contexts/         # React contexts (Auth, DarkMode)
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions (API client)
├── server/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Express server
│   └── .env              # Backend environment variables
├── public/               # Static assets
├── DEPLOYMENT.md         # Deployment guide
├── QUICK_START.md        # Setup instructions
└── package.json          # Dependencies
```

## 🎨 Screenshots

### Dashboard Page
<img width="2559" height="1439" alt="Dashboard with energy statistics and charts" src="https://github.com/user-attachments/assets/6fb553a9-3ba0-4c44-b9b3-1d19aa91486d" />

### Marketplace Page
<img width="2559" height="1439" alt="Energy marketplace with available listings" src="https://github.com/user-attachments/assets/7bb5e221-2012-4121-9bfe-f7512433e57b" />

### Analytics Page
<img width="2559" height="1439" alt="Analytics dashboard with graphs" src="https://github.com/user-attachments/assets/d384b934-2b16-49ba-9a0a-a4e4bfee333e" />

### Dark Mode
Full dark mode support across all pages with smooth transitions.

## 🔧 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/gridshare
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

See `.env.example` files for templates.

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Detailed setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [DARK_MODE_GUIDE.md](./DARK_MODE_GUIDE.md) - Dark mode implementation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Technical setup guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React, Node.js, and MongoDB
- UI powered by Tailwind CSS
- Charts by Recharts
- Icons by Lucide React

---

**Ready to deploy?** Check out [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to get started!
