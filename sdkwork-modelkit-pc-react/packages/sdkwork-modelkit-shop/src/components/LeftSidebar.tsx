import React from 'react';
import { Package, ChevronRight, Sparkles, Cpu, Tag } from 'lucide-react';
import { useAppContext } from '@sdkwork/modelkit-core';

interface LeftSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedNodes: Record<string, boolean>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function LeftSidebar({
  activeTab,
  setActiveTab,
  expandedNodes,
  setExpandedNodes
}: LeftSidebarProps) {
  const { t } = useAppContext();

  return (
    <div className="w-56 shrink-0 bg-panel border border-divider rounded-2xl p-4 flex flex-col gap-2.5 hidden md:flex sticky top-4 h-fit max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-1 px-1">
        <h3 className="text-xs font-black text-text-muted uppercase tracking-wider">{t('shop:category_tree')}</h3>
        <span className="text-[9px] bg-primary-hover/10 text-primary-light px-1.5 py-0.5 rounded font-bold font-mono">TREE</span>
      </div>
      
      <button 
        onClick={() => setActiveTab('all')} 
        className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer border ${activeTab === 'all' ? 'bg-primary-main/15 text-primary-light border-primary-hover/30 font-bold' : 'text-text-main/85 hover:bg-surface border-transparent'}`}
      >
        <Package size={14} className="text-primary-light shrink-0" />
        <span className="truncate">{t('shop:all_assets')}</span>
      </button>

      <div className="h-px bg-divider my-1"></div>

      <div className="space-y-3">
        {/* 1. Compute & Net Parent Node */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedNodes(prev => ({ ...prev, compute: !prev.compute }))}
            className="w-full flex items-center justify-between text-left px-1.5 py-1 text-[11px] font-bold text-text-muted hover:text-text-main transition-colors group cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <ChevronRight size={13} className={`transition-transform duration-200 shrink-0 ${expandedNodes.compute ? 'rotate-90' : ''}`} />
              <Sparkles size={12} className="text-primary-light shrink-0" />
              <span className="truncate font-bold text-text-muted group-hover:text-text-main">{t('shop:compute_network')}</span>
            </span>
          </button>
          {expandedNodes.compute && (
            <div className="pl-3.5 border-l border-divider/60 ml-3 space-y-1 animate-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setActiveTab('compute-network')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'compute-network' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'compute-network' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:all_compute_net')}</span>
              </button>
              <button
                onClick={() => setActiveTab('api-credits')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'api-credits' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'api-credits' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:api_credits')}</span>
              </button>
              <button
                onClick={() => setActiveTab('keys')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'keys' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'keys' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:secure_gateways')}</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Hardware Parent Node */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedNodes(prev => ({ ...prev, hardware: !prev.hardware }))}
            className="w-full flex items-center justify-between text-left px-1.5 py-1 text-[11px] font-bold text-text-muted hover:text-text-main transition-colors group cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <ChevronRight size={13} className={`transition-transform duration-200 shrink-0 ${expandedNodes.hardware ? 'rotate-90' : ''}`} />
              <Cpu size={12} className="text-primary-main shrink-0" />
              <span className="truncate font-bold text-text-muted group-hover:text-text-main">{t('shop:hardware_terminals')}</span>
            </span>
          </button>
          
          {expandedNodes.hardware && (
            <div className="pl-3.5 border-l border-divider/60 ml-3 space-y-1 animate-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setActiveTab('hardware-all')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'hardware-all' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'hardware-all' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:all_hardware')}</span>
              </button>
              <button
                onClick={() => setActiveTab('hardware-mcp')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'hardware-mcp' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'hardware-mcp' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:mcp_core_box')}</span>
              </button>
              <button
                onClick={() => setActiveTab('hardware-diy')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'hardware-diy' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'hardware-diy' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:diy_boards_used')}</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Apparel/Gear Parent Node */}
        <div className="space-y-1">
          <button
            onClick={() => setExpandedNodes(prev => ({ ...prev, apparelGear: !prev.apparelGear }))}
            className="w-full flex items-center justify-between text-left px-1.5 py-1 text-[11px] font-bold text-text-muted hover:text-text-main transition-colors group cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <ChevronRight size={13} className={`transition-transform duration-200 shrink-0 ${expandedNodes.apparelGear ? 'rotate-90' : ''}`} />
              <Tag size={12} className="text-teal-400 shrink-0" />
              <span className="truncate font-bold text-text-muted group-hover:text-text-main">{t('shop:apparel_gear')}</span>
            </span>
          </button>
          
          {expandedNodes.apparelGear && (
            <div className="pl-3.5 border-l border-divider/60 ml-3 space-y-1 animate-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setActiveTab('merchandise-all')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'merchandise-all' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'merchandise-all' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:all_merchandise')}</span>
              </button>
              <button
                onClick={() => setActiveTab('merchandise-apparel')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'merchandise-apparel' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'merchandise-apparel' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:apparel_hoodie')}</span>
              </button>
              <button
                onClick={() => setActiveTab('merchandise-peripherals')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'merchandise-peripherals' ? 'bg-primary-main/10 text-primary-light font-bold' : 'text-text-main/70 hover:bg-surface hover:text-text-main'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'merchandise-peripherals' ? 'bg-primary-light animate-pulse' : 'bg-gray-600'}`} />
                <span className="truncate">{t('shop:keyboards_keycaps')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
