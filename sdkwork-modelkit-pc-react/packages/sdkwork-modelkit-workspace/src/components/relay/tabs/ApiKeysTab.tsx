import React, { useState, useEffect } from "react";
import { Key, Plus, Search, Copy, Edit3, Trash2, Play, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { LocalRelay, LocalApiKey } from "../../../services/types";
import { workspaceService } from "../../../services/WorkspaceService";
import { ApiKeyConfigModal } from "../../modals/ApiKeyConfigModal";
import { useAppContext } from "@sdkwork/modelkit-core";

interface ApiKeysTabProps {
  relay: LocalRelay;
}

export function ApiKeysTab({ relay }: ApiKeysTabProps) {
  const { t, language } = useAppContext();

  const [keys, setKeys] = useState<LocalApiKey[]>([]);
  const [keySearchQuery, setKeySearchQuery] = useState("");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyModalMode, setKeyModalMode] = useState<"add" | "edit">("add");
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [keyModalKeyToggle, setKeyModalKeyToggle] = useState(false);
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [keyFormData, setKeyFormData] = useState({
    name: "",
    key: "",
    baseUrl: "",
  });

  useEffect(() => {
    workspaceService.getApiKeys().then(setKeys);
  }, []);

  const saveKeysToStorage = (updatedKeys: LocalApiKey[]) => {
    setKeys(updatedKeys);
    workspaceService.saveApiKeys(updatedKeys);
  };

  const openAddKeyModal = () => {
    setKeyModalMode("add");
    setEditingKeyId(null);
    setKeyModalKeyToggle(false);

    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    setKeyFormData({
      name: `${relay.name} Client Key`,
      key: `sk-${relay.id.replace("relay-", "")}-${randomSuffix}`,
      baseUrl: `http://localhost:${relay.port}`,
    });
    setIsKeyModalOpen(true);
  };

  const openEditKeyModal = (k: LocalApiKey) => {
    setKeyModalMode("edit");
    setEditingKeyId(k.id);
    setKeyModalKeyToggle(false);
    setKeyFormData({
      name: k.name,
      key: k.key,
      baseUrl: k.baseUrl || "",
    });
    setIsKeyModalOpen(true);
  };

  const handleSaveRelayApiKey = () => {
    if (!keyFormData.name.trim()) {
      toast.error(t("workspace:name_empty", "Name cannot be empty"));
      return;
    }
    if (!keyFormData.key.trim()) {
      toast.error(t("workspace:key_empty", "API Key cannot be empty"));
      return;
    }

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (keyModalMode === "add") {
      const newId = `k-${Date.now()}`;
      const newApiKey: LocalApiKey = {
        id: newId,
        name: keyFormData.name,
        key: keyFormData.key,
        baseUrl: keyFormData.baseUrl,
        enabled: true,
        timeAdded: formattedTime,
        relayId: relay.id,
      };

      const updatedKeys = [newApiKey, ...keys];
      saveKeysToStorage(updatedKeys);
      toast.success(t("workspace:key_added_success", "API Key added successfully!"));
    } else if (keyModalMode === "edit" && editingKeyId) {
      const updatedKeys = keys.map((k) =>
        k.id === editingKeyId
          ? {
              ...k,
              name: keyFormData.name,
              key: keyFormData.key,
              baseUrl: keyFormData.baseUrl,
            }
          : k
      );
      saveKeysToStorage(updatedKeys);
      toast.success(t("workspace:key_updated_success", "API Key updated successfully!"));
    }

    setIsKeyModalOpen(false);
  };

  const handleDeleteKey = (id: string, name: string) => {
    const updatedKeys = keys.filter((k) => k.id !== id);
    saveKeysToStorage(updatedKeys);
    toast.success(`${t("workspace:key_deleted_success", "API Key deleted")}: ${name}`);
  };

  const handleDuplicateKey = (k: LocalApiKey) => {
    const newId = `k-${Date.now()}`;
    const copy: LocalApiKey = {
      ...k,
      id: newId,
      name: `${k.name} (${t("workspace:copy_postfix", "Copy")})`,
      timeAdded: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    const updatedKeys = [copy, ...keys];
    saveKeysToStorage(updatedKeys);
    toast.success(t("workspace:copy_success", "Configuration duplicated!"));
  };

  const handleToggleKeyEnabled = (id: string, name: string) => {
    const updatedKeys = keys.map((k) => {
      if (k.id === id) {
        const nextState = !k.enabled;
        toast.success(`${name} ${nextState ? t("workspace:enabled", "Enabled") : t("workspace:disabled", "Disabled")}`);
        return { ...k, enabled: nextState };
      }
      return k;
    });
    saveKeysToStorage(updatedKeys);
  };

  const toggleShowKey = (id: string) => {
    setShowKeyMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const relayKeys = keys.filter((k) => k.relayId === relay.id);
  const searchedKeys = relayKeys.filter(
    (k) =>
      k.name.toLowerCase().includes(keySearchQuery.toLowerCase()) ||
      k.key.toLowerCase().includes(keySearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="api-keys-tab">
      <div className="flex items-center justify-between mb-4 mt-2">
        <div>
          <h3 className="text-xl font-bold text-text-main mb-2">
            {relayKeys.length} {t("workspace:client_keys_count_label", "Active Client API Keys")}
          </h3>
          <p className="text-xs text-text-muted">
            {t("workspace:client_keys_desc", "Configure independent API keys for this local transit route. Clients can connect to this gateway using designated keys.")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t("workspace:search_keys_placeholder", "Search keys...")}
              value={keySearchQuery}
              onChange={(e) => setKeySearchQuery(e.target.value)}
              className="bg-surface border border-divider-strong rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary-main w-[200px]"
            />
          </div>
          <button
            onClick={openAddKeyModal}
            className="bg-primary-main hover:bg-primary-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            id="add-key-btn"
          >
            <Plus size={14} /> {t("workspace:add_key_btn", "Add API Key")}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {searchedKeys.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm border border-dashed border-divider rounded-xl">
            {t("workspace:no_client_keys", "No matching client API keys")}
          </div>
        ) : (
          searchedKeys.map((k) => {
            const isShown = showKeyMap[k.id];
            return (
              <div
                key={k.id}
                className="flex items-center justify-between p-4 bg-transparent border border-divider rounded-xl hover:bg-panel hover:border-divider-strong transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-bold shadow-sm transition-colors ${
                      k.enabled
                        ? "bg-primary-main/10 border-primary-main/30 text-primary-light"
                        : "bg-surface border-divider text-text-muted"
                    }`}
                  >
                    <Key size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className={`text-[15px] font-bold ${k.enabled ? "text-text-main" : "text-text-muted"}`}>
                        {k.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase border ${
                          k.enabled
                            ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-400"
                            : "bg-gray-600/5 border-gray-600/10 text-text-muted"
                        }`}
                      >
                        {k.enabled ? t("workspace:enabled_short", "Active") : t("workspace:disabled_short", "Disabled")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-text-muted mt-0.5">
                      <span className="bg-canvas px-2 py-0.5 rounded border border-divider/15">
                        {isShown ? k.key : "••••••••••••••••••••••••••••••••"}
                      </span>
                      <button
                        onClick={() => toggleShowKey(k.id)}
                        className="text-text-muted hover:text-text-main p-0.5 rounded hover:bg-divider transition-colors"
                      >
                        {isShown ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(k.key);
                          toast.success(t("workspace:modal_copy_key_success", "API Key copied to clipboard!"));
                        }}
                        className="text-text-muted hover:text-primary-light p-0.5 rounded hover:bg-divider transition-colors"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                    {k.baseUrl && (
                      <span className="text-[11px] text-text-muted font-mono mt-0.5">
                        {t("workspace:base_url_heading", "Base URL")}: {k.baseUrl}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pr-1">
                  <button
                    onClick={() => handleToggleKeyEnabled(k.id, k.name)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border text-xs font-bold cursor-pointer ${
                      k.enabled
                        ? "bg-primary-main/20 border-primary-main/30 text-primary-light hover:bg-primary-main/40"
                        : "bg-transparent border-divider-strong text-text-muted hover:text-text-main hover:border-divider-strong"
                    }`}
                  >
                    <Play size={12} className={k.enabled ? "fill-blue-400" : ""} />{" "}
                    {k.enabled ? t("workspace:disable_btn", "Disable") : t("workspace:enable_btn", "Enable")}
                  </button>

                  <div className="w-px h-5 bg-surface-hover mx-2"></div>

                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-text-muted font-mono mr-2 hidden xl:block">{k.timeAdded}</span>
                    <button
                      onClick={() => handleDuplicateKey(k)}
                      className="w-8 h-8 rounded-lg hover:bg-divider text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:duplicate_btn", "Duplicate")}
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => openEditKeyModal(k)}
                      className="w-8 h-8 rounded-lg hover:bg-divider text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:edit_btn", "Edit")}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id, k.name)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      title={t("workspace:delete_btn", "Delete")}
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

      <ApiKeyConfigModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        modalMode={keyModalMode}
        formData={keyFormData}
        setFormData={setKeyFormData as any}
        showModalKey={keyModalKeyToggle}
        setShowModalKey={setKeyModalKeyToggle}
        handleSaveApiKey={handleSaveRelayApiKey}
      />
    </div>
  );
}
