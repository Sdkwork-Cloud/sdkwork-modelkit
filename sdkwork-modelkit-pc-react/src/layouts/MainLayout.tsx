import React, { useState, Suspense } from 'react';
import { HeaderUserProfile, DeepLinkInterceptorModal } from '@sdkwork/modelkit-workspace';
import { useCartStorage, useOrdersStorage } from '@sdkwork/modelkit-shop';
import { useAppContext } from '@sdkwork/modelkit-core';
import { ChevronDown, Plus, Settings, Home, BookOpen, Route, PackageSearch, FolderGit2, Server, ShoppingBag, Globe, History, Newspaper, Loader2, Sparkles, Puzzle } from 'lucide-react';

const WorkspacePage = React.lazy(() => import('@sdkwork/modelkit-workspace').then(m => ({ default: m.WorkspacePage })));
const MCPManager = React.lazy(() => import('@sdkwork/modelkit-workspace').then(m => ({ default: m.MCPManager })));
const SkillHubPage = React.lazy(() => import('@sdkwork/modelkit-skillhub').then(m => ({ default: m.SkillHubPage })));
const PluginsPage = React.lazy(() => import('@sdkwork/modelkit-plugins').then(m => ({ default: m.PluginsPage })));
const RelayPage = React.lazy(() => import('@sdkwork/modelkit-relay').then(m => ({ default: m.RelayPage })));
const SoftwarePage = React.lazy(() => import('@sdkwork/modelkit-software').then(m => ({ default: m.SoftwarePage })));
const ReposPage = React.lazy(() => import('@sdkwork/modelkit-repos').then(m => ({ default: m.ReposPage })));
const NewsPage = React.lazy(() => import('@sdkwork/modelkit-news').then(m => ({ default: m.NewsPage })));
const ShopView = React.lazy(() => import('@sdkwork/modelkit-shop').then(m => ({ default: m.ShopView })));
const PromptsPage = React.lazy(() => import('@sdkwork/modelkit-prompts').then(m => ({ default: m.PromptsPage })));

