import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  purchaseVipWithWallet,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { uuid } from '@sdkwork/utils';
import { IWorkspaceService, LocalApiKey, LocalRelay, ProviderData, RequestLog, VipStatus } from './types';

const DEFAULT_API_KEYS: LocalApiKey[] = [];
const DEFAULT_PROVIDERS: ProviderData[] = [];
const DEFAULT_RELAYS: LocalRelay[] = [];
const DEFAULT_LOGS: RequestLog[] = [];
const DEFAULT_VIP: VipStatus = { isActive: false, plan: 'Free', cycle: 'monthly', date: '' };

export class ApiWorkspaceService implements IWorkspaceService {
  async getApiKeys(): Promise<LocalApiKey[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceApiKeys, DEFAULT_API_KEYS);
  }

  async saveApiKeys(keys: LocalApiKey[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceApiKeys, keys);
  }

  async getRelays(): Promise<LocalRelay[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceRelays, DEFAULT_RELAYS);
  }

  async saveRelays(relays: LocalRelay[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceRelays, relays);
  }

  async getProviders(): Promise<ProviderData[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceProviders, DEFAULT_PROVIDERS);
  }

  async saveProviders(providers: ProviderData[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceProviders, providers);
  }

  async getRequestLogs(): Promise<RequestLog[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceRequestLogs, DEFAULT_LOGS);
  }

  async saveRequestLogs(logs: RequestLog[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceRequestLogs, logs);
  }

  async clearRequestLogs(): Promise<void> {
    await this.saveRequestLogs([]);
  }

  async addRequestLog(log: Omit<RequestLog, 'id' | 'time'> & Partial<Pick<RequestLog, 'id' | 'time'>>): Promise<RequestLog> {
    const logs = await this.getRequestLogs();
    const entry: RequestLog = {
      id: log.id || uuid(),
      time: log.time || new Date().toISOString(),
      tool: log.tool,
      method: log.method,
      path: log.path,
      relay: log.relay,
      status: log.status,
      duration: log.duration,
      size: log.size,
      payload: log.payload,
      response: log.response,
      ip: log.ip,
      provider: log.provider,
      model: log.model,
    };
    await this.saveRequestLogs([entry, ...logs]);
    return entry;
  }

  async getVipStatus(): Promise<VipStatus> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceVip, DEFAULT_VIP);
  }

  async setVipStatus(status: VipStatus | null): Promise<void> {
    if (!status) {
      await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceVip, DEFAULT_VIP);
      return;
    }
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceVip, status);
  }

  async purchaseVipPlan(input: {
    planId: string;
    planName: string;
    billingCycle: 'monthly' | 'yearly';
    price: number;
  }): Promise<{ vipStatus: VipStatus; remainingBalance: number }> {
    return purchaseVipWithWallet(input);
  }
}

export const workspaceService = new ApiWorkspaceService();
