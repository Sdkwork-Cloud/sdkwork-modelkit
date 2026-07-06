import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Star, X, Settings, Key, Globe, Terminal, Blocks, Zap, Database, Shield, Command, Plug, PenTool, CheckCircle2, Box, ArrowLeft, TerminalSquare, GitBranch, Upload, FolderArchive } from 'lucide-react';
import { useAppContext } from '@sdkwork/modelkit-core';
import { AgentTool } from '@sdkwork/modelkit-types';
import { fetchAgentTools } from '@sdkwork/modelkit-services';
import { toast } from 'sonner';
import { pluginsService } from '../services/PluginsService';
import { PluginItem } from '../services/types';
import { PublishPluginModal } from './modals/PublishPluginModal';
import { InstallPluginModal } from './modals/InstallPluginModal';
import { PluginDetailsView } from './PluginDetailsView';

function renderIcon(iconName: string, className: string = 'text-emerald-500') {
  const props = { size: 22, className };
  switch(iconName) {
    case 'Shield': return <Shield {...props} className="text-emerald-500" />;
    case 'Zap': return <Zap {...props} className="text-emerald-500" />;
    case 'Database': return <Database {...props} className="text-orange-400" />;
    case 'Globe': return <Globe {...props} className="text-orange-400" />;
    case 'Terminal': return <Terminal {...props} className="text-yellow-500" />;
    case 'Blocks': return <Blocks {...props} className="text-emerald-500" />;
    default: return <Box {...props} className="text-emerald-500" />;
  }
}

