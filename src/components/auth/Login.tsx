import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { LiquidEtherBackground } from '../LiquidEtherBackground';
import GlassSurface from '../GlassSurface';
import { Zap, Eye, EyeOff, LogIn, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Display the actual error message from the API
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 relative" style={{ isolation: 'isolate' }}>
      {/* Liquid Ether Background */}
      <LiquidEtherBackground />
      
      {/* Dark Mode Toggle - Top Right */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome to GridShare
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your energy trading account
          </p>
        </div>

        {/* Login Form */}
        <GlassSurface
          width="100%"
          borderRadius={24}
          backgroundOpacity={0.2}
          blur={16}
          brightness={65}
          opacity={0.9}
        >
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full p-8 space-y-6"
            onSubmit={handleSubmit}
          >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </motion.form>
        </GlassSurface>
      </motion.div>
    </div>
  );
};