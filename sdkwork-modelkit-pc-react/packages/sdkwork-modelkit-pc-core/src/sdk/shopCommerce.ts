import { uuid } from '@sdkwork/utils';
import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from './preferenceStore';

export type CommercePaymentMethod = 'wallet' | 'alipay' | 'wechat' | 'card';
export type CommerceProductType = 'virtual' | 'physical';
export type CommerceOrderStatus = 'completed' | 'processing' | 'shipped';

export interface CommerceProductSnapshot {
  id: string;
  name: string;
  type: CommerceProductType;
  price: number;
  couponFormat?: string;
}

export interface CommerceSkuSnapshot {
  id?: string;
  name?: string;
  price: number;
}

export interface CommerceCartItem {
  product: CommerceProductSnapshot;
  selectedSku?: CommerceSkuSnapshot;
  quantity: number;
}

export interface CommerceShippingAddress {
  name: string;
  phone: string;
  address: string;
}

export interface CommerceOrderRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  skuId?: string;
  skuName?: string;
  productType: CommerceProductType;
  price: number;
  quantity: number;
  totalPrice: number;
  paymentMethod: CommercePaymentMethod;
  status: CommerceOrderStatus;
  couponCode?: string;
  couponRedeemed?: boolean;
  shippingAddress?: CommerceShippingAddress;
  trackingNumber?: string;
}

export interface CommerceCheckoutInput {
  items: CommerceCartItem[];
  paymentMethod: CommercePaymentMethod;
  shippingAddress?: CommerceShippingAddress;
  clearCart: boolean;
}

export interface CommerceCheckoutResult {
  orders: CommerceOrderRecord[];
  totalCharged: number;
  remainingBalance: number;
}

interface AccountBillingState {
  balance: number;
  methods: unknown[];
}

const DEFAULT_BILLING: AccountBillingState = {
  balance: 0,
  methods: [],
};

function resolveItemPrice(item: CommerceCartItem): number {
  return item.selectedSku?.price ?? item.product.price;
}

export function generateVirtualCouponCode(format?: string): string {
  const token = uuid().replace(/-/g, '').slice(0, 16).toUpperCase();
  if (!format) {
    return `MK-${token}`;
  }
  let code = format;
  while (code.includes('X')) {
    code = code.replace('X', token[Math.floor(Math.random() * token.length)]);
  }
  return code;
}

function buildTrackingNumber(): string {
  return `SF${uuid().replace(/-/g, '').slice(0, 14).toUpperCase()}CN`;
}

export async function checkoutCommerceCart(
  input: CommerceCheckoutInput,
  existingOrders: CommerceOrderRecord[],
): Promise<CommerceCheckoutResult> {
  if (input.items.length === 0) {
    throw new Error('Checkout cart is empty');
  }

  if (input.paymentMethod !== 'wallet') {
    throw new Error('Only wallet payment is supported in the current release.');
  }

  const billing = await loadPreferencePayload<AccountBillingState>(
    MODELKIT_PREFERENCE_NAMESPACES.accountBilling,
    DEFAULT_BILLING,
  );

  const total = input.items.reduce((sum, item) => {
    return sum + resolveItemPrice(item) * item.quantity;
  }, 0);

  if (billing.balance < total) {
    throw new Error('Insufficient wallet balance. Add funds in Account settings.');
  }

  const purchaseTime = new Date().toISOString();
  const orders: CommerceOrderRecord[] = input.items.map((item) => {
    const unitPrice = resolveItemPrice(item);
    return {
      id: `ORD-${uuid().slice(0, 8).toUpperCase()}`,
      date: purchaseTime,
      productId: item.product.id,
      productName: item.product.name,
      skuId: item.selectedSku?.id,
      skuName: item.selectedSku?.name,
      productType: item.product.type,
      price: unitPrice,
      quantity: item.quantity,
      totalPrice: unitPrice * item.quantity,
      paymentMethod: input.paymentMethod,
      status: item.product.type === 'virtual' ? 'completed' : 'processing',
      couponCode:
        item.product.type === 'virtual'
          ? generateVirtualCouponCode(item.product.couponFormat)
          : undefined,
      couponRedeemed: false,
      shippingAddress:
        item.product.type === 'physical' ? input.shippingAddress : undefined,
      trackingNumber: item.product.type === 'physical' ? buildTrackingNumber() : undefined,
    };
  });

  const remainingBalance = Number((billing.balance - total).toFixed(2));
  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountBilling, {
    ...billing,
    balance: remainingBalance,
  });
  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopOrders, [
    ...orders,
    ...existingOrders,
  ]);

  if (input.clearCart) {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopCart, []);
  }

  return {
    orders,
    totalCharged: total,
    remainingBalance,
  };
}

export async function redeemCommerceCoupon(code: string): Promise<boolean> {
  const normalized = code.trim();
  if (!normalized) {
    return false;
  }

  const orders = await loadPreferencePayload<CommerceOrderRecord[]>(
    MODELKIT_PREFERENCE_NAMESPACES.shopOrders,
    [],
  );
  const matchIndex = orders.findIndex(
    (order) => order.couponCode === normalized && !order.couponRedeemed,
  );
  if (matchIndex === -1) {
    return false;
  }

  const billing = await loadPreferencePayload<AccountBillingState>(
    MODELKIT_PREFERENCE_NAMESPACES.accountBilling,
    DEFAULT_BILLING,
  );
  const credit = orders[matchIndex].totalPrice;
  const nextOrders = [...orders];
  nextOrders[matchIndex] = { ...nextOrders[matchIndex], couponRedeemed: true };

  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.shopOrders, nextOrders);
  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountBilling, {
    ...billing,
    balance: Number((billing.balance + credit).toFixed(2)),
  });
  return true;
}

export async function readCommerceWalletBalance(): Promise<number> {
  const billing = await loadPreferencePayload<AccountBillingState>(
    MODELKIT_PREFERENCE_NAMESPACES.accountBilling,
    DEFAULT_BILLING,
  );
  return billing.balance;
}

export interface VipPurchaseInput {
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
}

export interface VipPurchaseResult {
  vipStatus: {
    isActive: boolean;
    plan: string;
    cycle: string;
    date: string;
  };
  remainingBalance: number;
}

export async function purchaseVipWithWallet(input: VipPurchaseInput): Promise<VipPurchaseResult> {
  if (input.price <= 0) {
    throw new Error('Invalid VIP plan price');
  }

  const billing = await loadPreferencePayload<AccountBillingState>(
    MODELKIT_PREFERENCE_NAMESPACES.accountBilling,
    DEFAULT_BILLING,
  );

  if (billing.balance < input.price) {
    throw new Error('Insufficient wallet balance. Add funds in Account settings.');
  }

  const remainingBalance = Number((billing.balance - input.price).toFixed(2));
  const vipStatus = {
    isActive: true,
    plan: input.planName,
    cycle: input.billingCycle,
    date: new Date().toISOString().slice(0, 10),
  };

  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountBilling, {
    ...billing,
    balance: remainingBalance,
  });
  await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceVip, vipStatus);

  return { vipStatus, remainingBalance };
}
