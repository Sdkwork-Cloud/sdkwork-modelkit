import React, { useState, useEffect } from 'react';
import { useAppContext } from '@sdkwork/modelkit-core';
import { Search, Copy, Heart, Check, PlaySquare, Image as ImageIcon, Music, Zap, TerminalSquare, AudioWaveform, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { promptsService, PromptItem, PromptCategory } from '../services/PromptsService';

export function PromptsPage() {
  const { t } = useAppContext();
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<PromptCategory[]>([]);

  useEffect(() => {
    promptsService.getPrompts().then(setPrompts);
    promptsService.getCategories().then(setCategories);
  }, []);

  const renderIcon = (type: string) => {
    switch(type) {
      case 'terminal': return <TerminalSquare size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'video': return <PlaySquare size={14} />;
      case 'music': return <Music size={14} />;
      case 'sound': return <AudioWaveform size={14} />;
      case 'zap': 
      default: return <Zap size={14} />;
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesType = activeType === 'all' || p.type === activeType;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success(t('prompts:copied', 'Prompt copied to clipboard!'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-canvas text-text-main font-sans">
      
      {/* Sidebar for Prompts Navigation */}
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <Sparkles size={16} className="text-text-muted" />
            {t('prompts:prompts_title', 'Prompt Engine')}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveType(c.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeType === c.id 
                  ? 'bg-primary-main/10 text-primary-light font-bold' 
                  : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main'
              }`}
            >
              <div className={activeType === c.id ? 'text-primary-light' : 'text-text-muted/70'}>
                {renderIcon(c.iconType)}
              </div>
              {t(c.label, c.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-surface/30">
        <div className="shrink-0 px-8 h-16 border-b border-divider bg-panel flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black text-text-main font-display">{categories.find(c => c.id === activeType) ? t(categories.find(c => c.id === activeType)!.label, categories.find(c => c.id === activeType)!.label) : ''}</h1>
            <div className="h-4 w-px bg-divider"></div>
            <p className="text-xs text-text-muted hidden sm:block">{t('prompts:prompts_desc', 'Multimodal system-level prompt collection designed for advanced creators')}</p>
          </div>

          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder={t('prompts:search_placeholder', 'Search prompt resources...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-hover border border-divider rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-primary-main focus:bg-surface transition-all text-text-main placeholder-text-muted/60"
            />
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {filteredPrompts.length === 0 ? (
            <div className="w-full h-40 flex items-center justify-center text-text-muted text-sm font-medium">
              {t('prompts:no_results', 'No matching prompts found')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPrompts.map(prompt => (
                <div key={prompt.id} className="bg-surface border border-divider hover:border-primary-main/30 rounded-xl p-5 flex flex-col transition-all group hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-muted group-hover:text-primary-light transition-colors">
                        {renderIcon(categories.find(c => c.id === prompt.type)?.iconType || 'zap')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-main line-clamp-1" title={prompt.title}>{prompt.title}</h3>
                        <div className="text-[10px] text-text-muted mt-0.5">{t('prompts:author', 'Author: ')}{prompt.author}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-surface-hover rounded-lg p-3 mb-4 text-xs text-text-main font-mono leading-relaxed line-clamp-4 relative text-opacity-80">
                    {prompt.content}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-hover to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-[10px] text-text-muted font-medium flex items-center gap-1">
                      <Heart size={10} className="text-red-400" />
                      {t('prompts:views_count', '{count} uses').replace('{count}', prompt.views.toString())}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleCopy(prompt.id, prompt.content)}
                        className={`p-1.5 rounded-md transition-all flex items-center justify-center ${copiedId === prompt.id ? 'bg-emerald-500/10 text-emerald-500 border-transparent' : 'bg-surface border border-divider text-text-muted hover:text-primary-light hover:border-primary-main/30'}`}
                        title={t('prompts:btn_copy', 'Copy Prompt')}
                      >
                        {copiedId === prompt.id ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                      <button className="px-3 py-1.5 rounded-md bg-primary-main hover:bg-primary-hover text-white text-[11px] font-bold transition-all">
                        {t('prompts:btn_use', 'Use')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