export function MainLayout() {
  const { language, setLanguage, t } = useAppContext();
  const [activeMenu, setActiveMenu] = useState('home');
  const [workspaceNavigateTarget, setWorkspaceNavigateTarget] = useState<'user-profile' | 'system-settings' | null>(null);
  const [shopTarget, setShopTarget] = useState<'orders' | 'cart' | null>(null);

  const { cart } = useCartStorage();
  const { orders } = useOrdersStorage();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const ordersCount = orders.length;

  const handleProfileNavigate = (target: 'user-profile' | 'system-settings' | 'shop-orders' | 'shop-cart') => {
    if (target === 'shop-orders') {
      setActiveMenu('shop');
      setShopTarget('orders');
    } else if (target === 'shop-cart') {
      setActiveMenu('shop');
      setShopTarget('cart');
    } else {
      setActiveMenu('home');
      setWorkspaceNavigateTarget(target as 'user-profile' | 'system-settings');
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-canvas text-text-main flex flex-col font-sans overflow-hidden select-none">
      <DeepLinkInterceptorModal />
      {/* Header */}
      <header className="h-14 border-b border-divider bg-panel/80 backdrop-blur-md flex items-center justify-between px-5 shrink-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-primary-main to-primary-light rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-[0_0_12px_var(--color-primary-alpha)]">MK</div>
            <span className="font-display font-bold tracking-tight text-[16px] text-text-main">ModelKit</span>
            <span className="text-[10px] bg-primary-alpha border border-primary-alpha/50 px-2.5 py-0.5 rounded-full text-primary-main font-bold font-mono tracking-wide">v1.2</span>
          </div>

          <div className="h-4 w-px bg-divider"></div>

          {/* Menus */}
          <nav className="flex items-center gap-1.5">
            <MenuButton icon={<Home size={14} />} label={t('common:workspace')} active={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
            <MenuButton icon={<ShoppingBag size={14} />} label={t('common:shop')} active={activeMenu === 'shop'} onClick={() => setActiveMenu('shop')} />
            <MenuButton icon={<BookOpen size={14} />} label={t('common:skill_store')} active={activeMenu === 'skillhub'} onClick={() => setActiveMenu('skillhub')} />
            <MenuButton icon={<Puzzle size={14} />} label={t('plugins:plugins_store', 'Plugins')} active={activeMenu === 'plugins'} onClick={() => setActiveMenu('plugins')} />
            <MenuButton icon={<Server size={14} />} label={t('common:mcp')} active={activeMenu === 'mcp'} onClick={() => setActiveMenu('mcp')} />
            <MenuButton icon={<Sparkles size={14} />} label={t('common:prompts', 'Prompts')} active={activeMenu === 'prompts'} onClick={() => setActiveMenu('prompts')} />
            <MenuButton icon={<Route size={14} />} label={t('common:popular_sites')} active={activeMenu === 'relay'} onClick={() => setActiveMenu('relay')} />
            <MenuButton icon={<PackageSearch size={14} />} label={t('common:software')} active={activeMenu === 'software'} onClick={() => setActiveMenu('software')} />
            <MenuButton icon={<FolderGit2 size={14} />} label={t('common:repositories')} active={activeMenu === 'repos'} onClick={() => setActiveMenu('repos')} />
            <MenuButton icon={<Newspaper size={14} />} label={t('common:tech_news')} active={activeMenu === 'news'} onClick={() => setActiveMenu('news')} />
          </nav>
        </div>


        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative group cursor-pointer flex items-center bg-surface border border-divider hover:border-primary-main/50 rounded-xl px-2.5 py-1.5 gap-2 transition-all">
            <Globe size={13} className="text-primary-light hover:rotate-12 transition-transform duration-300" />
            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted group-hover:text-text-main transition-colors">
              {language === 'zh' ? '中文' : 'ENG'}
            </span>
            <ChevronDown size={12} className="text-text-muted group-hover:text-text-main transition-colors" />
            
            <div className="absolute right-0 top-full mt-1.5 w-32 bg-surface-hover border border-divider rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 p-1.5">
              <div onClick={() => setLanguage('zh')} className={`px-2.5 py-1.5 text-xs rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between transition-colors ${language === 'zh' ? 'text-primary-light bg-primary-alpha font-semibold' : 'text-text-muted hover:text-text-main'}`}>
                简体中文 {language === 'zh' && <div className="w-1.5 h-1.5 bg-primary-main rounded-full shadow-[0_0_6px_var(--color-primary-alpha)]"></div>}
              </div>
              <div onClick={() => setLanguage('en')} className={`px-2.5 py-1.5 text-xs rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between transition-colors ${language === 'en' ? 'text-primary-light bg-primary-alpha font-semibold' : 'text-text-muted hover:text-text-main'}`}>
                English {language === 'en' && <div className="w-1.5 h-1.5 bg-primary-main rounded-full shadow-[0_0_6px_var(--color-primary-alpha)]"></div>}
              </div>
            </div>
          </div>

          <div className="w-px h-5 bg-divider"></div>

          {/* Header Order Badge feedback */}
          <button 
            onClick={() => handleProfileNavigate('shop-orders')}
            className={`flex items-center justify-center bg-surface border border-divider hover:border-primary-main/50 rounded-xl px-2.5 py-1.5 gap-1.5 transition-all text-xs cursor-pointer relative ${activeMenu === 'shop' && shopTarget === 'orders' ? 'text-primary-main border-primary-main/30 bg-primary-alpha font-extrabold shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            <History size={13} className={activeMenu === 'shop' && shopTarget === 'orders' ? 'animate-pulse' : ''} />
            <span>{t('shop:my_orders_assets', 'My Orders')}</span>
            {ordersCount > 0 && (
              <span className="bg-primary-main/10 text-primary-main px-1.5 py-0.5 rounded text-[10px] font-black font-mono border border-primary-main/25 animate-pulse">
                {ordersCount}
              </span>
            )}
          </button>

          <div className="w-px h-5 bg-divider"></div>

          {/* Header Card Badge feedback */}
          <button 
            onClick={() => handleProfileNavigate('shop-cart')}
            className={`flex items-center justify-center bg-surface border border-divider hover:border-primary-main/50 rounded-xl w-8 h-8 transition-all hover:text-text-main cursor-pointer relative ${shopTarget === 'cart' ? 'text-primary-light border-primary-main/30 bg-primary-main/10' : 'text-text-muted'}`}
          >
            <ShoppingBag size={14} className={shopTarget === 'cart' ? 'scale-110' : ''} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black font-mono border border-[#0D0F14] text-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <div className="w-px h-5 bg-divider"></div>
          <HeaderUserProfile onNavigate={handleProfileNavigate} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden flex-col relative">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-canvas z-10"><Loader2 className="animate-spin text-primary-main w-8 h-8" /></div>}>
          {activeMenu === 'home' && (
            <WorkspacePage 
              navigateTarget={workspaceNavigateTarget} 
              onClearNavigateTarget={() => setWorkspaceNavigateTarget(null)} 
            />
          )}
          {activeMenu === 'shop' || shopTarget ? <ShopView target={shopTarget} onClearTarget={() => setShopTarget(null)} isActiveMenu={activeMenu === 'shop'} /> : null}
          {activeMenu === 'skillhub' && <SkillHubPage />}
          {activeMenu === 'plugins' && <PluginsPage />}
          {activeMenu === 'mcp' && <MCPManager />}
          {activeMenu === 'prompts' && <PromptsPage />}
          {activeMenu === 'relay' && <RelayPage />}
          {activeMenu === 'software' && <SoftwarePage />}
          {activeMenu === 'repos' && <ReposPage />}
          {activeMenu === 'news' && <NewsPage />}
        </Suspense>
      </div>
    </div>
  );
}

function MenuButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold tracking-wide transition-all ${
        active 
          ? 'bg-surface-hover text-primary-light border border-primary-alpha shadow-[inset_0_1px_rgba(255,255,255,0.02)] font-bold' 
          : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/[0.03] hover:text-text-main border border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
