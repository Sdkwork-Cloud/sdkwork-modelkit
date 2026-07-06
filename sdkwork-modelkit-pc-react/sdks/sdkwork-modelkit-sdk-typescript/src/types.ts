export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  configFile: string;
  configLanguage: 'json' | 'yaml' | 'typescript' | 'bash';
}

export interface DeepLinkPayload {
  apiKey: string;
  baseUrl?: string;
  name: string;
  description?: string;
  defaultModel?: string;
  supportedTools: string[]; // List of tool IDs
}

export type LayoutMode = 'drawer' | 'modal';

export const UNIFIED_TOOLS: ToolDefinition[] = [
  {
    id: 'claude_code',
    name: 'Claude Code',
    description: 'Anthropic\'s CLI agent focused on deep codebase understanding.',
    configFile: '~/.claude.json',
    configLanguage: 'json'
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI-powered code generation toolkit.',
    configFile: '~/.codex/config.json',
    configLanguage: 'json'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google DeepMind\'s multimodal coding agent.',
    configFile: '~/.gemini/config.json',
    configLanguage: 'json'
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'Open-source code interpretation engine for local environments.',
    configFile: '~/.opencode/config.json',
    configLanguage: 'json'
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    description: 'Web automation and browser interaction agent.',
    configFile: '~/.openclaw/config.json',
    configLanguage: 'json'
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    description: 'Lightweight rapid scaffolding and code generation tool.',
    configFile: '~/.hermes/agent.yaml',
    configLanguage: 'yaml'
  }
];
