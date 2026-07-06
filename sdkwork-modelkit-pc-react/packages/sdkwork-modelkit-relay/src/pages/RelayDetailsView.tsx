import { useAppContext } from '@sdkwork/modelkit-core';
import React from 'react';
import { ChevronLeft, Server, Activity, ArrowUpRight, Copy, Check } from 'lucide-react';
import { RelayNode } from '../services/types';

interface RelayDetailsViewProps {
  relay: RelayNode;
  onBack: () => void;
}

export function RelayDetailsView({ relay, onBack }: RelayDetailsViewProps) {
  const { t } = useAppContext();
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyClone = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="h-14 border-b border-divider flex items-center px-4 shrink-0 bg-panel">
        <button onClick={onBack} className="flex items-center gap-1 text-primary-main hover:text-primary-light text-sm font-semibold transition-colors">
          <ChevronLeft size={18} /> {t('relay:discover')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full mx-auto p-6 lg:p-8">
          
          {/* Header Info */}
          <div className="flex items-start gap-8 mb-10">
            <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-4xl shadow-2xl shrink-0 bg-gradient-to-br ${relay.banner} text-text-main`}>
              <Server size={48} />
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-main">{relay.name}</h1>
                  {relay.free && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Free Tier Available</span>}
                </div>
                <div className="flex flex-col items-end">
                  <a href={relay.url || '#'} target="_blank" rel="noopener noreferrer" className={`w-32 py-2 flex justify-center items-center gap-2 rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-all bg-primary-main text-white hover:bg-primary-hover hover:scale-[1.03]`}>
                    OPEN API <ArrowUpRight size={14} />
                  </a>
                  <span className="text-[10px] text-text-muted mt-3 font-semibold flex items-center gap-1"><Activity size={12} className="text-emerald-500"/> Operational</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-divider">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Base URL</span>
                  <div className="text-sm font-mono mt-1 text-primary-light">{new URL(relay.url || 'https://api.example.com').origin}</div>
                </div>
                <div className="w-px h-8 bg-divider"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Category</span>
                  <div className="text-sm font-bold mt-1 text-text-main">{relay.category}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-divider my-8"></div>

          {/* About */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">{t('relay:txt_1018')}</h3>
            <p className="text-sm text-text-main leading-relaxed font-semibold">
              {relay.desc}
            </p>
          </div>

          {/* Base URL block */}
          {relay.url && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                <Server size={13} className="text-primary-light" />
                {t('relay:txt_1019')}
              </h3>
              <div className="p-4 bg-surface rounded-xl border border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Endpoint URL</p>
                  <div className="flex items-center bg-surface rounded-lg px-3 py-2 border border-divider font-mono text-xs text-primary-light select-all overflow-x-auto custom-scrollbar whitespace-nowrap">
                    {relay.url}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyClone(relay.url || '')}
                    className="px-4 py-2 border border-divider hover:border-[var(--color-primary-alpha)] rounded-xl text-xs font-bold transition-all text-text-main hover:text-text-main flex items-center gap-1.5 bg-surface cursor-pointer select-none"
                  >
                    {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    {copiedLink ? 'Copied' : 'Copy URL'}
                  </button>
                  <a
                    href={relay.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-surface text-text-main flex items-center gap-1 rounded-xl border border-divider hover:border-[var(--color-primary-alpha)] transition-all font-bold text-xs"
                  >
                    Doc <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