export function PluginsPage() {
  const { t } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Most downloaded');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGrid, setIsGrid] = useState(false);
  
  const [selectedPlugin, setSelectedPlugin] = useState<number | null>(null);
  const [installModalPlugin, setInstallModalPlugin] = useState<number | null>(null);
  const [agents, setAgents] = useState<AgentTool[]>([]);
  const [selectedFilterAgent, setSelectedFilterAgent] = useState<string>('All');

  // Dynamic plugins list state
  const [pluginsList, setPluginsList] = useState<PluginItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);


  useEffect(() => {
    fetchAgentTools().then(data => {
      setAgents(data);
    });
    
    pluginsService.getPlugins().then(setPluginsList);
    pluginsService.getCategories().then(setCategories);
  }, []);

  const sortOptions = ['Featured', 'Most downloaded', 'Most starred', 'Most installed', 'Recently updated', 'Newest', 'Name'];

  const filteredPlugins = useMemo(() => {
    let result = pluginsList.filter(plugin => {
      const matchCat = selectedCategory === 'All' ? true : selectedCategory === 'Installed' ? plugin.installedAgents.length > 0 : plugin.type === selectedCategory;
      const matchAgent = selectedFilterAgent === 'All' ? true : plugin.installedAgents.includes(selectedFilterAgent);
      const matchSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || plugin.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchAgent && matchSearch;
    });

    const parseNum = (str: string | number) => {
      if (typeof str === 'number') return str;
      const s = String(str);
      if (s.endsWith('k')) return parseFloat(s) * 1000;
      if (s.endsWith('m')) return parseFloat(s) * 1000000;
      return parseFloat(s);
    };
    
    const parseTime = (str: string) => {
      if (str.includes('h')) return parseInt(str);
      if (str.includes('d')) return parseInt(str) * 24;
      return 999;
    };

    result.sort((a, b) => {
      switch (selectedSort) {
        case 'Most downloaded':
        case 'Most installed':
          return parseNum(b.downloads) - parseNum(a.downloads);
        case 'Most starred':
          return parseNum(b.rating) - parseNum(a.rating);
        case 'Recently updated':
        case 'Newest':
          return parseTime(a.updated) - parseTime(b.updated);
        case 'Name':
          return a.name.localeCompare(b.name);
        case 'Featured':
        default:
          return 0; // maintain original order for 'Featured'
      }
    });

    return result;
  }, [selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="flex flex-1 h-full bg-canvas text-text-main font-sans overflow-hidden">
      {/* Sidebar for Store Navigation */}
      {!selectedPlugin && (
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0 h-full">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <Blocks size={16} className="text-text-muted" />
            {t('plugins:plugin_store')}
          </h2>
        </div>

        <div className="relative px-3 mb-5">
          <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder={t('plugins:search_plugins')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-divider rounded-lg pl-8.5 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-main/50 transition-colors text-text-main placeholder:text-text-muted" 
          />
        </div>

        <div className="flex-1 px-2.5 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 py-1.5">{t('software:discover')}</div>
          
          <button 
            onClick={() => setSelectedCategory('All')} 
            className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedCategory === 'All' 
                ? 'text-primary-light bg-primary-main/10 font-bold border border-primary-main/10' 
                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            All Plugins
          </button>
          
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 pt-5 pb-1.5">{t('software:categories')}</div>
          {categories.filter(c => c !== 'All').map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat 
                  ? 'text-primary-light bg-primary-main/10 font-bold border border-primary-main/10' 
                  : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {t(cat, cat)}
            </button>
          ))}
        </div>

        <div className="p-3 mt-auto border-t border-divider">
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            className="w-full py-2 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            <Upload size={14} className="inline-block" />
            {t('plugins:publish')}
          </button>
        </div>
      </div>
      )}

      {/* Main Container */}
      {!selectedPlugin ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6 lg:p-8">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[24px] font-semibold tracking-tight text-text-main flex items-baseline gap-3">
              {selectedCategory === 'All' ? 'All Plugins' : t(selectedCategory, selectedCategory)} <span className="text-sm text-text-muted font-normal">{filteredPlugins.length} found</span>
            </h1>
          </div>

          {/* Top Filter Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 bg-surface/50 p-4 rounded-xl border border-divider">
            <div className="flex items-center gap-2 overflow-x-auto stylish-scrollbar pb-1 xl:pb-0 hide-scrollbar-on-desktop">
              <div className="flex items-center gap-2">
                <select 
                  value={selectedFilterAgent}
                  onChange={(e) => setSelectedFilterAgent(e.target.value)}
                  className="bg-panel border border-surface-hover rounded-lg px-3 py-2 text-[13px] text-text-main outline-none focus:border-[var(--color-primary-alpha)]"
                >
                  <option value="All">{t('plugins:all_agents')}</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>

                <select 
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-panel border border-surface-hover rounded-lg px-3 py-2 text-[13px] text-text-main outline-none focus:border-[var(--color-primary-alpha)]"
                >
                  {sortOptions.map(sort => (
                    <option key={sort} value={sort}>{t(sort, sort)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-2 text-[13px] text-text-muted cursor-pointer hover:text-text-main transition-colors mr-2">
                <input type="checkbox" className="accent-[#222] rounded border-divider bg-transparent h-3.5 w-3.5" /> 
                {t('plugins:hide_suspicious')}
              </label>

              <div className="flex items-center bg-panel border border-surface-hover rounded-lg p-0.5">
                <button 
                  onClick={() => setIsGrid(false)} 
                  className={`p-1.5 rounded-md text-text-muted transition-colors ${!isGrid ? 'bg-surface shadow-sm text-primary-light' : 'hover:text-text-main'}`}
                  title={t('plugins:list')}
                >
                  <Command size={15} />
                </button>
                <button 
                  onClick={() => setIsGrid(true)} 
                  className={`p-1.5 rounded-md text-text-muted transition-colors ${isGrid ? 'bg-surface shadow-sm text-primary-light' : 'hover:text-text-main'}`}
                  title={t('plugins:grid')}
                >
                  <Blocks size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Split */}
          <div className="flex flex-1 gap-12">
            
            {/* Right List Area */}
            <div className="flex-1 flex flex-col min-w-0 pb-20">

              {/* Render Plugins */}
              <div className={isGrid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pt-2' : 'flex flex-col gap-4'}>
                {filteredPlugins.map(plugin => (
                  <div 
                    key={plugin.id} 
                    onClick={() => setSelectedPlugin(plugin.id)}
                    className={`group relative border border-divider bg-surface hover:bg-surface hover:border-blue-550/20 transition-all cursor-pointer rounded-2xl p-5 ${isGrid ? 'flex flex-col h-full justify-between' : 'flex items-start gap-6'}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`shrink-0 rounded-2xl bg-surface-hover border border-divider flex items-center justify-center text-primary-light transition-all ${isGrid ? 'w-11 h-11 mb-2' : 'w-11 h-11 mt-0.5'}`}>
                        {renderIcon(plugin.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 truncate">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-text-muted text-xs font-medium">{plugin.author}</span>
                            <span className="text-text-muted text-xs">/</span>
                            <h3 className="text-[15px] font-bold text-text-main group-hover:text-primary-light transition-colors truncate">{plugin.name}</h3>
                          </div>
                          {plugin.installedAgents.length > 0 && (
                            <div className="flex items-center gap-1.5 shrink-0 group/badge relative ml-1">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-default">
                                <CheckCircle2 size={10} /> {plugin.installedAgents.length} Installed
                              </span>
                              <div className="absolute left-1/2 -top-8 -translate-x-1/2 bg-surface-hover border border-divider-strong text-text-main text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {plugin.installedAgents.join(', ')}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className={`text-[12.5px] text-text-muted leading-relaxed mb-3 ${isGrid ? 'line-clamp-3 h-[4rem]' : 'line-clamp-2 pr-28'}`}>
                          {plugin.desc}
                        </p>
                        <div className="flex items-center gap-5 text-[11px] text-text-muted font-medium">
                          <span>{t('plugins:updated')} {plugin.updated}</span>
                          <span className="flex items-center gap-1.5"><Star size={12} className="text-text-muted" /> {plugin.rating}k</span>
                          <span className="flex items-center gap-1.5"><Download size={12} className="text-text-muted" /> {plugin.downloads}</span>
                        </div>
                      </div>
                    </div>

                    {/* Manage/Install Button inside row */}
                    <div className={isGrid ? 'mt-4 pt-4 border-t border-divider flex justify-end' : 'absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'}>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setInstallModalPlugin(plugin.id); 
                        }}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold border border-divider hover:border-[var(--color-primary-alpha)] hover:bg-surface text-text-main transition-all bg-surface shadow-sm select-none"
                      >
                        {plugin.installedAgents.length > 0 ? t('plugins:manage') : t('plugins:install')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Selected Plugin Detail Page */
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-canvas">
          <PluginDetailsView 
            plugin={pluginsList.find(s => s.id === selectedPlugin)!}
            agents={agents}
            onBack={() => setSelectedPlugin(null)}
            onInstallClick={(plugin) => {
              setInstallModalPlugin(plugin.id);
            }}
            renderIcon={renderIcon}
          />
        </div>
      )}

      {/* Install Modal Component */}
      <InstallPluginModal
        isOpen={installModalPlugin !== null}
        pluginName={pluginsList.find(s => s.id === installModalPlugin)?.name || ''}
        agents={agents}
        initialSelectedAgents={installModalPlugin !== null ? agents.filter(a => pluginsList.find(s => s.id === installModalPlugin)?.installedAgents.includes(a.name)).map(a => a.id) : []}
        onClose={() => setInstallModalPlugin(null)}
        onConfirm={(selectedAgents) => {
          setInstallModalPlugin(null);
          toast.success(`Plugin installed to ${selectedAgents.length} agents`);
        }}
      />

      {/* Publish Plugin Modal */}
      <PublishPluginModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        categories={categories}
        onPluginPublished={(newPlugin) => setPluginsList([newPlugin, ...pluginsList])}
      />
    </div>
  );
}