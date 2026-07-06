import {
  createCatalogItem,
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
  patchCatalogItem,
  type ModelkitCatalogDomain,
} from '@sdkwork/modelkit-pc-core/sdk';
import { ISkillhubService, SkillItem, PublishSkillInput } from './types';

function toSkillItem(record: { itemId: string; payload: SkillItem }): SkillItem {
  return {
    ...record.payload,
    id: record.payload.id ?? record.itemId,
  };
}

function buildPublishPayload(input: PublishSkillInput): SkillItem {
  return {
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
}

export class ApiSkillhubService implements ISkillhubService {
  async getSkills(): Promise<SkillItem[]> {
    const records = await listCatalogItems<SkillItem>(MODELKIT_CATALOG_DOMAINS.skillhub);
    return records.map(toSkillItem);
  }

  async getCategories(): Promise<string[]> {
    return listCatalogCategories(MODELKIT_CATALOG_DOMAINS.skillhub);
  }

  async publishSkill(input: PublishSkillInput): Promise<SkillItem> {
    const payload = buildPublishPayload(input);
    const record = await createCatalogItem(MODELKIT_CATALOG_DOMAINS.skillhub, {
      category: input.category,
      payload,
      driveObjectRef: input.artifactUri,
    });
    return toSkillItem(record);
  }

  async installSkillToAgents(skillId: number, agents: string[]): Promise<void> {
    const records = await listCatalogItems<SkillItem>(MODELKIT_CATALOG_DOMAINS.skillhub);
    const target = records.find((record) => record.payload.id === skillId);
    if (!target) {
      return;
    }
    const nextAgents = Array.from(new Set([...(target.payload.installedAgents ?? []), ...agents]));
    await patchCatalogItem(MODELKIT_CATALOG_DOMAINS.skillhub, target.itemId, {
      ...target.payload,
      installedAgents: nextAgents,
    });
  }
}

export const skillhubService = new ApiSkillhubService();
