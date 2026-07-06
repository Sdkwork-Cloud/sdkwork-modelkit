import type { SdkWorkResourceData } from '@sdkwork/utils';
import {
  modelkitApiRequest,
  readModelkitAccessToken,
  readModelkitAuthToken,
  readModelkitApiBaseUrl,
} from './modelkitApiTransport';

export const MODELKIT_PREFERENCE_NAMESPACES = {
  workspaceApiKeys: 'workspace.api_keys',
  workspaceRelays: 'workspace.relays',
  workspaceProviders: 'workspace.providers',
  workspaceRequestLogs: 'workspace.request_logs',
  workspaceVip: 'workspace.vip',
  workspaceAgents: 'workspace.agents',
  workspaceResources: 'workspace.resources',
  workspaceAgentTools: 'workspace.agent_tools',
  accountBilling: 'account.billing',
  accountApiKeys: 'account.api_keys',
  userProfile: 'user.profile',
  systemSettings: 'system.settings',
  shopCart: 'shop.cart',
  shopOrders: 'shop.orders',
  uiSettings: 'ui.settings',
} as const;

export type ModelkitPreferenceNamespace =
  (typeof MODELKIT_PREFERENCE_NAMESPACES)[keyof typeof MODELKIT_PREFERENCE_NAMESPACES];

export interface PreferenceRecord<T> {
  namespace: string;
  payload: T;
  version: number;
}

export interface ModelkitAppApiClientConfig {
  baseUrl?: string;
  accessToken?: string;
  authToken?: string;
}

export class ModelkitAppApiClient {
  private readonly baseUrl: string;
  private readonly accessToken?: string;
  private readonly authToken?: string;

  constructor(config?: Partial<ModelkitAppApiClientConfig>) {
    this.baseUrl = (config?.baseUrl || readModelkitApiBaseUrl()).replace(/\/$/, '');
    this.accessToken = config?.accessToken ?? readModelkitAccessToken();
    this.authToken = config?.authToken ?? readModelkitAuthToken();
  }

  async getPreference<T>(namespace: ModelkitPreferenceNamespace): Promise<PreferenceRecord<T> | null> {
    const response = await this.request<SdkWorkResourceData<PreferenceRecord<T>>>(
      `/app/v3/api/modelkit/preferences/${encodeURIComponent(namespace)}`,
      { method: 'GET' },
    );
    return response.data.item;
  }

  async putPreference<T>(
    namespace: ModelkitPreferenceNamespace,
    payload: T,
  ): Promise<PreferenceRecord<T>> {
    const response = await this.request<SdkWorkResourceData<PreferenceRecord<T>>>(
      `/app/v3/api/modelkit/preferences/${encodeURIComponent(namespace)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ payload }),
      },
    );
    return response.data.item;
  }

  private request<TData>(path: string, init: RequestInit) {
    return modelkitApiRequest<TData>(path, init, {
      baseUrl: this.baseUrl,
      accessToken: this.accessToken,
      authToken: this.authToken,
    });
  }
}

let singletonClient: ModelkitAppApiClient | undefined;
let singletonConfig: ModelkitAppApiClientConfig | undefined;

export function getModelkitAppApiClient(): ModelkitAppApiClient {
  if (!singletonClient) {
    singletonClient = new ModelkitAppApiClient();
    singletonConfig = {};
  }
  return singletonClient;
}

export function configureModelkitAppApiClient(config: ModelkitAppApiClientConfig): ModelkitAppApiClient {
  singletonConfig = config;
  singletonClient = new ModelkitAppApiClient(config);
  return singletonClient;
}

export function refreshModelkitAppApiClientSession(): void {
  if (!singletonConfig) {
    return;
  }
  singletonClient = new ModelkitAppApiClient({
    ...singletonConfig,
    accessToken: readModelkitAccessToken(),
    authToken: readModelkitAuthToken(),
  });
}
