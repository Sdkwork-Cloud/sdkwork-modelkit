import React from "react";
import { Settings2, Terminal } from "lucide-react";
import { LocalRelay } from "../../../services/types";
import { useAppContext } from "@sdkwork/modelkit-core";

interface DetailsTabProps {
  relay: LocalRelay;
  setRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>>;
}

export function DetailsTab({ relay, setRelays }: DetailsTabProps) {
  const { t } = useAppContext();
  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="details-tab">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl border border-divider p-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
            {t("workspace:server_endpoint", "Server Endpoint")}
          </div>
          <div className="font-mono text-sm text-primary-light truncate">http://localhost:{relay.port}</div>
        </div>
        <div className="bg-surface rounded-xl border border-divider p-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
            {t("workspace:api_format", "API Format")}
          </div>
          <div className="font-mono text-sm text-text-main">OpenAI Compatible</div>
        </div>
        <div className="bg-surface rounded-xl border border-divider p-5">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
            {t("workspace:connected_accounts", "Connected Accounts")}
          </div>
          <div className="font-medium text-sm text-text-main">
            {relay.providers.length} {t("workspace:active_accounts", "Active Accounts")}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider overflow-hidden">
        <div className="px-6 py-4 border-b border-divider bg-surface flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Settings2 size={16} className="text-text-muted" /> {t("workspace:general_settings", "General Settings")}
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              {t("workspace:router_name", "Router Name")}
            </label>
            <input
              type="text"
              value={relay.name}
              onChange={(e) =>
                setRelays((prev) => prev.map((r) => (r.id === relay.id ? { ...r, name: e.target.value } : r)))
              }
              className="w-full bg-panel border border-divider-strong rounded-lg px-4 py-2.5 text-sm font-medium text-text-main focus:border-primary-main focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              {t("workspace:local_port", "Local Port")}
            </label>
            <input
              type="number"
              value={relay.port}
              onChange={(e) =>
                setRelays((prev) =>
                  prev.map((r) =>
                    r.id === relay.id
                      ? {
                          ...r,
                          port: e.target.value === "" ? "" : parseInt(e.target.value) || 0,
                        }
                      : r
                  )
                )
              }
              className="w-full bg-panel border border-divider-strong rounded-lg px-4 py-2.5 text-sm font-mono text-text-main focus:border-primary-main focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-divider overflow-hidden">
        <div className="px-6 py-4 border-b border-divider bg-surface flex flex-col pt-4 pb-4">
          <h3 className="font-bold flex items-center gap-2 text-sm text-text-main">
            <Terminal size={14} /> {t("workspace:server_logs", "Server Logs")}
          </h3>
        </div>
        <div className="bg-canvas p-4 h-[200px] overflow-y-auto font-mono text-xs text-text-muted space-y-1">
          {relay.status === "running" ? (
            <>
              <div className="text-primary-light">
                [INFO] {t("workspace:log_initialized", "Relay Server initialized")} ({relay.name})
              </div>
              <div>
                [INFO] {t("workspace:log_binding", "Binding to")} 127.0.0.1:{relay.port}...
              </div>
              <div className="text-emerald-400">
                [SUCCESS] {t("workspace:log_listening", "Listening on")} http://127.0.0.1:{relay.port}
              </div>
              {relay.protocols && relay.protocols.length > 0 && (
                <div>
                  [INFO] {t("workspace:log_registered", "Registered protocols:")} {relay.protocols.join(", ")}
                </div>
              )}
              <div>
                [INFO] {t("workspace:log_loaded", "Loaded")} {relay.providers.length}{" "}
                {t("workspace:log_upstreams", "upstream provider(s)")}
              </div>
              <div>[INFO] {t("workspace:log_ready", "Router load balancing ready")}</div>
              <div className="text-text-muted animate-pulse">
                [INFO] {t("workspace:log_awaiting", "Awaiting requests...")}
              </div>
            </>
          ) : (
            <div className="text-red-400/50 italic">{t("workspace:server_stopped", "Server is currently stopped.")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
