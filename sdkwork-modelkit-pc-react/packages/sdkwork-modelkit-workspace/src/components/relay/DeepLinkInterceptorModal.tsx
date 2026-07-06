import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import { parseDeepLink, UNIFIED_TOOLS } from "@sdkwork/modelkit-sdk-typescript";
import {
  X,
  Check,
  Key,
  Code2,
  Copy,
  Sparkles,
  FolderSync,
  Play,
  Server,
  HelpCircle,
  ShieldAlert,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { ToolConfigRegistry, ConfigStrategyResult } from "./ConfigStrategies";
import { workspaceService } from "../../services/WorkspaceService";

export function DeepLinkInterceptorModal() {
  const { t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<any>(null);
  const [activeStrategyResult, setActiveStrategyResult] =
    useState<ConfigStrategyResult | null>(null);
  const [selectedStrategyToolId, setSelectedStrategyToolId] = useState<
    string | null
  >(null);
  const [isSavedToManager, setIsSavedToManager] = useState(false);

  useEffect(() => {
    // Look for ?deeplink= parameter or similar in URL query on mount
    const searchParams = new URLSearchParams(window.location.search);
    const deeplinkParam = searchParams.get("deeplink");

      if (deeplinkParam) {
      try {
        const parsed = parseDeepLink(deeplinkParam);
        if (parsed) {
          setPayload(parsed);
          setIsOpen(true);
          toast.success(
            t("workspace:deeplink_detected", "📥 Detected inbound ecosystem Deep Link, smart configuration loaded!")
          );

          // Clean the query string in browser history without full page reload
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (err) {
        console.error("Failed to auto-parse deep link in interceptor", err);
      }
    }
  }, []);

  if (!isOpen || !payload) return null;

  // Run the configured strategy for a specific tool
  const handleExecuteStrategy = (toolId: string, toolName: string) => {
    setSelectedStrategyToolId(toolId);

    // Instantiate strategy via Strategy Pattern Registry
    const strategy = ToolConfigRegistry.getStrategy(toolId, toolName);
    const result = strategy.execute(payload);

    setActiveStrategyResult(result);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(t("workspace:strategy_apply_failed", "Failed to apply strategy, please check key validity."));
    }
  };

  // Sync to actual modelkit_api_keys local manager storage
  const handleSyncToManager = async () => {
    try {
      let currentKeys = await workspaceService.getApiKeys();

      // Check if duplicate key already exists
      const exists = currentKeys.some((k: any) => k.key === payload.apiKey);
      if (exists) {
        toast.info(t("workspace:key_already_imported", "API Key already imported, skipped duplicate."));
        setIsSavedToManager(true);
        return;
      }

      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newId = `k-dl-${Date.now()}`;
      const newApiKey = {
        id: newId,
        name: `${payload.name} (DeepLink)`,
        key: payload.apiKey,
        baseUrl: payload.baseUrl || "",
        enabled: true,
        timeAdded: formattedTime,
      };

      currentKeys = [newApiKey as any, ...currentKeys];
      await workspaceService.saveApiKeys(currentKeys);

      setIsSavedToManager(true);
      toast.success(t("workspace:key_sync_success", "🎉 API Key smoothly synchronized to local keystore!"));
    } catch (e) {
      console.error("Failed to sync deep link key", e);
      toast.error(t("workspace:sync_failed", "Sync failed, please refresh and retry"));
    }
  };

  const handleCopyConfigText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("workspace:config_copied", "Configuration snippet copied to clipboard!"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Interceptor Card layout */}
      <div className="relative bg-panel border border-divider-strong rounded-3xl w-full max-w-2xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Header HUD Banner */}
        <div className="p-6 border-b border-divider bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-main/10 border border-[var(--color-primary-alpha)] flex items-center justify-center text-primary-light">
              <FolderSync
                size={20}
                className="animate-spin"
                style={{ animationDuration: "6s" }}
              />
            </div>
            <div>
              <h3 className="text-sm font-black text-text-main uppercase tracking-widest font-mono flex items-center gap-2">
                {t("workspace:txt_1262")}
              </h3>
              <p className="text-[11px] text-text-muted">
                {t("workspace:txt_1263")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body scrolling pane */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
          {/* Metadata Grid */}
          <div className="p-4 rounded-2xl bg-canvas border border-divider">
            <div className="text-[10px] text-primary-light font-extrabold uppercase font-mono tracking-widest mb-3 flex items-center gap-1.5">
              <Key size={12} />
              {t("workspace:txt_1264")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-text-muted font-bold block">
                  {t("workspace:txt_1265")}
                </span>
                <span className="text-text-main font-black text-sm">
                  {payload.name}
                </span>
              </div>
              <div>
                <span className="text-text-muted font-bold block">
                  {t("workspace:txt_1266")}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 group/url">
                  <span className="text-text-muted font-mono text-[11px] break-all">
                    {payload.baseUrl || "https://api.openai.com/v1"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        payload.baseUrl || "https://api.openai.com/v1",
                      );
                      toast.success(t("workspace:copy_baseurl_success", "API endpoint Base URL copied!"));
                    }}
                    className="text-text-muted hover:text-primary-light p-0.5 rounded transition-all opacity-40 group-hover/url:opacity-100 cursor-pointer"
                    title={t("workspace:copy_baseurl_title", "Copy Base URL")}
                  >
                    <Copy size={11} />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-text-muted font-bold block">
                  {t("workspace:txt_1268")}
                </span>
                <span className="text-text-muted">
                  {payload.description || t("workspace:no_description", "No description provided")}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-text-muted font-bold block">
                  {t("workspace:txt_1270")}
                </span>
                <span className="text-text-muted font-mono text-[11px] break-all bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-divider inline-block mt-0.5">
                  {payload.apiKey}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-divider flex justify-end">
              <button
                onClick={handleSyncToManager}
                disabled={isSavedToManager}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isSavedToManager
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-primary-main hover:bg-primary-hover text-white shadow-md active:scale-97"
                }`}
              >
                {isSavedToManager ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>{t("workspace:txt_1271")}</span>
                  </>
                ) : (
                  <>
                    <FolderSync size={14} />
                    <span>{t("workspace:txt_1272")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Strategies Options Sector */}
          <div className="space-y-3.5">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest font-mono block">
              {t("workspace:txt_1273")}
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {UNIFIED_TOOLS.filter(
                (t) =>
                  payload.supportedTools.length === 0 ||
                  payload.supportedTools.includes(t.id),
              ).map((tool) => {
                const isSelected = selectedStrategyToolId === tool.id;
                return (
                  <div
                    key={tool.id}
                    className={`p-4 border rounded-2xl transition-all ${
                      isSelected
                        ? "bg-primary-main/5 border-primary-main shadow-[inset_0_1px_rgba(59,130,246,0.1)]"
                        : "bg-surface border-divider hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-divider flex items-center justify-center text-primary-light shrink-0">
                          <Cpu size={15} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-text-main">
                              {tool.name}
                            </span>
                            <span className="text-[9px] font-mono text-text-muted bg-panel px-1.5 py-0.5 rounded border border-divider">
                              {tool.configFile}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted mt-1 leading-normal mr-2">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleExecuteStrategy(tool.id, tool.name)
                        }
                        className="px-3 py-1.5 bg-divider hover:bg-primary-main hover:text-text-main text-text-main rounded-lg text-xs font-black flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-sm"
                      >
                        <Play size={11} />
                        <span>{t("workspace:txt_1274")}</span>
                      </button>
                    </div>

                    {/* Show execution feedback if this tool strategy was dispatched */}
                    {isSelected && activeStrategyResult && (
                      <div className="mt-4 bg-canvas border border-[var(--color-primary-alpha)] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold text-[10.5px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t("workspace:txt_1275")}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyConfigText(
                                activeStrategyResult.configContent,
                              )
                            }
                            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-main rounded-lg transition-colors"
                            title={t('workspace:copy_final_config', "Copy configuration")}
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                        <p className="text-text-muted leading-normal text-[11px] bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-divider">
                          {activeStrategyResult.message}
                        </p>
                        <div className="space-y-1">
                          <span className="text-[9px] text-text-muted font-mono block">
                            {t('workspace:generated_config_file', 'Generated config file:')} (
                            {activeStrategyResult.configPath})
                          </span>
                          <pre className="bg-canvas p-3 text-blue-300 font-mono text-[10.5px] rounded-lg overflow-x-auto max-h-[140px] custom-scrollbar border border-divider">
                            {activeStrategyResult.configContent}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-divider bg-surface flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-text-muted">
            <ShieldAlert size={14} className="text-amber-500" />
            <span className="text-[10px] uppercase font-bold text-text-muted">
              {t("workspace:txt_1277")}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-main font-black rounded-xl text-xs transition-colors cursor-pointer"
          >
            {t("workspace:complete_and_close", "Done and Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
