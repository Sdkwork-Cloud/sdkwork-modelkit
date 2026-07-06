import React from "react";
import { Cpu, ArrowRight, Play, Copy, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LocalRelay } from "../../../services/types";

interface ModelMappingItemProps {
  m: any;
  assocTool: any;
  relay: LocalRelay;
  setRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>>;
  setMappingModalMode: (mode: "add" | "edit") => void;
  setEditingMappingId: (id: string | null) => void;
  setIsMappingModalOpen: (isOpen: boolean) => void;
  t: any;
}

export function ModelMappingItem({
  m,
  assocTool,
  relay,
  setRelays,
  setMappingModalMode,
  setEditingMappingId,
  setIsMappingModalOpen,
  t,
}: ModelMappingItemProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface border border-divider hover:border-divider-strong rounded-2xl transition-all gap-4 group">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-inner shrink-0 transition-colors ${
            m.enabled
              ? "bg-primary-main/10 border-primary-main/20 text-primary-light"
              : "bg-panel border-divider text-text-muted"
          }`}
        >
          <Cpu size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                m.toolId === "all"
                  ? "bg-primary-main/10 border-primary-main/20 text-primary-light"
                  : "bg-panel border-divider text-text-muted"
              }`}
            >
              {m.toolId === "all"
                ? t("workspace:all_tools_universal", "✦ All Tools (Universal)")
                : assocTool?.name || m.toolId}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase border ${
                m.enabled
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-surface border-divider text-text-muted"
              }`}
            >
              {m.enabled
                ? t("workspace:enabled_status", "Enabled")
                : t("workspace:disabled_status", "Disabled")}
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-2 font-mono text-xs text-text-main flex-wrap min-w-0">
            <span
              className="bg-panel px-2.5 py-1 rounded border border-divider-strong text-amber-500 font-bold truncate max-w-[200px]"
              title={m.sourceModel}
            >
              {m.sourceModel}
            </span>
            <div className="flex items-center text-text-muted">
              <ArrowRight size={12} className="mx-0.5" />
            </div>
            <span
              className="bg-panel px-2.5 py-1 rounded border border-divider-strong text-emerald-400 font-bold truncate max-w-[200px]"
              title={m.targetModel}
            >
              {m.targetModel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-none border-divider pt-3 md:pt-0">
        <button
          onClick={() => {
            const updated = (relay.modelMappings || []).map((item) =>
              item.id === m.id ? { ...item, enabled: !item.enabled } : item
            );
            setRelays((prev) =>
              prev.map((r) =>
                r.id === relay.id ? { ...r, modelMappings: updated } : r
              )
            );
            toast.success(
              t("workspace:mapping_toggle_success", "Mapping toggle success")
            );
          }}
          className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border text-xs font-bold cursor-pointer ${
            m.enabled
              ? "bg-primary-main/10 border-primary-main/20 text-primary-light hover:bg-primary-main/20"
              : "bg-panel border-divider text-text-muted hover:text-text-main"
          }`}
        >
          <Play size={11} className={m.enabled ? "fill-blue-400" : ""} />
          {m.enabled
            ? t("workspace:disable_btn", "Disable")
            : t("workspace:enable_btn", "Enable")}
        </button>

        <div className="hidden md:block w-px h-5 bg-divider"></div>

        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              const copy = {
                ...m,
                id: `m-${Date.now()}`,
                sourceModel: `${m.sourceModel}_copy`,
              };
              const updated = [copy, ...(relay.modelMappings || [])];
              setRelays((prev) =>
                prev.map((r) =>
                  r.id === relay.id ? { ...r, modelMappings: updated } : r
                )
              );
              toast.success(
                t("workspace:mapping_cloned_success", "Rule cloned!")
              );
            }}
            className="w-8 h-8 rounded-xl hover:bg-panel border border-transparent hover:border-divider text-text-muted hover:text-text-main flex items-center justify-center transition-all cursor-pointer"
            title={t("workspace:clone_btn", "Clone")}
          >
            <Copy size={13} />
          </button>
          <button
            onClick={() => {
              setMappingModalMode("edit");
              setEditingMappingId(m.id);
              setIsMappingModalOpen(true);
            }}
            className="w-8 h-8 rounded-xl hover:bg-panel border border-transparent hover:border-divider text-text-muted hover:text-text-main flex items-center justify-center transition-all cursor-pointer"
            title={t("workspace:edit_btn", "Edit")}
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => {
              const updated = (relay.modelMappings || []).filter(
                (item) => item.id !== m.id
              );
              setRelays((prev) =>
                prev.map((r) =>
                  r.id === relay.id ? { ...r, modelMappings: updated } : r
                )
              );
              toast.success(
                t("workspace:mapping_deleted_success", "Mapping deleted")
              );
            }}
            className="w-8 h-8 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-text-muted hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
            title={t("workspace:delete_btn", "Delete")}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
