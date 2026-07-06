import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  ChevronRight, 
  ChevronLeft,
  Cpu, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Timer, 
  Truck, 
  Ticket, 
  Copy, 
  History, 
  Trash2, 
  Plus, 
  Minus, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Sun,
  Moon,
  Palette,
  Search
} from 'lucide-react';

import { toast } from 'sonner';
import { useAppContext } from '@sdkwork/modelkit-core';
import { Product, CartItem, OrderHistoryItem, ProductCategory, ProductSku } from '../types';
import { useCartStorage, useOrdersStorage } from '../hooks';
import { OrdersPage } from './OrdersPage';
import { CartDrawer } from './CartDrawer';

import { shopService } from '../services/ShopService';

import { ApplyPublisherModal } from './modals/ApplyPublisherModal';
import { PublishProductModal } from './modals/PublishProductModal';
import { ShopCheckoutModal } from './modals/ShopCheckoutModal';
import { LeftSidebar } from './LeftSidebar';
import { ShopProductCard } from './ShopProductCard';
import { ProductDetailsView } from './product/ProductDetailsView';


interface ShopViewProps {
  target?: 'orders' | 'cart' | null;
  onClearTarget?: () => void;
  isActiveMenu?: boolean;
}

export function ShopView({ target, onClearTarget, isActiveMenu = true }: ShopViewProps = {}) {
  const { language, t } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    compute: true,
    hardware: true,
    apparelGear: true
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
  const { cart, saveCart } = useCartStorage();
  const [showCart, setShowCart] = useState(false);
  const { orders, saveOrders } = useOrdersStorage();
  const [showOrders, setShowOrders] = useState(false);
  
  useEffect(() => {
    if (target === 'orders') {
      setShowOrders(true);
      setShowCart(false);
      setSelectedProduct(null);
      onClearTarget?.();
    } else if (target === 'cart') {
      setShowCart(true);
      setShowOrders(false);
      setSelectedProduct(null);
      onClearTarget?.();
    }
  }, [target, onClearTarget]);

  // Checkout variables
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [newlyCreatedOrder, setNewlyCreatedOrder] = useState<OrderHistoryItem | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  // Modern Professional Marketplace States
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [shopCategories, setShopCategories] = useState<{id: string; name: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply & Publish States
  const [showApplyPublisher, setShowApplyPublisher] = useState(false);
  const [showPublishProduct, setShowPublishProduct] = useState(false);
  
  const [isPublisher, setIsPublisher] = useState(false);
  
  const [sidebarRecommendations, setSidebarRecommendations] = useState<{ newArrivals: any[], hottest: any[], recommended: any[] }>({ newArrivals: [], hottest: [], recommended: [] });

  useEffect(() => {
    const initData = async () => {
      const [prods, cats, sideRecs] = await Promise.all([
        shopService.getProducts(),
        shopService.getCategories(),
        shopService.getSidebarRecommendations()
      ]);
      setProductsList(prods);
      setShopCategories(cats);
      setSidebarRecommendations(sideRecs);
    };
    initData();
  }, []);

  // Helper to dynamically get the active price
  const getActivePrice = (product: Product, sku?: ProductSku | null) => {
    return sku ? sku.price : product.price;
  };

  // Synchronize SKU selection upon changing product detail focus
  useEffect(() => {
    if (selectedProduct && selectedProduct.skus && selectedProduct.skus.length > 0) {
      setSelectedSku(selectedProduct.skus[0]);
    } else {
      setSelectedSku(null);
    }
  }, [selectedProduct]);

  const handleAddToCart = (product: Product, sku?: ProductSku | null, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Choose selected or default to the first SKU if available
    const actualSku = sku || (product.skus && product.skus.length > 0 ? product.skus[0] : undefined);
    
    // Check if item is already in cart with exact SKU
    const existingIndex = cart.findIndex(item => {
      if (item.product.id !== product.id) return false;
      if (actualSku && item.selectedSku) {
        return item.selectedSku.id === actualSku.id;
      }
      return !actualSku && !item.selectedSku;
    });

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, selectedSku: actualSku || undefined, quantity: 1 }]);
    }
    
    const skuSuffix = actualSku ? ` (${actualSku.name})` : '';
    toast.success(`🛒 ${product.name}${skuSuffix} successfully added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, skuId: string | undefined, delta: number) => {
    const newCart = cart.map(item => {
      const isMatch = item.product.id === productId && 
                      ((!skuId && !item.selectedSku) || (skuId && item.selectedSku && item.selectedSku.id === skuId));
      if (isMatch) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null);
    
    saveCart(newCart);
  };

  const handleRemoveFromCart = (productId: string, skuId: string | undefined) => {
    const newCart = cart.filter(item => {
      const isMatch = item.product.id === productId && 
                      ((!skuId && !item.selectedSku) || (skuId && item.selectedSku && item.selectedSku.id === skuId));
      return !isMatch;
    });
    saveCart(newCart);
    toast.info('Item removed from cart.');
  };

  const handleClearCart = () => {
    saveCart([]);
    toast.info('Cart cleared.');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const activePrice = getActivePrice(item.product, item.selectedSku);
      return total + activePrice * item.quantity;
    }, 0);
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty, go pick some good stuff!');
      return;
    }
    
    setCheckoutItems(cart);
    setIsBuyNow(false);
    
    setShowCart(false); // Hide the shopping cart drawer during checkout
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product, sku?: ProductSku | null) => {
    const actualSku = sku || (product.skus && product.skus.length > 0 ? product.skus[0] : undefined);
    const buyNowItem: CartItem = { product, selectedSku: actualSku || undefined, quantity: 1 };
    
    setCheckoutItems([buyNowItem]);
    setIsBuyNow(true);
    
    setSelectedProduct(null); // Close detail modal
    setShowCart(false);
    setIsCheckoutOpen(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('📋 Coupon code successfully copied to clipboard.');
  };

  const handleSubmitComment = (productId: string, commentText: string) => {
    const userCommentId = `com-${Math.random().toString(36).substr(2, 9)}`;
    const commentTime = 'Just now';
    const userComment = {
      id: userCommentId,
      user: '@anonymous_geek',
      avatar: '💻',
      time: commentTime,
      question: commentText,
    };
    
    const updatedProducts = productsList.map(prod => {
      if (prod.id === productId) {
        const currentComments = prod.comments || [];
        return {
          ...prod,
          comments: [userComment, ...currentComments]
        };
      }
      return prod;
    });
    
    setProductsList(updatedProducts);
    const currentSelected = updatedProducts.find(p => p.id === productId);
    if (currentSelected) {
      setSelectedProduct(currentSelected);
    }
    toast.success('💬 Comment posted successfully! Seller is replying...');
    
    setTimeout(() => {
      const answersPreset = [
        'Great question! The item works perfectly and comes with various dev scripts.',
        'Very professional question, tested on Linux 2.6+ kernels, mounts instantly!',
        'Absolutely! Supports hot-plugging and stable long connections under heavy load.',
        'Personal collection in mint condition, ships with a custom geek cable.'
      ];
      
      const randomAnswer = answersPreset[Math.floor(Math.random() * answersPreset.length)];
      
      const replProducts = updatedProducts.map(prod => {
        if (prod.id === productId) {
          const coms = prod.comments || [];
          const updatedComs = coms.map(c => {
            if (c.id === userCommentId) {
              return {
                ...c,
                reply: {
                  user: prod.sellerName || 'Seller',
                  time: '1s ago',
                  answer: randomAnswer
                }
              };
            }
            return c;
          });
          return { ...prod, comments: updatedComs };
        }
        return prod;
      });
      
      setProductsList(replProducts);
      const updatedSelect = replProducts.find(p => p.id === productId);
      const originalSelect = productsList.find(p => p.id === productId);
      if (updatedSelect) {
        setSelectedProduct(updatedSelect);
      }
      toast.info(`🔔 Seller [${originalSelect?.sellerName || 'Owner'}] replied to your question!`);
    }, 1800);
  };

  const handleApplyPublisherSubmit = () => {
    setIsPublisher(true);
    setShowApplyPublisher(false);
  };

  const handlePublishSubmit = (newProd: Product) => {
    setProductsList([newProd, ...productsList]);
    setShowPublishProduct(false);
  };

  const filteredProducts = productsList.filter(product => {
    let matchesTab = false;
    
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'compute-network') {
      matchesTab = product.category === 'api-credits' || product.category === 'keys';
    } else if (activeTab === 'api-credits') {
      matchesTab = product.category === 'api-credits';
    } else if (activeTab === 'keys') {
      matchesTab = product.category === 'keys';
    } else if (activeTab === 'hardware-all') {
      matchesTab = product.category === 'hardware';
    } else if (activeTab === 'hardware-mcp') {
      matchesTab = product.id === 'prod-mcp-hw-node';
    } else if (activeTab === 'hardware-diy') {
      matchesTab = product.id === 'prod-used-raspi';
    } else if (activeTab === 'merchandise-all') {
      matchesTab = product.category === 'merchandise';
    } else if (activeTab === 'merchandise-apparel') {
      matchesTab = product.id === 'prod-hoodie-code';
    } else if (activeTab === 'merchandise-peripherals') {
      matchesTab = product.id === 'prod-custom-keycap' || product.id === 'prod-mechanical-keyboard';
    } else {
      matchesTab = product.category === activeTab;
    }

    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sellerName && product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    onClearTarget?.();
  };

  if (!isActiveMenu) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <CartDrawer 
            isOpen={showCart} 
            onClose={() => {
              setShowCart(false);
              onClearTarget?.();
            }} 
            onCheckout={handleOpenCheckout} 
            getActivePrice={getActivePrice} 
          />
          <ShopCheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={closeCheckout} 
            checkoutItems={checkoutItems} 
            isBuyNow={isBuyNow} 
            onSuccessNavigate={() => {
              closeCheckout();
              setShowOrders(true);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-hidden relative select-none">
      
      {/* Decorative radial gradients */}
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-primary-main/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-96 h-96 rounded-full bg-primary-hover/5 blur-[150px] pointer-events-none" />

      {/* Header Area removed per user instruction. Orders & Cart buttons integrated into AppHeader. */}

      {/* Main Content Area */}
      {showOrders ? (
        <OrdersPage onBack={() => {
          setShowOrders(false);
          onClearTarget?.();
        }} />
      ) : (
        <div className={`flex-1 flex overflow-y-auto no-scrollbar p-4 gap-4 items-start relative ${!isActiveMenu ? 'hidden' : ''}`}>
          
          {/* Left Sidebar Categories Tree */}
          {!selectedProduct && (
            <LeftSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedNodes={expandedNodes}
              setExpandedNodes={setExpandedNodes}
            />
          )}

        {/* Left Side Catalog filtering and store content */}
        <div className="flex-1 flex flex-col p-6 bg-panel md:rounded-2xl border-x md:border border-divider space-y-6 min-h-0">
          
          {selectedProduct ? (
            /* PRODUCT DETAILS VIEW */
            <ProductDetailsView
              product={selectedProduct}
              selectedSku={selectedSku}
              onSelectSku={setSelectedSku}
              onBack={() => setSelectedProduct(null)}
              getActivePrice={getActivePrice}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSubmitComment={handleSubmitComment}
            />
          ) : (
            /* CATALOG LISTING VIEW */
            <div className="space-y-6">
              
              {/* Top Action Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-divider p-4 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('shop:txt_1054')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-panel border border-divider-strong rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main placeholder:text-text-muted"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  {!isPublisher ? (
                    <button
                      onClick={() => setShowApplyPublisher(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      {t('shop:txt_1044')}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPublishProduct(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plus size={16} />
                      {t('shop:txt_1045')}
                    </button>
                  )}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  return (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      onClick={(p) => setSelectedProduct(p)}
                      onAddToCart={handleAddToCart}
                    />
                  );
                })}
              </div>

              {/* Secure Trust Stamp */}
              <div className="p-4 rounded-xl border border-dashed border-divider bg-black/10 flex items-center gap-3 text-xs max-w-4xl">
                <AlertCircle size={15} className="text-primary-light shrink-0" />
                <span className="text-text-muted">
                  {t('shop:txt_1046')}<strong>{t('shop:txt_1047')}</strong> {t('shop:txt_1048')}<strong>{t('shop:txt_1049')}</strong>{t('shop:txt_1050')}
                </span>
              </div>
            </div>
          )}
        </div>

          {/* Right Sidebar Recommended */}
          {!selectedProduct && (
            <div className="w-72 shrink-0 bg-panel border border-divider rounded-2xl p-4 hidden xl:flex flex-col gap-4 sticky top-4 h-fit">
            
            {/* New Arrivals Card */}
            <div className="bg-surface/30 border border-divider rounded-xl p-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1 flex justify-between items-center">
                {t('shop:new_arrivals')}
                <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">NEW</span>
              </h3>
              <div className="space-y-1">
                {sidebarRecommendations.newArrivals.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center group cursor-pointer p-1.5 rounded-lg hover:bg-surface transition-colors border border-transparent hover:border-divider">
                    <div className="w-9 h-9 rounded-md bg-surface border border-divider flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-text-main group-hover:text-primary-light transition-colors truncate">{item.title}</h4>
                      <div className="text-[9px] text-text-muted mt-0.5 truncate">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hottest Card */}
            <div className="bg-surface/30 border border-divider rounded-xl p-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1 flex justify-between items-center">
                {t('shop:hottest')}
                <span className="text-[9px] bg-primary-main/10 text-primary-main px-1.5 py-0.5 rounded border border-primary-main/20 font-mono">HOT 🔥</span>
              </h3>
              <div className="space-y-1">
                {sidebarRecommendations.hottest.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center group cursor-pointer p-1.5 rounded-lg hover:bg-surface transition-colors border border-transparent hover:border-divider">
                    <div className="w-9 h-9 rounded-md bg-surface border border-divider flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1 flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                        <h4 className="text-[11px] font-bold text-text-main group-hover:text-primary-light transition-colors truncate">{item.title}</h4>
                        <div className="text-[9px] text-text-muted mt-0.5 truncate">{item.desc}</div>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted/50 font-bold italic">#{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Card */}
            <div className="bg-panel border border-primary-main/20 rounded-xl p-3 shadow-[0_0_15px_var(--color-primary-alpha)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-main/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
              <h3 className="text-xs font-bold text-primary-light uppercase tracking-wider mb-3 px-1 flex justify-between items-center relative z-10">
                {t('shop:recommended')}
                <span className="text-[9px] bg-primary-main/10 text-primary-light px-1.5 py-0.5 rounded border border-primary-main/20 font-mono">REC 💎</span>
              </h3>
              <div className="space-y-1 relative z-10">
                {sidebarRecommendations.recommended.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center group cursor-pointer p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-divider">
                    <div className="w-9 h-9 rounded-md bg-black/40 border border-divider flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-text-main group-hover:text-primary-light transition-colors truncate">{item.title}</h4>
                      <div className="text-[9px] text-text-muted mt-0.5 truncate">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
      )}

      {/* CHECKOUT CONSOLE MODAL */}
      <ShopCheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={closeCheckout} 
        checkoutItems={checkoutItems} 
        isBuyNow={isBuyNow} 
        onSuccessNavigate={() => {
          closeCheckout();
          setShowOrders(true);
        }} 
      />
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={showCart} 
        onClose={() => {
          setShowCart(false);
          onClearTarget?.();
        }} 
        onCheckout={handleOpenCheckout} 
        getActivePrice={getActivePrice} 
      />

      {/* Apply Publisher Modal */}
      {showApplyPublisher && (
        <ApplyPublisherModal 
          onClose={() => setShowApplyPublisher(false)}
          onSubmit={handleApplyPublisherSubmit}
        />
      )}

      {/* Publish Product Modal */}
      {showPublishProduct && (
        <PublishProductModal 
          onClose={() => setShowPublishProduct(false)}
          onSubmit={handlePublishSubmit}
        />
      )}

    </div>
  );
}

function CategoryTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
        active 
          ? 'bg-primary-hover/10 text-primary-light border-primary-hover/25 shadow-sm font-extrabold'
          : 'bg-surface-hover border-divider text-text-main/80 hover:text-text-main/80 hover:border-divider'
      }`}
    >
      {label}
    </button>
  );
}
