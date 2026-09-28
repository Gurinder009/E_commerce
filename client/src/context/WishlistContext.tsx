import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { IProduct } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from '../utils/toast';

interface WishlistContextType {
  wishlist: IProduct[];
  wishlistIds: Set<string>;
  isLoading: boolean;
  toggleWishlist: (product: IProduct) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('/wishlist');
      if (res.data.success && Array.isArray(res.data.data)) {
        setWishlist(res.data.data);
        setWishlistIds(new Set(res.data.data.map((p: IProduct) => p._id)));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product: IProduct) => {
    if (!isAuthenticated) {
      toast.info('Please log in to manage your wishlist.');
      return;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId: product._id });
      if (res.data.success) {
        const added = res.data.data.added;
        if (added) {
          setWishlist((prev) => [...prev, product]);
          setWishlistIds((prev) => new Set([...prev, product._id]));
          toast.success(`"${product.name}" added to wishlist.`);
        } else {
          setWishlist((prev) => prev.filter((p) => p._id !== product._id));
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(product._id);
            return next;
          });
          toast.info(`"${product.name}" removed from wishlist.`);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        isLoading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
