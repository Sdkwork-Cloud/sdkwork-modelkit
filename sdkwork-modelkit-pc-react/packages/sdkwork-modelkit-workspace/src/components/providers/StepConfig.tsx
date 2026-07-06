import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import { ProviderData } from "../../services/types";
import Editor from "@monaco-editor/react";
import {
  Check,
  Code2,
  FileCode2,
  Settings2,
  FileText,
  ChevronRight,
  ChevronLeft,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

interface StepConfigProps {
  formData: ProviderData;
  setFormData: (data: ProviderData) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TOOL_INFO: Record<string, { name: string; path: string; lang: string }> =
  {
    claude_code: { name: "Claude Code", path: "~/.claude.json", lang: "json" },
    codex: { name: "Codex", path: "~/.codex/config.json", lang: "json" },
    gemini: { name: "Gemini", path: "~/.gemini/config.json", lang: "json" },
    opencode: {
      name: "OpenCode",
      path: "~/.opencode/config.json",
      lang: "json",
    },
    openclaw: {
      name: "OpenClaw",
      path: "~/.openclaw/config.json",
      lang: "json",
    },
    hermes: {
      name: "Hermes Agent",
      path: "~/.hermes/agent.yaml",
      lang: "yaml",
    },
  };

export function StepConfig({
  formData,
  setFormData,
  activeTab,
  setActiveTab,
}: StepConfigProps) {
  const { t, language } = useAppContext();
  const isZh = language === "zh";
  const [configObj, setConfigObj] = useState({
    providerRef: formData.name || "default",
    protocol: "openai",
    targetTool: "claude_code",
    connection: {
      type: "apiKey",
      token: formData.apiKey || "${API_KEY}",
      baseUrl: formData.endpoint || "https://geekspace.cloud/v1",
    },
    capabilities: {
      streaming: true,
      functionCalling: true,
    },
  });

  const generateCode = (conf: typeof configObj) => {
    const { providerRef, protocol, connection, targetTool } = conf;
    const baseUrl = connection.baseUrl || "https://geekspace.cloud/v1";
    const apiKey = connection.token || "${API_KEY}";
    const defaultModel = formData.defaultModel || "gpt-4o";

    switch (targetTool) {
      case "claude_code":
        return JSON.stringify(
          {
            customProviders: {
              [providerRef]: {
                url: baseUrl,
                apiKey: apiKey,
                defaultModel: defaultModel,
                protocol: protocol,
              },
            },
          },
          null,
          2,
        );

      case "codex":
        return JSON.stringify(
          {
            api: {
              provider: protocol,
              baseUrl: baseUrl,
              apiKey: apiKey,
              model: defaultModel,
            },
          },
          null,
          2,
        );

      case "gemini":
        return JSON.stringify(
          {
            apiKey: apiKey,
            baseUrl: baseUrl,
            defaultModel: defaultModel,
          },
          null,
          2,
        );

      case "opencode":
        return JSON.stringify(
          {
            llm: {
              provider: protocol,
              baseURL: baseUrl,
              apiKey: apiKey,
              model: defaultModel,
            },
          },
          null,
          2,
        );

      case "openclaw":
        return JSON.stringify(
          {
            provider: protocol,
            endpoint: baseUrl,
            auth: {
              type: connection.type,
              token: apiKey,
            },
            defaultModel: defaultModel,
          },
          null,
          2,
        );

      case "hermes":
        return `providers:
  - name: ${providerRef}
    protocol: ${protocol}
    baseUrl: "${baseUrl}"
    credentials:
      apiKey: "${apiKey}"
    models:
      - name: ${defaultModel}
        capabilities:
          streaming: ${conf.capabilities.streaming}
          functionCalling: ${conf.capabilities.functionCalling}
`;

      default:
        return "";
    }
  };

  const [code, setCode] = useState(() => generateCode(configObj));

  useEffect(() => {
    setCode(generateCode(configObj));
  }, [configObj, formData.defaultModel]);

  const updateConfig = (newConfig: typeof configObj) => {
    setConfigObj(newConfig);
  };

  const currentTool =
    TOOL_INFO[configObj.targetTool] || TOOL_INFO.claude_desktop;

  return (
    <div className="flex flex-row h-full gap-6">
      {/* Left Form (WYSIWYG) */}
      <div className="w-[340px] flex flex-col shrink-0 gap-6 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        <div>
          <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
            Configuration
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                Target Tool
              </label>
              <select
                value={configObj.targetTool}
                onChange={(e) =>
                  updateConfig({ ...configObj, targetTool: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-md px-3 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all outline-none"
              >
                {Object.entries(TOOL_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                Provider Ref
              </label>
              <input
                type="text"
                value={configObj.providerRef}
                onChange={(e) =>
                  updateConfig({ ...configObj, providerRef: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-md px-3 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                  Protocol
                </label>
                <select
                  value={configObj.protocol}
                  onChange={(e) =>
                    updateConfig({ ...configObj, protocol: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-md px-3 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all outline-none"
                >
                  <option value="openai">OpenAI Compatible</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="ollama">Ollama</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                  Auth Type
                </label>
                <select
                  value={configObj.connection?.type || "apiKey"}
                  onChange={(e) =>
                    updateConfig({
                      ...configObj,
                      connection: {
                        ...configObj.connection,
                        type: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-md px-3 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all outline-none"
                >
                  <option value="apiKey">API Key</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="custom">Custom Header</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                Token Variable
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={configObj.connection?.token || ""}
                  onChange={(e) =>
                    updateConfig({
                      ...configObj,
                      connection: {
                        ...configObj.connection,
                        token: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-md pl-3 pr-9 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono outline-none"
                />
                {configObj.connection?.token && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        configObj.connection?.token || "",
                      );
                      toast.success(t("workspace:copy_token_success", "Token value copied!"));
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-light p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title={t("workspace:copy_token_title", "Copy Token Value")}
                  >
                    <Copy size={13} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-muted tracking-wider mb-2">
                Base URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={configObj.connection?.baseUrl || ""}
                  onChange={(e) =>
                    updateConfig({
                      ...configObj,
                      connection: {
                        ...configObj.connection,
                        baseUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-md pl-3 pr-9 py-2 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono outline-none"
                />
                {configObj.connection?.baseUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        configObj.connection?.baseUrl || "",
                      );
                      toast.success(t("workspace:copy_baseurl_success", "API endpoint Base URL copied!"));
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-light p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                    title={t("workspace:copy_baseurl_title", "Copy Base URL")}
                  >
                    <Copy size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-divider">
          <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
            Capabilities
          </h4>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 bg-surface border border-surface-hover rounded-lg cursor-pointer hover:border-divider-strong transition-colors">
              <div>
                <div className="text-[13px] font-medium text-text-main">
                  Streaming
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  Support Server-Sent Events streaming returns
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative ${configObj.capabilities?.streaming ? "bg-primary-main" : "bg-divider-strong"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${configObj.capabilities?.streaming ? "translate-x-4" : "translate-x-0"}`}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!!configObj.capabilities?.streaming}
                  onChange={(e) =>
                    updateConfig({
                      ...configObj,
                      capabilities: {
                        ...configObj.capabilities,
                        streaming: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            </label>

            <label className="flex items-center justify-between p-3 bg-surface border border-surface-hover rounded-lg cursor-pointer hover:border-divider-strong transition-colors">
              <div>
                <div className="text-[13px] font-medium text-text-main">
                  Function Calling
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  Support tool calling and structured output format
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative ${configObj.capabilities?.functionCalling ? "bg-primary-main" : "bg-divider-strong"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${configObj.capabilities?.functionCalling ? "translate-x-4" : "translate-x-0"}`}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!!configObj.capabilities?.functionCalling}
                  onChange={(e) =>
                    updateConfig({
                      ...configObj,
                      capabilities: {
                        ...configObj.capabilities,
                        functionCalling: e.target.checked,
                      },
                    })
                  }
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right File Config */}
      <div className="flex-1 flex flex-col min-w-0 border border-surface-hover rounded-xl overflow-hidden bg-panel">
        <div className="flex items-center justify-between border-b border-surface-hover bg-surface px-4 py-3">
          <div className="flex items-center gap-2 text-text-main">
            {currentTool.lang === "json" ? (
              <Code2 size={16} className="text-primary-light" />
            ) : currentTool.lang === "typescript" ? (
              <FileCode2 size={16} className="text-yellow-400" />
            ) : (
              <FileText size={16} className="text-green-400" />
            )}
            <span className="text-sm font-medium font-mono">
              {currentTool.path}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Copied to clipboard");
              }}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-text-main bg-surface-hover/50 hover:bg-surface-hover hover:text-text-main transition-colors"
            >
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([code], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = currentTool.path.split("/").pop() || "config.txt";
                a.click();
              }}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-primary-light bg-primary-main/10 border border-[var(--color-primary-alpha)] hover:bg-primary-hover/20 transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute top-4 right-6 z-10 bg-primary-main/10 text-primary-light border border-[var(--color-primary-alpha)] px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <Check size={12} />
            Auto-generated
          </div>
          <Editor
            height="100%"
            language={currentTool.lang}
            theme="vs-dark"
            value={code}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily:
                "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
              lineHeight: 24,
              padding: { top: 24, bottom: 24 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
              renderLineHighlight: "all",
              readOnly: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
