import React, { useState, useEffect } from "react";
import {
  Settings2,
  Terminal,
  Shield,
  RefreshCw,
  Database,
  Server,
  Check,
  HelpCircle,
  Activity,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { useAppContext, useService } from "@sdkwork/modelkit-core";
import {
  ISystemService,
  ISystemServiceToken,
} from "@sdkwork/modelkit-services";
import { toast } from "sonner";
import { workspaceService } from "../../services/WorkspaceService";
import type { LocalRelay } from "../../services/types";

interface SystemSettingsProps {
  onNavigate?: (view: "user-profile" | "system-settings") => void;
}

export function SystemSettings({ onNavigate }: SystemSettingsProps) {
  const {
    language,
    setLanguage,
    t,
    themeMode,
    setThemeMode,
    themeColor,
    setThemeColor,
  } = useAppContext();
  const systemService = useService<ISystemService>(ISystemServiceToken);
  const [debugLevel, setDebugLevel] = useState("info");
  const [sslVerification, setSslVerification] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [relays, setRelays] = useState<LocalRelay[]>([]);

  useEffect(() => {
    systemService.fetchSettings().then((settings) => {
      setDebugLevel(settings.debugLevel || "info");
      setSslVerification(settings.sslVerification || false);
    });
    workspaceService.getRelays().then(setRelays);
  }, [systemService]);

  const handleClearCache = async () => {
    setIsClearingCache(true);
    await systemService.clearCache();
    setIsClearingCache(false);
    toast.success(
      t('workspace:system_cache_cleared', 'Response cache disabled and persisted to system settings.')
    );
  };

  const handleSaveConfigs = async () => {
    setSaveLoading(true);
    await systemService.updateSettings({
      debugLevel: debugLevel as "error" | "debug" | "info" | "warn",
      sslVerification,
      language,
      theme: themeMode,
    });
    setSaveLoading(false);
    toast.success(t('workspace:settings_saved', "System parameters saved successfully."));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas overflow-y-auto custom-scrollbar">
      {/* Header Bar */}
      <div className="px-8 pt-8 flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 px-1.5 rounded bg-primary-main/10 border border-primary-main/20 text-primary-light text-[10px] font-bold select-none">
                {t("workspace:system_config")}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
              <Settings2 className="text-primary-light" size={22} />
              {t("workspace:system_environment_settings")}
            </h1>
          </div>
        </div>
      </div>

      {/* Settings Panel Grid */}
      <div className="px-8 pb-12 grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-none">
        {/* Core Settings Module */}
        <div className="border border-divider bg-panel rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-divider pb-3">
            <Server
              size={16}
              className="text-primary-light hover:animate-spin"
            />
            {t("workspace:primary_gateway_core_configurations")}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                {t("workspace:debug_logging_level")}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["debug", "info", "warn", "error"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDebugLevel(level)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all uppercase ${
                      debugLevel === level
                        ? "bg-primary-main/10 border-primary-main text-primary-light shadow-[0_0_8px_var(--color-primary-alpha)]"
                        : "bg-surface border-divider text-text-muted hover:text-text-main hover:border-divider-strong"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-1.5">
                {t(
                  "workspace:tune_output_verbosity_for_backend_node_js_compute_",
                )}
              </p>
            </div>

            <div className="border-t border-divider pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text-main block font-sans">
                  {t("workspace:display_language")}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">
                  {t(
                    "workspace:configure_primary_system_and_sub_module_localizati",
                  )}
                </span>
              </div>
              <div className="flex gap-1 bg-surface p-1 border border-divider rounded-xl shrink-0 self-center">
                <button
                  type="button"
                  onClick={() => setLanguage("zh")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wide transition-all cursor-pointer ${
                    language === "zh"
                      ? "bg-primary-main/10 text-primary-light border border-primary-main/20"
                      : "text-text-muted hover:text-text-main border border-transparent"
                  }`}
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wide transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-primary-main/10 text-primary-light border border-primary-main/20"
                      : "text-text-muted hover:text-text-main border border-transparent"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="border-t border-divider pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text-main block">
                  {t("workspace:https_tls_enforcement_policy")}
                </span>
                <span className="text-[10px] text-text-muted">
                  {t(
                    "workspace:always_enforce_cryptographic_safety_certificate_ch",
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSslVerification(!sslVerification)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none border ${
                  sslVerification
                    ? "bg-primary-main border-primary-main"
                    : "bg-button-dark border-divider-strong"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-all absolute top-0.5 ${
                    sslVerification ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-divider pt-4">
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                {t("workspace:daemon_data_directory")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="~/.sdkwork/modelkit/daemon"
                  className="flex-1 bg-surface border border-divider rounded-lg px-3 py-2 text-xs font-mono text-text-main focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      t("workspace:directory_locked_by_daemon_process"),
                    )
                  }
                  className="px-3 bg-button-dark hover:bg-surface-hover border border-divider hover:border-divider-strong rounded-lg text-xs font-bold text-text-main transition-colors cursor-pointer"
                >
                  {t("workspace:browse")}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfigs}
                disabled={saveLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary-main hover:bg-primary-hover text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_var(--color-primary-alpha)]"
              >
                {saveLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {t("workspace:apply_parameters")}
              </button>
            </div>
          </div>
        </div>

        {/* Theme and Appearance Module */}
        <div className="border border-divider bg-panel rounded-2xl p-6 space-y-6 shadow-xl h-fit">
          <h3 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-divider pb-3">
            <Palette size={16} className="text-pink-400" />
            {t("workspace:interface_theme_appearance")}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-3 uppercase tracking-wide">
                {t("workspace:color_scheme")}
              </label>
              <div className="flex bg-surface border border-divider rounded-xl p-1.5 gap-1.5">
                <button
                  onClick={() => setThemeMode("light")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${themeMode === "light" ? "bg-panel shadow-sm border border-divider-strong text-text-main scale-[1.02]" : "text-text-muted hover:text-text-main"}`}
                >
                  <Sun size={14} />
                  {t("workspace:light_mode")}
                </button>
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${themeMode === "dark" ? "bg-surface-hover shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-text-main scale-[1.02]" : "text-text-muted hover:text-text-main"}`}
                >
                  <Moon size={14} />
                  {t("workspace:dark_mode")}
                </button>
                <button
                  onClick={() => setThemeMode("system")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${themeMode === "system" ? "bg-primary-main/10 border border-primary-main/30 text-primary-light scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "text-text-muted hover:text-text-main"}`}
                >
                  <Settings2 size={14} />
                  {t("workspace:system_match")}
                </button>
              </div>
            </div>

            <div className="border-t border-divider pt-5">
              <label className="block text-xs font-bold text-text-muted mb-3 uppercase tracking-wide">
                {t("workspace:global_accent_color")}
              </label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setThemeColor("indigo")}
                  className={`relative h-12 rounded-xl flex items-center justify-center border-2 transition-all overflow-hidden ${themeColor === "indigo" ? "border-text-main scale-[1.05] shadow-[0_0_15px_rgba(99,102,241,0.4)] z-10" : "border-transparent hover:border-divider-strong hover:scale-105"}`}
                >
                  <div className="absolute inset-0 bg-primary-hover opacity-20"></div>
                  <div className="w-4 h-4 rounded-full bg-primary-hover shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                </button>
                <button
                  onClick={() => setThemeColor("blue")}
                  className={`relative h-12 rounded-xl flex items-center justify-center border-2 transition-all overflow-hidden ${themeColor === "blue" ? "border-text-main scale-[1.05] shadow-[0_0_15px_rgba(59,130,246,0.4)] z-10" : "border-transparent hover:border-divider-strong hover:scale-105"}`}
                >
                  <div className="absolute inset-0 bg-primary-hover opacity-20"></div>
                  <div className="w-4 h-4 rounded-full bg-primary-hover shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                </button>
                <button
                  onClick={() => setThemeColor("amber")}
                  className={`relative h-12 rounded-xl flex items-center justify-center border-2 transition-all overflow-hidden ${themeColor === "amber" ? "border-text-main scale-[1.05] shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10" : "border-transparent hover:border-divider-strong hover:scale-105"}`}
                >
                  <div className="absolute inset-0 bg-amber-500 opacity-20"></div>
                  <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                </button>
                <button
                  onClick={() => setThemeColor("teal")}
                  className={`relative h-12 rounded-xl flex items-center justify-center border-2 transition-all overflow-hidden ${themeColor === "teal" ? "border-text-main scale-[1.05] shadow-[0_0_15px_rgba(20,184,166,0.4)] z-10" : "border-transparent hover:border-divider-strong hover:scale-105"}`}
                >
                  <div className="absolute inset-0 bg-teal-500 opacity-20"></div>
                  <div className="w-4 h-4 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace relay status from persisted preferences */}
        <div className="space-y-6">
          <div className="border border-divider-strong bg-panel rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-divider pb-3">
              <Activity size={16} className="text-primary-light" />
              {t('workspace:workspace_relay_status', 'Workspace Relay Status')}
            </h3>

            <div className="space-y-3">
              {relays.length === 0 ? (
                <p className="text-xs text-text-muted">
                  {t(
                    'workspace:no_workspace_relays',
                    'No workspace relays configured. Create one in the Workspace view.',
                  )}
                </p>
              ) : (
                relays.map((relay) => (
                  <div
                    key={relay.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface border border-divider hover:border-divider-strong transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          relay.status === 'running'
                            ? 'bg-emerald-500 animate-pulse'
                            : 'bg-text-muted'
                        }`}
                      />
                      <div>
                        <span className="text-xs font-bold text-text-main block">
                          {relay.name}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {relay.port ? `127.0.0.1:${relay.port}` : t('workspace:relay_port_unset', 'Port not configured')}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        relay.status === 'running'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-surface-hover border-divider text-text-muted'
                      }`}
                    >
                      {relay.status === 'running'
                        ? t('workspace:relay_status_running', 'RUNNING')
                        : t('workspace:relay_status_stopped', 'STOPPED')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border border-divider-strong bg-panel rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-divider pb-3">
              <Database size={16} className="text-primary-light" />
              {t("workspace:system_cache_section_title", "Response Cache")}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text-main block">
                  {t("workspace:system_cache_description", "Semantic and exact-match response caches")}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">
                  {t(
                    "workspace:system_cache_hint",
                    "Clearing disables both cache modes in persisted system settings.",
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isClearingCache ? (
                  <span className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={12} />
                    {t("workspace:system_cache_clear_button", "Clear cache")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
