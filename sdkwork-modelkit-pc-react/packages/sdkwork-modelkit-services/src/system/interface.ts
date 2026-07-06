export interface SystemSettings {
  // General
  workspaceDir: string;
  debugLevel: 'debug' | 'info' | 'warn' | 'error';
  telemetryEnabled: boolean;
  autoUpdate: boolean;

  // Security
  masterOverrideKey: string;
  localEncryption: 'aes-256-gcm' | 'chacha20' | 'none';
  sessionTimeoutMinutes: number;

  // Network
  proxyEnabled: boolean;
  proxyProtocol: 'http' | 'socks5';
  proxyAddress: string;
  sslVerification: boolean;

  // Engine Limits
  maxConcurrentJobs: number;
  contextWindowTokens: '4k' | '16k' | '32k' | '128k';
  semanticCache: boolean;
  exactMatchCache: boolean;

  // UI
  language: string;
  theme: string;
}

export const ISystemServiceToken = Symbol.for('ISystemService');

export interface ISystemService {
  fetchSettings(): Promise<SystemSettings>;
  updateSettings(data: Partial<SystemSettings>): Promise<void>;
  clearCache(): Promise<void>;
}

