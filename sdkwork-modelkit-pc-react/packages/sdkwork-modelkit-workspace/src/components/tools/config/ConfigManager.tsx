import React, { useState, useEffect } from "react";
import {
  Settings2,
  Key,
  HardDrive,
  Network,
  Shield,
  Zap,
  Database,
  Bell,
  Check,
  Save,
  RotateCcw,
  Sliders,
  Cpu,
  Lock,
  ChevronRight,
  User,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useService } from "@sdkwork/modelkit-core";
import {
  ISystemService,
  ISystemServiceToken,
  SystemSettings,
} from "@sdkwork/modelkit-services";

export function ConfigManager() {
  const [activeTab, setActiveTab] = useState("general");
  const systemService = useService<ISystemService>(ISystemServiceToken);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    systemService.fetchSettings().then((res) => {
      setSettings(res);
      setLoading(false);
    });
  }, [systemService]);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await systemService.updateSettings(settings);
      toast.success("Configuration saved successfully");
    } catch (e) {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      group: "Workspace",
      items: [
        { id: "general", label: "General", icon: Settings2 },
        { id: "members", label: "Members", icon: User },
        { id: "billing", label: "Billing", icon: CreditCard },
      ],
    },
    {
      group: "System",
      items: [
        { id: "security", label: "Security & Access", icon: Lock },
        { id: "network", label: "Network & Proxy", icon: Network },
        { id: "engine", label: "Engine Limits", icon: Cpu },
      ],
    },
  ];

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary-main" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full mx-auto pb-12 pt-2">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 shrink-0">
        <div className="sticky top-6">
          <div className="mb-6 px-1">
            <h2 className="text-2xl font-semibold text-text-main tracking-tight">
              Settings
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {tabs.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
                  {section.group}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left group ${
                        activeTab === tab.id
                          ? "bg-primary-main/10 text-primary-main dark:text-primary-light font-semibold"
                          : "text-text-muted hover:text-text-main hover:bg-surface-hover"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <tab.icon
                          size={15}
                          className={
                            activeTab === tab.id
                              ? "text-primary-main dark:text-primary-light"
                              : "text-text-muted group-hover:text-text-main"
                          }
                        />
                        {tab.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-panel border border-divider rounded-xl shadow-sm">
          <div className="p-8">
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-text-main mb-1">
                    General Settings
                  </h3>
                  <p className="text-sm text-text-muted">
                    Configure core system behaviors and global paths.
                  </p>
                </div>

                <div className="h-px w-full bg-divider" />

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Workspace Directory
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Absolute path for storing logs, models and artifacts.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="text"
                        value={settings.workspaceDir}
                        onChange={(e) =>
                          handleChange("workspaceDir", e.target.value)
                        }
                        className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm font-mono text-text-main outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder:text-text-muted"
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Log Level
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Choose the verbosity of system logs.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <select
                        value={settings.debugLevel}
                        onChange={(e) =>
                          handleChange("debugLevel", e.target.value)
                        }
                        className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="debug">DEBUG - Verbose tracing</option>
                        <option value="info">INFO - Standard output</option>
                        <option value="warn">WARN - Anomalies only</option>
                        <option value="error">ERROR - Critical only</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Telemetry & Updates
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Help us improve the product by sending anonymous data.
                      </p>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5">
                          <input
                            type="checkbox"
                            checked={settings.telemetryEnabled}
                            onChange={(e) =>
                              handleChange("telemetryEnabled", e.target.checked)
                            }
                            className="w-4 h-4 rounded text-primary-main border-divider-strong focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-text-main group-hover:text-primary-main transition-colors">
                            Anonymous Telemetry
                          </span>
                          <span className="block text-xs text-text-muted mt-0.5">
                            Allow sending of anonymous usage data. No prompt
                            data is collected.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5">
                          <input
                            type="checkbox"
                            checked={settings.autoUpdate}
                            onChange={(e) =>
                              handleChange("autoUpdate", e.target.checked)
                            }
                            className="w-4 h-4 rounded text-primary-main border-divider-strong focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-text-main group-hover:text-primary-main transition-colors">
                            Auto-update Toolchains
                          </span>
                          <span className="block text-xs text-text-muted mt-0.5">
                            Automatically check for and install minor background
                            updates.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-divider mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary-main hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-text-main mb-1">
                    Security & Access
                  </h3>
                  <p className="text-sm text-text-muted">
                    Manage global API keys and data encryption parameters.
                  </p>
                </div>

                <div className="h-px w-full bg-divider" />

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-rose-500 flex items-center gap-1.5">
                        <Shield size={14} /> Master Override
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Global overrides will bypass all provider-specific
                        layers. Use with caution.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="password"
                        value={settings.masterOverrideKey}
                        onChange={(e) =>
                          handleChange("masterOverrideKey", e.target.value)
                        }
                        placeholder="sk-***************************"
                        className="w-full bg-surface border border-rose-500/30 rounded-md px-3 py-2 text-sm font-mono text-text-main outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-sm placeholder:text-text-muted"
                      />
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Local Encryption
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Select the encryption standard used for local data.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <select
                        value={settings.localEncryption}
                        onChange={(e) =>
                          handleChange("localEncryption", e.target.value)
                        }
                        className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="aes-256-gcm">
                          AES-256-GCM (Recommended)
                        </option>
                        <option value="chacha20">ChaCha20-Poly1305</option>
                        <option value="none">No Encryption (Plaintext)</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Session Timeout
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Idle time before requiring re-authentication.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <div className="relative w-full">
                        <input
                          type="number"
                          value={settings.sessionTimeoutMinutes}
                          onChange={(e) =>
                            handleChange(
                              "sessionTimeoutMinutes",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full bg-surface border border-divider-strong rounded-md pl-3 pr-12 py-2 text-sm text-text-main outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                          Minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-divider mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary-main hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "network" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-text-main mb-1">
                    Network & Proxy
                  </h3>
                  <p className="text-sm text-text-muted">
                    Configure outbound connections, proxies, and certificate
                    validation.
                  </p>
                </div>

                <div className="h-px w-full bg-divider" />

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Enable Proxy
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Route all external API traffic through a designated
                        server.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={settings.proxyEnabled}
                          onChange={(e) =>
                            handleChange("proxyEnabled", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-divider-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-main border border-divider shadow-sm"></div>
                      </label>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div
                    className={`flex flex-col md:flex-row gap-8 ${!settings.proxyEnabled ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Proxy Configuration
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Set the protocol and address of your proxy server.
                      </p>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-main">
                          Protocol
                        </label>
                        <select
                          value={settings.proxyProtocol}
                          onChange={(e) =>
                            handleChange("proxyProtocol", e.target.value)
                          }
                          className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-main transition-all appearance-none cursor-pointer"
                        >
                          <option value="http">HTTP / HTTPS</option>
                          <option value="socks5">SOCKS5</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-main">
                          Address
                        </label>
                        <input
                          type="text"
                          value={settings.proxyAddress}
                          onChange={(e) =>
                            handleChange("proxyAddress", e.target.value)
                          }
                          placeholder="e.g. 127.0.0.1:7890"
                          className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm font-mono text-text-main outline-none focus:border-primary-main transition-all cursor-text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        SSL Verification
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Reject self-signed certificates or expired SSL on
                        external requests.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={settings.sslVerification}
                          onChange={(e) =>
                            handleChange("sslVerification", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-divider-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-main border border-divider shadow-sm"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-divider mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary-main hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "engine" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-xl font-semibold text-text-main mb-1">
                    Engine Limits
                  </h3>
                  <p className="text-sm text-text-muted">
                    Control concurrency, memory usage and execution constraints.
                  </p>
                </div>

                <div className="h-px w-full bg-divider" />

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Max Concurrent Jobs
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Maximum number of parallel agent execution threads.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <div className="w-full pt-2 px-1">
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="1"
                            max="16"
                            value={settings.maxConcurrentJobs}
                            onChange={(e) =>
                              handleChange(
                                "maxConcurrentJobs",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-full h-1.5 bg-divider-strong rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="w-8 text-center bg-primary-main/10 text-primary-main font-bold rounded px-1 py-0.5 text-xs">
                            {settings.maxConcurrentJobs}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[10px] text-text-muted font-medium px-1">
                          <span>1</span>
                          <span>16</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <h4 className="text-sm font-semibold text-text-main">
                        Context Window
                      </h4>
                      <p className="text-xs text-text-muted mt-1 pr-4">
                        Maximum token bounds per request across all agents.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <select
                        value={settings.contextWindowTokens}
                        onChange={(e) =>
                          handleChange("contextWindowTokens", e.target.value)
                        }
                        className="w-full bg-surface border border-divider-strong rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="4k">4,096 Tokens</option>
                        <option value="16k">16,384 Tokens</option>
                        <option value="32k">32,768 Tokens (Default)</option>
                        <option value="128k">128,000 Tokens</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-px w-full bg-divider" />

                  <div className="p-5 rounded-lg border border-divider bg-surface shadow-sm">
                    <h4 className="text-sm font-semibold text-text-main flex items-center gap-2 mb-2">
                      {settings.semanticCache ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <Database size={16} className="text-primary-main" />
                      )}
                      Semantic Caching
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed mb-4 max-w-2xl">
                      Enable semantic caching to save tokens on repeated inputs.
                      This feature is experimental and may cause minor drift in
                      highly creative workflows.
                    </p>
                    <button
                      onClick={() =>
                        handleChange("semanticCache", !settings.semanticCache)
                      }
                      className={`px-4 py-2 rounded-md border text-xs font-medium transition-all shadow-sm ${
                        settings.semanticCache
                          ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                          : "bg-panel border-divider-strong text-text-main hover:bg-surface-hover hover:border-primary-main/50"
                      }`}
                    >
                      {settings.semanticCache
                        ? "Enabled"
                        : "Enable Semantic Cache"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-divider mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary-main hover:bg-primary-hover text-white text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Empty views for the rest */}
            {["members", "billing"].includes(activeTab) && (
              <div className="py-20 text-center animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-xl bg-surface border border-divider-strong flex items-center justify-center text-text-muted mx-auto mb-4">
                  {activeTab === "members" ? (
                    <User size={24} />
                  ) : (
                    <CreditCard size={24} />
                  )}
                </div>
                <h3 className="text-lg font-medium text-text-main mb-2">
                  {activeTab === "members" ? "Team Members" : "Billing & Plans"}
                </h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto">
                  This feature is currently under development and will be
                  available in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
