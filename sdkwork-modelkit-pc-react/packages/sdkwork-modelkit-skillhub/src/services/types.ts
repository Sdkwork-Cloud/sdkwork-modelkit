export interface SkillEndpoint {
  method: string;
  path: string;
  desc: string;
}

export interface SkillItem {
  id: number;
  name: string;
  author: string;
  downloads: string;
  rating: number;
  type: string;
  updated: string;
  desc: string;
  installedAgents: string[];
  icon: any; // We will use a string internally or map it, but for UI we might map icon names -> React components
  schemaType: string;
  authType: string;
  permissions: string[];
  endpoints: SkillEndpoint[];
}

export interface PublishSkillInput {
  name: string;
  author: string;
  category: string;
  desc: string;
  schemaType: string;
  authType: string;
  permissions: string[];
  sourceType: 'repo' | 'zip';
  repoUrl?: string;
  fileName?: string;
  artifactUri?: string;
}

export interface ISkillhubService {
  getSkills(): Promise<SkillItem[]>;
  getCategories(): Promise<string[]>;
  publishSkill(input: PublishSkillInput): Promise<SkillItem>;
  installSkillToAgents(skillId: number, agents: string[]): Promise<void>;
}
