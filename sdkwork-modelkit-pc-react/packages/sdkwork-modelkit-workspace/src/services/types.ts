export interface LocalApiKey {
  id: string;
  name: string;
  key: string;
  baseUrl?: string;
  enabled: boolean;
  timeAdded: string;
  relayId?: string;
}

export interface LocalRelay {
  id: string;
  name: string;
  port: number | '';
  status: 'running' | 'stopped';
  providers: string[];
  protocols: string[];
  enabledTools?: string[];
  modelMappings?: Array<{
    id: string;
    sourceModel: string;
    targetModel: string;
    toolId: string;
    enabled: boolean;
  }>;
}

export interface ProviderData {
  id: string;
  name: string;
  url: string;
  initial?: string;
  openaiUrl?: string;
  anthropicUrl?: string;
  geminiUrl?: string;
  modelId?: string;
  apiKey?: string;
  enabled?: boolean;
  remark?: string;
  endpoint?: string;
  icon?: string;
  defaultModel?: string;
  maxRetries?: number;
  timeoutMs?: number;
  enableProxy?: boolean;
  customHeaders?: string;
  enableSpeedCheck?: boolean;
  enableHealthCheck?: boolean;
  concurrencyLimit?: number;
  apiFormat?: string;
  authField?: string;
  claudeModels?: {
    mainModel?: string;
    thinkingModel?: string;
    haikuModel?: string;
    sonnetModel?: string;
    opusModel?: string;
  };
}

export interface RequestLog {
  id: string;
  time: string;
  tool: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | string;
  path: string;
  relay: string;
  status: number;
  duration: number; // in ms
  size: string;
  payload: string;
  response: string;
  ip: string;
  provider?: string;
  model?: string;
}

export interface VipStatus {
  isActive: boolean;
  plan: string;
  cycle: string;
  date: string;
}

export interface IWorkspaceService {
  // API Keys
  getApiKeys(): Promise<LocalApiKey[]>;
  saveApiKeys(keys: LocalApiKey[]): Promise<void>;
  
  // Relays / Providers
  getRelays(): Promise<LocalRelay[]>;
  saveRelays(relays: LocalRelay[]): Promise<void>;

  getProviders(): Promise<ProviderData[]>;
  saveProviders(providers: ProviderData[]): Promise<void>;

  // Logs
  getRequestLogs(): Promise<RequestLog[]>;
  saveRequestLogs(logs: RequestLog[]): Promise<void>;
  clearRequestLogs(): Promise<void>;
  addRequestLog(log: Omit<RequestLog, 'id' | 'time'> & Partial<Pick<RequestLog, 'id' | 'time'>>): Promise<RequestLog>;

  // VIP
  getVipStatus(): Promise<VipStatus>;
  setVipStatus(status: VipStatus | null): Promise<void>;
  purchaseVipPlan(input: {
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'yearly';
    price: number;
  }): Promise<{ vipStatus: VipStatus; remainingBalance: number }>;
}


