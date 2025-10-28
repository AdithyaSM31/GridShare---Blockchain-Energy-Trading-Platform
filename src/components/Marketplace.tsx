import React, { useState } from 'react';
import { useEnergyTrading } from '../hooks/useEnergyTrading';
import { useAuth } from '../contexts/AuthContext';
import { EnergyListing } from '../types';
import { 
  Search, 
  Filter, 
  Sun, 
  Wind, 
  Droplets,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  ShoppingCart,
  Plus,
  X
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const { listings, loading, createListing, purchaseEnergy } = useEnergyTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'amount' | 'time'>('time');
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  // Filter and sort listings
  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.prosumerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = filterSource === 'all' || listing.energySource === filterSource;
      const isAvailable = listing.status === 'available';
      return matchesSearch && matchesSource && isAvailable;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerKwh - b.pricePerKwh;
        case 'amount':
          return b.energyAmount - a.energyAmount;
        case 'time':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'solar': return Sun;
      case 'wind': return Wind;
      case 'hydro': return Droplets;
      default: return Zap;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'solar': return 'text-yellow-600 bg-yellow-100';
      case 'wind': return 'text-blue-600 bg-blue-100';
      case 'hydro': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  const handlePurchase = (listingId: string) => {
    try {
      purchaseEnergy(listingId, purchaseAmount);
      setSelectedListing(null);
      setPurchaseAmount(1);
      // Show success message (you could add a toast notification here)
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Energy Marketplace</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover and trade renewable energy with your neighbors
          </p>
        </div>
        {(user?.role === 'prosumer' || user?.role === 'both') && (
          <button
            onClick={() => setShowCreateListing(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Sell Energy
          </button>
        )}
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="liquid-glass rounded-xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by producer or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Sources</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="hydro">Hydro</option>
              <option value="mixed">Mixed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'amount' | 'time')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="time">Latest</option>
              <option value="price">Lowest Price</option>
              <option value="amount">Most Energy</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => {
          const SourceIcon = getSourceIcon(listing.energySource);
          const sourceColors = getSourceColor(listing.energySource);
          
          return (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="liquid-glass-card rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${sourceColors}`}>
                      <SourceIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{listing.prosumerName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{listing.energySource} Energy</p>
                    </div>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    Available
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{listing.energyAmount} kWh</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${listing.pricePerKwh.toFixed(3)}/kWh
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{listing.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Available until {format(listing.availableUntil, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Total: ${(listing.energyAmount * listing.pricePerKwh).toFixed(2)}
                  </div>
                  <button
                    onClick={() => setSelectedListing(listing.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500">
            {searchTerm || filterSource !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to list energy for sale!'
            }
          </p>
        </motion.div>
      )}

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showCreateListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateListing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-white">Create Energy Listing</h3>
                <button
                  onClick={() => setShowCreateListing(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  await createListing({
                    energyAmount: parseFloat(formData.get('energyAmount') as string),
                    pricePerKwh: parseFloat(formData.get('pricePerKwh') as string),
                    energySource: formData.get('energySource') as EnergyListing['energySource'],
                    availableUntil: new Date(formData.get('availableUntil') as string),
                    location: (formData.get('location') as string) || user?.location?.address || 'Unknown',
                  });
                  setShowCreateListing(false);
                  // Show success message
                } catch (error: any) {
                  alert(error?.message || 'Failed to create listing');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy Amount (kWh)
                  </label>
                  <input
                    type="number"
                    name="energyAmount"
                    min="0.1"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per kWh ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerKwh"
                    min="0.001"
                    step="0.001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy Source
                  </label>
                  <select
                    name="energySource"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="solar">Solar</option>
                    <option value="wind">Wind</option>
                    <option value="hydro">Hydro</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Until
                  </label>
                  <input
                    type="datetime-local"
                    name="availableUntil"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder={user?.location?.address || 'Enter location'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateListing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedListing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              {(() => {
                const listing = listings.find(l => l.id === selectedListing);
                if (!listing) return null;
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Purchase Energy</h3>
                      <button
                        onClick={() => setSelectedListing(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium dark:text-gray-300">From:</span>
                          <span className="dark:text-white">{listing.prosumerName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium dark:text-gray-300">Available:</span>
                          <span className="dark:text-white">{listing.energyAmount} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium dark:text-gray-300">Price:</span>
                          <span className="dark:text-white">${listing.pricePerKwh.toFixed(3)}/kWh</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Amount to purchase (kWh)
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          max={listing.energyAmount}
                          step="0.1"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span className="dark:text-gray-200">Total:</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            ${(purchaseAmount * listing.pricePerKwh).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedListing(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePurchase(listing.id)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};