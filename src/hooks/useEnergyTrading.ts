import { useEffect, useMemo, useState } from 'react';
import { EnergyListing, Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

export const useEnergyTrading = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<EnergyListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch listings
        const listingsData = await api.get('/energy/listings');
        const formattedListings = listingsData.map((l: any) => ({
          ...l,
          id: l._id,
          createdAt: new Date(l.createdAt),
          availableFrom: new Date(l.availableFrom),
          availableUntil: new Date(l.availableUntil),
        }));
        setListings(formattedListings);

        // Fetch transactions if user is logged in
        if (user) {
          const transactionsData = await api.get('/energy/transactions');
          const formattedTransactions = transactionsData.map((t: any) => ({
            ...t,
            id: t._id,
            timestamp: new Date(t.timestamp),
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Create a new listing for the current user
  const createListing = async (data: {
    energyAmount: number;
    pricePerKwh: number;
    energySource: EnergyListing['energySource'];
    availableFrom?: Date;
    availableUntil: Date;
    location: string;
  }): Promise<EnergyListing> => {
    if (!user) {
      throw new Error('You must be logged in to create a listing.');
    }

    try {
      const response = await api.post('/energy/listings', data);
      const newListing: EnergyListing = {
        ...response,
        id: response._id,
        createdAt: new Date(response.createdAt),
        availableFrom: new Date(response.availableFrom),
        availableUntil: new Date(response.availableUntil),
      };
      
      setListings(prev => [newListing, ...prev]);
      return newListing;
    } catch (error) {
      console.error('Failed to create listing:', error);
      throw error;
    }
  };

  // Purchase energy from a listing
  const purchaseEnergy = async (listingId: string, amount: number) => {
    if (!user) {
      throw new Error('You must be logged in to purchase energy.');
    }
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0.');
    }

    try {
      const response = await api.post(`/energy/purchase/${listingId}`, { amount });
      const { transaction: txData, listing: updatedListingData } = response;
      
      // Update listing in state
      setListings(prev => prev.map(l => 
        l.id === listingId ? {
          ...updatedListingData,
          id: updatedListingData._id,
          createdAt: new Date(updatedListingData.createdAt),
          availableFrom: new Date(updatedListingData.availableFrom),
          availableUntil: new Date(updatedListingData.availableUntil),
        } : l
      ));

      // Add transaction to state
      const newTransaction: Transaction = {
        ...txData,
        id: txData._id,
        timestamp: new Date(txData.timestamp),
      };
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Failed to purchase energy:', error);
      throw error;
    }
  };

  return useMemo(
    () => ({
      listings,
      transactions,
      loading,
      createListing,
      purchaseEnergy,
    }),
    [listings, transactions, loading]
  );
};

export type UseEnergyTrading = ReturnType<typeof useEnergyTrading>;
