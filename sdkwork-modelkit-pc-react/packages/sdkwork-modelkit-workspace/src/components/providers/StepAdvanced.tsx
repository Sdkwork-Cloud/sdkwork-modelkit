import React from "react";
import { ProviderData } from "../../services/types";
import { useAppContext } from "@sdkwork/modelkit-core";

interface StepAdvancedProps {
  formData: ProviderData;
  setFormData: (data: ProviderData) => void;
}

export function StepAdvanced({ formData, setFormData }: StepAdvancedProps) {
  const { t, language } = useAppContext();
  const isZh = language === "zh";

  return (
    <div className="space-y-8">
      {/* Network Control */}
      <div>
        <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
          {t("workspace:net_cnt_title", "Network Control")}
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              {t("workspace:ctrl_max_retries", "Max Retries")}
            </label>
            <input
              type="number"
              value={formData.maxRetries}
              min={0}
              max={10}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxRetries: parseInt(e.target.value) || 0,
                })
              }
              className="w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              {t("workspace:ctrl_timeout", "Timeout (ms)")}
            </label>
            <input
              type="number"
              value={formData.timeoutMs}
              min={1000}
              step={1000}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  timeoutMs: parseInt(e.target.value) || 30000,
                })
              }
              className="w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div>
        <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
          {t("workspace:network_ctrl_t", "Probes & Proxy")}
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-surface border border-divider rounded-xl cursor-pointer hover:border-divider-strong transition-colors">
            <div>
              <div className="text-sm font-bold text-text-main">
                {t("workspace:ctrl_speed_check", "Speed Check")}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {t("workspace:ctrl_speed_check_desc", "Automatically measure API and show latency in the list.")}
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors relative ${formData.enableSpeedCheck ? "bg-primary-main" : "bg-divider-strong"}`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.enableSpeedCheck ? "translate-x-4" : "translate-x-0"}`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.enableSpeedCheck}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableSpeedCheck: e.target.checked,
                  })
                }
              />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 bg-surface border border-divider rounded-xl cursor-pointer hover:border-divider-strong transition-colors">
            <div>
              <div className="text-sm font-bold text-text-main">
                {t("workspace:ctrl_health_check", "Health Check")}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {t("workspace:ctrl_health_check_desc", "Periodically send heartbeat to verify endpoint connectivity.")}
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors relative ${formData.enableHealthCheck ? "bg-primary-main" : "bg-divider-strong"}`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.enableHealthCheck ? "translate-x-4" : "translate-x-0"}`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.enableHealthCheck}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableHealthCheck: e.target.checked,
                  })
                }
              />
            </div>
          </label>

          <label className="flex items-center justify-between p-4 bg-surface border border-divider rounded-xl cursor-pointer hover:border-divider-strong transition-colors">
            <div>
              <div className="text-sm font-bold text-text-main">
                {t("workspace:ctrl_system_proxy", "System Proxy")}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {t("workspace:ctrl_system_proxy_desc", "Traffic will go through the global HTTP/HTTPS proxy.")}
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors relative ${formData.enableProxy ? "bg-primary-main" : "bg-divider-strong"}`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.enableProxy ? "translate-x-4" : "translate-x-0"}`}
              />
              <input
                type="checkbox"
                className="sr-sr-only sr-only"
                checked={formData.enableProxy}
                onChange={(e) =>
                  setFormData({ ...formData, enableProxy: e.target.checked })
                }
              />
            </div>
          </label>
        </div>
      </div>

      {/* Rate Limits */}
      <div>
        <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
          {t("workspace:ctrl_rate_limits", "Rate Limits")}
        </h4>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{t("workspace:ctrl_concurrency_limit", "Concurrency Limit")}</span>
              <span className="text-primary-light">
                {formData.concurrencyLimit === 0
                  ? t("workspace:ctrl_unlimited", "Unlimited")
                  : `${formData.concurrencyLimit} ${t("workspace:ctrl_threads", "Threads")}`}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={formData.concurrencyLimit || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  concurrencyLimit: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-divider rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between mt-2 text-[10px] text-text-muted font-mono">
              <span>{t("workspace:ctrl_unlimited_short", "0 (Unlimited)")}</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
