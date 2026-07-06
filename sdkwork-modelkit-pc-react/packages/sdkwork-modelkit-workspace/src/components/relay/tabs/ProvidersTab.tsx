import React, { useState, useEffect } from "react";
import { Search, Plus, GripVertical, Play, Edit3, Copy, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LocalRelay, ProviderData } from "../../../services/types";
import { workspaceService } from "../../../services/WorkspaceService";
import { ProviderEditorDrawer } from "../../providers/ProviderEditorDrawer";
import { useAppContext } from "@sdkwork/modelkit-core";

interface ProvidersTabProps {
  relay: LocalRelay;
  setRelays: React.Dispatch<React.SetStateAction<LocalRelay[]>>;
  tools?: any[];
}

export function ProvidersTab({ relay, setRelays, tools = [] }: ProvidersTabProps) {
  const { t, language } = useAppContext();

  // Providers list synchronized with workspaceService
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubTab, setSelectedSubTab] = useState<string>("all");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ProviderData | null>(null);

  useEffect(() => {
    workspaceService.getProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (providers.length > 0) {
      workspaceService.saveProviders(providers);
    }
  }, [providers]);

  const openAddModal = () => {
    setEditingProvider({
      id: "",
      name: "",
      url: "",
      endpoint: "",
      initial: "C",
      apiKey: "",
      enabled: true,
      remark: "",
      timeoutMs: 30000,
    });
    setIsDrawerOpen(true);
  };

  const openEditModal = (p: ProviderData) => {
    setEditingProvider(p);
    setIsDrawerOpen(true);
  };

  const handleSaveProvider = (savedData: ProviderData) => {
    if (!savedData.id) {
      // Create new provider
      const newId = Date.now().toString();
      const newProvider: ProviderData = {
        ...savedData,
        id: newId,
        endpoint: savedData.url || savedData.endpoint || "https://api.openai.com/v1",
        initial: savedData.name.trim().charAt(0).toUpperCase(),
      };

      setProviders((prev) => [...prev, newProvider]);

      // Auto-enable for current relay
      setRelays((prev) =>
        prev.map((r) =>
          r.id === relay.id ? { ...r, providers: [...r.providers, newId] } : r
        )
      );
      toast.success(t("workspace:provider_added", "Provider added successfully!"));
    } else {
      // Edit existing provider
      setProviders((prev) =>
        prev.map((p) =>
          p.id === savedData.id
            ? {
                ...p,
                ...savedData,
                endpoint: savedData.url || savedData.endpoint || p.endpoint,
                initial: savedData.name.trim().charAt(0).toUpperCase(),
              }
            : p
        )
      );
      toast.success(t("workspace:provider_updated", "Provider updated successfully!"));
    }

    setIsDrawerOpen(false);
  };

  const handleDuplicate = (p: ProviderData) => {
    const newId = Date.now().toString();
    const copy: ProviderData = {
      ...p,
      id: newId,
      name: `${p.name} (${t("workspace:copy_postfix", "Copy")})`,
      initial: p.name.trim().charAt(0).toUpperCase(),
    };

    setProviders((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      if (index === -1) return [...prev, copy];
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });

    toast.success(t("workspace:copy_success", "Provider configuration duplicated!"));
  };

  const handleDeleteProvider = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    setRelays((prev) =>
      prev.map((r) => ({
        ...r,
        providers: r.providers.filter((pid) => pid !== id),
      }))
    );
    toast.success(t("workspace:provider_deleted", "Provider deleted successfully!"));
  };

  const filteredProviders = providers.filter((p) => {
    // 1. Check search query compatibility
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.openaiUrl || p.anthropicUrl || p.geminiUrl || p.url || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.modelId || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Check tab filter
    if (selectedSubTab === "all") {
      return true;
    } else if (selectedSubTab === "custom") {
      const defaultIds = ["0", "1", "2", "3", "4"];
      return !defaultIds.includes(p.id);
    } else {
      const targetToolId = selectedSubTab;
      
      // If already enabled/checked for this relay, keep it visible in this tab
      if (relay.providers.includes(p.id)) {
        return true;
      }

      const tid = targetToolId.toLowerCase();
      const toolObj = tools.find((t) => t.id === targetToolId);
      const toolName = (toolObj?.name || "").toLowerCase();

      // Check model mappings in active relay
      if (relay.modelMappings) {
        const relevantMappings = relay.modelMappings.filter(
          (m) => m.toolId === targetToolId && m.enabled
        );
        if (relevantMappings.length > 0) {
          const targetModels = relevantMappings.map((m) => m.targetModel.toLowerCase());
          const pModel = (p.modelId || "").toLowerCase();
          if (targetModels.some((tm) => pModel.includes(tm) || tm.includes(pModel))) {
            return true;
          }
        }
      }

      // Keyword heuristic falls back for standard tools
      const pName = p.name.toLowerCase();
      const pUrl = (p.openaiUrl || p.anthropicUrl || p.geminiUrl || p.url || "").toLowerCase();
      const pModel = (p.modelId || "").toLowerCase();

      if (
        tid.includes("claude") ||
        tid.includes("anthropic") ||
        toolName.includes("claude") ||
        toolName.includes("anthropic")
      ) {
        return (
          pModel.includes("claude") ||
          pModel.includes("sonnet") ||
          pName.includes("claude") ||
          pUrl.includes("anthropic") ||
          pUrl.includes("claude")
        );
      }

      if (
        tid.includes("codex") ||
        tid.includes("openai") ||
        tid.includes("copilot") ||
        tid.includes("cursor") ||
        tid.includes("code") ||
        toolName.includes("codex") ||
        toolName.includes("openai") ||
        toolName.includes("cursor") ||
        toolName.includes("code")
      ) {
        return (
          pModel.includes("gpt") ||
          pModel.includes("openai") ||
          pName.includes("openai") ||
          pUrl.includes("openai") ||
          pUrl.includes("geekspace")
        );
      }

      // Default fallback for custom or unhandled tools: show custom added providers
      const defaultIds = ["0", "1", "2", "3", "4"];
      return !defaultIds.includes(p.id);
    }
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200" id="providers-tab">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-divider/40">
        {/* Left Side: Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSubTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSubTab === "all"
                ? "bg-primary-main/15 text-primary-light border border-primary-main/30"
                : "bg-surface hover:bg-surface-hover text-text-muted border border-divider hover:text-text-main hover:border-divider-strong"
            }`}
          >
            {t("workspace:all_providers", "All Providers")}
          </button>

          {tools.length > 0 && (
            <>
              <div className="w-px h-4 bg-divider-strong mx-1 shrink-0"></div>
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedSubTab(tool.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    selectedSubTab === tool.id
                      ? "bg-primary-main/15 text-primary-light border border-primary-main/30"
                      : "bg-surface hover:bg-surface-hover text-text-muted border border-divider hover:text-text-main hover:border-divider-strong"
                  }`}
                >
                  {tool.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Right Side: Search and Add Button */}
        <div className="flex items-center gap-3 shrink-0 self-end xl:self-auto w-full xl:w-auto justify-end">
          <div className="relative max-w-[200px] w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t("workspace:search_providers_placeholder", "Search providers...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border border-divider-strong rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary-main w-full"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary-main hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            id="add-provider-btn"
          >
            <Plus size={14} /> {t("workspace:add_provider_btn", "Add Provider")}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            {t("workspace:no_matching_providers", "No matching providers found")}
          </div>
        ) : (
          filteredProviders.map((p) => {
            const isChecked = relay.providers.includes(p.id);
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-4 bg-transparent border rounded-xl transition-all group ${
                  isChecked ? "border-divider-strong bg-panel" : "border-divider hover:bg-panel hover:border-divider-strong"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button className="text-primary-main group-hover:text-text-muted cursor-grab transition-colors">
                    <GripVertical size={16} />
                  </button>
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-bold shadow-sm transition-colors ${
                      isChecked ? "bg-divider border-divider-strong text-text-main" : "bg-surface border-divider text-text-muted group-hover:text-text-main"
                    }`}
                  >
                    {p.initial}
                  </div>
                  <div className="flex flex-col gap-0.5 max-w-md">
                    <span
                      className={`text-[15px] font-bold transition-colors ${isChecked ? "text-text-main" : "text-text-muted group-hover:text-text-main"}`}
                    >
                      {p.name}
                    </span>
                    <span className="text-[13px] text-primary-main/60 font-mono transition-colors truncate max-w-[280px]">
                      {p.openaiUrl || p.anthropicUrl || p.url}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 pr-1">
                  <button
                    onClick={() => {
                      const newProviders = isChecked
                        ? relay.providers.filter((id) => id !== p.id)
                        : [...relay.providers, p.id];
                      setRelays((prev) =>
                        prev.map((r) => (r.id === relay.id ? { ...r, providers: newProviders } : r))
                      );
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border text-xs font-bold cursor-pointer ${
                      isChecked
                        ? "bg-primary-main/20 border-primary-main/30 text-primary-light hover:bg-primary-main/40"
                        : "bg-transparent border-divider-strong text-text-muted hover:text-text-main hover:border-divider-strong"
                    }`}
                  >
                    <Play size={12} className={isChecked ? "fill-blue-400" : ""} />{" "}
                    {isChecked ? t("workspace:prov_enabled", "Enabled") : t("workspace:prov_enable", "Enable")}
                  </button>

                  <div className="w-px h-5 bg-surface-hover mx-2"></div>

                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(p)}
                      className="w-8 h-8 rounded-lg hover:bg-divider text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:btn_edit", "Edit")}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="w-8 h-8 rounded-lg hover:bg-divider text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:btn_duplicate", "Duplicate")}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => {
                        const urlToCopy = p.openaiUrl || p.anthropicUrl || p.geminiUrl || p.url;
                        navigator.clipboard.writeText(urlToCopy);
                        toast.success(t("workspace:link_copied", "Link copied successfully!"));
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-divider text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:btn_copy_link", "Copy Link")}
                    >
                      <LinkIcon size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(p.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:btn_delete", "Delete")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ProviderEditorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveProvider}
        initialData={editingProvider}
      />
    </div>
  );
}
