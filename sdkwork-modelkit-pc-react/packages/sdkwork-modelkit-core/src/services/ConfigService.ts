import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { isBlank } from '@sdkwork/utils';

export interface AppConfig {
  language: 'zh' | 'en';
  themeMode: 'light' | 'dark' | 'system';
  themeColor: string;
}

export interface IConfigService {
  getConfig(): Promise<AppConfig>;
  saveConfig(config: AppConfig): Promise<void>;
  getLanguage(): 'zh' | 'en';
  setLanguage(lang: 'zh' | 'en'): void;
  getThemeMode(): 'light' | 'dark' | 'system';
  setThemeMode(mode: 'light' | 'dark' | 'system'): void;
  getThemeColor(): string;
  setThemeColor(color: string): void;
}

const DEFAULT_CONFIG: AppConfig = {
  language: 'en',
  themeMode: 'system',
  themeColor: 'blue',
};

function detectLanguage(): 'zh' | 'en' {
  const navLang = navigator.language?.toLowerCase() || '';
  return navLang.includes('zh') ? 'zh' : 'en';
}

export class ApiConfigService implements IConfigService {
  private cache: AppConfig = { ...DEFAULT_CONFIG, language: detectLanguage() };

  async getConfig(): Promise<AppConfig> {
    this.cache = await loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.uiSettings, this.cache);
    return this.cache;
  }

  async saveConfig(config: AppConfig): Promise<void> {
    this.cache = config;
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.uiSettings, config);
  }

  getLanguage(): 'zh' | 'en' {
    return this.cache.language;
  }

  setLanguage(lang: 'zh' | 'en') {
    void this.saveConfig({ ...this.cache, language: lang });
  }

  getThemeMode(): 'light' | 'dark' | 'system' {
    return this.cache.themeMode;
  }

  setThemeMode(mode: 'light' | 'dark' | 'system') {
    void this.saveConfig({ ...this.cache, themeMode: mode });
  }

  getThemeColor(): string {
    return isBlank(this.cache.themeColor) ? 'blue' : this.cache.themeColor;
  }

  setThemeColor(color: string) {
    void this.saveConfig({ ...this.cache, themeColor: color });
  }
}

export const configService = new ApiConfigService();
