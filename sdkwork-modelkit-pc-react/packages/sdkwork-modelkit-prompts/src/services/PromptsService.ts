import {
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
} from '@sdkwork/modelkit-pc-core/sdk';

export interface PromptItem {
  id: string;
  type: string;
  title: string;
  content: string;
  views: number;
  author: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  iconType: string;
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  all: 'zap',
  text: 'terminal',
  agent: 'zap',
  image: 'image',
  video: 'video',
  music: 'music',
  sound: 'sound',
};

function toPromptItem(record: { itemId: string; payload: PromptItem }): PromptItem {
  return {
    ...record.payload,
    id: record.payload.id || record.itemId,
  };
}

export class ApiPromptsService {
  async getPrompts(): Promise<PromptItem[]> {
    const records = await listCatalogItems<PromptItem>(MODELKIT_CATALOG_DOMAINS.prompts);
    return records.map(toPromptItem);
  }

  async getCategories(): Promise<PromptCategory[]> {
    const categories = await listCatalogCategories(MODELKIT_CATALOG_DOMAINS.prompts);
    return categories.map((id) => ({
      id,
      label: id === 'all' ? 'prompts:type_all' : `prompts:type_${id}`,
      iconType: CATEGORY_ICON_MAP[id] || 'zap',
    }));
  }
}

export const promptsService = new ApiPromptsService();
