import { useAppContext } from '@sdkwork/modelkit-core';
import React, { useState } from 'react';
import { ChevronLeft, FolderGit2, Star, GitFork, ArrowUpRight, ShieldCheck, Check, Copy, GitBranch } from 'lucide-react';
import { RepoItem } from '../services/types';

interface RepoDetailsViewProps {
  repo: RepoItem;
  onBack: () => void;
}

export function RepoDetailsView({ repo, onBack }: RepoDetailsViewProps) {
  const { t } = useAppContext();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyClone = (link: string) => {
    navigator.clipboard.writeText(`git clone ${link}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="h-14 border-b border-divider flex items-center px-4 shrink-0 bg-panel">
        <button onClick={onBack} className="flex items-center gap-1.5 text-primary-light hover:text-primary-light text-sm font-semibold transition-colors">
          <ChevronLeft size={16} /> {t('repos:discover')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="w-full mx-auto p-6 lg:p-8">
          
          {/* Header Info */}
          <div className="flex items-start gap-8 mb-10">
            <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-4xl shadow-2xl shrink-0 bg-gradient-to-br ${repo.banner} text-text-main`}>
              <FolderGit2 size={48} />
            </div>
            
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg text-text-muted font-medium mb-1">{repo.org} / </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">{repo.name}</h1>
                </div>
                <div className="flex flex-col items-end">
                  <a href={repo.gitUrl || `https://github.com/${repo.org}/${repo.name}`} target="_blank" rel="noopener noreferrer" className={`w-32 py-2 flex justify-center items-center gap-2 rounded-full text-sm font-bold shadow-lg transition-transform bg-surface text-text-main hover:scale-105`}>
                    VISIT REPO <ArrowUpRight size={14} />
                  </a>
                  <span className="text-[10px] text-text-muted mt-2 font-medium flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500"/> Verified Repository</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-divider">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Language</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold mt-1">
                    <div className={`w-2 h-2 rounded-full ${repo.lang === 'Python' ? 'bg-primary-hover' : repo.lang === 'TypeScript' ? 'bg-primary-main' : 'bg-cyan-500'}`}></div>
                    {repo.lang}
                  </div>
                </div>
                <div className="w-px h-8 bg-surface-hover"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Stars</span>
                  <div className="text-sm font-bold mt-1 flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500"/> {repo.stars}</div>
                </div>
                <div className="w-px h-8 bg-surface-hover"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Forks</span>
                  <div className="text-sm font-bold mt-1 flex items-center gap-1"><GitFork size={14}/> {repo.forks}</div>
                </div>
                <div className="w-px h-8 bg-surface-hover"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Category</span>
                  <div className="text-sm font-bold mt-1">{repo.category}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-surface-hover my-8"></div>

          {/* Git clone source block */}
          {(repo.gitUrl || (repo.org && repo.name)) && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                <GitBranch size={13} className="text-primary-light" />
                {t('repos:txt_1020')}
              </h3>
              <div className="p-4 bg-surface rounded-xl border border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Clone Command</p>
                  <div className="flex items-center bg-surface rounded-lg px-3 py-2 border border-divider font-mono text-xs text-primary-light select-all overflow-x-auto custom-scrollbar whitespace-nowrap">
                    git clone {repo.gitUrl || `https://github.com/${repo.org}/${repo.name}.git`}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyClone(repo.gitUrl || `https://github.com/${repo.org}/${repo.name}.git`)}
                    className="px-4 py-2 border border-divider hover:border-[var(--color-primary-alpha)] rounded-lg text-xs font-bold transition-all text-text-main hover:text-text-main flex items-center gap-1.5 bg-surface cursor-pointer"
                  >
                    {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    {copiedLink ? 'Copied' : 'Copy Command'}
                  </button>
                  <a
                    href={repo.gitUrl || `https://github.com/${repo.org}/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-surface text-text-main flex items-center gap-1 rounded-lg border border-divider hover:border-[var(--color-primary-alpha)] transition-all font-bold text-xs"
                  >
                    Browse Code <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Why recommend this repository */}
          {repo.recommendReason && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">{t('repos:txt_1021')}</h3>
              <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-emerald-300 text-xs font-medium leading-relaxed">
                {repo.recommendReason}
              </div>
            </div>
          )}

          {/* About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">{t('repos:txt_1022')}</h3>
            <p className="text-sm text-text-main leading-relaxed font-semibold">
              {repo.desc}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
