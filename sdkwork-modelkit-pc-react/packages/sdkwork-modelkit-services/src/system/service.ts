import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { ISystemService, SystemSettings } from './interface';
import { DEFAULT_SYSTEM_SETTINGS } from './defaults';

export * from './interface';

export class ApiSystemService implements ISystemService {
  async fetchSettings(): Promise<SystemSettings> {
    return loadPreferencePayload(
      MODELKIT_PREFERENCE_NAMESPACES.systemSettings,
      DEFAULT_SYSTEM_SETTINGS,
    );
  }

  async updateSettings(data: Partial<SystemSettings>): Promise<void> {
    const current = await this.fetchSettings();
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.systemSettings, {
      ...current,
      ...data,
    });
  }

  async clearCache(): Promise<void> {
    const current = await this.fetchSettings();
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.systemSettings, {
      ...current,
      semanticCache: false,
      exactMatchCache: false,
    });
  }
}

export const SystemSettingsService = new ApiSystemService();
