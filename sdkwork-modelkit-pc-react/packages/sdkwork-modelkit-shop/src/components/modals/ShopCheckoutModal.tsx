import { useAppContext } from '@sdkwork/modelkit-core';
import React, { useState, useEffect } from 'react';
import { Cpu, CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { CartItem, Product, ProductSku } from '../../types';
import { useCartStorage } from '../../hooks';
import { shopService } from '../../services/ShopService';

interface ShopCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutItems: CartItem[];
  isBuyNow: boolean;
  onSuccessNavigate: () => void;
}

export function ShopCheckoutModal({
  isOpen,
  onClose,
  checkoutItems,
  isBuyNow,
  onSuccessNavigate,
}: ShopCheckoutModalProps) {
  const { t } = useAppContext();
  const { saveCart } = useCartStorage();

  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [walletBalance, setWalletBalance] = useState(0);
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    shopService.getWalletBalance().then(setWalletBalance);
    setAddressName('');
    setAddressPhone('');
    setAddressDetail('');
    setCheckoutStep('form');
  }, [isOpen, checkoutItems]);

  if (!isOpen) {
    return null;
  }

  const getActivePrice = (product: Product, sku?: ProductSku | null) => {
    return sku ? sku.price : product.price;
  };

  const getCheckoutTotal = () => {
    return checkoutItems.reduce((total, item) => {
      const activePrice = getActivePrice(item.product, item.selectedSku);
      return total + activePrice * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    const hasPhysical = checkoutItems.some((item) => item.product.type === 'physical');
    if (hasPhysical && (!addressName.trim() || !addressPhone.trim() || !addressDetail.trim())) {
      toast.error('Incomplete shipping address, please fill it out!');
      return;
    }

    const total = getCheckoutTotal();
    if (walletBalance < total) {
      toast.error('Insufficient wallet balance. Add funds in Account settings.');
      return;
    }

    setCheckoutStep('processing');
    try {
      await shopService.checkout({
        items: checkoutItems,
        paymentMethod: 'wallet',
        shippingAddress: hasPhysical
          ? { name: addressName, phone: addressPhone, address: addressDetail }
          : undefined,
        clearCart: !isBuyNow,
      });
      if (!isBuyNow) {
        await saveCart([]);
      }
      setWalletBalance(await shopService.getWalletBalance());
      setCheckoutStep('success');
      toast.success('Payment completed. Orders saved to your account.');
    } catch (error) {
      setCheckoutStep('form');
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface border border-divider rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {checkoutStep === 'form' && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2.5">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest flex justify-between items-center">
                {t('shop:txt_1089')}
                <button onClick={onClose} className="text-text-muted hover:text-text-main text-lg font-black">&times;</button>
              </label>
              <div className="p-3.5 rounded-2xl bg-panel border border-divider text-xs space-y-3.5">
                {checkoutItems.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSku?.id ?? 'default'}`} className="flex justify-between items-start text-text-main/80">
                    <span className="flex-1 truncate pr-4 text-text-main">
                      {item.product.imageUrl || '🏷️'} {item.product.name}{' '}
                      <span className="text-primary-light font-bold font-mono">x {item.quantity}</span>
                    </span>
                    <strong className="text-text-main/80 font-mono font-bold shrink-0">
                      ¥ {getActivePrice(item.product, item.selectedSku) * item.quantity}
                    </strong>
                  </div>
                ))}
                <div className="flex justify-between items-center text-text-main/80 pt-3 border-t border-divider">
                  <span className="text-xs font-bold text-text-main/80">{t('shop:txt_1090')}</span>
                  <strong className="text-xl font-black text-primary-main font-mono">¥ {getCheckoutTotal()}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary-main/5 border border-primary-main/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                <CreditCard size={16} className="text-primary-main" />
                Wallet balance
              </div>
              <span className="font-mono text-primary-main font-black">¥ {walletBalance.toFixed(2)}</span>
            </div>

            {checkoutItems.some((item) => item.product.type === 'physical') && (
              <div className="space-y-3 bg-surface-hover/30 border border-divider-strong p-4.5 rounded-2xl">
                <label className="text-xs font-bold text-text-main">Shipping address</label>
                <input
                  type="text"
                  value={addressName}
                  onChange={(event) => setAddressName(event.target.value)}
                  placeholder="Recipient name"
                  className="w-full bg-panel border border-divider rounded-lg px-3 py-2 text-xs text-text-main"
                />
                <input
                  type="text"
                  value={addressPhone}
                  onChange={(event) => setAddressPhone(event.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-panel border border-divider rounded-lg px-3 py-2 text-xs text-text-main"
                />
                <textarea
                  value={addressDetail}
                  onChange={(event) => setAddressDetail(event.target.value)}
                  placeholder="Full address"
                  rows={2}
                  className="w-full bg-panel border border-divider rounded-lg px-3 py-2 text-xs text-text-main resize-none"
                />
              </div>
            )}

            <div className="pt-2 border-t border-divider flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-text-main/80 hover:text-text-main cursor-pointer">
                {t('shop:txt_1102')}
              </button>
              <button
                onClick={handlePlaceOrder}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-primary-main hover:bg-primary-hover text-text-main cursor-pointer"
              >
                Pay with wallet
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-main/20 border-t-primary-hover rounded-full animate-spin" />
              <Cpu size={24} className="text-primary-main absolute top-5 left-5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-text-main">{t('shop:txt_1114')}</h4>
              <p className="text-xs text-text-muted">Charging wallet and issuing virtual fulfillment codes.</p>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-text-main">{t('shop:txt_1116')}</h4>
              <p className="text-xs text-text-main/80 max-w-sm leading-relaxed">
                Your order is saved under Account orders. Virtual coupon codes are available immediately.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-4 border-t border-divider/50 w-full justify-center">
              <button
                onClick={onSuccessNavigate}
                className="px-5 py-2 rounded-xl text-xs font-bold border border-divider text-text-main/80 hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
              >
                {t('shop:txt_1120')}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-surface text-text-main hover:bg-surface-hover transition-all cursor-pointer"
              >
                {t('shop:txt_1121')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
