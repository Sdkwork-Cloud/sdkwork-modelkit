import { SystemSettings } from './interface';

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  workspaceDir: '',
  debugLevel: 'info',
  telemetryEnabled: false,
  autoUpdate: true,
  masterOverrideKey: '',
  localEncryption: 'aes-256-gcm',
  sessionTimeoutMinutes: 120,
  proxyEnabled: false,
  proxyProtocol: 'socks5',
  proxyAddress: '',
  sslVerification: true,
  maxConcurrentJobs: 4,
  contextWindowTokens: '32k',
  semanticCache: false,
  exactMatchCache: true,
  language: 'en',
  theme: 'dark',
};
