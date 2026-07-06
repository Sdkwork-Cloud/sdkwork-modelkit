import React, { useEffect } from "react";
import { X, Code2 } from "lucide-react";
import { SkillConfig } from "@sdkwork/modelkit-services";

interface SkillAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "add" | "edit";
  formData: Partial<SkillConfig>;
  setFormData: (data: Partial<SkillConfig>) => void;
  onSave: (e: React.FormEvent) => void;
}

export function SkillAddEditModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  onSave,
}: SkillAddEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-panel border border-divider rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-divider flex justify-between items-center bg-canvas">
          <h2 className="text-md font-bold text-text-main flex items-center gap-2">
            <Code2 size={18} className="text-primary-main" />
            {modalMode === "add"
              ? "Create New Skill"
              : "Edit Skill Configuration"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1.5 rounded-lg hover:bg-surface-hover"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Skill Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. getWeather"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Type
              </label>
              <select
                value={formData.type || "function"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors focus:bg-surface"
              >
                <option value="function">Local Function</option>
                <option value="rest">REST API Call</option>
                <option value="graphql">GraphQL Mutation/Query</option>
                <option value="webhook">Webhook Subscription</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what this skill does so the AI model knows when to use it..."
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Utility, Web, System"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
              />
            </div>
          </div>

          <div className="px-6 py-5 border-t border-divider bg-canvas flex justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] font-semibold text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-[13px] font-semibold bg-primary-main text-white shadow-lg hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {modalMode === "add" ? "Create Skill" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
