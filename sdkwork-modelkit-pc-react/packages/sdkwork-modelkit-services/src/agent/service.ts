import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { AgentTool } from '@sdkwork/modelkit-types';
import { AgentConfig, IAgentService } from './interface';
import { buildUnifiedAgentTools } from './agentToolsCatalog';

interface AgentToolOverrides {
  status?: AgentTool['status'];
  config?: AgentTool['config'];
}

type AgentToolsState = Record<string, AgentToolOverrides>;

const DEFAULT_AGENTS: AgentConfig[] = [];

export class ApiAgentService implements IAgentService {
  private async loadAgents(): Promise<AgentConfig[]> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceAgents, DEFAULT_AGENTS);
  }

  private async saveAgents(agents: AgentConfig[]): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceAgents, agents);
  }

  private async loadToolOverrides(): Promise<AgentToolsState> {
    return loadPreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceAgentTools, {});
  }

  private async saveToolOverrides(state: AgentToolsState): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.workspaceAgentTools, state);
  }

  private mergeAgentTools(overrides: AgentToolsState): AgentTool[] {
    return buildUnifiedAgentTools().map((tool) => {
      const override = overrides[tool.id];
      if (!override) {
        return tool;
      }
      return {
        ...tool,
        status: override.status ?? tool.status,
        config: { ...tool.config, ...override.config },
      };
    });
  }

  async fetchAgents(): Promise<AgentConfig[]> {
    return this.loadAgents();
  }

  async createAgent(config?: Partial<AgentConfig>): Promise<AgentConfig> {
    const agents = await this.loadAgents();
    const newAgent: AgentConfig = {
      id: Date.now(),
      name: config?.name || 'New Agent',
      task: config?.task || 'A new empty agent.',
      model: config?.model || 'gpt-4o',
      type: config?.type || 'Assistant',
      skills: config?.skills || [],
      mcp: config?.mcp || [],
      ...config,
    };
    await this.saveAgents([...agents, newAgent]);
    return newAgent;
  }

  async updateAgent(id: number, config: Partial<AgentConfig>): Promise<AgentConfig> {
    const agents = await this.loadAgents();
    const index = agents.findIndex((agent) => agent.id === id);
    if (index === -1) {
      throw new Error('Agent not found');
    }
    const updated = { ...agents[index], ...config };
    const next = [...agents];
    next[index] = updated;
    await this.saveAgents(next);
    return updated;
  }

  async deleteAgent(id: number): Promise<void> {
    const agents = await this.loadAgents();
    await this.saveAgents(agents.filter((agent) => agent.id !== id));
  }

  async fetchAgentTools(): Promise<AgentTool[]> {
    const overrides = await this.loadToolOverrides();
    return this.mergeAgentTools(overrides);
  }

  async toggleAgentStatus(id: string, newStatus: AgentTool['status']): Promise<void> {
    const overrides = await this.loadToolOverrides();
    overrides[id] = { ...overrides[id], status: newStatus };
    await this.saveToolOverrides(overrides);
  }

  async updateAgentConfig(id: string, config: AgentTool['config']): Promise<void> {
    const overrides = await this.loadToolOverrides();
    overrides[id] = {
      ...overrides[id],
      config: { ...overrides[id]?.config, ...config },
    };
    await this.saveToolOverrides(overrides);
  }
}

export const AgentService = new ApiAgentService();

export const fetchAgents = AgentService.fetchAgents.bind(AgentService);
export const createAgent = AgentService.createAgent.bind(AgentService);
export const deleteAgent = AgentService.deleteAgent.bind(AgentService);
export const fetchAgentTools = AgentService.fetchAgentTools.bind(AgentService);
export const toggleAgentStatus = AgentService.toggleAgentStatus.bind(AgentService);
export const updateAgentConfig = AgentService.updateAgentConfig.bind(AgentService);
