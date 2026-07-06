import type {
  SdkWorkApiResponse,
  SdkWorkPageData,
  SdkWorkResourceData,
} from '@sdkwork/utils';
import { modelkitApiRequest } from './modelkitApiTransport';

export const MODELKIT_CATALOG_DOMAINS = {
  skillhub: 'skillhub',
  plugins: 'plugins',
  relay: 'relay',
  software: 'software',
  repos: 'repos',
  news: 'news',
  shop: 'shop',
  prompts: 'prompts',
} as const;

export type ModelkitCatalogDomain =
  (typeof MODELKIT_CATALOG_DOMAINS)[keyof typeof MODELKIT_CATALOG_DOMAINS];

export interface CatalogItemRecord<T = Record<string, unknown>> {
  itemId: string;
  domain: string;
  category: string;
  payload: T;
  driveObjectRef?: string;
  version: number;
}

export interface CatalogListQuery {
  category?: string;
  q?: string;
  offset?: number;
  limit?: number;
}

function mapCatalogItem<T>(raw: {
  item_id: string;
  domain: string;
  category: string;
  payload: T;
  drive_object_ref?: string;
  version: number;
}): CatalogItemRecord<T> {
  return {
    itemId: raw.item_id,
    domain: raw.domain,
    category: raw.category,
    payload: raw.payload,
    driveObjectRef: raw.drive_object_ref,
    version: raw.version,
  };
}

export async function listCatalogItems<T = Record<string, unknown>>(
  domain: ModelkitCatalogDomain,
  query: CatalogListQuery = {},
): Promise<CatalogItemRecord<T>[]> {
  const params = new URLSearchParams();
  if (query.category) {
    params.set('category', query.category);
  }
  if (query.q) {
    params.set('q', query.q);
  }
  if (query.offset !== undefined) {
    params.set('offset', String(query.offset));
  }
  if (query.limit !== undefined) {
    params.set('limit', String(query.limit));
  }
  const suffix = params.size > 0 ? `?${params.toString()}` : '';
  const response = await catalogRequest<SdkWorkPageData<{
    item_id: string;
    domain: string;
    category: string;
    payload: T;
    drive_object_ref?: string;
    version: number;
  }>>(`/app/v3/api/modelkit/catalog/${encodeURIComponent(domain)}/items${suffix}`);
  return (response.data.items ?? []).map(mapCatalogItem);
}

export async function createCatalogItem<T = Record<string, unknown>>(
  domain: ModelkitCatalogDomain,
  input: {
    category: string;
    payload: T;
    driveObjectRef?: string;
  },
): Promise<CatalogItemRecord<T>> {
  const response = await catalogRequest<SdkWorkResourceData<{
    item_id: string;
    domain: string;
    category: string;
    payload: T;
    drive_object_ref?: string;
    version: number;
  }>>(`/app/v3/api/modelkit/catalog/${encodeURIComponent(domain)}/items`, {
    method: 'POST',
    body: JSON.stringify({
      category: input.category,
      payload: input.payload,
      drive_object_ref: input.driveObjectRef,
    }),
  });
  return mapCatalogItem(response.data.item);
}

export async function patchCatalogItem<T = Record<string, unknown>>(
  domain: ModelkitCatalogDomain,
  itemId: string,
  payload: T,
): Promise<CatalogItemRecord<T>> {
  const response = await catalogRequest<SdkWorkResourceData<{
    item_id: string;
    domain: string;
    category: string;
    payload: T;
    drive_object_ref?: string;
    version: number;
  }>>(`/app/v3/api/modelkit/catalog/${encodeURIComponent(domain)}/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ payload }),
  });
  return mapCatalogItem(response.data.item);
}

export async function listCatalogCategories(domain: ModelkitCatalogDomain): Promise<string[]> {
  const response = await catalogRequest<SdkWorkResourceData<{ categories: string[] }>>(
    `/app/v3/api/modelkit/catalog/${encodeURIComponent(domain)}/categories`,
  );
  return response.data.item.categories ?? [];
}

async function catalogRequest<TData>(
  path: string,
  init: RequestInit = {},
): Promise<SdkWorkApiResponse<TData>> {
  return modelkitApiRequest<TData>(path, init);
}
