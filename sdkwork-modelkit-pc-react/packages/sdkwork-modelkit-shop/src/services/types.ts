import { Product, ProductCategory, ProductSku, CartItem, OrderHistoryItem as Order } from '../types';

export interface IShopService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getCategories(): Promise<{ id: ProductCategory; name: string }[]>;
  
  getCart(): Promise<CartItem[]>;
  saveCart(cart: CartItem[]): Promise<void>;
  
  getOrders(): Promise<Order[]>;
  saveOrders(orders: Order[]): Promise<void>;
  getWalletBalance(): Promise<number>;
  checkout(input: {
    items: CartItem[];
    paymentMethod: Order['paymentMethod'];
    shippingAddress?: Order['shippingAddress'];
    clearCart: boolean;
  }): Promise<import('@sdkwork/modelkit-pc-core/sdk').CommerceCheckoutResult>;
}
