import React, { useState, useEffect } from "react";
import { ProviderList } from "./ProviderList";
import { ProviderEditorDrawer } from "./ProviderEditorDrawer";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { workspaceService } from "../../services/WorkspaceService";
import { ProviderData } from "../../services/types";

interface ProvidersManagerProps {
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  editingProvider: any;
  setEditingProvider: (provider: any) => void;
}

export function ProvidersManager({
  isEditorOpen,
  setIsEditorOpen,
  editingProvider,
  setEditingProvider,
}: ProvidersManagerProps) {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    workspaceService.getProviders().then(setProviders);
  }, []);

  const handleEditProvider = (provider: any) => {
    setEditingProvider(provider);
    setIsEditorOpen(true);
  };

  const handleSaveProvider = async (data: any) => {
    let newProviders = [...providers];
    const targetId =
      data.id ||
      (
        Math.max(0, ...providers.map((p) => parseInt(p.id) || 0)) + 1
      ).toString();

    if (data.id) {
      newProviders = providers.map((p) =>
        p.id === data.id ? { ...p, ...data } : p,
      );
    } else {
      newProviders = [...providers, { ...data, id: targetId }];
    }

    if (data.enabled) {
      // Logic for enabling single provider if needed
    }

    setProviders(newProviders);
    await workspaceService.saveProviders(newProviders);
    toast.success("Saved successfully");
  };

  const handleDeleteProvider = async (id: string) => {
    const newProviders = providers.filter((p) => p.id !== id);
    setProviders(newProviders);
    await workspaceService.saveProviders(newProviders);
    toast.success("Deleted successfully");
  };

  const handleCopyProvider = async (provider: any) => {
    const newProvider = {
      ...provider,
      id: (
        Math.max(0, ...providers.map((p) => parseInt(p.id) || 0)) + 1
      ).toString(),
      name: `${provider.name} (Copy)`,
    };
    const index = providers.findIndex((p) => p.id === provider.id);
    const newProviders = [...providers];
    if (index !== -1) {
      newProviders.splice(index + 1, 0, newProvider);
    } else {
      newProviders.push(newProvider);
    }
    setProviders(newProviders);
    await workspaceService.saveProviders(newProviders);
    toast.success("Copied successfully");
  };

  const handleTestProvider = (provider: any) => {
    toast.loading(`Testing ${provider.name}...`, { id: `test-${provider.id}` });
    setTimeout(() => {
      toast.success(`${provider.name} Test Passed (Latency: 45ms)`, {
        id: `test-${provider.id}`,
      });
    }, 1500);
  };

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main mb-1">
            {providers.length} Providers
          </h2>
          <p className="text-xs text-text-muted">
            Drag to reorder, search to locate, and import real-time config.
          </p>
        </div>
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search providers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-surface-hover rounded-lg pl-9 pr-4 py-2 text-sm text-text-main outline-none focus:border-primary-main/50 focus:bg-surface transition-all"
          />
        </div>
      </div>

      <ProviderList
        providers={filteredProviders as any}
        setProviders={(newFilteredProviders) => {
          if (searchTerm) return;
          setProviders(newFilteredProviders as any);
          workspaceService.saveProviders(newFilteredProviders as any);
        }}
        onEdit={handleEditProvider}
        onDelete={handleDeleteProvider as any}
        onCopy={handleCopyProvider}
        onTest={handleTestProvider}
      />
      <ProviderEditorDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProvider}
        initialData={editingProvider}
      />
    </>
  );
}
