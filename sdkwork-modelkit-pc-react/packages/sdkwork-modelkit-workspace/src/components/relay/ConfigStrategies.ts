import { DeepLinkPayload } from '@sdkwork/modelkit-sdk-typescript';

export interface ConfigStrategyResult {
  success: boolean;
  message: string;
  configPath: string;
  configContent: string;
}

export interface IToolConfigStrategy {
  toolId: string;
  toolName: string;
  execute(payload: DeepLinkPayload): ConfigStrategyResult;
}

/**
 * Claude Desktop Configuration Strategy (MCP Server config)
 */
export class ClaudeDesktopStrategy implements IToolConfigStrategy {
  toolId = 'claude_desktop';
  toolName = 'Claude Desktop';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = '~/Library/Application Support/Claude/claude_desktop_config.json';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const configObj = {
      "mcpServers": {
        "modelkit-gateway": {
          "command": "npx",
          "args": ["-y", "@sdkwork/modelkit-mcp"],
          "env": {
            "MODELKIT_API_KEY": payload.apiKey,
            "MODELKIT_BASE_URL": baseUrl
          }
        }
      }
    };

    return {
      success: true,
      message: `[Strategy - Claude Desktop] Successfully registered MCP local relay! Service: modelkit-gateway`,
      configPath,
      configContent: JSON.stringify(configObj, null, 2)
    };
  }
}

/**
 * Cursor IDE Configuration Strategy
 */
export class CursorStrategy implements IToolConfigStrategy {
  toolId = 'cursor';
  toolName = 'Cursor IDE';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = '~/Library/Application Support/Cursor/User/settings.json';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const configObj = {
      "cursor.general.openaiApiKey": payload.apiKey,
      "cursor.general.customOpenAIBaseUrl": baseUrl,
      "cursor.models.custom": [
        "claude-3-5-sonnet",
        "gemini-2.5-pro",
        "gpt-4o-mini"
      ]
    };

    return {
      success: true,
      message: `[Strategy - Cursor IDE] Injected custom OpenAI Base Endpoint, expanded default model pool.`,
      configPath,
      configContent: JSON.stringify(configObj, null, 2)
    };
  }
}

/**
 * Continue Developer Configuration Strategy
 */
export class ContinueStrategy implements IToolConfigStrategy {
  toolId = 'continue';
  toolName = 'Continue Developer';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = '~/.continue/config.json';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const configObj = {
      "models": [
        {
          "title": "ModelKit Core Pro",
          "provider": "openai",
          "model": "claude-3-5-sonnet",
          "apiKey": payload.apiKey,
          "apiBase": baseUrl
        }
      ],
      "tabAutocompleteModel": {
        "title": "ModelKit Fast Autocomplete",
        "provider": "openai",
        "model": "gpt-4o-mini",
        "apiKey": payload.apiKey,
        "apiBase": baseUrl
      }
    };

    return {
      success: true,
      message: `[Strategy - Continue Dev] Successfully modified ~/.continue/config.json, aligned main and autocomplete models.`,
      configPath,
      configContent: JSON.stringify(configObj, null, 2)
    };
  }
}

/**
 * Shell Env Configuration Strategy
 */
export class ShellStrategy implements IToolConfigStrategy {
  toolId = 'shell';
  toolName = 'Terminal Env';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = '~/.zshrc';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const textContent = `# Export Env Profile
export OPENAI_API_KEY="${payload.apiKey}"
export OPENAI_API_BASE="${baseUrl}"
export ANTHROPIC_API_KEY="${payload.apiKey}"
export DEEPSEEK_API_KEY="${payload.apiKey}"`;

    return {
      success: true,
      message: `[Strategy - Terminal Env] Generated shell profile security integration, loaded via source.`,
      configPath,
      configContent: textContent
    };
  }
}

/**
 * NextChat Configuration Strategy
 */
export class NextChatStrategy implements IToolConfigStrategy {
  toolId = 'nextchat';
  toolName = 'NextChat (Docker)';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = 'docker-compose.yml';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const yamlContent = `version: '3.8'
services:
  chatgpt-next-web:
    image: yidadaa/chatgpt-next-web:latest
    ports:
      - "3010:3000"
    environment:
      - OPENAI_API_KEY="${payload.apiKey}"
      - BASE_URL="${baseUrl}"
      - CUSTOM_MODELS="-all,+claude-3-5-sonnet,+gemini-2.5-pro,+gpt-4o-mini"
    restart: always`;

    return {
      success: true,
      message: `[Strategy - NextChat] Generated complete docker-compose deployment configuration, ready.`,
      configPath,
      configContent: yamlContent
    };
  }
}

/**
 * ModelKit SDK Strategy
 */
export class ModelKitSdkStrategy implements IToolConfigStrategy {
  toolId = 'modelkit_sdk';
  toolName = 'ModelKit Core SDK';

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = 'src/modelkit.ts';
    const baseUrl = payload.baseUrl || 'https://geekspace.cloud/v1';

    const codeContent = `import { GoogleGenAI } from "@google/genai";

// Initialize TypeScript SDK Client
export const ai = new GoogleGenAI({
  apiKey: "${payload.apiKey}",
  baseUrl: "${baseUrl}"
});

export async function generateContent(prompt: string) {
  const response = await ai.models.generateContent({
    model: "claude-3-5-sonnet",
    contents: prompt
  });
  return response.text;
}`;

    return {
      success: true,
      message: `[Strategy - ModelKit Core SDK] Generated TypeScript type-safe API context.`,
      configPath,
      configContent: codeContent
    };
  }
}

/**
 * Default Strategy (Generic JSON compiler)
 */
export class DefaultStrategy implements IToolConfigStrategy {
  constructor(public toolId: string, public toolName: string) {}

  execute(payload: DeepLinkPayload): ConfigStrategyResult {
    const configPath = `~/.${this.toolId}/config.json`;
    
    const configObj = {
      apiKey: payload.apiKey,
      baseUrl: payload.baseUrl || 'https://geekspace.cloud/v1',
      name: payload.name,
      description: payload.description || '',
      synchronizedAt: new Date().toISOString()
    };

    return {
      success: true,
      message: `[Strategy - ${this.toolName}] Config generated.`,
      configPath,
      configContent: JSON.stringify(configObj, null, 2)
    };
  }
}

/**
 * Configuration manager implementing Strategy Pattern
 */
export class ToolConfigRegistry {
  private static strategies: Record<string, IToolConfigStrategy> = {
    // Rely dynamically on generic generation, or we can add specific ones if needed.
    // However, we just drop the old specific strategies to avoid bloating unless necessary.
  };

  /**
   * Get specific strategy or construct a default one dynamically
   */
  static getStrategy(toolId: string, toolName: string): IToolConfigStrategy {
    if (this.strategies[toolId]) {
      return this.strategies[toolId];
    }
    return new DefaultStrategy(toolId, toolName);
  }
}
