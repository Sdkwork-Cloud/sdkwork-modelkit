import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import {
  IResourcesService,
  MCPConfig,
  PromptConfig,
  SkillConfig,
} from './interface';

export * from './interface';

interface WorkspaceResourcesPayload {
  mcps: MCPConfig[];
  prompts: PromptConfig[];
  skills: SkillConfig[];
}

const DEFAULT_RESOURCES: WorkspaceResourcesPayload = {
  mcps: [],
  prompts: [],
  skills: [],
};

export class ApiResourcesService implements IResourcesService {
  private async loadState(): Promise<WorkspaceResourcesPayload> {
    return loadPreferencePayload(
      MODELKIT_PREFERENCE_NAMESPACES.workspaceResources,
      DEFAULT_RESOURCES,
    );
  }

  private async saveState(state: WorkspaceResourcesPayload): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceResources, state);
  }

  async fetchMCPs(): Promise<MCPConfig[]> {
    return (await this.loadState()).mcps;
  }

  async toggleMCPStatus(id: number, currentStatus: string): Promise<void> {
    const state = await this.loadState();
    const item = state.mcps.find((mcp) => mcp.id === id);
    if (!item) {
      return;
    }
    item.status = currentStatus === 'connected' ? 'disconnected' : 'connected';
    await this.saveState(state);
  }

  async addMCP(config: Partial<MCPConfig>): Promise<MCPConfig> {
    const state = await this.loadState();
    const newMcp: MCPConfig = {
      id: Date.now(),
      name: config.name || 'New MCP Server',
      author: config.author || '@local',
      desc: config.desc || 'Custom server',
      type: config.type || 'Core',
      status: config.status || 'disconnected',
      protocol: config.protocol || 'stdio',
      rating: config.rating ?? 5,
      downloads: config.downloads || '0',
      updated: config.updated || 'just now',
      capabilities: config.capabilities || ['Custom'],
      resources: config.resources ?? 0,
      prompts: config.prompts ?? 0,
      tools: config.tools ?? 1,
      ...config,
    };
    state.mcps.push(newMcp);
    await this.saveState(state);
    return newMcp;
  }

  async editMCP(id: number, config: Partial<MCPConfig>): Promise<MCPConfig> {
    const state = await this.loadState();
    const index = state.mcps.findIndex((mcp) => mcp.id === id);
    if (index === -1) {
      throw new Error('MCP Server not found');
    }
    state.mcps[index] = { ...state.mcps[index], ...config };
    await this.saveState(state);
    return state.mcps[index];
  }

  async deleteMCP(id: number): Promise<void> {
    const state = await this.loadState();
    state.mcps = state.mcps.filter((mcp) => mcp.id !== id);
    await this.saveState(state);
  }

  async fetchPrompts(): Promise<PromptConfig[]> {
    return (await this.loadState()).prompts;
  }

  async createPrompt(config: Partial<PromptConfig>): Promise<PromptConfig> {
    const state = await this.loadState();
    const newPrompt: PromptConfig = {
      id: Date.now(),
      title: config.title || 'New Prompt',
      category: config.category || 'Uncategorized',
      desc: config.desc || 'Empty prompt template',
      usage: config.usage ?? 0,
      version: config.version || 'v1.0',
      ...config,
    };
    state.prompts.push(newPrompt);
    await this.saveState(state);
    return newPrompt;
  }

  async deletePrompt(id: number): Promise<void> {
    const state = await this.loadState();
    state.prompts = state.prompts.filter((prompt) => prompt.id !== id);
    await this.saveState(state);
  }

  async fetchSkills(): Promise<SkillConfig[]> {
    return (await this.loadState()).skills;
  }

  async toggleSkill(id: string, active: boolean): Promise<void> {
    const state = await this.loadState();
    const item = state.skills.find((skill) => skill.id === id);
    if (item) {
      item.active = active;
      await this.saveState(state);
    }
  }

  async createSkill(config: Partial<SkillConfig>): Promise<SkillConfig> {
    const state = await this.loadState();
    const newSkill: SkillConfig = {
      id: Date.now().toString(),
      name: config.name || 'New Skill',
      description: config.description || 'Empty skill template',
      type: config.type || 'function',
      tags: config.tags || ['Custom'],
      active: config.active ?? false,
      ...config,
    };
    state.skills.push(newSkill);
    await this.saveState(state);
    return newSkill;
  }

  async updateSkill(id: string, config: Partial<SkillConfig>): Promise<SkillConfig> {
    const state = await this.loadState();
    const index = state.skills.findIndex((skill) => skill.id === id);
    if (index === -1) {
      throw new Error('Skill not found');
    }
    state.skills[index] = { ...state.skills[index], ...config };
    await this.saveState(state);
    return state.skills[index];
  }

  async deleteSkill(id: string): Promise<void> {
    const state = await this.loadState();
    state.skills = state.skills.filter((skill) => skill.id !== id);
    await this.saveState(state);
  }
}

export const ResourcesService = new ApiResourcesService();
