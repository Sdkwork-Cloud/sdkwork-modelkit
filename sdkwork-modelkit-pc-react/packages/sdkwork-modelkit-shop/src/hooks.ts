import { useState, useEffect } from 'react';
import { CartItem, OrderHistoryItem } from './types';
import { shopService } from './services/ShopService';

export function useCartStorage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    shopService.getCart().then(setCart).catch(console.error);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      } else {
        shopService.getCart().then(setCart).catch(console.error);
      }
    };

    window.addEventListener('shop_cart_updated', handleUpdate);
    return () => window.removeEventListener('shop_cart_updated', handleUpdate);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    shopService.saveCart(newCart).catch(console.error);
    window.dispatchEvent(new CustomEvent('shop_cart_updated', { detail: newCart }));
  };

  return { cart, saveCart };
}

export function useOrdersStorage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);

  useEffect(() => {
    shopService.getOrders().then(newOrders => setOrders(newOrders as OrderHistoryItem[])).catch(console.error);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setOrders(customEvent.detail);
      } else {
         shopService.getOrders().then(newOrders => setOrders(newOrders as OrderHistoryItem[])).catch(console.error);
      }
    };

    window.addEventListener('shop_orders_updated', handleUpdate);
    return () => window.removeEventListener('shop_orders_updated', handleUpdate);
  }, []);

  const saveOrders = (newOrders: OrderHistoryItem[]) => {
    setOrders(newOrders);
    shopService.saveOrders(newOrders as any[]).catch(console.error);
    window.dispatchEvent(new CustomEvent('shop_orders_updated', { detail: newOrders }));
  };

  return { orders, saveOrders };
}
