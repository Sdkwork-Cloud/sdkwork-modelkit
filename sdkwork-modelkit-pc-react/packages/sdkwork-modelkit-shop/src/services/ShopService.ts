import {
  checkoutCommerceCart,
  listCatalogItems,
  loadPreferencePayload,
  MODELKIT_CATALOG_DOMAINS,
  MODELKIT_PREFERENCE_NAMESPACES,
  readCommerceWalletBalance,
  savePreferencePayload,
  type CommerceCartItem,
  type CommerceCheckoutResult,
} from '@sdkwork/modelkit-pc-core/sdk';
import { IShopService } from './types';
import { Product, ProductCategory, CartItem, OrderHistoryItem as Order } from '../types';

export type CheckoutInput = {
  items: CartItem[];
  paymentMethod: Order['paymentMethod'];
  shippingAddress?: Order['shippingAddress'];
  clearCart: boolean;
};
export type CheckoutResult = CommerceCheckoutResult;

export interface SidebarRecommendations {
  newArrivals: { icon: string; title: string; desc: string }[];
  hottest: { icon: string; title: string; desc: string }[];
  recommended: { icon: string; title: string; desc: string }[];
}

const SIDEBAR_RECOMMENDATIONS: SidebarRecommendations = {
  newArrivals: [
    { icon: '📱', title: 'ModelKit Relay Pack', desc: 'Production relay templates' },
  ],
  hottest: [
    { icon: '🎧', title: 'SkillHub Bundle', desc: 'Curated automation skills' },
  ],
  recommended: [
    { icon: '📱', title: 'Workspace Pro', desc: 'Advanced workspace tooling' },
  ],
};

function toCommerceCartItem(item: CartItem): CommerceCartItem {
  return {
    product: {
      id: item.product.id,
      name: item.product.name,
      type: item.product.type,
      price: item.product.price,
      couponFormat: item.product.couponFormat,
    },
    selectedSku: item.selectedSku
      ? {
          id: item.selectedSku.id,
          name: item.selectedSku.name,
          price: item.selectedSku.price,
        }
      : undefined,
    quantity: item.quantity,
  };
}

export class ApiShopService implements IShopService {
  async getProducts(): Promise<Product[]> {
    const records = await listCatalogItems<Product>(MODELKIT_CATALOG_DOMAINS.shop);
    return records.map((record) => record.payload);
  }

  async getSidebarRecommendations(): Promise<SidebarRecommendations> {
    const products = await this.getProducts();
    const pick = (index: number) => products[index];
    return {
      newArrivals: pick(0)
        ? [{ icon: pick(0)!.imageUrl || '📦', title: pick(0)!.name, desc: pick(0)!.description }]
        : SIDEBAR_RECOMMENDATIONS.newArrivals,
      hottest: pick(1)
        ? [{ icon: pick(1)!.imageUrl || '🔥', title: pick(1)!.name, desc: pick(1)!.description }]
        : SIDEBAR_RECOMMENDATIONS.hottest,
      recommended: pick(2)
        ? [{ icon: pick(2)!.imageUrl || '⭐', title: pick(2)!.name, desc: pick(2)!.description }]
        : SIDEBAR_RECOMMENDATIONS.recommended,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((product) => product.id === id) || null;
  }

  async getCategories(): Promise<{ id: ProductCategory; name: string }[]> {
    return [
      { id: 'all', name: 'All Products' },
      { id: 'api-credits', name: 'Digital Assets / API' },
      { id: 'keys', name: 'Licenses / Keys' },
      { id: 'hardware', name: 'Hardware / Gadgets' },
      { id: 'merchandise', name: 'Merchandise / Peripherals' },
    ];
  }

  async getCart(): Promise<CartItem[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopCart, []);
  }

  async saveCart(cart: CartItem[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopCart, cart);
  }

  async getOrders(): Promise<Order[]> {
    return loadPreferencePayload<Order[]>(MODELKIT_PREFERENCE_NAMESPACES.shopOrders, []);
  }

  async saveOrders(orders: Order[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopOrders, orders);
  }

  async getWalletBalance(): Promise<number> {
    return readCommerceWalletBalance();
  }

  async checkout(input: CheckoutInput): Promise<CheckoutResult> {
    const existingOrders = await this.getOrders();
    return checkoutCommerceCart(
      {
        items: input.items.map(toCommerceCartItem),
        paymentMethod: input.paymentMethod,
        shippingAddress: input.shippingAddress,
        clearCart: input.clearCart,
      },
      existingOrders,
    );
  }
}

export const shopService = new ApiShopService();
