import { AgentToolConfig } from '@sdkwork/modelkit-types';

export const DEFAULT_TOOL_CONFIGS: Record<string, AgentToolConfig> = {
  'claude-code': {
    model: "claude-3-5-sonnet-20241022",
    autoApprove: false,
    fileSystemAccess: 'read-write',
    allowedCommands: ["npm test", "npm run build", "tsc"],
    verbose: false,
    theme: "dark",
    maxContext: 200000
  },
  'codex': {
    model: "davinci-codex",
    temperature: 0.2,
    maxTokens: 4000,
    stopSequences: ["\n\n"],
    enableSandbox: true,
    fileSystemAccess: 'read-only'
  },
  'gemini': {
    model: "gemini-1.5-pro",
    temperature: 0.4,
    topP: 0.95,
    topK: 64,
    useFlash: true,
    safetySettings: "BLOCK_MEDIUM_AND_ABOVE",
    autoApprove: true,
    fileSystemAccess: 'none'
  },
  'openclaw': {
    browserMode: "headless",
    defaultTimeout: 30000,
    allowedDomains: ["github.com", "stackoverflow.com"],
    recordVideo: false,
    userAgent: "OpenClawBot/1.0",
    fileSystemAccess: 'read-only'
  },
  'hermes': {
    model: "hermes-3",
    scaffoldTemplate: "react-vite-ts",
    installDependencies: true,
    autoFormat: true,
    autoApprove: true,
    fileSystemAccess: 'read-write'
  },
  'opencode': {
    localEnv: "docker",
    mountCurrentDir: true,
    allowNetwork: false,
    memoryLimit: "2g",
    fileSystemAccess: 'read-write',
    autoApprove: false
  }
};

export class ToolConfigService {
  static getDefaultConfig(toolId: string, toolName: string): AgentToolConfig {
    const config = DEFAULT_TOOL_CONFIGS[toolId];
    if (config) {
      return { ...config, id: `${toolName.toLowerCase().replace(/\s+/g, '-')}-instance` };
    }
    
    // Generic default
    return {
      id: `${toolName.toLowerCase().replace(/\s+/g, '-')}-instance`,
      version: "1.0.0",
      model: "claude-3-5-sonnet",
      temperature: 0.45,
      maxTokens: 4096,
      autoApprove: false,
      fileSystemAccess: 'read-only'
    };
  }

  static getFieldSchemas(toolId: string) {
    // This could return a JSON schema or a simplified schema array to dynamically render options
    return null;
  }
}
