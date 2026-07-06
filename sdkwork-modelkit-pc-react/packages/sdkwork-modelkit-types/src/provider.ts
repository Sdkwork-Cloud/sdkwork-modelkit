export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'custom';

export interface ApiAccount {
  id: string;
  name: string;
  provider: LLMProvider;
  apiKey: string;
  isActive: boolean;
}
