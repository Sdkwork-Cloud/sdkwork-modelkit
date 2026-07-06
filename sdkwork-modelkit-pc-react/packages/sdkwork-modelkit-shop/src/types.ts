export type ProductType = 'virtual' | 'physical';

export type ProductCategory = 'all' | 'api-credits' | 'hardware' | 'keys' | 'merchandise';

export interface ProductSku {
  id: string;
  name: string;      
  price: number;
  originalPrice?: number;
  stock: number;
  specs?: Record<string, string>; // Specific specifications override for this SKU
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  badge?: string;
  imageUrl: string;
  merchantName?: string;
  externalUrl?: string;
  features: string[];
  specs: Record<string, string>;
  skus?: ProductSku[]; // Optional multi-SKU list
  images?: string[]; // Multiple carousel images (emojis, icons, or vector graphics descriptions)
  // For virtual goods
  couponFormat?: string;
  // For physical goods
  estimatedDelivery?: string;
  // Xianyu / Geek marketplace metadata
  sellerName?: string;
  sellerAvatar?: string;
  sellerCredit?: string; 
  location?: string;     
  condition?: string;    
  views?: number;
  wants?: number;
  comments?: Array<{
    id: string;
    user: string;
    avatar: string;
    time: string;
    question: string;
    reply?: {
      user: string;
      time: string;
      answer: string;
    };
  }>;
}

export interface CartItem {
  product: Product;
  selectedSku?: ProductSku;
  quantity: number;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  productId: string;
  productName: string;
  skuId?: string;
  skuName?: string;
  productType: ProductType;
  price: number;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'wallet' | 'alipay' | 'wechat' | 'card';
  status: 'completed' | 'processing' | 'shipped';
  couponCode?: string;
  couponRedeemed?: boolean;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
  };
  trackingNumber?: string;
}
