import React from 'react';
import { Download, Star, ChevronLeft, ExternalLink, Activity, Terminal, Monitor, Apple, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@sdkwork/modelkit-core';
import { SoftwareItem } from '../services/types';

interface SoftwareDetailsViewProps {
  sw: SoftwareItem;
  installingAppId: number | null;
  installProgress: number;
  installStep: string;
  installLogs: string[];
  onBack: () => void;
  startInstallation: (appId: number) => void;
  startUninstallation: (appId: number) => void;
}

export function SoftwareDetailsView({
  sw,
  installingAppId,
  installProgress,
  installStep,
  installLogs,
  onBack,
  startInstallation,
  startUninstallation
}: SoftwareDetailsViewProps) {
  const { t } = useAppContext();

  return (
    <>
      <div className="h-14 border-b border-divider flex items-center px-4 shrink-0 bg-panel">
        <button onClick={onBack} className="flex items-center gap-1.5 text-primary-light hover:text-primary-light text-sm font-semibold transition-colors">
          <ChevronLeft size={16} /> {t('software:discover_catalog')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full p-6 lg:p-8 max-w-none">
          
          {/* Header Info */}
          <div className="flex items-start gap-8 mb-10">
            <div className={`w-28 h-28 rounded-3xl overflow-hidden flex items-center justify-center text-5xl font-bold text-white shadow-2xl shrink-0 ${
              sw.installed ? `bg-gradient-to-br ${sw.banner}` : 'bg-surface-hover border border-divider-strong'
            }`}>
              {typeof sw.icon === 'string' && (sw.icon.startsWith('data:') || sw.icon.startsWith('blob:')) ? (
                <img src={sw.icon} className="w-full h-full object-cover animate-fade-in" alt="" referrerPolicy="no-referrer" />
              ) : (
                sw.icon
              )}
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-3xl font-bold tracking-tight">{sw.name}</h1>
                    {!sw.installed && installingAppId !== sw.id && (
                      <button
                        type="button"
                        onClick={() => startInstallation(sw.id)}
                        className="px-3 py-1 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-all shadow-[0_2px_8px_var(--color-primary-alpha)] hover:scale-105 active:scale-95 flex items-center gap-1 shrink-0"
                      >
                        <Download size={12} />
                        {t('software:txt_1146')}
                      </button>
                    )}
                    {installingAppId === sw.id && (
                      <span className="px-3 py-1 bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-xs font-bold rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                        <Activity size={12} className="animate-spin" />
                        {t('software:installing', 'Installing')} {installProgress}%
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg text-text-muted font-medium">{sw.publisher}</h2>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  {installingAppId === sw.id ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-primary-light font-bold flex items-center gap-1.5 bg-primary-main/10 px-3 py-1.5 rounded-full border border-[var(--color-primary-alpha)]"><Activity size={12} className="animate-spin text-primary-main" /> {t('software:installing', 'Installing')} {installProgress}%</span>
                      <span className="text-[10px] text-text-muted mt-1 font-mono">{installStep}</span>
                    </div>
                  ) : sw.installed ? (
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => toast.success(`${t('software:launching', 'Launching')} ${sw.name}...`)}
                        className="w-32 py-2 rounded-full text-sm font-bold shadow-lg transition-transform bg-primary-main text-white hover:bg-primary-hover hover:scale-[1.02]"
                      >
                        {t('software:launch_app', 'LAUNCH APP')}
                      </button>
                      <button 
                        onClick={() => startUninstallation(sw.id)}
                        className="w-32 py-1.5 rounded-full text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/15"
                      >
                        {t('software:uninstall', 'UNINSTALL')}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startInstallation(sw.id)}
                      className="w-32 py-2 rounded-full text-sm font-bold shadow-lg transition-transform bg-surface text-text-main hover:scale-105 hover:bg-surface-hover"
                    >
                      {t('software:install_app', 'INSTALL APP')}
                    </button>
                  )}
                  {sw.website && (
                    <a 
                      href={sw.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-32 mt-2 py-2 rounded-full text-sm font-bold bg-surface-hover text-text-main hover:bg-surface-hover hover:text-text-main transition-colors flex items-center justify-center gap-1.5 border border-divider-strong"
                    >
                      {t('software:website', 'Website')} <ExternalLink size={14} />
                    </a>
                  )}
                  <span className="text-[10px] text-text-muted mt-2 font-medium flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500"/> {t('software:verified_publisher', 'Verified Publisher')}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-divider">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{t('software:rating', 'Rating')}</span>
                  <div className="flex items-center gap-1 text-sm font-bold mt-1">
                    {sw.rating} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="w-px h-8 bg-surface-hover"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{t('software:category', 'Category')}</span>
                  <div className="text-sm font-bold mt-1">{t(sw.type, sw.type)}</div>
                </div>
                <div className="w-px h-8 bg-surface-hover"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{t('software:size', 'Size')}</span>
                  <div className="text-sm font-bold mt-1">{sw.size}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-surface-hover my-8"></div>

          {/* Local Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-surface border border-divider rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-primary-hover"></div>
              <div>
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{t('software:txt_1147')}</div>
                <div className="text-sm font-bold mt-1.5 flex items-center gap-2 text-text-main">
                  {sw.installed ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>{t('software:txt_1148')}</span>
                    </>
                  ) : installingAppId === sw.id ? (
                    <>
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-hover animate-pulse shrink-0"></div>
                      <span>{t('software:installing', 'Installing')} ({installProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/85 shrink-0"></div>
                      <span className="text-text-muted">{t('software:txt_1149')}</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-text-muted mt-1 font-semibold">{t('software:txt_1165', 'Installed apps integrate natively with the daemon workspace.')}</p>
              </div>
              
              <div>
                {installingAppId === sw.id ? (
                  <span className="text-xs text-primary-light font-mono font-bold animate-pulse">active</span>
                ) : sw.installed ? (
                  <button 
                    onClick={() => startUninstallation(sw.id)}
                    className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/15"
                  >
                    {t('software:uninstall', 'Uninstall')}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => startInstallation(sw.id)}
                    className="text-xs font-bold bg-surface text-text-main px-3.5 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main transition-all border border-divider shadow-inner"
                  >
                    {t('software:one_click_install', 'One-click Install')}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-surface border border-divider rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[3px] h-full bg-indigo-500"></div>
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{t('software:txt_1150')}</span>
                <p className="text-sm font-bold mt-1.5 text-text-main flex items-center gap-2">
                  <Activity size={16} className={sw.installed ? "text-emerald-500 animate-pulse shrink-0" : "text-text-muted shrink-0"} />
                  {sw.installed ? t('software:active_link', "Active Link (Daemon linked)") : t('software:pending_local_registration', "Pending local registration")}
                </p>
                <p className="text-[10px] text-text-muted mt-1 font-semibold">{t('software:txt_1166', 'Communication pathway mapping state config.')}</p>
              </div>
              <span className="text-xs font-mono text-indigo-450 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/10">PORT 3000</span>
            </div>
          </div>

          {/* Installing Live Terminal Console */}
          {installingAppId === sw.id && (
            <div className="mb-10 bg-panel border border-divider rounded-2xl overflow-hidden p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b border-divider/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-primary-main animate-pulse" />
                  <span className="text-xs font-mono font-bold text-text-main">ModelKit Package Installer v1.2</span>
                </div>
                <span className="text-xs font-mono font-bold text-primary-main bg-primary-main/5 px-2.5 py-1 rounded border border-primary-main/10">{installProgress}% {t('software:completed', 'Completed')}</span>
              </div>
              
              <div className="space-y-1 mb-4 h-32 overflow-y-auto font-mono text-[11px] text-text-muted select-all custom-scrollbar bg-black/40 p-3 rounded-lg border border-divider">
                {installLogs.map((log, lIdx) => (
                  <div key={lIdx} className={log.includes('[success]') ? 'text-emerald-500' : log.includes('[mcp]') ? 'text-indigo-400 font-semibold' : 'text-text-muted'}>
                    {log}
                  </div>
                ))}
                <div className="text-primary-light animate-pulse font-bold">{'>'} {installStep}...</div>
              </div>

              <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-divider">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 h-1.5 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${installProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-text-muted font-semibold">
                <span>SYSTEM: PID {Math.floor(Math.random() * 8000) + 1200}</span>
                <span>BANDWIDTH: 112.4 MB/s</span>
              </div>
            </div>
          )}

          {/* Screenshots */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">{t('software:screenshots', 'Screenshots')}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
              {sw.screenshots && sw.screenshots.length > 0 ? (
                sw.screenshots.map((src: string, i: number) => (
                  <div key={i} className="w-[380px] h-[220px] bg-surface-hover border border-divider-strong rounded-xl shrink-0 snap-center relative overflow-hidden group">
                    <img src={src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="App Screenshot" referrerPolicy="no-referrer" />
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="w-[380px] h-[220px] bg-surface-hover border border-divider-strong rounded-xl shrink-0 snap-center flex items-center justify-center relative overflow-hidden group">
                     <Monitor className="text-primary-main w-14 h-14 group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* What's New */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
               <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">{t('software:whats_new', "What's New")}</h3>
               <span className="text-xs font-mono text-text-muted">{t('software:version', 'Version')} {sw.version}</span>
            </div>
            <div className="bg-surface-hover rounded-xl p-5 border border-divider-strong">
               <p className="text-sm text-text-main leading-relaxed font-semibold">
                 - Performance improvements and framework environment fixes.<br/>
                 - Optimized ModelKit context integration.<br/>
                 - Added support for new local APIs.
               </p>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">{t('software:about_this_app', 'About this app')}</h3>
            <p className="text-sm text-text-main leading-relaxed font-semibold">
              {sw.desc} Designed to seamlessly integrate with your existing workflow, maximizing developer productivity. It leverages advanced capabilities to ensure context-aware execution. We are continually updating it to match the latest API standards and developer expectations.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {sw.tags.map((t: string) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-surface-hover text-xs font-semibold text-text-muted border border-divider-strong">
                  #{t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
