import {
  createCatalogItem,
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
  patchCatalogItem,
} from '@sdkwork/modelkit-pc-core/sdk';
import { IPluginsService, PluginItem, PublishPluginInput } from './types';

function toPluginItem(record: { itemId: string; payload: PluginItem }): PluginItem {
  return {
    ...record.payload,
    id: record.payload.id ?? (Number(record.itemId.replace(/\D/g, '').slice(0, 8)) || Date.now()),
  };
}

export class ApiPluginsService implements IPluginsService {
  async getPlugins(): Promise<PluginItem[]> {
    const records = await listCatalogItems<PluginItem>(MODELKIT_CATALOG_DOMAINS.plugins);
    return records.map(toPluginItem);
  }

  async getCategories(): Promise<string[]> {
    return listCatalogCategories(MODELKIT_CATALOG_DOMAINS.plugins);
  }

  async publishPlugin(input: PublishPluginInput): Promise<PluginItem> {
    const payload: PluginItem = {
      id: Date.now(),
      name: input.name,
      author: input.author,
      downloads: '0k',
      rating: 0,
      type: input.category,
      updated: 'Just now',
      desc: input.desc,
      installedAgents: [],
      icon: 'Box',
      schemaType: input.schemaType,
      authType: input.authType,
      permissions: input.permissions,
      endpoints: [{ method: 'POST', path: '/v1/execute', desc: 'Execute action' }],
    };
    const record = await createCatalogItem(MODELKIT_CATALOG_DOMAINS.plugins, {
      category: input.category,
      payload,
      driveObjectRef: input.artifactUri,
    });
    return toPluginItem(record);
  }

  async installPluginToAgents(pluginId: number, agents: string[]): Promise<void> {
    const records = await listCatalogItems<PluginItem>(MODELKIT_CATALOG_DOMAINS.plugins);
    const target = records.find((record) => record.payload.id === pluginId);
    if (!target) {
      return;
    }
    await patchCatalogItem(MODELKIT_CATALOG_DOMAINS.plugins, target.itemId, {
      ...target.payload,
      installedAgents: Array.from(new Set([...(target.payload.installedAgents ?? []), ...agents])),
    });
  }
}

export const pluginsService = new ApiPluginsService();
