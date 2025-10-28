import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEnergyData } from '../hooks/useEnergyData';
import { useEnergyTrading } from '../hooks/useEnergyTrading';
import GlassSurface from './GlassSurface';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Leaf,
  Battery,
  Sun,
  Wind,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { energyData, priceData, loading: energyLoading } = useEnergyData(user?.id || '');
  const { transactions, loading: tradingLoading } = useEnergyTrading();

  if (energyLoading || tradingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safely check if data exists
  if (!energyData || energyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Zap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Energy Data Available</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start trading energy to see your production and consumption metrics here.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            💡 Tip: Create a listing in the Marketplace to sell energy, or buy energy from others to populate your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const currentEnergy = energyData[energyData.length - 1];
  const dailyProduction = energyData.slice(-24).reduce((sum, d) => sum + (d.production || 0), 0);
  const dailyConsumption = energyData.slice(-24).reduce((sum, d) => sum + (d.consumption || 0), 0);
  
  // Calculate previous period for comparison
  const previousDayProduction = energyData.slice(-48, -24).reduce((sum, d) => sum + (d.production || 0), 0);
  const previousDayConsumption = energyData.slice(-48, -24).reduce((sum, d) => sum + (d.consumption || 0), 0);
  
  // Calculate actual changes
  const productionChange = previousDayProduction > 0 
    ? ((dailyProduction - previousDayProduction) / previousDayProduction * 100).toFixed(1)
    : '0';
  const consumptionChange = previousDayConsumption > 0
    ? ((dailyConsumption - previousDayConsumption) / previousDayConsumption * 100).toFixed(1)
    : '0';
  
  // Calculate real savings from transactions
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  
  const currentMonthTransactions = (transactions || []).filter(t => t.timestamp > thirtyDaysAgo);
  const previousMonthTransactions = (transactions || []).filter(t => 
    t.timestamp > sixtyDaysAgo && t.timestamp <= thirtyDaysAgo
  );
  
  // Calculate actual spending vs grid price
  const currentMonthSpending = currentMonthTransactions
    .filter(t => t.buyerId === user?.id)
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const energyBought = currentMonthTransactions
    .filter(t => t.buyerId === user?.id)
    .reduce((sum, t) => sum + t.energyAmount, 0);
  
  // Assume grid price is average 0.20 per kWh (or get from priceData)
  const avgGridPrice = priceData && priceData.length > 0 
    ? priceData[priceData.length - 1]?.gridPrice || 0.20
    : 0.20;
  
  const gridCost = energyBought * avgGridPrice;
  const actualSavings = gridCost > 0 ? ((gridCost - currentMonthSpending) / gridCost * 100) : 0;
  
  const transactionsChange = previousMonthTransactions.length > 0
    ? ((currentMonthTransactions.length - previousMonthTransactions.length) / previousMonthTransactions.length * 100).toFixed(0)
    : currentMonthTransactions.length > 0 ? '+100' : '0';

  const stats = [
    {
      name: 'Current Production',
      value: `${currentEnergy?.production.toFixed(1) || '0'} kWh`,
      icon: Sun,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: `${parseFloat(productionChange) >= 0 ? '+' : ''}${productionChange}%`,
      changeType: parseFloat(productionChange) >= 0 ? 'positive' as const : 'negative' as const,
    },
    {
      name: 'Daily Consumption',
      value: `${dailyConsumption.toFixed(1)} kWh`,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `${parseFloat(consumptionChange) >= 0 ? '+' : ''}${consumptionChange}%`,
      changeType: parseFloat(consumptionChange) < 0 ? 'positive' as const : 'negative' as const, // Lower consumption is better
    },
    {
      name: 'Monthly Savings',
      value: `${actualSavings.toFixed(1)}%`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: energyBought > 0 ? `$${(gridCost - currentMonthSpending).toFixed(2)} saved` : 'No purchases',
      changeType: 'positive' as const,
    },
    {
      name: 'Transactions',
      value: currentMonthTransactions.length.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `${transactionsChange}%`,
      changeType: parseFloat(transactionsChange) >= 0 ? 'positive' as const : 'negative' as const,
    },
  ];

  // Prepare chart data
  const last24Hours = energyData.slice(-24).map(data => ({
    time: format(data.timestamp, 'HH:mm'),
    production: data.production,
    consumption: data.consumption,
    net: data.production - data.consumption,
  }));

  const priceComparisonData = (priceData || []).slice(-7).map(data => ({
    date: format(data.timestamp, 'MMM dd'),
    p2p: data.p2pPrice,
    grid: data.gridPrice,
    savings: data.savings,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's your energy overview for today
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Battery className="w-4 h-4" />
            <span>Battery: {currentEnergy?.batteryLevel?.toFixed(0) || '0'}%</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassSurface
              width="100%"
              borderRadius={16}
              backgroundOpacity={0.15}
              blur={12}
              brightness={70}
              opacity={0.92}
            >
              <div className="w-full p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor} dark:bg-opacity-20`}>
                    <stat.icon className={`w-6 h-6 ${stat.color} dark:brightness-125`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                  )}
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>
            </GlassSurface>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Flow Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassSurface
            width="100%"
            borderRadius={16}
            backgroundOpacity={0.15}
            blur={12}
            brightness={70}
            opacity={0.92}
          >
            <div className="w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                Energy Flow (24h)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={last24Hours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                  <XAxis dataKey="time" stroke="#666" className="dark:stroke-gray-400" fontSize={12} />
                  <YAxis stroke="#666" className="dark:stroke-gray-400" fontSize={12} />
                  <Area
                    type="monotone"
                    dataKey="production"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Production"
                  />
                  <Area
                    type="monotone"
                    dataKey="consumption"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Consumption"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassSurface>
        </motion.div>

        {/* Price Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassSurface
            width="100%"
            borderRadius={16}
            backgroundOpacity={0.15}
            blur={12}
            brightness={70}
            opacity={0.92}
          >
            <div className="w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                Price Comparison (7d)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                  <XAxis dataKey="date" stroke="#666" className="dark:stroke-gray-400" fontSize={12} />
                  <YAxis stroke="#666" className="dark:stroke-gray-400" fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey="p2p"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    name="P2P Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="grid"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                    name="Grid Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassSurface>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassSurface
          width="100%"
          borderRadius={16}
          backgroundOpacity={0.15}
          blur={12}
          brightness={70}
          opacity={0.92}
        >
          <div className="w-full">
            <div className="px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            </div>
            <div className="p-6">
          {transactions.slice(0, 5).length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30' :
                      transaction.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.energySource === 'solar' ? (
                        <Sun className={`w-4 h-4 ${
                          transaction.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`} />
                      ) : (
                        <Wind className={`w-4 h-4 ${
                          transaction.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.energyAmount || 0} kWh from {transaction.sellerName || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(transaction.timestamp, 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(transaction.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className={`text-sm capitalize ${
                      transaction.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                      transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start trading energy to see your activity here</p>
            </div>
          )}
            </div>
          </div>
        </GlassSurface>
      </motion.div>
    </div>
  );
};