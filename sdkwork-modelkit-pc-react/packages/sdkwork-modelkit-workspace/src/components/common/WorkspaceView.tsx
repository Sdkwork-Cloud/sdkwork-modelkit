import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState } from "react";
import { AgentTool } from "@sdkwork/modelkit-types";
import { ProvidersManager } from "../providers/ProvidersManager";
import { SkillsManager } from "../tools/skills/SkillsManager";
import { PromptsManager } from "../tools/prompts/PromptsManager";
import { ConfigManager } from "../tools/config/ConfigManager";
import { McpManager } from "../tools/mcp/McpManager";
import { AgentsManager } from "../tools/agents/AgentsManager";
import {
  Settings2,
  Plus,
  Download,
  Loader2,
  Terminal,
  Monitor,
  X,
  Check,
} from "lucide-react";
import { getProviderIcon } from "../providers/ProviderIcon";
import { AppInstallModal } from "../modals/AppInstallModal";

interface WorkspaceViewProps {
  activeTool: AgentTool;
  isInstalling?: boolean;
  installProgress?: number;
  installType?: "cli" | "desktop";
  installLogs?: string[];
  onInstall?: (id: string, type: "cli" | "desktop") => void;
  onUninstall?: (id: string) => void;
  onNavigate?: (view: "user-profile" | "system-settings") => void;
}

