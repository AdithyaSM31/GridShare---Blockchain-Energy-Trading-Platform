import { useState, useEffect } from 'react';
import { EnergyData, PriceData } from '../types';
import { addHours, subDays, startOfDay } from 'date-fns';
import { api } from '../utils/api';

export const useEnergyData = (userId: string) => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        
        if (userId) {
          // Fetch transactions and listings to derive energy data
          const [transactions, listings] = await Promise.all([
            api.get('/energy/transactions').catch(() => []),
            api.get('/energy/listings').catch(() => [])
          ]);
          
          // Calculate energy data from actual marketplace transactions
          const derivedEnergyData = deriveEnergyDataFromTransactions(transactions, listings, userId);
          setEnergyData(derivedEnergyData);
          
          // Calculate price data from actual marketplace listings
          const derivedPriceData = derivePriceDataFromMarketplace(listings, transactions);
          setPriceData(derivedPriceData);
        } else {
          setEnergyData([]);
          setPriceData([]);
        }
      } catch (error) {
        console.error('Error fetching energy data:', error);
        setEnergyData([]);
        setPriceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [userId]);

  // Derive energy production/consumption from actual transactions
  const deriveEnergyDataFromTransactions = (transactions: any[], _listings: any[], uid: string): EnergyData[] => {
    const data: EnergyData[] = [];
    const now = new Date();
    
    // Create hourly buckets for the last 7 days
    const hourlyBuckets = new Map<string, { production: number; consumption: number; count: number }>();
    
    // Initialize hourly buckets
    for (let i = 0; i < 24 * 7; i++) {
      const timestamp = subDays(addHours(now, -i), 0);
      const key = timestamp.toISOString();
      hourlyBuckets.set(key, { production: 0, consumption: 0, count: 0 });
    }
    
    // Aggregate transactions into hourly buckets
    transactions.forEach((txn: any) => {
      const txnDate = new Date(txn.timestamp);
      const hourKey = new Date(
        txnDate.getFullYear(),
        txnDate.getMonth(),
        txnDate.getDate(),
        txnDate.getHours()
      ).toISOString();
      
      const bucket = hourlyBuckets.get(hourKey);
      if (bucket) {
        // If user is seller, this is production (energy they generated and sold)
        if (txn.sellerId === uid) {
          bucket.production += txn.energyAmount;
        }
        // If user is buyer, this is consumption (energy they purchased and used)
        if (txn.buyerId === uid) {
          bucket.consumption += txn.energyAmount;
        }
        bucket.count++;
      }
    });
    
    // Convert buckets to EnergyData array
    const sortedKeys = Array.from(hourlyBuckets.keys()).sort();
    sortedKeys.forEach(key => {
      const bucket = hourlyBuckets.get(key)!;
      const timestamp = new Date(key);
      
      // Calculate grid import/export
      const netEnergy = bucket.production - bucket.consumption;
      const gridImport = netEnergy < 0 ? Math.abs(netEnergy) : 0;
      const gridExport = netEnergy > 0 ? netEnergy : 0;
      
      // Estimate battery level based on net energy
      const batteryLevel = 50 + (netEnergy * 5); // Simplified battery simulation
      
      data.push({
        userId: uid,
        timestamp,
        production: Math.round(bucket.production * 100) / 100,
        consumption: Math.round(bucket.consumption * 100) / 100,
        gridImport: Math.round(gridImport * 100) / 100,
        gridExport: Math.round(gridExport * 100) / 100,
        batteryLevel: Math.max(0, Math.min(100, batteryLevel)),
      });
    });
    
    return data;
  };

  // Derive price data from actual marketplace listings and transactions
  const derivePriceDataFromMarketplace = (listings: any[], transactions: any[]): PriceData[] => {
    const data: PriceData[] = [];
    const now = new Date();
    const GRID_PRICE = 0.22; // Standard grid price per kWh
    
    // Create daily buckets for the last 30 days
    const dailyBuckets = new Map<string, { prices: number[]; transactionPrices: number[] }>();
    
    // Initialize daily buckets
    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(now, i));
      const key = date.toISOString().split('T')[0];
      dailyBuckets.set(key, { prices: [], transactionPrices: [] });
    }
    
    // Aggregate listing prices
    listings.forEach((listing: any) => {
      const listingDate = new Date(listing.createdAt);
      const dateKey = startOfDay(listingDate).toISOString().split('T')[0];
      const bucket = dailyBuckets.get(dateKey);
      if (bucket && listing.pricePerKwh) {
        bucket.prices.push(listing.pricePerKwh);
      }
    });
    
    // Aggregate transaction prices
    transactions.forEach((txn: any) => {
      const txnDate = new Date(txn.timestamp);
      const dateKey = startOfDay(txnDate).toISOString().split('T')[0];
      const bucket = dailyBuckets.get(dateKey);
      if (bucket && txn.pricePerKwh) {
        bucket.transactionPrices.push(txn.pricePerKwh);
      }
    });
    
    // Convert buckets to PriceData array
    const sortedKeys = Array.from(dailyBuckets.keys()).sort();
    sortedKeys.forEach(key => {
      const bucket = dailyBuckets.get(key)!;
      const timestamp = new Date(key);
      
      // Calculate average P2P price (prefer transaction prices, fallback to listing prices)
      let avgP2PPrice = GRID_PRICE * 0.75; // Default to 25% savings
      
      if (bucket.transactionPrices.length > 0) {
        avgP2PPrice = bucket.transactionPrices.reduce((a, b) => a + b, 0) / bucket.transactionPrices.length;
      } else if (bucket.prices.length > 0) {
        avgP2PPrice = bucket.prices.reduce((a, b) => a + b, 0) / bucket.prices.length;
      }
      
      const savings = ((GRID_PRICE - avgP2PPrice) / GRID_PRICE) * 100;
      
      data.push({
        timestamp,
        p2pPrice: Math.round(avgP2PPrice * 1000) / 1000,
        gridPrice: GRID_PRICE,
        savings: Math.round(Math.max(0, savings) * 10) / 10,
      });
    });
    
    return data;
  };

  return { energyData, priceData, loading };
};