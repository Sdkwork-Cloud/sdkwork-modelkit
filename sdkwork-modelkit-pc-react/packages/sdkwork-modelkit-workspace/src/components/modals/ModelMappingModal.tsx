import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import { X, Sliders, Cpu, ArrowRight, Save, Layers } from "lucide-react";
import { AgentTool } from "@sdkwork/modelkit-types";
import { getProviderIcon } from "../providers/ProviderIcon";

interface ModelMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AgentTool[];
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    toolId: string;
    sourceModel: string;
    targetModel: string;
    enabled: boolean;
  };
  onSave: (data: {
    id?: string;
    toolId: string;
    sourceModel: string;
    targetModel: string;
    enabled: boolean;
  }) => void;
}

export function ModelMappingModal({
  isOpen,
  onClose,
  tools,
  mode,
  initialData,
  onSave,
}: ModelMappingModalProps) {
  const { t } = useAppContext();

  const [toolId, setToolId] = useState("");
  const [sourceModel, setSourceModel] = useState("");
  const [targetModel, setTargetModel] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setToolId(initialData.toolId);
        setSourceModel(initialData.sourceModel);
        setTargetModel(initialData.targetModel);
        setEnabled(initialData.enabled);
      } else {
        // Find first tool or 'all'
        setToolId("all");
        setSourceModel("claude-3-5-sonnet");
        setTargetModel("deepseek-chat");
        setEnabled(true);
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceModel.trim()) {
      alert(t("workspace:enter_source_model_id", "Please enter a source model ID."));
      return;
    }
    if (!targetModel.trim()) {
      alert(t("workspace:enter_target_model_id", "Please enter a target model ID."));
      return;
    }
    onSave({
      id: initialData?.id,
      toolId,
      sourceModel: sourceModel.trim(),
      targetModel: targetModel.trim(),
      enabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-divider-strong rounded-2xl w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-divider flex items-center justify-between bg-surface/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-primary-main font-mono font-extrabold text-lg">&gt;_</span>
            <h3 className="text-sm font-black text-text-main font-mono uppercase tracking-wider">
              {mode === "add"
                ? t("workspace:add_model_mapping", "Add Model Mapping")
                : t("workspace:edit_model_mapping", "Edit Model Mapping")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-divider"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Fields Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Associated Tool Selection */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2.5 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Layers size={13} className="text-primary-main" />
              {t("workspace:triggering_application_tool", "Triggering Application/Tool")}
            </label>
            <select
              value={toolId}
              onChange={(e) => setToolId(e.target.value)}
              className="w-full bg-panel/60 border border-divider-strong hover:border-text-muted focus:border-primary-main focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-xs text-text-main focus:outline-none transition-all cursor-pointer font-sans"
            >
              <option value="all" className="bg-surface text-text-main font-bold">
                {t("workspace:all_tools_universal", "✦ All Tools (Universal)")}
              </option>
              {tools.map((t) => (
                <option key={t.id} value={t.id} className="bg-surface text-text-main">
                  {t.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-text-muted mt-1.5 pl-1">
              {t("workspace:mapping_tool_hint", "This rule will only trigger for requests originating from this specific developer tool.")}
            </p>
          </div>

          {/* Model Matching Flow Cards */}
          <div className="grid grid-cols-1 gap-4 bg-panel/30 border border-divider/50 rounded-xl p-4.5">
            {/* Source Model MATCH */}
            <div>
              <label className="block text-[11px] font-bold text-text-muted mb-2 uppercase tracking-wide flex items-center gap-1">
                <Cpu size={12} className="text-amber-500" />
                {t("workspace:client_requested_model_id", "Client Requested Model ID")}
              </label>
              <input
                type="text"
                placeholder="e.g. claude-3-5-sonnet-20241022"
                value={sourceModel}
                onChange={(e) => setSourceModel(e.target.value)}
                className="w-full bg-panel border border-[#444] hover:border-gray-500 focus:border-primary-main rounded-xl px-3.5 py-2.5 text-xs text-text-main font-mono focus:outline-none transition-all"
                required
              />
            </div>

            {/* Visual mapping arrow */}
            <div className="flex items-center justify-center">
              <div className="bg-primary-main/10 border border-primary-main/20 rounded-full p-1.5 text-primary-light">
                <ArrowRight size={14} className="animate-pulse" />
              </div>
            </div>

            {/* Target Model FORWARD */}
            <div>
              <label className="block text-[11px] font-bold text-text-muted mb-2 uppercase tracking-wide flex items-center gap-1">
                <Cpu size={12} className="text-emerald-500" />
                {t("workspace:mapped_target_model_id", "Mapped Target Model ID")}
              </label>
              <input
                type="text"
                placeholder="e.g. deepseek-coder"
                value={targetModel}
                onChange={(e) => setTargetModel(e.target.value)}
                className="w-full bg-panel border border-[#444] hover:border-gray-500 focus:border-primary-main rounded-xl px-3.5 py-2.5 text-xs text-text-main font-mono focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Enabled Checkbox Toggle */}
          <div className="flex items-center gap-3 bg-panel/40 p-4 rounded-xl border border-divider/40">
            <input
              type="checkbox"
              id="mapping_enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 rounded bg-canvas border-divider-strong text-primary-main focus:ring-blue-600 focus:ring-offset-[#141518] transition-colors cursor-pointer"
            />
            <label htmlFor="mapping_enabled" className="text-xs font-bold text-text-main cursor-pointer select-none">
              {t("workspace:enable_mapping_rule", "Enable this model mapping rule")}
            </label>
          </div>

          {/* Modal Buttons */}
          <div className="border-t border-divider pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-divider hover:border-divider-strong rounded-xl text-xs font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
            >
              {t("workspace:txt_1209", "Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-main hover:bg-primary-hover text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              {t("workspace:save_mapping", "Save Mapping")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
