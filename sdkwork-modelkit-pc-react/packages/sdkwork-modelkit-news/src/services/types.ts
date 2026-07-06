export interface NewsCategory {
  id: string;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export interface HotArticle {
  id: number;
  title: string;
  views: number;
}

export interface SeebugPaper {
  id: number;
  title: string;
  date: string;
}

export interface BannerInfo {
  tag: string;
  title: string;
  description: string;
}

export interface INewsService {
  getCategories(): Promise<NewsCategory[]>;
  getArticles(categoryName: string): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | null>;
  getHotArticles(): Promise<HotArticle[]>;
  getSeebugPapers(): Promise<SeebugPaper[]>;
  getBannerInfo(): Promise<BannerInfo>;
}
