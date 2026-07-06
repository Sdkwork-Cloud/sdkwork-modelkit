import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService } from '../services/ConfigService';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'zh' | 'en';
  setLanguage: (lang: 'zh' | 'en') => void;
  t: any; // Keep signature compatible temporarily to avoid breaking existing usages until refactored
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { t: i18nT } = useTranslation();
  const [activeTab, setActiveTab] = useState('tools');
  const [language, setLanguageState] = useState<'zh' | 'en'>(configService.getLanguage());

  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(configService.getThemeMode());

  const [themeColor, setThemeColorState] = useState<string>(configService.getThemeColor());

  const setLanguage = (lang: 'zh' | 'en') => {
    setLanguageState(lang);
    configService.setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
    configService.setThemeMode(mode);
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    configService.setThemeColor(color);
  };

  useEffect(() => {
    const applyTheme = () => {
      const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
  }, [themeColor]);

  const t = (key: string, _enFallback?: string) => { const res = i18nT(key); if (res === key && _enFallback) return _enFallback; return res; };

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab, language, setLanguage, t, themeMode, setThemeMode, themeColor, setThemeColor }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
