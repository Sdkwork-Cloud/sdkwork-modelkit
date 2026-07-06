export interface MCPConfig {
  id: number;
  name: string;
  author: string;
  desc: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  protocol: 'stdio' | 'sse';
  command?: string;
  url?: string;
  rating: number;
  downloads: string;
  updated: string;
  capabilities: string[];
  resources: number;
  prompts: number;
  tools: number;
}

export interface PromptConfig {
  id: number;
  title: string;
  category: string;
  desc: string;
  usage: number;
  version: string;
  content?: string;
}

export interface SkillConfig {
  id: string; // Changed to string for uuid compatibility
  name: string;
  description: string;
  type: 'function' | 'rest' | 'graphql' | 'webhook';
  tags?: string[];
  active?: boolean;
}

export const IResourcesServiceToken = Symbol.for('IResourcesService');

export interface IResourcesService {
  fetchMCPs(): Promise<MCPConfig[]>;
  toggleMCPStatus(id: number, currentStatus: string): Promise<void>;
  addMCP(config: Partial<MCPConfig>): Promise<MCPConfig>;
  editMCP(id: number, config: Partial<MCPConfig>): Promise<MCPConfig>;
  deleteMCP(id: number): Promise<void>;

  fetchPrompts(): Promise<PromptConfig[]>;
  createPrompt(config: Partial<PromptConfig>): Promise<PromptConfig>;
  deletePrompt(id: number): Promise<void>;

  fetchSkills(): Promise<SkillConfig[]>;
  toggleSkill(id: string, active: boolean): Promise<void>;
  createSkill(config: Partial<SkillConfig>): Promise<SkillConfig>;
  updateSkill(id: string, config: Partial<SkillConfig>): Promise<SkillConfig>;
  deleteSkill(id: string): Promise<void>;
}
