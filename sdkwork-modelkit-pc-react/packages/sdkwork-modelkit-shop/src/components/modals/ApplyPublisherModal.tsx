import { useAppContext } from '@sdkwork/modelkit-core';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ApplyPublisherModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

export function ApplyPublisherModal({ onClose, onSubmit }: ApplyPublisherModalProps) {
  const { t } = useAppContext();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    toast.success('Publisher application approved in test environment, you can now publish items!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-panel border gap-4 border-divider-strong rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-text-main mb-2">{t('shop:txt_1056')}</h3>
        <p className="text-sm text-text-muted mb-6">{t('shop:txt_1057')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1058')}</label>
            <input required type="text" placeholder={t('shop:txt_1066')} className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1059')}</label>
            <select className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main h-10 appearance-none">
              <option value="compute">{t('shop:txt_1060')}</option>
              <option value="hardware">{t('shop:txt_1061')}</option>
              <option value="diy">{t('shop:txt_1062')}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('shop:txt_1063')}</label>
            <input type="text" placeholder={t('shop:txt_1067')} className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-main transition-all text-text-main" />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-divider mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-main hover:bg-surface transition-colors cursor-pointer border border-transparent">
              {t('shop:txt_1064')}
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg transition-all cursor-pointer">
              {t('shop:txt_1065')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
