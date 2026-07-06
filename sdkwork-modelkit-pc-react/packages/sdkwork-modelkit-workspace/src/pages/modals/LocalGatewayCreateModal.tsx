import React from 'react';
import { useAppContext } from '@sdkwork/modelkit-core';

interface LocalGatewayCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRouterName: string;
  setNewRouterName: (name: string) => void;
  newRouterPort: number;
  setNewRouterPort: (port: number) => void;
  newRouterProtocols: string[];
  setNewRouterProtocols: (protocols: string[] | ((prev: string[]) => string[])) => void;
  onCreate: () => void;
}

export function LocalGatewayCreateModal({
  isOpen,
  onClose,
  newRouterName,
  setNewRouterName,
  newRouterPort,
  setNewRouterPort,
  newRouterProtocols,
  setNewRouterProtocols,
  onCreate
}: LocalGatewayCreateModalProps) {
  const { t } = useAppContext();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface border border-divider-strong rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-main">{t('workspace:create_workspace_relay', 'Create Workspace Relay')}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            &times;
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">{t('workspace:router_name', 'Router Name')}</label>
            <input 
              type="text" 
              value={newRouterName}
              onChange={e => setNewRouterName(e.target.value)}
              className="w-full bg-panel border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50"
              placeholder={t('workspace:eg_router_name', 'e.g. My Custom Router')}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">{t('workspace:listen_port', 'Listen Port')}</label>
            <input 
              type="number" 
              value={newRouterPort}
              onChange={e => setNewRouterPort(parseInt(e.target.value) || 10000)}
              className="w-full bg-panel border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">{t('workspace:intercept_protocols', 'Intercept Protocols')}</label>
            <div className="space-y-3">
              {['openai', 'anthropic', 'gemini'].map(p => (
                <label key={p} className="flex items-center gap-3 w-fit cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    newRouterProtocols.includes(p) ? 'bg-primary-main border-primary-main' : 'border-text-muted group-hover:border-text-main'
                  }`}>
                    {newRouterProtocols.includes(p) && <div className="w-2 h-2 rounded-sm bg-white" />}
                  </div>
                  <span className="text-sm font-semibold capitalize text-text-main">{p} {t('workspace:compatible', 'Compatible')}</span>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={newRouterProtocols.includes(p)}
                    onChange={(e) => {
                      if (e.target.checked) setNewRouterProtocols(prev => [...prev, p]);
                      else setNewRouterProtocols(prev => prev.filter(x => x !== p));
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-divider bg-panel flex justify-end gap-3 font-sans">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-surface"
          >
            {t('workspace:cancel', 'Cancel')}
          </button>
          <button 
            type="button"
            onClick={onCreate}
            className="px-6 py-2 rounded-lg text-xs font-bold bg-primary-main hover:bg-primary-hover text-white shadow-lg active:scale-[0.98] transition-all"
          >
            {t('workspace:create', 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
