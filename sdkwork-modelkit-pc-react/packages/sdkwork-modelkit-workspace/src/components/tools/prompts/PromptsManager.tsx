import React, { useState, useEffect } from "react";
import { Plus, Search, FileText, Settings2, Trash2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import { useService } from "@sdkwork/modelkit-core";
import {
  IResourcesService,
  IResourcesServiceToken,
  PromptConfig,
} from "@sdkwork/modelkit-services";

export function PromptsManager() {
  const resourcesService = useService<IResourcesService>(
    IResourcesServiceToken,
  );
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePromptId, setActivePromptId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    resourcesService.fetchPrompts().then((data) => {
      setPrompts(data);
      if (data.length > 0) setActivePromptId(data[0].id);
      setLoading(false);
    });
  }, [resourcesService]);

  const activePrompt = prompts.find((p) => p.id === activePromptId);

  const handleCreate = async () => {
    toast.info("Create new prompt");
    const newPrompt = await resourcesService.createPrompt({
      title: "Untitled Prompt",
      category: "custom",
      desc: "",
      content: "",
    });
    setPrompts([...prompts, newPrompt]);
    setActivePromptId(newPrompt.id);
  };

  const handleDelete = async () => {
    if (!activePrompt) return;
    await resourcesService.deletePrompt(activePrompt.id);
    const updatedPrompts = prompts.filter((p) => p.id !== activePrompt.id);
    setPrompts(updatedPrompts);
    toast.success("Prompt removed");
    if (updatedPrompts.length > 0) {
      setActivePromptId(updatedPrompts[0].id);
    } else {
      setActivePromptId(null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activePrompt || value === undefined) return;
    setPrompts(
      prompts.map((p) =>
        p.id === activePrompt.id ? { ...p, content: value } : p,
      ),
    );
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 h-64">
        <div className="w-6 h-6 border-2 border-[var(--color-primary-alpha)] border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] min-h-[500px] md:flex-row gap-6">
      <div className="w-full md:w-[300px] flex flex-col shrink-0 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main">Prompts</h2>
          <button
            onClick={handleCreate}
            className="w-8 h-8 rounded-lg bg-primary-main/20 text-primary-light hover:bg-primary-main hover:text-text-main flex items-center justify-center transition-colors shadow-sm"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-surface-hover rounded-lg pl-9 pr-4 py-2 text-sm text-text-main outline-none focus:border-primary-main/50 transition-all font-sans"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredPrompts.length === 0 ? (
            <div className="text-text-muted text-sm text-center py-8">
              No results
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setActivePromptId(prompt.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                  activePromptId === prompt.id
                    ? "bg-primary-main/10 border-[var(--color-primary-alpha)] shadow-[0_0_10px_rgba(59,130,246,0.05)]"
                    : "bg-surface border-surface-hover hover:border-divider-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">
                    {prompt.title}
                  </span>
                  <FileText
                    size={14}
                    className={
                      activePromptId === prompt.id
                        ? "text-primary-light"
                        : "text-text-muted"
                    }
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {prompt.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 border border-surface-hover rounded-xl overflow-hidden bg-panel">
        <div className="h-14 flex-shrink-0 border-b border-surface-hover bg-surface flex items-center justify-between px-4">
          <h3 className="text-sm font-medium text-text-main font-mono flex items-center gap-2">
            <FileText size={14} className="text-primary-light" />
            {activePrompt?.title
              ? `${activePrompt.title.toLowerCase().replace(/\s+/g, "_")}.prompt`
              : "Select a prompt"}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success("Variable context active")}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-text-main bg-surface-hover/50 hover:bg-surface-hover hover:text-text-main transition-colors"
            >
              <Settings2 size={14} /> Variables
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <Editor
            height="100%"
            language="markdown"
            theme="vs-dark"
            value={activePrompt?.content || ""}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily:
                "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
              wordWrap: "on",
              padding: { top: 24, bottom: 24 },
            }}
          />
        </div>
      </div>
    </div>
  );
}
