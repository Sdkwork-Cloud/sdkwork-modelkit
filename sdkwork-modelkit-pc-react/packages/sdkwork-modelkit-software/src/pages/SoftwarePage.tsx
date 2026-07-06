import React, { useState, useRef, useEffect } from 'react';
import { Download, Search, Star, ChevronLeft, ExternalLink, Activity, Award, Sparkles, X, Terminal, Monitor, Apple, ShieldCheck, CheckCircle2, Upload, Plus, Trash2, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '@sdkwork/modelkit-core';
import { softwareService } from '../services/SoftwareService';
import { SoftwareItem } from '../services/types';

import { SoftwareDetailsView } from './SoftwareDetailsView';
import { SubmitAppModal } from './modals/SubmitAppModal';

export function SoftwarePage() {
  const { t } = useAppContext();
  const [selectedSoftware, setSelectedSoftware] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [installingAppId, setInstallingAppId] = useState<number | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStep, setInstallStep] = useState('');
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSoftware = async () => {
    try {
      const [list, cats] = await Promise.all([
        softwareService.getSoftwareList(),
        softwareService.getCategories()
      ]);
      setSoftwareList(list);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftware();
  }, []);

  const startInstallation = (appId: number) => {
    const app = softwareList.find(s => s.id === appId);
    if (!app) return;

    setInstallingAppId(appId);
    setInstallProgress(0);
    setInstallStep('Initializing local runtime paths...');
    setInstallLogs([`$ sdkwork install ${app.name.toLowerCase()}`, `[info] Querying manifest registry for ${app.name}...`]);

    const steps = [
      { progress: 15, step: `Downloading packages (${app.size})...`, log: `[info] Downloading binaries from distributed registry...` },
      { progress: 40, step: 'Unpacking archives & arranging scripts...', log: `[info] Allocating files to local directory paths` },
      { progress: 65, step: 'Validating security keys & hashes...', log: `[success] Verification of developer pgp signature succeeded!` },
      { progress: 85, step: 'Configuring workspace execution gates...', log: `[info] Creating desktop symbolic links and dynamic daemon bindings` },
      { progress: 100, step: 'Finalizing install configuration...', log: `[success] App registered successfully. Ready to run!` }
    ];

    let currentStepIndex = 0;
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        setInstallProgress(100);
        setInstallStep('Success! App is initialized.');
        setInstallLogs(prev => [...prev, `[system] Updated config in background daemon`, `[system] SUCCESS: ${app.name} is now installed.`]);
        
        softwareService.installSoftware(appId).then(() => {
          setSoftwareList(prevList => prevList.map(item => 
            item.id === appId ? { ...item, installed: true } : item
          ));
        });
        
        toast.success(`Successfully installed ${app.name}!`);
        setTimeout(() => {
          setInstallingAppId(null);
        }, 1500);
      } else {
        setInstallProgress(currentProgress);
        const nextStep = steps.find(s => currentProgress >= s.progress && currentProgress < (s.progress + 20));
        if (nextStep && steps.indexOf(nextStep) !== currentStepIndex) {
          currentStepIndex = steps.indexOf(nextStep);
          setInstallStep(nextStep.step);
          setInstallLogs(prev => [...prev, nextStep.log]);
        }
      }
    }, 200);
  };

  const startUninstallation = async (appId: number) => {
    const app = softwareList.find(s => s.id === appId);
    if (!app) return;
    
    await softwareService.uninstallSoftware(appId);
    setSoftwareList(prevList => prevList.map(item => 
      item.id === appId ? { ...item, installed: false } : item
    ));
    toast.info(`Successfully uninstalled ${app.name}`);
  };

  // Form states for Submit Soft App removed, managed by SubmitAppModal
  
  const filteredList = softwareList.filter(s => {
    const matchCat = selectedCategory ? s.type === selectedCategory : true;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filteredList.length > 0 ? filteredList[0] : null;
  const itemsList = filteredList; // Clean unified shop screen

  return (
    <div className="flex-1 flex overflow-hidden bg-canvas text-text-main font-sans">
      
      {/* Sidebar for Store Navigation */}
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <Monitor size={16} className="text-text-muted" />
            {t('software:software_app')}
          </h2>
        </div>
        
        <div className="relative px-3 mb-5">
          <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder={t('software:search_software')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-divider rounded-lg pl-8.5 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary-main/50 transition-colors text-text-main placeholder:text-text-muted" 
          />
        </div>

        <div className="flex-1 px-2.5 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 py-1.5">{t('software:discover')}</div>
          <button 
            onClick={() => setSelectedCategory(null)} 
            className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-all ${
              selectedCategory === null 
                ? 'text-primary-light bg-primary-main/10 font-bold border border-primary-main/10' 
                : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles size={13} /> {t('software:featured_shop')}
          </button>
          
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 pt-5 pb-1.5">{t('software:categories')}</div>
          {categories.map(cat => (
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
            onClick={() => {
              setIsApplyModalOpen(true);
            }}
            className="w-full py-2 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            <Plus size={14} /> {t('software:submit_software')}
          </button>
        </div>
      </div>

      {/* Main Discover Layout */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${selectedSoftware ? 'hidden' : 'block'}`}>
        <div className="w-full p-6 lg:p-8 pb-20 max-w-none">
          
          {/* Hero Banner - Airy & Luxurious */}
          <AnimatePresence mode="wait">
            {!selectedCategory && !searchQuery && featured && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSoftware(featured.id)}
                className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-divider mb-12"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${featured.banner} opacity-85 transition-transform duration-700 ease-out group-hover:scale-105`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1">
                      <Sparkles size={11} className="animate-pulse" /> {t('software:txt_1151')}
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{featured.name}</h1>
                    <p className="text-sm font-medium text-white/90 line-clamp-2 mt-2 leading-relaxed">{featured.desc}</p>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <button className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-xs hover:scale-105 active:scale-95 transition-all shadow-md">
                      {t('software:view_details', 'VIEW DETAILS')}
                    </button>
                    <span className="text-[10px] text-white/70 mt-2">{t('software:verified_publisher', 'Verified Publisher')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified Spacious Catalog Store Grid */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-divider">
              <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
                <Monitor size={16} className="text-text-muted" />
                {selectedCategory ? `${t(selectedCategory, selectedCategory)} Apps` : t('software:explore_applications')}
              </h2>
              <span className="text-xs font-semibold text-text-muted">{itemsList.length} {t('software:apps_found')}</span>
            </div>

            {itemsList.length === 0 ? (
              <div className="text-center py-20 bg-surface border border-divider rounded-3xl">
                <ImageIcon className="mx-auto w-12 h-12 text-text-muted mb-3" />
                <p className="text-sm text-text-muted font-medium">No applications found matching your criteria</p>
                <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} className="mt-4 px-4 py-2 bg-surface hover:bg-surface-hover border border-divider rounded-lg text-xs font-semibold transition-colors">Reset filter</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsList.map((sw) => (
                  <motion.div
                    key={sw.id}
                    whileHover={{ y: -4 }}
                    className="bg-surface border border-divider hover:border-[var(--color-primary-alpha)] rounded-2xl p-5 flex flex-col justify-between h-[230px] transition-all duration-300 relative group cursor-pointer shadow-sm"
                    onClick={() => setSelectedSoftware(sw.id)}
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-13 h-13 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner shrink-0 overflow-hidden bg-surface border border-divider">
                          {typeof sw.icon === 'string' && (sw.icon.startsWith('data:') || sw.icon.startsWith('blob:')) ? (
                            <img src={sw.icon} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          ) : sw.installed ? (
                            <span className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white w-full h-full flex items-center justify-center font-bold">{sw.icon}</span>
                          ) : (
                            <span className="text-text-muted group-hover:text-text-main transition-colors">{sw.icon}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[14px] text-text-main group-hover:text-text-main truncate transition-colors">{sw.name}</h3>
                          <p className="text-xs text-text-muted mt-0.5 truncate">{sw.type}</p>
                          <p className="text-[10px] text-text-muted font-semibold truncate mt-0.5">{sw.publisher}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4 font-normal">
                        {sw.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-divider mt-auto">
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <Monitor size={11} className="text-text-muted" />
                        <span className="truncate max-w-[80px]">{sw.os.join(', ')}</span>
                        <span>•</span>
                        <span>{sw.size}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSoftware(sw.id);
                          if (!sw.installed && installingAppId !== sw.id) {
                            // Automatically start installation when clicking GET
                            startInstallation(sw.id);
                          } else if (sw.installed) {
                            toast.success(`Launching ${sw.name} via ModelKit workspace...`);
                          }
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ml-2 flex items-center gap-1.5 cursor-pointer ${
                          sw.installed 
                            ? 'bg-surface-hover text-emerald-400 border border-emerald-500/20 hover:bg-surface-hover' 
                            : installingAppId === sw.id 
                              ? 'bg-primary-main/10 text-primary-light border border-[var(--color-primary-alpha)]'
                              : 'bg-surface text-text-main hover:bg-surface-hover hover:scale-[1.02]'
                        }`}
                      >
                        {sw.installed ? (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            {t('software:action_open', 'OPEN')}
                          </>
                        ) : installingAppId === sw.id ? (
                          <>
                            <Download size={12} className="animate-bounce" />
                            {installProgress}%
                          </>
                        ) : (
                          t('software:action_get', 'GET')
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Details View (Overlay) */}
      {selectedSoftware && (
        <div className="flex-1 flex flex-col h-full bg-canvas animate-in slide-in-from-right-8 duration-300">
          {(() => {
            const sw = softwareList.find(s => s.id === selectedSoftware)!;
            return (
                  <SoftwareDetailsView 
                    sw={sw} 
                    installingAppId={installingAppId} 
                    installProgress={installProgress} 
                    installStep={installStep} 
                    installLogs={installLogs} 
                    onBack={() => setSelectedSoftware(null)} 
                    startInstallation={startInstallation} 
                    startUninstallation={startUninstallation} 
                  />
            );
          })()}
        </div>
      )}

      {/* Submit App Modal */}
      <SubmitAppModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        categories={categories}
        onAppSubmitted={(newAppItem) => {
          setSoftwareList(prev => [newAppItem, ...prev]);
        }}
      />
    </div>
  );
}
