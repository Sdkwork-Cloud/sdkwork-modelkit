import { useAppContext } from '@sdkwork/modelkit-core';
import React, { useState } from 'react';
import { X, GitBranch } from 'lucide-react';
import { toast } from 'sonner';

interface SubmitRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoriesList: string[];
  onSubmit: (data: any) => Promise<void>;
}

export function SubmitRepoModal({ isOpen, onClose, categoriesList, onSubmit }: SubmitRepoModalProps) {
  const { t } = useAppContext();
  // Form states for Submit Repo
  const [gitUrl, setGitUrl] = useState('');
  const [org, setOrg] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [lang, setLang] = useState('TypeScript');
  const [category, setCategory] = useState('LLM Tools');
  const [recommendReason, setRecommendReason] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (!isOpen) return null;

  // Auto-parse organization and repo name when typing Git URL
  const handleGitUrlChange = (value: string) => {
    setGitUrl(value);
    let cleaned = value.trim();
    if (cleaned.endsWith('.git')) {
      cleaned = cleaned.slice(0, -4);
    }
    
    // Check if it is a standard SSH/HTTP URL format
    if (cleaned.includes('git@')) {
      const parts = cleaned.split(':');
      if (parts.length > 1) {
        const pathParts = parts[1].split('/');
        if (pathParts.length >= 2) {
          setOrg(pathParts[pathParts.length - 2]);
          setName(pathParts[pathParts.length - 1]);
        }
      }
    } else {
      try {
        if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
          cleaned = 'https://' + cleaned;
        }
        const urlObj = new URL(cleaned);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          setOrg(pathParts[pathParts.length - 2]);
          setName(pathParts[pathParts.length - 1]);
        }
      } catch (e) {
        // Fallback simple regex
        const match = cleaned.match(/(?:github\.com|gitlab\.com|gitee\.com)\/([^\/]+)\/([^\/]+)/);
        if (match && match[1] && match[2]) {
          setOrg(match[1]);
          setName(match[2]);
        }
      }
    }
  };

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl || !org || !name || !desc) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit({
        org, name, desc, lang, category, gitUrl, recommendReason, contactEmail
      });
      toast.success('Repository submitted successfully!');
      onClose();

      // Reset Form
      setGitUrl('');
      setOrg('');
      setName('');
      setDesc('');
      setLang('TypeScript');
      setCategory('LLM Tools');
      setRecommendReason('');
      setContactEmail('');
    } catch (err) {
      toast.error('Failed to submit repository');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-surface border border-divider rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 border-b border-divider flex justify-between items-center bg-panel">
          <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
            <GitBranch size={16} className="text-primary-main" />
            {t('repos:txt_1023')}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors" type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleRecommendSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* Git URL Input - FIRST CLASS CITIZEN */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                {t('repos:txt_1024')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="https://github.com/org/repo-name or git@github.com:..." 
                value={gitUrl}
                onChange={(e) => handleGitUrlChange(e.target.value)}
                className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
              />
              <p className="text-[10px] text-text-muted mt-1 font-semibold">Supports GitHub, GitLab, Gitee, etc. Auto-extracts Organization & Repository name on entry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  {t('repos:txt_1025')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. microsoft" 
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  {t('repos:txt_1026')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. autogen" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">{t('repos:txt_1027')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. TypeScript, Python, Go" 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">{t('repos:txt_1028')}</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-divider rounded-lg px-3.5 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors focus:bg-panel"
                >
                  {categoriesList.map(c => <option key={c} value={c} className="bg-panel">{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                {t('repos:txt_1029')} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="Briefly describe the repository value..." 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">{t('repos:txt_1030')}</label>
              <textarea 
                rows={3} 
                placeholder="Describe main advantages, features, and why it is useful..." 
                value={recommendReason}
                onChange={(e) => setRecommendReason(e.target.value)}
                className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">{t('repos:txt_1031')}</label>
              <input 
                type="email" 
                placeholder="We may contact you if we need verification..." 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-panel" 
              />
            </div>

          </div>
          <div className="px-6 py-4.5 border-t border-divider bg-panel flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2 text-[13px] font-bold text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-lg text-[13px] font-bold bg-primary-main hover:bg-primary-hover text-white transition-all shadow-md shadow-[var(--color-primary-alpha)] active:scale-[0.98]"
            >
              Submit & Push
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
