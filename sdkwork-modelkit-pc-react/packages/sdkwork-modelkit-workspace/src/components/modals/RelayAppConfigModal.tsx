import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import { X, Sliders, Settings2, ShieldCheck, CheckSquare, Square, Eye, EyeOff, Copy, Sparkles } from "lucide-react";
import { AgentTool } from "@sdkwork/modelkit-types";
import { getProviderIcon } from "../providers/ProviderIcon";
import { LocalRelay } from "../../services/types";
import { toast } from "sonner";
import { workspaceService } from "../../services/WorkspaceService";
import { QuickConfigButton, UNIFIED_TOOLS } from "@sdkwork/modelkit-sdk-typescript";

interface RelayAppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  relay: LocalRelay | undefined;
  tools: AgentTool[];
  onSave: (relayId: string, enabledTools: string[]) => void;
}

export function RelayAppConfigModal({
  isOpen,
  onClose,
  relay,
  tools,
  onSave,
}: RelayAppConfigModalProps) {
  const { t, language } = useAppContext();
  const isZh = language === "zh";

  // Hold a dynamic local array of checked tool IDs
  const [localEnabledTools, setLocalEnabledTools] = useState<string[]>([]);
  const [defaultApiKey, setDefaultApiKey] = useState<string>("");
  const [defaultBaseUrl, setDefaultBaseUrl] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    if (relay) {
      setLocalEnabledTools(relay.enabledTools || []); // Default to empty if not set
    }
  }, [relay, tools, isOpen]);

  useEffect(() => {
    if (isOpen && relay) {
      workspaceService.getApiKeys().then((keys) => {
        const relayKeys = keys.filter((k) => k.relayId === relay.id);
        if (relayKeys.length > 0) {
          const activeKey = relayKeys.find(k => k.enabled) || relayKeys[0];
          setDefaultApiKey(activeKey.key);
          setDefaultBaseUrl(activeKey.baseUrl || `http://localhost:${relay.port}`);
        } else {
          // Auto-generate, save and persist default API Key for this relay
          const generatedKey = `sk-${relay.id.replace('relay-', '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          const defaultUrl = `http://localhost:${relay.port}`;
          const newKeyItem = {
            id: `k-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: `${relay.name} Default Key`,
            key: generatedKey,
            baseUrl: defaultUrl,
            enabled: true,
            timeAdded: new Date().toISOString().replace('T', ' ').substring(0, 16),
            relayId: relay.id
          };
          const updatedKeys = [...keys, newKeyItem];
          workspaceService.saveApiKeys(updatedKeys).then(() => {
            setDefaultApiKey(generatedKey);
            setDefaultBaseUrl(defaultUrl);
          });
        }
      });
    }
  }, [isOpen, relay]);

  if (!isOpen || !relay) return null;

  // Transform workspace tools into standard Config UI tool shapes
  const configTools = tools.map((t) => {
    const defaultTool = UNIFIED_TOOLS.find((u) => u.id === t.id);
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      configFile: defaultTool?.configFile || `~/.${t.id}/config.json`,
      configLanguage: defaultTool?.configLanguage || "json",
    };
  }) as any[];

  const toggleTool = (toolId: string) => {
    setLocalEnabledTools((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };

  const handleSave = () => {
    onSave(relay.id, localEnabledTools);
    onClose();
  };

  const handleSelectAll = () => {
    setLocalEnabledTools(tools.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setLocalEnabledTools([]);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-divider-strong rounded-2xl w-full max-w-[600px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-divider flex items-center justify-between bg-surface/80 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-main/10 border border-primary-main/20 flex items-center justify-center text-primary-light">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text-main font-mono uppercase tracking-wider">
                {t("workspace:relay_app_config_hdr", "{{name}} - App Config").replace("{{name}}", relay.name)}
              </h3>
              <p className="text-[10px] text-text-muted mt-0.5">
                {t("workspace:associate_gateway_tools_hint", "Select tools to receive/route traffic through this gateway")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-divider"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Default API Key & Connection Info Card */}
          <div className="p-4 bg-canvas border border-divider-strong rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-text-main flex items-center gap-2">
                <span className="w-1.5 h-3 bg-primary-main rounded-sm"></span>
                {t("workspace:rel_key_note", "Local API Key Information (Auto-Initialized)")}
              </h4>
              <QuickConfigButton
                apiKey={defaultApiKey}
                baseUrl={defaultBaseUrl}
                name={relay.name}
                description={t("workspace:rel_associated_desc", "Relay associated key autoconfig")}
                layoutMode="drawer"
                label={t("workspace:apply_to_client_config", "Apply to client config")}
                tools={configTools.length > 0 ? configTools : undefined}
                onDirectConfig={(toolId, toolName) => {
                  toast.success(
                    t("workspace:direct_config_success", "[{{toolName}}] Configuration applied! Local API key and port successfully set.").replace("{{toolName}}", toolName)
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-surface border border-divider rounded-lg relative group/item">
                <div className="text-[10px] text-text-muted mb-1 font-sans">{t("workspace:api_base_url_label", "API Base URL")}</div>
                <div className="text-primary-light font-bold truncate pr-8">{defaultBaseUrl}</div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(defaultBaseUrl);
                    toast.success(t("workspace:endpoint_copied", "Custom endpoint URL copied!"));
                  }}
                  className="absolute right-2 top-3 text-text-muted hover:text-primary-light p-1 rounded hover:bg-divider transition-all"
                  title={t("workspace:copy_base_url_btn", "Copy Base URL")}
                >
                  <Copy size={13} />
                </button>
              </div>
              <div className="p-2.5 bg-surface border border-divider rounded-lg relative group/item">
                <div className="text-[10px] text-text-muted mb-1 font-sans">{t("workspace:local_api_key_label", "Local API Key")}</div>
                <div className="text-text-main font-bold truncate pr-14 font-mono">
                  {showKey ? defaultApiKey : "••••••••••••••••••••••••"}
                </div>
                <div className="absolute right-2 top-3 flex items-center gap-1 text-text-muted">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="hover:text-text-main p-1 rounded hover:bg-divider transition-all"
                  >
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(defaultApiKey);
                      toast.success(t("workspace:api_key_copied", "API key copied to clipboard!"));
                    }}
                    className="hover:text-primary-light p-1 rounded hover:bg-divider transition-all"
                    title={t("workspace:copy_api_key_btn", "Copy API Key")}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-text-muted select-none leading-relaxed">
              {t("workspace:relay_inject_tip", "Use 'Apply to client config' above to automatically populate the API key and endpoint details in chosen downstream agent workflows.")}
            </p>
          </div>

          {/* Quick toggle headers */}
          <div className="flex items-center justify-between border-b border-divider/50 pb-3">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <Settings2 size={13} className="text-primary-main" />
              {t("workspace:available_dev_tools_hdr", "AVAILABLE DEV TOOLS")}
            </span>
            <div className="flex gap-3 text-[10px] font-bold">
              <button
                onClick={handleSelectAll}
                className="text-primary-light hover:text-text-main transition-colors cursor-pointer"
              >
                {t("workspace:select_all_btn", "Select All")}
              </button>
              <span className="text-divider-strong">|</span>
              <button
                onClick={handleDeselectAll}
                className="text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                {t("workspace:deselect_all_btn", "Deselect All")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {tools.map((tool) => {
              const checked = localEnabledTools.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                    checked
                      ? "bg-primary-main/5 border-primary-main/40 hover:border-primary-main/60 shadow-[0_2px_8px_rgba(59,130,246,0.1)]"
                      : "bg-panel/40 border-divider hover:border-divider-strong hover:bg-panel"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 border shadow-inner ${
                        checked
                          ? "bg-surface text-primary-light border-primary-main/20"
                          : "bg-surface border-divider text-text-muted"
                      }`}
                    >
                      {getProviderIcon(tool.name, "w-4 h-4", tool.icon)}
                    </div>
                    <div className="truncate min-w-0">
                      <div className={`text-xs font-bold truncate ${checked ? "text-text-main" : "text-text-muted"}`}>
                        {tool.name}
                      </div>
                      <div className="text-[9px] text-text-muted select-none mt-0.5 truncate flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${tool.status === "installed" || tool.status === "running" ? "bg-emerald-500" : "bg-gray-600"}`}></span>
                        <span>{tool.status === "installed" || tool.status === "running" ? t("workspace:installed_status", "Deployed") : t("workspace:inactive_status", "Inactive")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {checked ? (
                      <CheckSquare size={16} className="text-primary-light" />
                    ) : (
                      <Square size={16} className="text-text-muted" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-divider bg-surface-hover/30 flex items-center justify-end gap-3.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-divider hover:border-divider-strong rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
          >
            {t("workspace:txt_1209", "Cancel")}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-primary-main hover:bg-primary-hover text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck size={14} />
            {t("workspace:confirm_association", "Save Associations")}
          </button>
        </div>
      </div>
    </div>
  );
}
