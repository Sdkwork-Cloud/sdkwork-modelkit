import {
  listCatalogItems,
  MODELKIT_CATALOG_DOMAINS,
} from '@sdkwork/modelkit-pc-core/sdk';
import {
  Article,
  BannerInfo,
  HotArticle,
  INewsService,
  NewsCategory,
  SeebugPaper,
} from './types';

type NewsPayload = Article & {
  hot?: boolean;
  views?: number;
  bannerTag?: string;
  bannerDescription?: string;
};

export class ApiNewsService implements INewsService {
  private async loadItems(): Promise<NewsPayload[]> {
    const records = await listCatalogItems<NewsPayload>(MODELKIT_CATALOG_DOMAINS.news);
    return records.map((record) => record.payload);
  }

  async getCategories(): Promise<NewsCategory[]> {
    const items = await this.loadItems();
    const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return categories.map((name) => ({ id: name.toLowerCase(), name }));
  }

  async getArticles(categoryName: string): Promise<Article[]> {
    const items = await this.loadItems();
    if (!categoryName || categoryName === 'All') {
      return items;
    }
    return items.filter((item) => item.category === categoryName);
  }

  async getArticleById(id: number): Promise<Article | null> {
    const items = await this.loadItems();
    return items.find((item) => item.id === id) ?? null;
  }

  async getHotArticles(): Promise<HotArticle[]> {
    const items = await this.loadItems();
    return items
      .filter((item) => item.hot)
      .map((item) => ({
        id: item.id,
        title: item.title,
        views: item.views ?? 0,
      }));
  }

  async getSeebugPapers(): Promise<SeebugPaper[]> {
    const items = await this.loadItems();
    return items
      .filter((item) => item.category === 'Seebug')
      .map((item) => ({
        id: item.id,
        title: item.title,
        date: item.date,
      }));
  }

  async getBannerInfo(): Promise<BannerInfo> {
    const items = await this.loadItems();
    const featured = items[0];
    return {
      tag: featured?.bannerTag ?? featured?.category ?? 'Modelkit',
      title: featured?.title ?? 'Modelkit News',
      description: featured?.bannerDescription ?? featured?.excerpt ?? 'Latest updates from Modelkit.',
    };
  }
}

export const newsService = new ApiNewsService();
