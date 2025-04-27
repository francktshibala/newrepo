import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], subtotal: 0, itemCount: 0 });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await cartService.getCart();
      setCart(data.cart);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (inv_id, quantity = 1) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cartService.addToCart(inv_id, quantity);
      fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (inv_id, quantity) => {
    if (!user || quantity < 1) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cartService.updateQuantity(inv_id, quantity);
      fetchCart();
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (inv_id) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cartService.removeFromCart(inv_id);
      fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await cartService.clearCart();
      setCart({ items: [], subtotal: 0, itemCount: 0 });
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        error, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};