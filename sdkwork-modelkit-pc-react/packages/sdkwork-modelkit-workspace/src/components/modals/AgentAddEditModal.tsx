import React from "react";
import { X, Bot } from "lucide-react";
import { AgentConfig } from "@sdkwork/modelkit-services";

interface AgentAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "add" | "edit";
  formData: Partial<AgentConfig>;
  setFormData: (data: Partial<AgentConfig>) => void;
  onSave: (e: React.FormEvent) => void;
}

export function AgentAddEditModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  onSave,
}: AgentAddEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-panel border border-divider rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-divider flex justify-between items-center bg-canvas">
          <h2 className="text-md font-bold text-text-main flex items-center gap-2">
            <Bot size={18} className="text-primary-main" />
            {modalMode === "add"
              ? "Create New Agent"
              : "Edit Agent Configuration"}
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
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Code Reviewer"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Model
                </label>
                <select
                  value={formData.model || "gpt-4o"}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors focus:bg-surface font-mono"
                >
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Agent Type
                </label>
                <select
                  value={formData.type || "Assistant"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors focus:bg-surface"
                >
                  <option value="Assistant">Assistant</option>
                  <option value="Agentic">Agentic Workflow</option>
                  <option value="Router">Workflow Router</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                System Task (Description){" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the agent's primary task and responsibilities..."
                value={formData.task || ""}
                onChange={(e) =>
                  setFormData({ ...formData, task: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Tools / Skills (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. WebSearch, FileEdit"
                value={formData.skills?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                MCP Connections (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. postgres-db, github"
                value={formData.mcp?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mcp: e.target.value
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
              {modalMode === "add" ? "Create Agent" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
