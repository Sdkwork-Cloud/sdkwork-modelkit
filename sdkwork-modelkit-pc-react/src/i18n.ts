import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonEn from './locales/en/common.json';
import commonZh from './locales/zh/common.json';

import workspaceEn from './locales/en/workspace.json';
import workspaceZh from './locales/zh/workspace.json';

import shopEn from './locales/en/shop.json';
import shopZh from './locales/zh/shop.json';

import relayEn from './locales/en/relay.json';
import relayZh from './locales/zh/relay.json';

import softwareEn from './locales/en/software.json';
import softwareZh from './locales/zh/software.json';

import newsEn from './locales/en/news.json';
import newsZh from './locales/zh/news.json';

import reposEn from './locales/en/repos.json';
import reposZh from './locales/zh/repos.json';

import skillhubEn from './locales/en/skillhub.json';
import skillhubZh from './locales/zh/skillhub.json';
import pluginsEn from './locales/en/plugins.json';
import pluginsZh from './locales/zh/plugins.json';

import promptsEn from './locales/en/prompts.json';
import promptsZh from './locales/zh/prompts.json';

const resources = {
  en: {
    common: commonEn,
    workspace: workspaceEn,
    shop: shopEn,
    relay: relayEn,
    software: softwareEn,
    news: newsEn,
    repos: reposEn,
    skillhub: skillhubEn,
    plugins: pluginsEn,
    prompts: promptsEn,
  },
  zh: {
    common: commonZh,
    workspace: workspaceZh,
    shop: shopZh,
    relay: relayZh,
    software: softwareZh,
    news: newsZh,
    repos: reposZh,
    skillhub: skillhubZh,
    plugins: pluginsZh,
    prompts: promptsZh,
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common', 'workspace', 'shop', 'relay', 'software', 'news', 'repos', 'skillhub', 'prompts', 'plugins'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
