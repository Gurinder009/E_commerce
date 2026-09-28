import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { ICart } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from '../utils/toast';

interface CartContextType {
  cart: ICart | null;
  cartCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number, variantSku?: string, selectedColor?: string, selectedSize?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    variantSku?: string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart.');
      return;
    }
    try {
      const res = await api.post('/cart/add', {
        productId,
        quantity,
        variantSku,
        selectedColor,
        selectedSize,
      });
      if (res.data.success) {
        setCart(res.data.data);
        toast.success('Item added to cart!');
        setIsCartOpen(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await api.put('/cart/update', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await api.delete(`/cart/item/${productId}`);
      if (res.data.success) {
        setCart(res.data.data);
        toast.info('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.post('/cart/coupon', { code });
      if (res.data.success) {
        setCart(res.data.data);
        toast.success(`Coupon "${code.toUpperCase()}" applied!`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await api.delete('/cart/coupon');
      if (res.data.success) {
        setCart(res.data.data);
        toast.info('Coupon removed');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      if (res.data.success) {
        setCart(null);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
