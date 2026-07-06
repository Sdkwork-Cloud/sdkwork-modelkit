export interface PaymentMethod {
  id: number;
  type: string;
  last4: string;
  expiry: string;
}

export interface BillingInfo {
  balance: number;
  methods: PaymentMethod[];
}

export interface ApiKey {
  id: number;
  name: string;
  prefix: string;
  last4: string;
  created: string;
  lastUsed: string;
}

export const IAccountServiceToken = Symbol.for('IAccountService');

export interface IAccountService {
  fetchBilling(): Promise<BillingInfo>;
  addFunds(amount: number): Promise<void>;
  redeemCode(code: string): Promise<boolean>;
  addMethod(params?: any): Promise<void>;
  removeMethod(id: number): Promise<void>;

  fetchKeys(): Promise<ApiKey[]>;
  createKey(name: string): Promise<ApiKey>;
  revokeKey(id: number): Promise<void>;
}
