import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Copy,
  Link,
  ExternalLink,
  Cpu,
  Terminal,
  Sparkles,
  HelpCircle,
  Globe,
  TerminalSquare,
  Settings2,
  Code2,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Eye,
  EyeOff,
  FolderOpen,
  FileText,
  CheckCircle2,
  Info,
  Search,
  Sliders,
  ChevronRight,
  Zap,
  Play,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  UNIFIED_TOOLS,
  ToolDefinition,
  LayoutMode,
  DeepLinkPayload,
} from "../types";
import { buildDeepLink } from "../utils/deeplink";

interface QuickConfigComponentProps {
  apiKey: string;
  baseUrl?: string;
  name: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  layoutMode?: LayoutMode;
  onDirectConfig?: (toolId: string, toolName: string) => void;
  customScheme?: string;
  tools?: ToolDefinition[];
}

export function QuickConfigComponent({
  apiKey,
  baseUrl = "",
  name,
  description = "Local Workspace Main Key",
  isOpen,
  onClose,
  layoutMode = "drawer",
  onDirectConfig,
  customScheme = "modelkit://config",
  tools: externalTools,
}: QuickConfigComponentProps) {
  const availableTools = externalTools || UNIFIED_TOOLS;

  // Configuration Target Scope Mode
  const [configScope, setConfigScope] = useState<"single" | "all">("single");

  // Selection and exploration state - initialize with real tool IDs
  const [activeEditorToolId, setActiveEditorToolId] = useState<string>(
    availableTools[0]?.id || "claude_code",
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "claude_code",
    "gemini",
    "codex",
  ]);
  const [showConfirmAll, setShowConfirmAll] = useState(false);
  const [copiedLink, setCopiedLink] = useState<"uri" | "web" | "config" | null>(
    null,
  );
  const [showPlainApiKey, setShowPlainApiKey] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live personalization variables for active tool
  const [selectedModel, setSelectedModel] = useState<string>("default");
  const [customBaseUrl, setCustomBaseUrl] = useState<string>("");
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  // Sync initial and custom base urls on mount/prop updates
  useEffect(() => {
    setCustomBaseUrl(baseUrl || "https://geekspace.cloud/v1");
  }, [baseUrl]);

  if (!isOpen) return null;

  // Toggle tool in bulk deploy set
  const toggleToolSelection = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((t) => t !== toolId)
        : [...prev, toolId],
    );
  };

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case "claude_code":
        return <TerminalSquare size={13} />;
      case "codex":
        return <Code2 size={13} />;
      case "gemini":
        return <Sparkles size={13} />;
      case "opencode":
        return <Terminal size={13} />;
      case "openclaw":
        return <Globe size={13} />;
      case "hermes":
        return <Zap size={13} />;
      default:
        return <Settings2 size={13} />;
    }
  };

  // Generate deep links payloads
  const getPayloadTools = (): string[] => {
    if (configScope === "single") {
      return [activeEditorToolId];
    }
    return selectedTools.length > 0 ? selectedTools : [activeEditorToolId];
  };

  const payload: DeepLinkPayload = {
    apiKey,
    baseUrl: customBaseUrl || baseUrl || "https://geekspace.cloud/v1",
    name,
    description: `Workspace Config - ${configScope === "single" ? "Focused" : "Bulk"} Mode`,
    supportedTools: getPayloadTools(),
  };

  const { customUri, webUri } = buildDeepLink(payload, customScheme);

  const handleCopyText = (text: string, type: "uri" | "web" | "config") => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    toast.success(`配置数据已复制到剪贴板！`, {
      description:
        type === "config"
          ? "代码已复制，您可以直接粘贴到本地配置文件中。"
          : "直链路径已就绪，可随时用于外部深度监听与绑定。",
      position: "top-center",
    });
    setTimeout(() => setCopiedLink(null), 1800);
  };

  // Handles fast dispatch event
  const handleQuickConfigure = (tool: ToolDefinition) => {
    if (onDirectConfig) {
      onDirectConfig(tool.id, tool.name);
      toast.success(
        `[本地路由分发 - ${tool.name}] 已经发布！已自动下发策略至 ${tool.id} 的底层挂载环境。`,
        {
          position: "top-center",
        },
      );
    } else {
      const payload: DeepLinkPayload = {
        name: name || "ModelKit Access",
        apiKey,
        baseUrl: customBaseUrl || baseUrl || "https://geekspace.cloud/v1",
        defaultModel: selectedModel || "",
        supportedTools: [tool.id],
      };
      const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
      const customUri = `modelkit://config?config=${b64}`;
      toast.loading(`正在拉起桌面端配置应用 ${tool.name}...`, {
        position: "top-center",
        duration: 2000,
      });
      window.location.href = customUri;
    }
  };

  // Dispatch to all selected/checked tools
  const handleBulkDispatch = () => {
    const targetIds = getPayloadTools();
    if (targetIds.length === 0) {
      toast.error("未选择任何适配软件，请在左侧勾选您想要分发的工具！");
      return;
    }

    if (onDirectConfig) {
      targetIds.forEach((id) => {
        const tool = availableTools.find((t) => t.id === id);
        if (tool) {
          onDirectConfig(tool.id, tool.name);
        }
      });
      toast.success(
        `[联合管道分发] 成功！已面向全部选中的 ${targetIds.length} 款辅助工具多路传输了本地策略密钥。`,
        {
          position: "top-center",
        },
      );
    } else {
      const payload: DeepLinkPayload = {
        name: name || "ModelKit Access",
        apiKey,
        baseUrl: customBaseUrl || baseUrl || "https://geekspace.cloud/v1",
        defaultModel: selectedModel || "",
        supportedTools: targetIds,
      };
      const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
      const customUri = `modelkit://config?config=${b64}`;
      toast.loading(`正在拉起桌面端联合配置本地工具...`, {
        position: "top-center",
        duration: 2000,
      });
      window.location.href = customUri;
    }
  };

  const handleDeployAll = () => {
    const targetIds = availableTools.map((t) => t.id);
    if (onDirectConfig) {
      targetIds.forEach((id) => {
        const tool = availableTools.find((t) => t.id === id);
        if (tool) {
          onDirectConfig(tool.id, tool.name);
        }
      });
      toast.success(
        `[全量分发] 成功！已下发策略至所有的 ${targetIds.length} 款可用应用。`,
        {
          position: "top-center",
        },
      );
    } else {
      const payload: DeepLinkPayload = {
        name: name || "ModelKit Access",
        apiKey,
        baseUrl: customBaseUrl || baseUrl || "https://geekspace.cloud/v1",
        defaultModel: selectedModel || "",
        supportedTools: targetIds,
      };
      const b64 = btoa(encodeURIComponent(JSON.stringify(payload)));
      const customUri = `modelkit://config?config=${b64}`;
      toast.loading(`正在拉起桌面端执行全量配置映射...`, {
        position: "top-center",
        duration: 2000,
      });
      window.location.href = customUri;
    }
  };

  const activeTool =
    availableTools.find((t) => t.id === activeEditorToolId) ||
    availableTools[0];

  // Dynamic code snippet structural generator supporting multiple files
  const getToolFiles = (
    tool: ToolDefinition,
    key: string,
    endpoint: string,
    provName: string,
    modelTemplate: string,
    revealKey: boolean,
  ) => {
    const safeUrl = endpoint || "https://geekspace.cloud/v1";
    const displayKey = revealKey
      ? key
      : "sk-proj-••••••••••••••••••••••••••••••••••••••••";

    // Choose selected model template or static default fallback representing source precision
    const selectModel = (toolId: string) => {
      if (modelTemplate && modelTemplate !== "default") return modelTemplate;
      switch (toolId) {
        case "claude_code":
          return "claude-3-5-sonnet";
        case "codex":
          return "gpt-4o";
        case "gemini":
          return "gemini-2.5-pro";
        case "opencode":
          return "gpt-4o";
        case "openclaw":
          return "claude-3-5-sonnet";
        case "hermes":
          return "gpt-4o-mini";
        default:
          return "gpt-4o";
      }
    };

    const targetModel = selectModel(tool.id);

    switch (tool.id) {
      case "claude_code":
        return [
          {
            name: ".claude.json",
            language: "json",
            content: JSON.stringify(
              {
                customProviders: {
                  [provName || "default"]: {
                    url: safeUrl,
                    apiKey: displayKey,
                    defaultModel: targetModel,
                    protocol: "openai",
                  },
                },
              },
              null,
              2,
            ),
          },
        ];
      case "codex":
        return [
          {
            name: "config.toml",
            language: "toml",
            content: `[api]\nprovider = "openai"\nbase_url = "${safeUrl}"\nmodel = "${targetModel}"`,
          },
          {
            name: "auth.json",
            language: "json",
            content: JSON.stringify(
              {
                credentials: {
                  apiKey: displayKey,
                },
              },
              null,
              2,
            ),
          },
        ];
      case "gemini":
        return [
          {
            name: "config.json",
            language: "json",
            content: JSON.stringify(
              {
                apiKey: displayKey,
                baseUrl: safeUrl,
                defaultModel: targetModel,
              },
              null,
              2,
            ),
          },
        ];
      case "opencode":
        return [
          {
            name: "config.json",
            language: "json",
            content: JSON.stringify(
              {
                llm: {
                  provider: "openai",
                  baseURL: safeUrl,
                  apiKey: displayKey,
                  model: targetModel,
                },
              },
              null,
              2,
            ),
          },
        ];
      case "openclaw":
        return [
          {
            name: "config.json",
            language: "json",
            content: JSON.stringify(
              {
                provider: "openai",
                endpoint: safeUrl,
                auth: {
                  type: "apiKey",
                  token: displayKey,
                },
                defaultModel: targetModel,
              },
              null,
              2,
            ),
          },
        ];
      case "hermes":
        return [
          {
            name: "agent.yaml",
            language: "yaml",
            content: `providers:\n  - name: ${provName || "default"}\n    protocol: openai\n    baseUrl: "${safeUrl}"\n    credentials:\n      apiKey: "${displayKey}"\n    models:\n      - name: ${targetModel}\n        capabilities:\n          streaming: true\n          functionCalling: true`,
          },
        ];
      default:
        return [
          {
            name: "config.txt",
            language: "typescript",
            content: `// Custom Configuration for ${tool.name}\n// Key: ${displayKey}\n// Domain: ${safeUrl}`,
          },
        ];
    }
  };

  // High fidelity VSCode micro syntax highlighting formatter
  const renderVSCodeCode = (code: string, language: string) => {
    const lines = code.split("\n");
    return (
      <div className="font-mono text-[11px] leading-relaxed select-text pr-4">
        {lines.map((line, idx) => {
          let coloredLine = <span className="text-[#a6accd]">{line}</span>;

          if (line.includes(":")) {
            const separatorIndex = line.indexOf(":");
            const keyPart = line.substring(0, separatorIndex);
            const valPart = line.substring(separatorIndex);

            if (language === "yaml") {
              coloredLine = (
                <span>
                  <span className="text-[#c792ea] font-medium">{keyPart}</span>
                  <span className="text-[#89ddff]">{valPart}</span>
                </span>
              );
            } else {
              // JSON style config
              coloredLine = (
                <span>
                  <span className="text-[#82aaff] font-medium">{keyPart}</span>
                  <span className="text-[#c3e88d]">{valPart}</span>
                </span>
              );
            }
          } else if (
            line.includes("apiKey") ||
            line.includes("baseUrl") ||
            line.includes("import ") ||
            line.includes("export ")
          ) {
            coloredLine = (
              <span className="text-[#ffcb6b] font-medium">{line}</span>
            );
          }

          return (
            <div
              key={idx}
              className="flex hover:bg-white/[0.02] px-3 py-0.5 group"
            >
              <span className="w-8 text-right text-gray-600 select-none pr-3 border-r border-[#1C1F26] mr-3 font-mono text-[9px]">
                {idx + 1}
              </span>
              <span className="flex-1 whitespace-pre-wrap font-mono">
                {coloredLine}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Filter tools based on query search
  const filteredTools = availableTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.configFile.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // VS Code File Tabs list logic
  const getVsCodeTabs = () => {
    if (configScope === "single") {
      // Only display the selected tool's tab - cleanly matches the requested single behavior
      return [activeTool];
    }
    // Display tabs for all tools that have been selectively CHECKED
    const checkedList = availableTools.filter((t) =>
      selectedTools.includes(t.id),
    );
    return checkedList.length > 0 ? checkedList : [activeTool];
  };

  const innerContent = (
    <div className="flex flex-col h-full bg-[#0d0f14] text-[#E0E0E0] select-none text-left relative">
      {showConfirmAll && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200 animate-in fade-in">
          <div className="bg-[#0b0c10] border border-[#1A1D24] rounded-2xl p-6 w-full max-w-[420px] shadow-2xl animate-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <AlertCircle className="text-yellow-500" size={18} />
              确认配置所有工具
            </h3>
            <p className="text-[11px] text-gray-400 font-mono leading-relaxed mb-6 bg-[#0f1116] p-3 rounded-lg border border-white/[0.03]">
              此操作将面向所有的{" "}
              <strong className="text-white bg-[#1a1d24] px-1 rounded">
                {availableTools.length}
              </strong>{" "}
              款可用集成工具批量自动下发最新的安全直连密钥与网关接口调度策略。
              <br />
              <br />
              这会默认覆盖已有连接池设置。是否确认执行全量覆盖并接管分发？
            </p>
            <div className="flex items-center justify-end gap-3 text-xs font-medium">
              <button
                onClick={() => setShowConfirmAll(false)}
                className="px-4 py-2 rounded-lg border border-white/[0.05] hover:bg-white/[0.02] text-gray-300 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowConfirmAll(false);
                  handleDeployAll();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer font-bold"
              >
                确认全量分发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header with metadata and Close button */}
      <div className="p-4 border-b border-[#1A1D24] flex items-center justify-between bg-[#090b0f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/10 p-2 rounded-xl border border-blue-500/15 text-blue-400">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              快速配置面板
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 px-3 rounded-lg border border-white/[0.03] text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
        >
          <X size={13} />
          <span>关闭</span>
        </button>
      </div>

      {/* 2. Mode Segmented Controls and Secure Key Context Row inside a unified, refined card */}
      <div className="p-4 border-b border-[#1A1D24] bg-[#0b0c10] shrink-0 space-y-4">
        {/* Toggle Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-[#14161d] p-1 rounded-xl border border-white/[0.03]">
            <button
              onClick={() => {
                setConfigScope("single");
                setSelectedTools([activeEditorToolId]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-nowrap cursor-pointer ${
                configScope === "single"
                  ? "bg-blue-600 text-white shadow font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Sliders size={12} />
              <span>单机配置</span>
            </button>

            <button
              onClick={() => setConfigScope("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-nowrap cursor-pointer ${
                configScope === "all"
                  ? "bg-blue-600 text-white shadow font-bold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Layers size={12} />
              <span>批量分发</span>
            </button>
          </div>

          {configScope === "all" && (
            <button
              onClick={() => setShowConfirmAll(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={12} />
              <span>配置所有工具</span>
            </button>
          )}
        </div>

        {/* Secure Key Info Block */}
        <div className="p-3.5 rounded-xl bg-[#08090C]/60 border border-white/[0.02] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                源 API 凭证
              </span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm font-bold text-white font-sans tracking-tight">
                {name}
              </span>
              <span
                className="text-xs text-gray-500 font-mono text-nowrap truncate max-w-[220px]"
                title={customBaseUrl || baseUrl || "https://geekspace.cloud/v1"}
              >
                {customBaseUrl || baseUrl || "https://geekspace.cloud/v1"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#121419] px-2.5 py-1.5 rounded-lg border border-white/[0.03] text-gray-400 font-mono text-xs flex items-center gap-2 select-all max-w-[200px] md:max-w-xs overflow-hidden">
              <span className="truncate block flex-1">
                {showPlainApiKey ? apiKey : "••••••••••••••••••••••••••••••••"}
              </span>
              <button
                onClick={() => setShowPlainApiKey(!showPlainApiKey)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                title={showPlainApiKey ? "隐藏密钥" : "显示密钥"}
              >
                {showPlainApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                toast.success("安全通道源密钥复制成功！");
              }}
              className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20 flex items-center justify-center cursor-pointer"
              title="复制"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Split Layout - Less cluttered layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Grid/Side Column: Clean interactive software list */}
        <div className="w-[280px] border-r border-[#191D24] flex flex-col bg-[#0b0c10] shrink-0">
          <div className="p-3 border-b border-[#191D24] space-y-2 bg-[#090a0d]">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono uppercase font-black tracking-wider">
              <span>配套集成环境</span>
              <span className="text-gray-550 font-normal">
                就绪: {availableTools.length}
              </span>
            </div>

            {/* Minimal Search */}
            <div className="relative">
              <Search
                className="absolute left-2.5 top-2.5 text-gray-500"
                size={12}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索配置工具..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#14161c] border border-white/[0.04] rounded-lg text-xs font-mono text-gray-200 placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clean tool rows view */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredTools.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 font-mono font-medium">
                无匹配的安装集成选项
              </div>
            ) : (
              filteredTools.map((tool) => {
                const isActive = activeEditorToolId === tool.id;
                const isChecked = selectedTools.includes(tool.id);

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      setActiveEditorToolId(tool.id);
                      setActiveFileIndex(0);
                      if (configScope === "single") {
                        setSelectedTools([tool.id]);
                      }
                    }}
                    className={`group rounded-xl p-2.5 border transition-all duration-200 cursor-pointer relative flex flex-col ${
                      isActive
                        ? "bg-[#151a24] border-blue-500/30 text-white"
                        : "border-transparent hover:bg-white/[0.02] text-gray-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Selector indicator */}
                        {configScope === "all" ? (
                          <div className="flex items-center justify-center pt-0.5 shrink-0 select-none">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleToolSelection(tool.id);
                              }}
                              className={`w-3.5 h-3.5 rounded transition-all flex items-center justify-center cursor-pointer ${
                                isChecked
                                  ? "bg-blue-600 border border-blue-500 text-white"
                                  : "border border-gray-700 bg-transparent text-transparent hover:border-gray-500"
                              }`}
                            >
                              <Check size={10} strokeWidth={4} />
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1.5">
                            <div
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                isActive
                                  ? "bg-blue-500 shadow-sm shadow-blue-500 animate-pulse"
                                  : "bg-gray-700"
                              }`}
                            />
                          </div>
                        )}

                        {/* Text and location path */}
                        <div className="min-w-0">
                          <span className="font-bold text-xs tracking-tight truncate flex items-center gap-1.5 group-hover:text-white transition-colors">
                            <span
                              className={`${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400"}`}
                            >
                              {getToolIcon(tool.id)}
                            </span>
                            {tool.name}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500 truncate block mt-0.5">
                            {tool.configFile}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <ChevronRight
                          size={12}
                          className="text-blue-500 shrink-0 mt-0.5"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-[#191D24] bg-[#08090C] text-[10px] font-mono text-gray-500 flex items-center justify-between">
            <span>分发应用: {getPayloadTools().length}</span>
          </div>
        </div>

        {/* Right Workspace Side Panel: Live parameters form + VS Code editor with collapsible protocols */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090a0e]">
          <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0 p-0">
            {/* A. Tuners Form - Beautifully minimalist row */}
            {configScope === "single" && (
              <div className="w-full md:w-[280px] p-4 bg-[#0a0b0e] border-b md:border-b-0 md:border-r border-[#1C1F26] shrink-0 overflow-y-auto custom-scrollbar space-y-4">
                <div className="flex items-center gap-1.5 border-b border-white/[0.02] pb-3 mb-1">
                  <Settings2 size={13} className="text-blue-400" />
                  <span className="text-[10px] font-black tracking-wider text-gray-200 uppercase font-mono">
                    配置参数 (Properties)
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* select model */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold">
                      默认模型
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-[#14161c] border border-[white]/[0.04] text-gray-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer hover:border-white/10 transition-colors font-mono"
                    >
                      <option value="default">✨ 自动适配最佳模型推荐</option>
                      <option value="claude-3-5-sonnet">
                        claude-3-5-sonnet (主力编程核心)
                      </option>
                      <option value="gpt-4o">gpt-4o (全能通用模型)</option>
                      <option value="gemini-2.5-pro">
                        gemini-2.5-pro (推理与长理解)
                      </option>
                      <option value="gpt-4o-mini">
                        gpt-4o-mini (高速轻量适配)
                      </option>
                    </select>
                  </div>

                  {/* customized endpoint */}
                  <div className="space-y-1.5 pt-2 border-t border-[white]/[0.02]">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold">
                        API 网关
                      </label>
                      <button
                        onClick={() =>
                          setCustomBaseUrl(
                            baseUrl || "https://geekspace.cloud/v1",
                          )
                        }
                        className="text-[9px] text-blue-500 hover:text-blue-400 font-extrabold cursor-pointer"
                      >
                        恢复默认
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={customBaseUrl}
                        onChange={(e) => setCustomBaseUrl(e.target.value)}
                        placeholder="https://geekspace.cloud/v1"
                        className="w-full bg-[#14161c] border border-white/[0.04] text-gray-300 rounded-lg pl-2 pr-9 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none hover:border-white/10 transition-colors font-mono placeholder:text-gray-700"
                      />
                      {customBaseUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(customBaseUrl);
                            toast.success("网关 URL 复制成功！");
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 p-1 rounded transition-all cursor-pointer"
                          title="复制"
                        >
                          <Copy size={11} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status checklist visual feedback */}
                  <div className="pt-4 mt-2 border-t border-[white]/[0.02] space-y-2.5 select-none">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>密钥安全注入就绪</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>环境语法分析完毕</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B. Clean File Editor block - Maximized */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#07080b]">
              {/* Code Panel inside real designer cards */}
              <div className="flex flex-col flex-1 min-h-0 w-full relative">
                {/* VS Code File Tabs Row */}
                <div className="flex items-center overflow-x-auto bg-[#0a0b0e] border-b border-[#1C1F26] custom-scrollbar shrink-0 select-none">
                  {[
                    ...getToolFiles(
                      activeTool,
                      apiKey,
                      customBaseUrl,
                      name,
                      selectedModel,
                      showPlainApiKey,
                    ),
                  ].map((file, idx) => {
                    const isActive = activeFileIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveFileIndex(idx)}
                        className={`px-4 py-2.5 text-[10.5px] font-mono flex items-center gap-1.5 border-r border-[#1C1F26] shrink-0 transition-colors cursor-pointer relative ${
                          isActive
                            ? "bg-[#07080b] text-[#82aaff] font-bold"
                            : "text-gray-500 hover:bg-[#0f1115] hover:text-gray-300"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />
                        )}
                        <FileText
                          size={11}
                          className={
                            isActive ? "text-blue-400" : "text-gray-600"
                          }
                        />
                        <span>{file.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Code Panel Core Container */}
                <div className="flex-1 overflow-y-auto bg-[#07080b] py-3.5 custom-scrollbar relative">
                  {(() => {
                    const files = getToolFiles(
                      activeTool,
                      apiKey,
                      customBaseUrl,
                      name,
                      selectedModel,
                      showPlainApiKey,
                    );
                    const activeFile = files[activeFileIndex] || files[0];
                    if (!activeFile) return null;

                    return (
                      <>
                        {/* Floating controls container */}
                        <div className="absolute top-2.5 right-3 flex items-center gap-2 z-10">
                          <span className="bg-[#111318] text-[9px] text-gray-550 uppercase px-1.5 py-0.5 rounded border border-white/[0.02] font-mono select-none">
                            {activeFile.language}
                          </span>

                          <button
                            onClick={() => {
                              handleCopyText(activeFile.content, "config");
                            }}
                            className="p-1.5 bg-[#14161c] hover:bg-gray-800 text-gray-300 hover:text-white rounded-lg flex items-center justify-center transition-colors shadow border border-white/[0.04] cursor-pointer"
                            title="复制"
                          >
                            {copiedLink === "config" ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>

                        {/* Colored Core Code Text */}
                        {renderVSCodeCode(
                          activeFile.content,
                          activeFile.language,
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Code Editor Footer Status Strip */}
                <div className="bg-[#007acc] text-white px-3 py-1.5 flex items-center justify-between text-[10px] font-mono font-bold shrink-0 select-none">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {(() => {
                        const files = getToolFiles(
                          activeTool,
                          apiKey,
                          customBaseUrl,
                          name,
                          selectedModel,
                          showPlainApiKey,
                        );
                        const activeFile = files[activeFileIndex] || files[0];
                        return (
                          <span>{activeFile?.name || "Live Snippet"}</span>
                        );
                      })()}
                    </span>
                    <span>UTF-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const files = getToolFiles(
                        activeTool,
                        apiKey,
                        customBaseUrl,
                        name,
                        selectedModel,
                        showPlainApiKey,
                      );
                      const activeFile = files[activeFileIndex] || files[0];
                      return (
                        <span>
                          {activeFile?.language.toUpperCase() || "TEXT"}
                        </span>
                      );
                    })()}
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider">
                      SECURED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* End top flex container */}
          {/* Right Panel Fixed Footer */}
          <div className="p-4 border-t border-[#191D24] bg-[#0b0c10] shrink-0 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {/* C. Primary Action Deploy buttons */}
            <div className="flex flex-wrap items-center gap-3 justify-between bg-[#0b0c10] p-3 rounded-xl border border-white/[0.02] shadow-inner">
              <div className="text-[10.5px] font-mono text-gray-400">
                {configScope === "single" ? (
                  <>
                    目标:{" "}
                    <span className="font-bold text-white">
                      {activeTool.name}
                    </span>
                  </>
                ) : (
                  <>
                    批量:{" "}
                    <span className="font-bold text-white">
                      {getPayloadTools().length} 款应用
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {configScope === "single" ? (
                  <button
                    onClick={() => handleQuickConfigure(activeTool)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-blue-500/10 active:scale-95 flex items-center gap-1.5 animate-in fade-in"
                  >
                    <Cpu size={12} />
                    <span>应用到 {activeTool.name}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBulkDispatch}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-blue-500/10 active:scale-95 flex items-center gap-1.5 animate-in fade-in"
                  >
                    <Zap
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span>一键分发</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout mode logic rendering
  if (layoutMode === "drawer") {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop layout */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        {/* Sliding left-to-right drawer container */}
        <div className="absolute left-0 top-0 bottom-0 w-[95vw] max-w-[1800px] h-full border-r border-[#1C1F26] shadow-2xl flex flex-col bg-[#090A0E] animate-in slide-in-from-left duration-300">
          {innerContent}
        </div>
      </div>
    );
  }

  // Centered Modal Layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      {/* Modal Card */}
      <div className="relative bg-[#090A0E] border border-[#2B2F3A] rounded-2xl w-[95vw] max-w-[1800px] h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {innerContent}
      </div>
    </div>
  );
}
