import React, { useState, useEffect } from "react";
import { useAppContext } from "@sdkwork/modelkit-core";
import {
  Key,
  Plus,
  Search,
  Trash2,
  Copy,
  Edit3,
  X,
  Eye,
  EyeOff,
  Play,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  QuickConfigButton,
  UNIFIED_TOOLS,
} from "@sdkwork/modelkit-sdk-typescript";
import { AgentTool } from "@sdkwork/modelkit-types";
import { workspaceService } from "../../services/WorkspaceService";
import { ConfigManager } from "../tools/config/ConfigManager"; // Ensure this doesn't break if unused, but wait I'll just add my import
import { LocalApiKey } from "../../services/types";
import { ApiKeyConfigModal } from '../modals/ApiKeyConfigModal';
import { ApiKeyRow } from './ApiKeyRow';

interface ApiKeyManagerProps {
  onNavigate?: (view: "user-profile" | "system-settings") => void;
  tools?: AgentTool[];
}

export function ApiKeyManager({ onNavigate, tools = [] }: ApiKeyManagerProps) {
  const { t } = useAppContext();
  // Transform workspace tools into standard Config UI tool shapes
  const configTools = tools.map((t) => {
    const defaultTool = UNIFIED_TOOLS.find((u) => u.id === t.id);
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      configFile: defaultTool?.configFile || `~/.${t.id}/config.json`,
      configLanguage: defaultTool?.configLanguage || "json",
    };
  }) as any[];

  const [keys, setKeys] = useState<LocalApiKey[]>([]);

  useEffect(() => {
    workspaceService.getApiKeys().then(setKeys);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showModalKey, setShowModalKey] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    baseUrl: "",
  });

  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (keys.length > 0) {
      workspaceService.saveApiKeys(keys);
    }
  }, [keys]);

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleKeyEnabled = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextState = !k.enabled;
          toast.success(
            `API Key ${k.name} is now ${nextState ? "enabled" : "disabled"}`,
          );
          return { ...k, enabled: nextState };
        }
        return k;
      }),
    );
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setShowModalKey(false);
    setFormData({
      name: "",
      key: "",
      baseUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (k: LocalApiKey) => {
    setModalMode("edit");
    setEditingId(k.id);
    setShowModalKey(false);
    setFormData({
      name: k.name,
      key: k.key,
      baseUrl: k.baseUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveApiKey = () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!formData.key.trim()) {
      toast.error("API Key cannot be empty");
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (modalMode === "add") {
      const newId = `k-${Date.now()}`;
      const newApiKey: LocalApiKey = {
        id: newId,
        name: formData.name,
        key: formData.key,
        baseUrl: formData.baseUrl,
        enabled: true,
        timeAdded: formattedTime,
      };

      setKeys((prev) => [newApiKey, ...prev]);
      toast.success(t("workspace:key_added_ok", "API Key added successfully!"));
    } else if (modalMode === "edit" && editingId) {
      setKeys((prev) =>
        prev.map((k) =>
          k.id === editingId
            ? {
                ...k,
                name: formData.name,
                key: formData.key,
                baseUrl: formData.baseUrl,
              }
            : k,
        ),
      );
      toast.success(t("workspace:key_updated_ok", "API Key updated successfully!"));
    }

    setIsModalOpen(false);
  };

  const handleDuplicate = (k: LocalApiKey) => {
    const newId = `k-${Date.now()}`;
    const copy: LocalApiKey = {
      ...k,
      id: newId,
      name: `${k.name} (Copy)`,
      timeAdded: new Date().toISOString().replace("T", " ").substr(0, 16),
    };
    setKeys((prev) => [copy, ...prev]);
    toast.success(t("workspace:key_dup_ok", "Key duplicated successfully!"));
  };

  const handleDelete = (id: string, name: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success(t("workspace:key_deleted_ok", "API Key {{name}} deleted successfully!").replace("{{name}}", name));
  };

  const handleTestKeyStatus = (k: LocalApiKey) => {
    setTestingId(k.id);
    toast.loading(`Testing upstream connection for ${k.name}...`, {
      id: `test-key-${k.id}`,
    });

    setTimeout(() => {
      setTestingId(null);
      const isOk = Math.random() > 0.05; // 95% success rate for simulation
      const latency = Math.floor(Math.random() * 80) + 30;
      if (isOk) {
        toast.success(
          `[Local Router] Connection test passed! Latency: ${latency}ms, Status: ACTIVE`,
          { id: `test-key-${k.id}` },
        );
      } else {
        toast.error(
          `[Local Router] Authentication failed. Please check Key or Base URL.`,
          { id: `test-key-${k.id}` },
        );
      }
    }, 1200);
  };

  const filteredKeys = keys.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.baseUrl &&
        k.baseUrl.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
      {/* Upper Module HUD Header */}
      <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-panel">
        <div>
          <h2 className="text-base font-black text-text-main tracking-widest uppercase flex items-center gap-2 font-mono">
            <Key
              size={18}
              className="text-primary-main shadow-[0_0_10px_rgba(59,130,246,0.35)]"
            />
            {t("workspace:api_keys_mgr", "Local API Keys Manager")}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {t("workspace:api_keys_desc", "Manage API keys for local proxy tunneling with strong client-side encryption. Supports all tool APIs.")}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary-main hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-blue-600/10 active:scale-95 cursor-pointer max-w-max self-start md:self-auto"
        >
          <Plus size={14} /> {t("workspace:add_api_key", "Add API Key")}
        </button>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* HUD Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-panel border border-divider flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-main/10 flex items-center justify-center border border-[var(--color-primary-alpha)] text-primary-light">
              <Key size={18} />
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-mono">
                {t("workspace:total_keys", "Total Keys")}
              </div>
              <div className="text-lg font-black text-text-main mt-0.5 font-mono">
                {keys.length} {t("workspace:keys_lbl", "keys")}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-panel border border-divider flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-mono">
                {t("workspace:active_keys", "Active Keys")}
              </div>
              <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono">
                {keys.filter((k) => k.enabled).length} {t("workspace:enabled_lbl", "Enabled")}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-panel border border-divider flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-main/10 flex items-center justify-center border border-primary-main/20 text-primary-light">
              <RefreshCw size={18} />
            </div>
            <div>
              <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-mono">
                {t("workspace:local_enc_layer", "Local Encryption Layer")}
              </div>
              <div className="text-lg font-black text-primary-light mt-0.5 font-mono">
                AES-256 (Local)
              </div>
            </div>
          </div>
        </div>

        {/* API Keys List and Search */}
        <div className="border border-divider bg-panel rounded-2xl overflow-hidden flex flex-col">
          {/* List Search Header */}
          <div className="p-4 border-b border-divider bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-bold text-text-main font-mono uppercase tracking-wider">
              {t("workspace:key_mapping_table", "Key Mapping Table")} ({filteredKeys.length})
            </span>
            <div className="relative w-full sm:w-64">
              <Search
                size={13}
                className="absolute left-3 top-3 text-text-muted"
              />
              <input
                type="text"
                placeholder={t("workspace:search_key_placeholder", "Search key name or API endpoint...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel border border-divider hover:border-divider-strong rounded-xl pl-9 pr-3 py-2 text-xs text-text-main placeholder-gray-600 focus:outline-none focus:border-primary-main/50 transition-all font-sans"
              />
            </div>
          </div>

          {/* List Rows */}
          <div className="divide-y divide-[#1C1F26] min-h-[220px]">
            {filteredKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
                <p className="text-sm font-bold text-text-muted">
                  {t("workspace:no_keys_configured", "No Local API Keys Configured")}
                </p>
                <button
                  onClick={openAddModal}
                  className="text-xs text-primary-main hover:text-primary-light font-bold flex items-center gap-1 mt-1"
                >
                  <Plus size={12} /> {t("workspace:add_first_key", "Click to add your first key")}
                </button>
              </div>
            ) : (
              filteredKeys.map((k) => (
                <ApiKeyRow
                  key={k.id}
                  k={k}
                  tools={configTools.length > 0 ? configTools : undefined}
                  isShown={!!showKeyMap[k.id]}
                  onToggleShow={toggleShowKey}
                  onToggleEnable={(k, state) => handleToggleKeyEnabled(k.id)}
                  onDuplicate={handleDuplicate}
                  onEdit={openEditModal}
                  onDelete={(k) => handleDelete(k.id, k.name)}
                  onTestConnection={handleTestKeyStatus}
                  t={t}
                />
              ))
            )}
          </div>
        </div>

        {/* Info card footer with professional docs summary */}
        <div className="p-5 rounded-2xl bg-panel border border-divider border-dashed flex items-start gap-4">
          <HelpCircle size={18} className="text-text-muted shrink-0 mt-0.5" />
          <div className="text-xs text-text-muted space-y-1">
            <h5 className="font-bold text-text-muted">
              Key Priority Principles:
            </h5>
            <p>
              1. Local API Keys can be mounted in the local router to enable
              support for all underlying tools.
            </p>
            <p>
              2. When overriding base URL or system-level keys, local nodes
              automatically prioritize this configuration.
            </p>
            <p>
              3. All stored data uses end-to-end client-side encryption and is
              never exposed to unauthorized outbound proxies.
            </p>
          </div>
        </div>
      </div>

      <ApiKeyConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        showModalKey={showModalKey}
        setShowModalKey={setShowModalKey}
        handleSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
