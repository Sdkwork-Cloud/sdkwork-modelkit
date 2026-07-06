export interface RelayNode {
  id: number;
  name: string;
  category: string;
  url: string;
  desc: string;
  latency: string;
  free: boolean;
  banner: string;
  screenshots: string[];
}

export interface PublishRelayInput {
  name: string;
  category: string;
  url: string;
  desc: string;
  email?: string;
  sourceType: 'git' | 'zip';
  repoUrl?: string;
  zipFileName?: string;
  screenshots: string[];
}

export interface IRelayService {
  getRelayNodes(): Promise<RelayNode[]>;
  getCategories(): Promise<{id: string; label: string}[]>;
  publishNode(input: PublishRelayInput): Promise<RelayNode>;
}
