import {
  createCatalogItem,
  listCatalogCategories,
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
} from '@sdkwork/modelkit-pc-core/sdk';
import { IReposService, RepoItem, RecommendedRepoInput } from './types';

function toRepoItem(record: { itemId: string; payload: RepoItem }): RepoItem {
  return {
    ...record.payload,
    id: record.payload.id ?? Date.now(),
  };
}

export class ApiReposService implements IReposService {
  async getRepos(): Promise<RepoItem[]> {
    const records = await listCatalogItems<RepoItem>(MODELKIT_CATALOG_DOMAINS.repos);
    return records.map(toRepoItem);
  }

  async getCategories(): Promise<string[]> {
    return listCatalogCategories(MODELKIT_CATALOG_DOMAINS.repos);
  }

  async getFeatured(): Promise<RepoItem | null> {
    const repos = await this.getRepos();
    return repos.find((repo) => repo.category === 'Featured') ?? repos[0] ?? null;
  }

  async getTrending(): Promise<RepoItem[]> {
    const repos = await this.getRepos();
    return repos.filter((repo) => repo.trending);
  }

  async getNewReleases(): Promise<RepoItem[]> {
    const repos = await this.getRepos();
    return repos.filter((repo) => repo.category === 'New Releases');
  }

  async submitRecommendRepo(input: RecommendedRepoInput): Promise<RepoItem> {
    const payload: RepoItem = {
      id: Date.now(),
      org: input.org,
      name: input.name,
      desc: input.desc,
      lang: input.lang,
      stars: '0',
      forks: '0',
      category: input.category,
      trending: false,
      banner: 'from-indigo-600 to-violet-800',
      gitUrl: input.gitUrl,
      recommendReason: input.recommendReason,
      contactEmail: input.contactEmail,
    };
    const record = await createCatalogItem(MODELKIT_CATALOG_DOMAINS.repos, {
      category: input.category,
      payload,
    });
    return toRepoItem(record);
  }
}

export const reposService = new ApiReposService();
