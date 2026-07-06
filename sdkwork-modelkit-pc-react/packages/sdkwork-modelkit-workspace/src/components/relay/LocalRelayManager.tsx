import React, { useState } from "react";
import { Network } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@sdkwork/modelkit-core";
import { LocalRelay } from "../../services/types";
import { ApiKeysTab } from "./tabs/ApiKeysTab";
import { ProvidersTab } from "./tabs/ProvidersTab";
import { RoutingTab } from "./tabs/RoutingTab";
import { ModelMappingTab } from "./tabs/ModelMappingTab";
import { DetailsTab } from "./tabs/DetailsTab";

export { type LocalRelay };

export function LocalRelayManager({
  relay,
  setRelays,
  onDelete,
  onNavigate,
  tools = [],
}: {
  relay: LocalRelay | undefined;
  setRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>>;
  onDelete: () => void;
  onNavigate?: (view: "user-profile" | "system-settings") => void;
  tools?: any[];
}) {
  const { t, language } = useAppContext();

  const [activeTab, setActiveTab] = useState<"api_keys" | "providers" | "routing" | "model_mapping" | "details">(
    "providers",
  );

  if (!relay) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted bg-canvas">
        <Network size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">
          {t(
            "workspace:select_local_relay",
            "Select or create a workspace relay in the sidebar",
          )}
        </p>
      </div>
    );
  }

  const toggleStatus = () => {
    setRelays((prev) =>
      prev.map((r) => {
        if (r.id === relay.id) {
          const newStatus = r.status === "running" ? "stopped" : "running";
          toast.success(
            newStatus === "running"
              ? t("workspace:router_started", "Router started")
              : t("workspace:router_stopped", "Router stopped"),
          );
          return { ...r, status: newStatus };
        }
        return r;
      }),
    );
  };

  const deleteRelay = () => {
    setRelays((prev) => prev.filter((r) => r.id !== relay.id));
    toast.success(t("workspace:router_deleted", "Router deleted"));
    onDelete();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas">
      <div className="h-14 border-b border-divider bg-panel flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6 h-full">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Network
              size={14}
              className={
                relay.status === "running"
                  ? "text-emerald-500"
                  : "text-primary-main"
              }
            />
            {relay.name}
          </h2>
          <div className="w-px h-4 bg-divider-strong"></div>
          <div className="flex items-center gap-1 h-full pt-1">
            <button
              onClick={() => setActiveTab("providers")}
              className={`px-4 py-2 border-b-2 text-sm font-bold transition-colors ${
                activeTab === "providers"
                  ? "text-primary-light border-primary-main animate-b-grow"
                  : "text-text-muted border-transparent hover:text-text-main"
              }`}
            >
              {t("workspace:prov_accounts", "Provider Accounts")}
            </button>
            <button
              onClick={() => setActiveTab("api_keys")}
              className={`px-4 py-2 border-b-2 text-sm font-bold transition-colors ${
                activeTab === "api_keys"
                  ? "text-primary-light border-primary-main animate-b-grow"
                  : "text-text-muted border-transparent hover:text-text-main"
              }`}
            >
              {t("workspace:local_api_key_tab", "Local API Key")}
            </button>
            <button
              onClick={() => setActiveTab("routing")}
              className={`px-4 py-2 border-b-2 text-sm font-bold transition-colors ${
                activeTab === "routing"
                  ? "text-primary-light border-primary-main animate-b-grow"
                  : "text-text-muted border-transparent hover:text-text-main"
              }`}
            >
              {t("workspace:routing_strategy_tab", "Routing Strategy Configuration")}
            </button>
            <button
              onClick={() => setActiveTab("model_mapping")}
              className={`px-4 py-2 border-b-2 text-sm font-bold transition-colors ${
                activeTab === "model_mapping"
                  ? "text-primary-light border-primary-main animate-b-grow"
                  : "text-text-muted border-transparent hover:text-text-main"
              }`}
            >
              {t("workspace:model_mapping_tab", "Model Mapping Configuration")}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 border-b-2 text-sm font-bold transition-colors ${
                activeTab === "details"
                  ? "text-primary-light border-primary-main animate-b-grow"
                  : "text-text-muted border-transparent hover:text-text-main"
              }`}
            >
              {t("workspace:relay_details", "Relay Details")}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              relay.status === "running"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-surface text-text-muted border border-divider-strong"
            }`}
          >
            {relay.status === "running"
              ? t("workspace:status_active", "Active")
              : t("workspace:status_offline", "Offline")}
          </span>
          <button
            onClick={toggleStatus}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              relay.status === "running"
                ? "bg-panel text-text-muted hover:text-text-main hover:border-divider-strong border-divider-strong"
                : "bg-primary-main text-white hover:bg-primary-hover border-primary-main"
            }`}
          >
            {relay.status === "running"
              ? t("workspace:stop_server", "Stop Server")
              : t("workspace:start_server", "Start Server")}
          </button>
          <button
            onClick={deleteRelay}
            className="px-4 py-1.5 rounded-lg bg-transparent hover:bg-red-500/10 text-text-muted hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
          >
            {t("workspace:delete_btn", "Delete")}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
        <div className="w-full mx-auto" id="relay-manager-tabs-content">
          {activeTab === "api_keys" && (
            <ApiKeysTab relay={relay} />
          )}

          {activeTab === "providers" && (
            <ProvidersTab relay={relay} setRelays={setRelays} tools={tools} />
          )}

          {activeTab === "routing" && (
            <RoutingTab />
          )}

          {activeTab === "model_mapping" && (
            <ModelMappingTab relay={relay} setRelays={setRelays} tools={tools} />
          )}

          {activeTab === "details" && (
            <DetailsTab relay={relay} setRelays={setRelays} />
          )}
        </div>
      </div>
    </div>
  );
}
