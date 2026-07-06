import React, { useState } from "react";
import { Cpu, Plus, Search, ArrowRight, Play, Copy, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LocalRelay } from "../../../services/types";
import { ModelMappingModal } from '../../modals/ModelMappingModal';
import { ModelMappingItem } from './ModelMappingItem';
import { useAppContext } from "@sdkwork/modelkit-core";

interface ModelMappingTabProps {
  relay: LocalRelay;
  setRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>>;
  tools: any[];
}

export function ModelMappingTab({
  relay,
  setRelays,
  tools,
}: ModelMappingTabProps) {
  const { t, language } = useAppContext();

  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [mappingModalMode, setMappingModalMode] = useState<"add" | "edit">("add");
  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);
  const [mappingSearchQuery, setMappingSearchQuery] = useState("");

  const handleSaveModelMapping = (data: {
    id?: string;
    toolId: string;
    sourceModel: string;
    targetModel: string;
    enabled: boolean;
  }) => {
    const mappings = relay.modelMappings || [];
    let updated;
    if (mappingModalMode === "add") {
      const newMapping = {
        id: `m-${Date.now()}`,
        toolId: data.toolId,
        sourceModel: data.sourceModel,
        targetModel: data.targetModel,
        enabled: data.enabled,
      };
      updated = [newMapping, ...mappings];
      toast.success(t("workspace:mapping_added_success", "Model mapping rule created successfully!"));
    } else {
      updated = mappings.map((m) =>
        m.id === editingMappingId
          ? {
              ...m,
              toolId: data.toolId,
              sourceModel: data.sourceModel,
              targetModel: data.targetModel,
              enabled: data.enabled,
            }
          : m
      );
      toast.success(t("workspace:mapping_updated_success", "Model mapping rule updated successfully!"));
    }
    setRelays((prev) =>
      prev.map((r) => (r.id === relay.id ? { ...r, modelMappings: updated } : r))
    );
    setIsMappingModalOpen(false);
  };

  const filteredMappings = (relay.modelMappings || []).filter((m) => {
    const query = mappingSearchQuery.toLowerCase();
    return (
      m.sourceModel.toLowerCase().includes(query) ||
      m.targetModel.toLowerCase().includes(query) ||
      m.toolId.toLowerCase().includes(query) ||
      (m.toolId === "all" && "all general".includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="model-mapping-tab">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 mt-2">
        <div>
          <h3 className="text-xl font-bold text-text-main mb-2">
            {(relay.modelMappings || []).length}{" "}
            {t("workspace:model_mappings_active_title_suffix", "Active Model Mappings")}
          </h3>
          <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
            {t(
              "workspace:model_mappings_desc",
              "Configure requested model translations for your developer clients and tools. Automatically rewrite model IDs and custom structures on the fly to match upstream models."
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t("workspace:search_model_placeholder", "Search model...")}
              value={mappingSearchQuery}
              onChange={(e) => setMappingSearchQuery(e.target.value)}
              className="bg-panel border border-divider rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary-main focus:ring-1 focus:ring-blue-500/20 w-[200px] transition-all"
            />
          </div>
          <button
            onClick={() => {
              setMappingModalMode("add");
              setEditingMappingId(null);
              setIsMappingModalOpen(true);
            }}
            className="bg-primary-main hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            id="add-mapping-btn"
          >
            <Plus size={14} />
            {t("workspace:add_mapping_btn", "Add Mapping")}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {!(relay.modelMappings && relay.modelMappings.length) ? (
          <div className="text-center py-16 text-text-muted text-sm border border-dashed border-divider-strong rounded-2xl bg-panel/10">
            <div className="w-12 h-12 rounded-full border border-divider flex items-center justify-center text-text-muted mx-auto mb-4 bg-panel/30">
              <Cpu size={20} />
            </div>
            <div className="font-bold text-text-main mb-1">
              {t("workspace:no_model_mappings_configured", "No Model Mappings Configured")}
            </div>
            <p className="text-xs max-w-sm mx-auto leading-relaxed mt-1">
              {t(
                "workspace:no_model_mappings_configured_desc",
                "Click 'Add Mapping' above to customize model routing patterns and intercept request overrides."
              )}
            </p>
          </div>
        ) : filteredMappings.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-sm border border-dashed border-divider-strong rounded-2xl bg-panel/10">
            <Search className="mx-auto mb-3 text-text-muted" size={24} />
            {t("workspace:no_matching_mappings_found", "No mapping rules match your current search query.")}
          </div>
        ) : (
          filteredMappings.map((m) => {
            const assocTool = tools.find((t) => t.id === m.toolId);
            return (
              <ModelMappingItem
                key={m.id}
                m={m}
                assocTool={assocTool}
                relay={relay}
                setRelays={setRelays}
                setMappingModalMode={setMappingModalMode}
                setEditingMappingId={setEditingMappingId}
                setIsMappingModalOpen={setIsMappingModalOpen}
                t={t}
              />
            );
          })
        )}
      </div>

      <ModelMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        tools={tools}
        mode={mappingModalMode}
        initialData={
          mappingModalMode === "edit" ? relay.modelMappings?.find((m) => m.id === editingMappingId) : undefined
        }
        onSave={handleSaveModelMapping}
      />
    </div>
  );
}
