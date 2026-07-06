import { useAppContext } from '@sdkwork/modelkit-core';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Product, ProductType, ProductCategory } from '../../types';

interface PublishProductModalProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export function PublishProductModal({ onClose, onSubmit }: PublishProductModalProps) {
  const { t } = useAppContext();
  const [publishForm, setPublishForm] = useState({
    name: '', type: 'virtual' as ProductType, category: 'all' as ProductCategory,
    price: 0, description: '', longDescription: '', externalUrl: '', imageUrl: '💻', features: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: publishForm.name,
      type: publishForm.type,
      category: publishForm.category,
      price: publishForm.price,
      description: publishForm.description,
      longDescription: publishForm.longDescription,
      imageUrl: publishForm.imageUrl,
      externalUrl: publishForm.externalUrl || undefined,
      features: publishForm.features.split('\n').filter(Boolean),
      specs: {},
      sellerName: 'Official Verified',
      merchantName: 'My Published Items'
    };
    
    onSubmit(newProd);
    toast.success('Product published successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-panel border gap-4 border-divider-strong rounded-3xl p-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-text-main mb-6">{t('shop:txt_1069')}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1070')}</label>
              <input required type="text" value={publishForm.name} onChange={e => setPublishForm({...publishForm, name: e.target.value})} placeholder="e.g. AWS 1-Year Account" className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1072')}</label>
              <input required type="number" min="0" step="0.01" value={publishForm.price || ''} onChange={e => setPublishForm({...publishForm, price: parseFloat(e.target.value) || 0})} placeholder="Price" className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1074')}</label>
              <select value={publishForm.category} onChange={e => setPublishForm({...publishForm, category: e.target.value as ProductCategory})} className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main h-10 appearance-none">
                <option value="all">{t('shop:txt_1075')}</option>
                <option value="api-credits">{t('shop:txt_1076')}</option>
                <option value="hardware">{t('shop:txt_1077')}</option>
                <option value="keys">{t('shop:txt_1078')}</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1079')}</label>
              <input type="text" maxLength={4} value={publishForm.imageUrl} onChange={e => setPublishForm({...publishForm, imageUrl: e.target.value})} placeholder="e.g. 💻" className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main text-center" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1081')}</label>
            <input required type="text" value={publishForm.description} onChange={e => setPublishForm({...publishForm, description: e.target.value})} placeholder="Short highlighted description..." className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1083')}</label>
            <input type="url" value={publishForm.externalUrl} onChange={e => setPublishForm({...publishForm, externalUrl: e.target.value})} placeholder="https://" className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main font-mono text-[13px]" />
            <p className="text-[10px] text-zinc-500">{t('shop:txt_1084')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1085')}</label>
            <textarea rows={4} value={publishForm.features} onChange={e => setPublishForm({...publishForm, features: e.target.value})} placeholder="- Dedicated IP&#10;- Refund Supported&#10;- Advanced Permissions" className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main custom-scrollbar"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-divider">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-main hover:bg-surface transition-colors cursor-pointer border border-transparent">
              {t('shop:txt_1087')}
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all cursor-pointer">
              {t('shop:txt_1088')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
