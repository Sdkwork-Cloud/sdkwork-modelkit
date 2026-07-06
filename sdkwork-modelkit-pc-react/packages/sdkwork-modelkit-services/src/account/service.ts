import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  redeemCommerceCoupon,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { ApiKey, BillingInfo, IAccountService } from './interface';

export * from './interface';

const DEFAULT_BILLING: BillingInfo = {
  balance: 0,
  methods: [],
};

const DEFAULT_API_KEYS: ApiKey[] = [];

export class ApiAccountService implements IAccountService {
  private async loadBilling(): Promise<BillingInfo> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountBilling, DEFAULT_BILLING);
  }

  private async saveBilling(billing: BillingInfo): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountBilling, billing);
  }

  private async loadApiKeys(): Promise<ApiKey[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountApiKeys, DEFAULT_API_KEYS);
  }

  private async saveApiKeys(keys: ApiKey[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.accountApiKeys, keys);
  }

  async fetchBilling(): Promise<BillingInfo> {
    return this.loadBilling();
  }

  async addFunds(amount: number): Promise<void> {
    const billing = await this.loadBilling();
    await this.saveBilling({ ...billing, balance: billing.balance + amount });
  }

  async redeemCode(code: string): Promise<boolean> {
    return redeemCommerceCoupon(code);
  }

  async addMethod(): Promise<void> {
    const billing = await this.loadBilling();
    await this.saveBilling({
      ...billing,
      methods: [
        ...billing.methods,
        { id: Date.now(), type: 'Card', last4: '0000', expiry: '12/2030' },
      ],
    });
  }

  async removeMethod(id: number): Promise<void> {
    const billing = await this.loadBilling();
    await this.saveBilling({
      ...billing,
      methods: billing.methods.filter((method) => method.id !== id),
    });
  }

  async fetchKeys(): Promise<ApiKey[]> {
    return this.loadApiKeys();
  }

  async createKey(name: string): Promise<ApiKey> {
    const keys = await this.loadApiKeys();
    const newKey: ApiKey = {
      id: Date.now(),
      name,
      prefix: 'sk-mk-',
      last4: Math.random().toString(36).substring(2, 6),
      created: new Date().toISOString(),
      lastUsed: 'Never',
    };
    await this.saveApiKeys([...keys, newKey]);
    return newKey;
  }

  async revokeKey(id: number): Promise<void> {
    const keys = await this.loadApiKeys();
    await this.saveApiKeys(keys.filter((key) => key.id !== id));
  }
}

export const BillingService = new ApiAccountService();
export const ApiKeyService = BillingService;
