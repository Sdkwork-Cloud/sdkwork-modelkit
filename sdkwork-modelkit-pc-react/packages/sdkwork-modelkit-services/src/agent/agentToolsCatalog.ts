import { AgentTool } from '@sdkwork/modelkit-types';
import { UNIFIED_TOOLS } from '@sdkwork/modelkit-sdk-typescript';
import { ToolConfigService } from './configManager';

const iconMap: Record<string, string> = {
  claude_code: 'TerminalSquare',
  codex: 'Code2',
  gemini: 'Sparkles',
  opencode: 'Terminal',
  openclaw: 'Globe',
  hermes: 'Zap',
};

const makeAgentTool = (
  id: string,
  name: string,
  description: string,
  icon: string,
  status: AgentTool['status'],
  extraConfig: Record<string, unknown> = {},
  sysReq?: string[],
): AgentTool => ({
  id,
  name,
  description,
  icon,
  status,
  config: { ...ToolConfigService.getDefaultConfig(id, name), ...extraConfig },
  systemRequirements: sysReq,
});

export function buildUnifiedAgentTools(): AgentTool[] {
  return UNIFIED_TOOLS.map((tool) =>
    makeAgentTool(
      tool.id,
      tool.name,
      tool.description,
      iconMap[tool.id] || 'Terminal',
      ['claude_code', 'hermes'].includes(tool.id) ? 'installed' : 'uninstalled',
      tool.id === 'claude_code' ? { autoUpdate: true } : {},
      tool.id === 'claude_code' ? ['Node.js >= 18'] : undefined,
    ),
  );
}
