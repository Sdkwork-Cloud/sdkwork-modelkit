import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, OrderHistoryItem } from './types';
import { shopService } from './services/ShopService';

interface ShopContextType {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  orders: OrderHistoryItem[];
  setOrders: (orders: OrderHistoryItem[]) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    shopService.getCart().then(setCart).catch(console.error);
    shopService.getOrders().then(newOrders => setOrders(newOrders as OrderHistoryItem[])).catch(console.error);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    shopService.saveCart(newCart).catch(console.error);
  };

  const saveOrders = (newOrders: OrderHistoryItem[]) => {
    setOrders(newOrders);
    shopService.saveOrders(newOrders as any[]).catch(console.error);
  };

  return (
    <ShopContext.Provider value={{ 
      cart, 
      setCart: saveCart, 
      orders, 
      setOrders: saveOrders, 
      isCartDrawerOpen, 
      setIsCartDrawerOpen 
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
