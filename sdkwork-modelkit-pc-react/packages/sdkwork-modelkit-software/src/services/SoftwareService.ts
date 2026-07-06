import {
  createCatalogItem,
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
  patchCatalogItem,
} from '@sdkwork/modelkit-pc-core/sdk';
import { ISoftwareService, SoftwareItem, SoftwareSubmitInput } from './types';

function toSoftwareItem(record: { itemId: string; payload: SoftwareItem }): SoftwareItem {
  return {
    ...record.payload,
    id: record.payload.id ?? Date.now(),
  };
}

export class ApiSoftwareService implements ISoftwareService {
  async getSoftwareList(): Promise<SoftwareItem[]> {
    const records = await listCatalogItems<SoftwareItem>(MODELKIT_CATALOG_DOMAINS.software);
    return records.map(toSoftwareItem);
  }

  async getCategories(): Promise<string[]> {
    return listCatalogCategories(MODELKIT_CATALOG_DOMAINS.software);
  }

  async submitSoftware(input: SoftwareSubmitInput): Promise<SoftwareItem> {
    const payload: SoftwareItem = {
      id: Date.now(),
      name: input.name,
      icon: 'AppWindow',
      version: input.version,
      publisher: input.publisher,
      type: input.category,
      os: input.os,
      size: input.size,
      desc: input.desc,
      tags: [],
      installed: false,
      rating: 0,
      banner: 'from-slate-700 to-slate-900',
      website: input.website,
      screenshots: [],
    };
    const record = await createCatalogItem(MODELKIT_CATALOG_DOMAINS.software, {
      category: input.category,
      payload,
    });
    return toSoftwareItem(record);
  }

  async installSoftware(id: number): Promise<void> {
    await this.setInstalled(id, true);
  }

  async uninstallSoftware(id: number): Promise<void> {
    await this.setInstalled(id, false);
  }

  private async setInstalled(id: number, installed: boolean): Promise<void> {
    const records = await listCatalogItems<SoftwareItem>(MODELKIT_CATALOG_DOMAINS.software);
    const target = records.find((record) => record.payload.id === id);
    if (!target) {
      return;
    }
    await patchCatalogItem(MODELKIT_CATALOG_DOMAINS.software, target.itemId, {
      ...target.payload,
      installed,
    });
  }
}

export const softwareService = new ApiSoftwareService();
