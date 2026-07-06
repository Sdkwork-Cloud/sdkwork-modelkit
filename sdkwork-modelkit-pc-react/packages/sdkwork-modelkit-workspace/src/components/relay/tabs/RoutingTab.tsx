import React from "react";
import { useAppContext } from "@sdkwork/modelkit-core";

export function RoutingTab() {
  const { t, language } = useAppContext();
  

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="routing-tab">
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h3 className="text-xl font-bold text-text-main mb-2">
            {t("workspace:advanced_routing_config", "Routing Configuration")}
          </h3>
          <p className="text-xs text-text-muted">
            {t(
              "workspace:advanced_routing_desc",
              "Configure advanced multi-account routing and anti-abuse policies to optimize API throughput and bypass rate-limiting (429)."
            )}
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider overflow-hidden p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">
            {t("workspace:routing_strategy_label", "Routing Strategy")}
          </label>
          <div className="space-y-3">
            {[
              {
                id: "round_robin",
                name: t("workspace:mode_round_robin", "Round Robin"),
                desc: t(
                  "workspace:mode_round_robin_desc",
                  "Distribute requests sequentially across all active provider accounts."
                ),
              },
              {
                id: "least_latency",
                name: t("workspace:mode_least_latency", "Least Latency"),
                desc: t(
                  "workspace:mode_least_latency_desc",
                  "Route to the provider account with the lowest historical response time."
                ),
              },
              {
                id: "weighted_random",
                name: t("workspace:mode_weighted_random", "Weighted Random"),
                desc: t(
                  "workspace:mode_weighted_random_desc",
                  "Distribute based on custom weights defined per provider."
                ),
              },
              {
                id: "fallback",
                name: t("workspace:mode_fallback", "Priority Fallback"),
                desc: t(
                  "workspace:mode_fallback_desc",
                  "Always use primary account, fallback to others only on failure or rate-limit."
                ),
              },
            ].map((mode) => (
              <label
                key={mode.id}
                className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg border border-divider hover:border-primary-main/50 hover:bg-panel transition-all"
              >
                <input
                  type="radio"
                  name="routing_mode"
                  defaultChecked={mode.id === "round_robin"}
                  className="mt-1 w-4 h-4 text-primary-main bg-canvas border-divider-strong focus:ring-blue-600 focus:ring-offset-[#141518]"
                />
                <div>
                  <div className="text-sm font-bold text-text-main leading-none mb-1.5">{mode.name}</div>
                  <div className="text-xs text-text-muted">{mode.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-divider">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded bg-canvas border-divider-strong text-primary-main focus:ring-blue-600 focus:ring-offset-[#141518] transition-colors cursor-pointer"
            />
            <span className="text-sm font-bold text-text-main group-hover:text-primary-light transition-colors">
              {t("workspace:auto_retry_label", "Automatic Multi-Account Retry on Failure")}
            </span>
          </label>
          <p className="text-xs text-text-muted mt-1.5 ml-6">
            {t(
              "workspace:auto_retry_desc",
              "Seamlessly retry failed requests (429, 50x) using the next available provider account in the rotation."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
