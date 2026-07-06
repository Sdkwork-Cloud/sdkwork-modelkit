import { useAppContext } from '@sdkwork/modelkit-core';
import React from 'react';
import { Shield } from 'lucide-react';
import { Article } from '../services/types';

interface NewsDetailsViewProps {
  article: Article;
  onBack: () => void;
}

export function NewsDetailsView({ article, onBack }: NewsDetailsViewProps) {
  const { t } = useAppContext();
  return (
    <div className="bg-white dark:bg-panel rounded-xl shadow-sm border border-gray-100 dark:border-divider-strong p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="mb-8 text-[13px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#0055ff] dark:hover:text-primary-light transition-colors flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        {t('news:txt_1000')}
      </button>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5 leading-snug">
        {article.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-500 dark:text-gray-400 mb-8 font-medium pb-6 border-b border-gray-100 dark:border-divider-strong">
        <span className="flex items-center gap-1.5"><Shield size={14}/> {t('news:author_label', 'Author')}: {article.author}</span>
        <span>{t('news:date_label', 'Date')}: {article.date}</span>
        <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded text-gray-600 dark:text-gray-300">{article.category}</span>
      </div>
      
      {article.image && (
        <div className="mb-10 rounded-xl overflow-hidden border border-gray-100 dark:border-divider max-h-[450px]">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      )}
      
      <div className="text-[15px] prose-slate dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 leading-[1.8]">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-divider-strong border-dashed pt-2">
          【{t('news:excerpt_label', 'Summary')}】 {article.excerpt.replace('...', '')}
        </p>
        {article.content ? (
          <div className="whitespace-pre-line">
            {article.content}
          </div>
        ) : (
          <>
            <p className="mb-5">{t('news:txt_1001')}</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 flex items-center gap-2"><div className="w-1.5 h-5 bg-[#0055ff] rounded-full"></div> {t('news:txt_1002')}</h3>
            <p className="mb-5">{t('news:txt_1003')}</p>
            <p className="mb-5">{t('news:txt_1004')}</p>
            <div className="bg-gray-50 dark:bg-[#1a1a1b] p-5 rounded-lg border border-gray-200 dark:border-[#333] my-6 font-mono text-[13px] text-gray-600 dark:text-gray-400 overflow-x-auto shadow-inner">
              $ curl -H "X-Vuln-Payload: &lt;encoded_exploit&gt;" https://target-system/api/v1/auth/bypass<br/>
              &gt; HTTP/1.1 200 OK<br/>
              &gt; {`{"status":"success","session_token":"admin_..."}`}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 flex items-center gap-2"><div className="w-1.5 h-5 bg-[#00e5ff] rounded-full"></div> {t('news:txt_1005')}</h3>
            <p className="mb-5">{t('news:txt_1006')}</p>
            <p className="mb-2">{t('news:txt_1007')}</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t('news:txt_1008')}</li>
              <li>{t('news:txt_1009')}</li>
              <li>{t('news:txt_1010')}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
