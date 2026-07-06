export type ToolStatus = 'installed' | 'uninstalled' | 'running' | 'error';

export interface AgentToolConfig {
  autoApprove?: boolean;
  fileSystemAccess?: 'read-only' | 'read-write' | 'none';
  allowedCommands?: string[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
  [key: string]: any;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: ToolStatus;
  config: AgentToolConfig;
  systemRequirements?: string[];
}

