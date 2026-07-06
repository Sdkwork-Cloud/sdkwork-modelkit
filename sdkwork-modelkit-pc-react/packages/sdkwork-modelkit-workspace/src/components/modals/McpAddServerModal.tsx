import React from "react";
import { Plug, X } from "lucide-react";
import { MCPConfig } from "@sdkwork/modelkit-services";

interface McpAddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "add" | "edit";
  formData: Partial<MCPConfig>;
  setFormData: (data: Partial<MCPConfig>) => void;
  onSave: (e: React.FormEvent) => void;
  categories: string[];
}

export function McpAddServerModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  onSave,
  categories,
}: McpAddServerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-panel border border-divider rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-divider flex justify-between items-center bg-canvas">
          <h2 className="text-md font-bold text-text-main flex items-center gap-2">
            <Plug size={18} className="text-primary-main" />
            {modalMode === "add"
              ? "Add MCP Server Connection"
              : "Edit MCP Server Connection"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Server Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. My Custom Database"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Publisher/Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @myusername"
                  value={formData.author || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Category
                </label>
                <select
                  value={formData.type || "Core"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors focus:bg-surface"
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what resources, prompts, or tools this server exposes..."
                value={formData.desc || ""}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Protocol / Connection Method
              </label>
              <div className="flex bg-surface p-1 rounded-lg border border-surface-hover">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, protocol: "stdio" })
                  }
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${formData.protocol === "stdio" ? "bg-surface text-primary-light" : "text-text-muted hover:text-text-main"}`}
                >
                  Local Command (stdio)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, protocol: "sse" })}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${formData.protocol === "sse" ? "bg-surface text-primary-light" : "text-text-muted hover:text-text-main"}`}
                >
                  SSE URL (sse)
                </button>
              </div>
            </div>

            {formData.protocol === "stdio" ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Command <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required={formData.protocol === "stdio"}
                  placeholder="e.g. npx -y @modelcontextprotocol/server-postgres ..."
                  value={formData.command || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, command: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main font-mono focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  The subprocess command used to launch this server locally.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  SSE URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required={formData.protocol === "sse"}
                  placeholder="e.g. https://mcp.myapi.com/sse"
                  value={formData.url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main font-mono focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  The external Server-Sent Events endpoint to connect to.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Capabilities (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Query Data, Read Records, Manage Schema"
                value={formData.capabilities?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capabilities: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary-main/50 transition-colors placeholder:text-text-muted focus:bg-surface"
              />
              <p className="text-[11px] text-text-muted mt-1">
                Key features this server exposes to the workspace.
              </p>
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
              className="px-6 py-2.5 rounded-lg text-[13px] font-semibold bg-surface text-text-main shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border border-divider hover:border-text-muted"
            >
              {modalMode === "add" ? "Add Connection" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
