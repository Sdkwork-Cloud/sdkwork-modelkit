import React, { useState, useRef, useEffect } from 'react';
import { Server, MessageSquare, Video, Image as ImageIcon, Music, Mic, ExternalLink, Zap, Plus, X, Sparkles, Activity, ShieldCheck, ChevronLeft, ArrowUpRight, Search, Upload, GitBranch, FolderArchive, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@sdkwork/modelkit-core';
import { relayService } from '../services/RelayService';
import { RelayNode } from '../services/types';
import { SubmitRelayModal } from './modals/SubmitRelayModal';
import { RelayDetailsView } from './RelayDetailsView';

function renderCategoryIcon(id: string) {
  switch (id) {
    case 'LLM': return <MessageSquare size={14} />;
    case 'Official': return <Server size={14} />;
    case 'Image': return <ImageIcon size={14} />;
    case 'Video': return <Video size={14} />;
    default: return <Server size={14} />;
  }
}

export function RelayPage() {
  const { t } = useAppContext();
  const [selectedRelay, setSelectedRelay] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [relayList, setRelayList] = useState<RelayNode[]>([]);
  const [categoriesList, setCategoriesList] = useState<{id: string; label: string}[]>([]);

  useEffect(() => {
    relayService.getRelayNodes().then(setRelayList);
    relayService.getCategories().then(setCategoriesList);
  }, []);

  const filteredList = relayList.filter(s => {
    const matchCat = selectedCategory ? s.category === selectedCategory : true;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filteredList.length > 0 ? filteredList[0] : null;
  const hotList = filteredList.slice(1, 4);
  const others = filteredList.slice(4);

  return (
    <div className="flex-1 flex overflow-hidden bg-canvas text-text-main relative">
      {/* Sidebar Navigation */}
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0 transition-opacity duration-300">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <Server size={16} className="text-text-muted" />
            {t('relay:websites')}
          </h2>
        </div>
        
        <div className="relative px-3 mb-6">
          <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder={t('relay:search_sites')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-divider hover:border-[#3B82F6]/30 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-main/40 focus:ring-1 focus:ring-blue-500/20 transition-all text-text-main placeholder-gray-500 font-sans" 
          />
        </div>

        <div className="flex-1 px-3 space-y-1">
          <div className="text-[10px] uppercase font-semibold tracking-widest text-text-muted px-3 py-2 select-none">{t('relay:discover')}</div>
          <button onClick={() => setSelectedCategory(null)} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${selectedCategory === null ? 'text-primary-light bg-primary-main/10 border border-primary-main/10' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}>
            <Sparkles size={14} />{t('relay:featured')}
          </button>
          
          <div className="text-[10px] uppercase font-semibold tracking-widest text-text-muted px-3 pt-6 pb-2 select-none">{t('relay:categories')}</div>
          {categoriesList.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${selectedCategory === cat.id ? 'text-primary-light bg-primary-main/10 border border-primary-main/10' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}>
              <span className={selectedCategory === cat.id ? 'text-primary-light' : 'text-text-muted'}>{renderCategoryIcon(cat.id)}</span> {cat.label}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_12px_var(--color-primary-alpha)] flex items-center justify-center gap-2"
          >
            <Plus size={14} /> {t('relay:submit_site')}
          </button>
        </div>
      </div>

      {/* Main Discover Layout */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${selectedRelay ? 'hidden' : 'block'}`}>
        <div className="w-full p-6 lg:p-8 pb-20">
          
          {/* Hero Banner */}
          {featured && (
            <div 
              onClick={() => setSelectedRelay(featured.id)}
              className="group relative h-[280px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl mb-12"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${featured.banner} opacity-90 transition-transform duration-700 ease-out group-hover:scale-105`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-2 flex items-center gap-1.5"><ShieldCheck size={12}/> {t('relay:editor_s_choice')}</div>
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{featured.name}</h1>
                  <p className="text-lg text-white/80 max-w-lg leading-snug font-medium line-clamp-2">{featured.desc}</p>
                </div>
                <div className="flex flex-col items-center">
                  <button className={`px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform`}>
                    OPEN API
                  </button>
                  {featured.free && <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-2">Free Tier</span>}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {/* Hot List */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-divider pb-2">
                <h2 className="text-[15px] font-bold tracking-tight text-text-main">{selectedCategory ? t('relay:featured') : t('relay:top_services')}</h2>
                <button className="text-xs font-semibold text-primary-main hover:text-primary-light">{t('relay:see_all')}</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-b border-divider pb-4">
                {hotList.map(relay => (
                  <div key={relay.id} className="group flex items-center justify-between p-4.5 border border-divider bg-surface rounded-2xl hover:bg-surface hover:border-[#3B82F6]/30 cursor-pointer transition-all" onClick={() => setSelectedRelay(relay.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface-hover border border-divider flex items-center justify-center text-text-muted group-hover:text-primary-light group-hover:bg-primary-hover/10 group-hover:border-[var(--color-primary-alpha)] transition-all shrink-0">
                        <Server size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[14px] text-text-main group-hover:text-primary-light transition-colors truncate">{relay.name}</h3>
                        <p className="text-[11px] text-text-muted font-medium truncate mt-0.5">{relay.category}</p>
                      </div>
                    </div>
                    <button className="shrink-0 w-[64px] py-1.5 rounded-xl text-[11px] font-bold bg-surface text-text-main shadow-md hover:scale-105 transition-all text-center ml-2">
                      VIEW
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Others List */}
            <div className="xl:col-span-1 2xl:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-divider pb-2">
                <h2 className="text-[15px] font-bold tracking-tight text-text-main">{selectedCategory ? t('relay:more') : t('relay:more_endpoints')}</h2>
                <button className="text-xs font-semibold text-primary-main hover:text-primary-light">{t('relay:see_all')}</button>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 border-b border-divider pb-4">
                {others.map(relay => (
                  <div key={relay.id} className="group flex items-center justify-between p-4.5 border border-divider bg-surface rounded-2xl hover:bg-surface hover:border-[#3B82F6]/30 cursor-pointer transition-all" onClick={() => setSelectedRelay(relay.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface-hover border border-divider flex items-center justify-center text-text-muted group-hover:text-primary-light group-hover:bg-primary-hover/10 group-hover:border-[var(--color-primary-alpha)] transition-all shrink-0">
                        <Server size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[14px] text-text-main group-hover:text-primary-light transition-colors truncate">{relay.name}</h3>
                        <p className="text-[11px] text-text-muted font-medium truncate mt-0.5">{relay.category}</p>
                      </div>
                    </div>
                    <button className="shrink-0 w-[64px] py-1.5 rounded-xl text-[11px] font-bold bg-surface text-text-main shadow-md hover:scale-105 transition-all text-center ml-2">
                      VIEW
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details View (Overlay) */}
      {selectedRelay && (
        <div className="flex-1 flex flex-col h-full bg-canvas animate-in slide-in-from-right-8 duration-300">
          <RelayDetailsView
            relay={relayList.find(r => r.id === selectedRelay)!}
            onBack={() => setSelectedRelay(null)}
          />
        </div>
      )}

      {/* Submit Relay Modal */}
      <SubmitRelayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoriesList={categoriesList}
        onRelaySubmitted={(newSite) => setRelayList([newSite, ...relayList])}
      />
    </div>
  );
}
