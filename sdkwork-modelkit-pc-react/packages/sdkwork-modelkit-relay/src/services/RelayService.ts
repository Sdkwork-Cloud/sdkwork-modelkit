import {
  createCatalogItem,
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
} from '@sdkwork/modelkit-pc-core/sdk';
import { IRelayService, RelayNode, PublishRelayInput } from './types';

function toRelayNode(record: { itemId: string; payload: RelayNode }): RelayNode {
  return {
    ...record.payload,
    id: record.payload.id ?? Date.now(),
  };
}

export class ApiRelayService implements IRelayService {
  async getRelayNodes(): Promise<RelayNode[]> {
    const records = await listCatalogItems<RelayNode>(MODELKIT_CATALOG_DOMAINS.relay);
    return records.map(toRelayNode);
  }

  async getCategories(): Promise<{ id: string; label: string }[]> {
    const categories = await listCatalogCategories(MODELKIT_CATALOG_DOMAINS.relay);
    return categories
      .filter((category) => category !== 'All')
      .map((category) => ({ id: category, label: category }));
  }

  async publishNode(input: PublishRelayInput): Promise<RelayNode> {
    const payload: RelayNode = {
      id: Date.now(),
      name: input.name,
      category: input.category,
      url: input.url,
      desc: input.desc,
      latency: '35ms',
      free: true,
      banner: 'from-blue-600 to-indigo-800',
      screenshots: input.screenshots,
    };
    const record = await createCatalogItem(MODELKIT_CATALOG_DOMAINS.relay, {
      category: input.category,
      payload,
    });
    return toRelayNode(record);
  }
}

export const relayService = new ApiRelayService();
