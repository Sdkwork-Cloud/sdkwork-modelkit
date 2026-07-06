export interface RepoItem {
  id: number;
  org: string;
  name: string;
  desc: string;
  lang: string;
  stars: string;
  forks: string;
  category: string;
  trending: boolean;
  banner: string;
  gitUrl?: string;
  recommendReason?: string;
  contactEmail?: string;
}

export interface RecommendedRepoInput {
  org: string;
  name: string;
  desc: string;
  lang: string;
  category: string;
  gitUrl: string;
  recommendReason?: string;
  contactEmail?: string;
}

export interface IReposService {
  getRepos(): Promise<RepoItem[]>;
  getCategories(): Promise<string[]>;
  getFeatured(): Promise<RepoItem | null>;
  getTrending(): Promise<RepoItem[]>;
  getNewReleases(): Promise<RepoItem[]>;
  submitRecommendRepo(input: RecommendedRepoInput): Promise<RepoItem>;
}