export function WorkspaceView({
  activeTool,
  isInstalling = false,
  installProgress = 0,
  installType,
  installLogs = [],
  onInstall,
  onUninstall,
  onNavigate,
}: WorkspaceViewProps) {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState("providers");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"cli" | "desktop">("cli");

  const tabs = [
    { id: "providers", label: t("workspace:tab_providers", "Providers") },
    { id: "skills", label: t("workspace:tab_skills", "Skills") },
    { id: "prompts", label: t("workspace:tab_prompts", "Prompts") },
    { id: "config", label: t("workspace:tab_config", "Config") },
    { id: "mcp", label: t("workspace:tab_mcp", "MCP") },
    { id: "agents", label: t("workspace:tab_agents", "Agents") },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-panel">
      {/* Tool Header Profile */}
      <div className="px-8 pt-8 flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-panel border border-divider flex items-center justify-center text-primary-light">
              {getProviderIcon(activeTool.name, "w-6 h-6")}
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-main tracking-tight">
                {activeTool.name}
              </h1>
              <span className="px-2 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-xs font-semibold">
                {t("workspace:header_tools", "Tools")}
              </span>
              {activeTool.status === "uninstalled" && (
                <>
                  {isInstalling ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-xs font-bold rounded-full select-none animate-pulse">
                      <Loader2
                        size={12}
                        className="animate-spin text-primary-light"
                      />
                      {t("workspace:installing_status", "Installing")} (
                      {installType === "cli"
                        ? t("workspace:type_cli", "CLI")
                        : t("workspace:type_desktop", "Desktop Client")}
                      ) {installProgress}%
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsInstallModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-main hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-all shadow-[0_2px_8px_var(--color-primary-alpha)] hover:scale-105 active:scale-95 cursor-pointer select-none"
                    >
                      <Download size={12} />
                      {t("workspace:txt_1178")}
                    </button>
                  )}
                </>
              )}
              {activeTool.status === "installed" && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold select-none">
                    <Check size={12} />
                    {t("workspace:txt_1179")}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUninstall?.(activeTool.id)}
                    className="px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 hover:border-red-500/50 text-red-500 hover:text-red-400 text-xs font-semibold transition-all cursor-pointer select-none"
                  >
                    {t("workspace:uninstall", "Uninstall")}
                  </button>
                </div>
              )}
              {activeTool.status === "running" && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-xs font-semibold select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  {t("workspace:txt_1181")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-panel hover:bg-surface-hover border border-divider text-text-main rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Settings2 size={16} />
              {t("workspace:btn_runtime", "Runtime")}
            </button>
            {activeTab === "providers" && (
              <button
                onClick={() => {
                  setEditingProvider({
                    id: "",
                    name: "",
                    url: "",
                    endpoint: "",
                    apiKey: "",
                    enabled: true,
                    remark: "",
                    timeoutMs: 30000,
                    initial: "C",
                  });
                  setIsEditorOpen(true);
                }}
                className="px-4 py-2 bg-primary-main hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                {t("workspace:btn_add_provider", "Add Provider")}
              </button>
            )}
            {/* Runtime selection button */}
          </div>
        </div>

        {/* Tabs at the top */}
        {activeTool.status !== "uninstalled" && !isInstalling ? (
          <div className="flex items-center gap-8 border-b border-divider">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary-light border-b-2 border-primary-main"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 pb-3 text-sm font-bold text-text-muted border-b border-divider select-none">
            <span className="px-2 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-xs">
              {t("workspace:setup_config", "Setup Config")}
            </span>
            <span className="text-text-muted">/</span>
            <span>{t("workspace:txt_1182")}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-0 flex flex-col items-stretch overflow-hidden ${activeTool.status === "uninstalled" || isInstalling || activeTab === "mcp" ? "" : "p-6 lg:p-8"}`}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          {activeTool.status === "uninstalled" || isInstalling ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {isInstalling ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                        <Loader2
                          className="animate-spin text-primary-main"
                          size={18}
                        />
                        {t('workspace:installing', 'Installing')} {activeTool.name}...
                      </h2>
                      <p className="text-xs text-text-muted mt-1">
                        {t("workspace:txt_1183")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono font-bold text-primary-light">
                        {installProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div className="h-2 bg-panel border border-divider rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        installType === "cli"
                          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          : "bg-gradient-to-r from-primary-main via-primary-dark to-blue-500 shadow-[0_0_8px_var(--color-primary-alpha)]"
                      }`}
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>

                  {/* Simulated live telemetry indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-panel border border-divider rounded-xl p-3.5">
                      <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        {t("workspace:txt_1184")}
                      </span>
                      <span className="text-sm font-mono font-bold text-text-main mt-0.5 block">
                        {installProgress === 100
                          ? t("workspace:speed_0", "0 B/s")
                          : installType === "cli"
                            ? t("workspace:local_bus_io", "Local Bus I/O")
                            : `${(10 + Math.sin(installProgress / 4) * 2.5).toFixed(1)} MB/s`}
                      </span>
                    </div>
                    <div className="bg-panel border border-divider rounded-xl p-3.5">
                      <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        {t("workspace:txt_1185")}
                      </span>
                      <span className="text-sm font-mono font-bold text-text-main mt-0.5 block">
                        {installType === "cli"
                          ? t("workspace:npm_global_bin", "NPM Global / Bin")
                          : t("workspace:macos_app", "macOS Application")}
                      </span>
                    </div>
                    <div className="bg-panel border border-divider rounded-xl p-3.5">
                      <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        {t("workspace:txt_1186")}
                      </span>
                      <span className="text-sm font-mono font-bold text-text-main mt-0.5 block">
                        {t("workspace:pid_live", "PID 38127 (Live)")}
                      </span>
                    </div>
                    <div className="bg-panel border border-divider rounded-xl p-3.5">
                      <span className="block text-[10px] uppercase font-bold text-text-muted tracking-wider">
                        {t("workspace:txt_1187")}
                      </span>
                      <span className="text-sm font-mono font-bold text-primary-light mt-0.5 block">
                        127.0.0.1:3000
                      </span>
                    </div>
                  </div>

                  {/* macOS Style Terminal Window */}
                  <div className="border border-divider rounded-2xl overflow-hidden shadow-2xl bg-canvas">
                    <div className="bg-panel border-b border-divider px-4 py-3 flex items-center justify-between animate-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/85 shadow-[0_0_6px_rgba(239,68,68,0.3)]" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/85" />
                        <span className="w-3 h-3 rounded-full bg-green-500/85" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-text-muted select-none">
                        sh (sdkwork@localhost) ~ /setup
                      </span>
                      <div className="w-12" />
                    </div>
                    <div className="p-5 font-mono text-[11px] space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar min-h-[180px] flex flex-col justify-end bg-canvas">
                      {installLogs.map((log, idx) => {
                        let colorClass = "text-text-main";
                        if (log.startsWith("$"))
                          colorClass = "text-primary-light font-semibold";
                        else if (log.startsWith("[success]"))
                          colorClass = "text-emerald-400 font-bold";
                        else if (log.startsWith("[info]"))
                          colorClass = "text-text-muted";
                        else if (log.startsWith("[mcp]"))
                          colorClass = "text-primary-light";

                        return (
                          <div
                            key={idx}
                            className={`leading-relaxed animate-in fade-in slide-in-from-left-1 duration-205 ${colorClass}`}
                          >
                            {log}
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-1 text-primary-light">
                        <span>$</span>
                        <span className="w-1.5 h-3.5 bg-primary-main/90 animate-pulse select-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="text-center max-w-xl mx-auto space-y-2 py-4">
                    <h2 className="text-xl font-bold text-text-main tracking-tight">
                      {t("workspace:txt_1188")}
                    </h2>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {t("workspace:txt_1189")}
                    </p>
                  </div>

                  {/* Two Main Installation Path Offerings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CLI Option card */}
                    <div
                      onClick={() => {
                        setSelectedType("cli");
                        setIsInstallModalOpen(true);
                      }}
                      className="group border border-divider rounded-2xl bg-panel p-6 space-y-4 hover:border-primary-main/50 hover:bg-surface transition-all cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-main/5 rounded-full blur-2xl group-hover:bg-primary-hover/10 transition-colors" />
                      <div className="p-3 bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light rounded-xl w-12 h-12 flex items-center justify-center">
                        <Terminal size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                          {t("workspace:txt_1190")}
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary-main/15 text-primary-light font-mono">
                            {t("workspace:recommended", "Recommended")}
                          </span>
                        </h3>
                        <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                          {t("workspace:txt_1191")}
                        </p>
                      </div>
                      <div className="border-t border-divider pt-3 flex items-center justify-between text-xs text-text-muted">
                        <span>
                          {t("workspace:txt_1192")}{" "}
                          <code className="font-mono text-primary-light text-[10px]">
                            {activeTool.id.toLowerCase()}
                          </code>
                        </span>
                        <span className="text-primary-main group-hover:translate-x-1 transition-transform">
                          {t("workspace:txt_1193")}
                        </span>
                      </div>
                    </div>

                    {/* Desktop GUI option card */}
                    <div
                      onClick={() => {
                        setSelectedType("desktop");
                        setIsInstallModalOpen(true);
                      }}
                      className="group border border-divider rounded-2xl bg-panel p-6 space-y-4 hover:border-primary-main/50 hover:bg-surface transition-all cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-main/5 rounded-full blur-2xl group-hover:bg-primary-main/10 transition-colors" />
                      <div className="p-3 bg-primary-main/10 border border-primary-main/20 text-primary-light rounded-xl w-12 h-12 flex items-center justify-center">
                        <Monitor size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-text-main">
                          {t("workspace:txt_1194")}
                        </h3>
                        <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                          {t("workspace:txt_1195")}
                        </p>
                      </div>
                      <div className="border-t border-divider pt-3 flex items-center justify-between text-xs text-text-muted">
                        <span>
                          {t("workspace:txt_1196")}{" "}
                          <code className="font-mono text-primary-light text-[10px]">
                            ~76.5 MB
                          </code>
                        </span>
                        <span className="text-primary-main group-hover:translate-x-1 transition-transform">
                          {t("workspace:txt_1197")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System check board */}
                  <div className="border border-divider rounded-2xl bg-canvas p-5 space-y-3">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      {t("workspace:txt_1198")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-2.5">
                        <div className="text-emerald-400 mt-0.5">
                          <Check
                            size={14}
                            className="border border-emerald-500/30 bg-emerald-500/10 rounded-full p-0.5"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-text-main block">
                            {t("workspace:txt_1199")}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {t(
                              "workspace:check_os",
                              "macOS / Linux Compatible",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="text-emerald-400 mt-0.5">
                          <Check
                            size={14}
                            className="border border-emerald-500/30 bg-emerald-500/10 rounded-full p-0.5"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-text-main block">
                            {t("workspace:txt_1200")}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {t(
                              "workspace:check_node",
                              "Node v18.19.0 (Checked)",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="text-emerald-400 mt-0.5">
                          <Check
                            size={14}
                            className="border border-emerald-500/30 bg-emerald-500/10 rounded-full p-0.5"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-text-main block">
                            {t("workspace:txt_1201")}
                          </span>
                          <span className="text-[10px] text-text-muted">
                            {t(
                              "workspace:check_port",
                              "Port Ingress Authorized",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center prompt button */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setIsInstallModalOpen(true)}
                      className="px-6 py-3 bg-primary-main hover:bg-primary-hover text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_var(--color-primary-alpha)] select-none animate-none"
                    >
                      <Download size={16} />
                      {t("workspace:txt_1202")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className={
                  activeTab === "providers"
                    ? "block mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <ProvidersManager
                  isEditorOpen={isEditorOpen}
                  setIsEditorOpen={setIsEditorOpen}
                  editingProvider={editingProvider}
                  setEditingProvider={setEditingProvider}
                />
              </div>

              <div
                className={
                  activeTab === "skills"
                    ? "block mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <SkillsManager />
              </div>

              <div
                className={
                  activeTab === "prompts"
                    ? "block mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <PromptsManager />
              </div>

              <div
                className={
                  activeTab === "config"
                    ? "block mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <ConfigManager />
              </div>

              <div
                className={
                  activeTab === "mcp"
                    ? "h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <McpManager />
              </div>

              <div
                className={
                  activeTab === "agents"
                    ? "block mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : "hidden"
                }
              >
                <AgentsManager />
              </div>
            </>
          )}
        </div>
      </div>

      <AppInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        activeTool={activeTool}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onInstall={onInstall}
      />
    </div>
  );
}
