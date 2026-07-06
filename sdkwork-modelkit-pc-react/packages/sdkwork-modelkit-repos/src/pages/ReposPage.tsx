import React, { useState, useEffect } from 'react';
import { Search, FolderGit2, Star, GitFork, Flame, ArrowUpRight, ChevronLeft, Sparkles, Activity, Award, ShieldCheck, Download, Code, X, Copy, Check, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '@sdkwork/modelkit-core';
import { reposService } from '../services/ReposService';
import { RepoItem } from '../services/types';
import { SubmitRepoModal } from './modals/SubmitRepoModal';
import { RepoDetailsView } from './RepoDetailsView';

export function ReposPage() {
  const { t } = useAppContext();
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [repoList, setRepoList] = useState<RepoItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [repos, cats] = await Promise.all([
          reposService.getRepos(),
          reposService.getCategories()
        ]);
        setRepoList(repos);
        setCategoriesList(cats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRecommendSubmit = async (data: any) => {
    const newItem = await reposService.submitRecommendRepo(data);
    setRepoList([newItem, ...repoList]);
  };

  const filteredRepos = repoList.filter(r => {
    const matchCat = selectedCategory ? r.category === selectedCategory : true;
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.lang.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  
  const featured = filteredRepos.length > 0 ? filteredRepos[0] : null;
  const trendingList = (selectedCategory || searchQuery) ? filteredRepos.slice(1, 4) : repoList.slice(1, 4);
  const newReleases = (selectedCategory || searchQuery) ? filteredRepos.slice(4) : repoList.slice(4, 6);

  return (
    <div className="flex-1 flex overflow-hidden bg-canvas text-text-main">
      {/* Sidebar Navigation */}
      <div className="w-[220px] border-r border-divider bg-panel flex flex-col py-5 shrink-0 transition-opacity duration-300">
        <div className="px-5 mb-5">
          <h2 className="text-md font-bold tracking-tight text-text-main flex items-center gap-2">
            <FolderGit2 size={16} className="text-text-muted" />
            {t('repos:repositories')}
          </h2>
        </div>
        
        <div className="relative px-3 mb-5">
          <Search size={13} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder={t('repos:search_repos')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-divider rounded-lg pl-8.5 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-primary-main/50 transition-colors text-text-main placeholder:text-text-muted" 
          />
        </div>

        <div className="flex-1 px-2.5 space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 py-1.5">{t('repos:discover')}</div>
          <button onClick={() => setSelectedCategory(null)} className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 ${selectedCategory === null ? 'text-primary-light bg-primary-main/10 border border-primary-main/10 font-bold' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Sparkles size={13} />{t('repos:featured')}
          </button>
          
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-3 pt-5 pb-1.5">{t('repos:categories')}</div>
          {categoriesList.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg ${selectedCategory === cat ? 'text-primary-light bg-primary-main/10 border border-primary-main/10 font-bold' : 'text-text-muted hover:text-text-main hover:bg-surface-hover'}`}>
              {t(cat, cat)}
            </button>
          ))}
        </div>

        <div className="p-3 mt-auto">
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full py-2 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98]"
          >
            <Sparkles size={13} /> {t('repos:submit_repo')}
          </button>
        </div>
      </div>

      {/* Main Discover Layout */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${selectedRepo ? 'hidden' : 'block'}`}>
        <div className="w-full p-6 lg:p-8 pb-20">
          
          {/* Hero Banner */}
          {featured && (
            <div 
              onClick={() => setSelectedRepo(featured.id)}
              className="group relative h-[280px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl mb-12"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${featured.banner} opacity-90 transition-transform duration-700 ease-out group-hover:scale-105`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-2 flex items-center gap-1.5"><Code size={12}/> Repository of the Month</div>
                  <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight flex items-center gap-3">
                    {featured.org} / {featured.name}
                  </h1>
                  <p className="text-lg text-white/80 max-w-lg leading-snug font-medium line-clamp-2 mt-2">{featured.desc}</p>
                </div>
                <div className="flex flex-col items-center">
                  <button className={`px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform`}>
                    VIEW
                  </button>
                  <div className="flex items-center gap-1 text-[10px] text-white/80 mt-2 font-bold"><Star size={10}/> {featured.stars}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {/* Trending List */}
            <div className="xl:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-divider pb-2">
                <h2 className="text-md font-bold text-text-main tracking-tight">{selectedCategory ? 'Featured' : 'Trending Now'}</h2>
                <button className="text-xs font-semibold text-primary-light hover:text-primary-light">See All</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-b border-divider pb-4">
                {trendingList.map(repo => (
                  <div key={repo.id} className="group flex items-center justify-between p-4 border border-divider rounded-xl bg-surface hover:bg-surface hover:border-[var(--color-primary-alpha)] cursor-pointer transition-all shadow-sm" onClick={() => setSelectedRepo(repo.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner bg-surface border border-divider text-text-muted group-hover:text-text-main shrink-0`}>
                        <FolderGit2 size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[14px] text-text-main group-hover:text-text-main truncate transition-colors">{repo.name}</h3>
                        <p className="text-xs text-text-muted font-semibold truncate">{repo.org}</p>
                      </div>
                    </div>
                    <button className="shrink-0 w-[64px] py-1.5 rounded-full text-xs font-bold bg-surface-hover text-text-main bg-surface hover:scale-[1.03] transition-all text-center ml-2 shadow-sm">
                      VIEW
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Rising Stars List */}
            <div className="xl:col-span-1 2xl:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-divider pb-2">
                <h2 className="text-md font-bold text-text-main tracking-tight">{selectedCategory ? 'More' : 'Rising Stars'}</h2>
                <button className="text-xs font-semibold text-primary-light hover:text-primary-light">See All</button>
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 border-b border-divider pb-4">
                {newReleases.map(repo => (
                  <div key={repo.id} className="group flex items-center justify-between p-4 border border-divider rounded-xl bg-surface hover:bg-surface hover:border-[var(--color-primary-alpha)] cursor-pointer transition-all shadow-sm" onClick={() => setSelectedRepo(repo.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface border border-divider flex items-center justify-center font-bold text-lg text-text-muted shadow-inner group-hover:text-text-main transition-colors shrink-0">
                        <FolderGit2 size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[14px] text-text-main group-hover:text-text-main truncate transition-colors">{repo.name}</h3>
                        <p className="text-xs text-text-muted font-semibold truncate">{repo.category}</p>
                      </div>
                    </div>
                    <button className="shrink-0 w-[64px] py-1.5 rounded-full text-xs font-bold bg-surface-hover text-text-main bg-surface hover:scale-[1.03] transition-all text-center ml-2 shadow-sm">
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
      {selectedRepo && (
        <div className="flex-1 flex flex-col h-full bg-canvas animate-in slide-in-from-right-8 duration-300">
          <RepoDetailsView 
            repo={repoList.find(r => r.id === selectedRepo)!}
            onBack={() => setSelectedRepo(null)}
          />
        </div>
      )}

      {/* Apply to Join Modal */}
      <SubmitRepoModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        categoriesList={categoriesList}
        onSubmit={handleRecommendSubmit}
      />
    </div>
  );
}
