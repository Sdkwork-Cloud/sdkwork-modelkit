import { AgentTool } from '@sdkwork/modelkit-types';

export interface AgentConfig {
  id: number;
  name: string;
  task: string;
  model: string;
  type: string;
  skills?: string[];
  mcp?: string[];
}

export const IAgentServiceToken = Symbol.for('IAgentService');

export interface IAgentService {
  fetchAgents(): Promise<AgentConfig[]>;
  createAgent(config?: Partial<AgentConfig>): Promise<AgentConfig>;
  updateAgent(id: number, config: Partial<AgentConfig>): Promise<AgentConfig>;
  deleteAgent(id: number): Promise<void>;
  
  fetchAgentTools(): Promise<AgentTool[]>;
  toggleAgentStatus(id: string, newStatus: AgentTool['status']): Promise<void>;
  updateAgentConfig(id: string, config: any): Promise<void>;
}
