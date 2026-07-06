import { useAppContext } from "@sdkwork/modelkit-core";
import React from "react";
import { X, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "add" | "edit";
  formData: {
    name: string;
    key: string;
    baseUrl: string;
  };
  setFormData: (data: any) => void;
  showModalKey: boolean;
  setShowModalKey: (show: boolean) => void;
  handleSaveApiKey: () => void;
}

export function ApiKeyConfigModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  showModalKey,
  setShowModalKey,
  handleSaveApiKey,
}: ApiKeyConfigModalProps) {
  const { t } = useAppContext();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-divider-strong rounded-2xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-divider flex items-center justify-between">
          <h3 className="text-[15px] font-black text-text-main flex items-center gap-2 font-mono uppercase tracking-wider">
            <span className="text-primary-main font-extrabold text-lg">&gt;_</span>{" "}
            {modalMode === "add" ? t("workspace:add_api_key_header", "Add API Key") : t("workspace:edit_api_key_header", "Edit API Key")}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Fields Body */}
        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
              {t("workspace:txt_1204")}
            </label>
            <input
              type="text"
              placeholder="e.g. OpenAI production key"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-panel border border-surface-hover hover:border-gray-600 focus:border-primary-main rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none transition-all placeholder-gray-600 font-sans"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
              {t("workspace:txt_1205")}
            </label>
            <div className="relative">
              <input
                type={showModalKey ? "text" : "password"}
                placeholder="sk-..."
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                className="w-full bg-panel border border-surface-hover hover:border-gray-600 focus:border-primary-main rounded-xl pl-4 pr-20 py-3 text-sm text-text-main focus:outline-none transition-all placeholder-gray-650 font-mono"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-text-muted">
                <button
                  type="button"
                  onClick={() => setShowModalKey(!showModalKey)}
                  className="p-1 hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                  title={showModalKey ? t("workspace:hide_sensitive", "Hide sensitive") : t("workspace:show_key", "Show key")}
                >
                  {showModalKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                {formData.key && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.key);
                      toast.success(t("workspace:api_key_copied", "API key copied to clipboard!"));
                    }}
                    className="p-1 hover:text-primary-light hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                    title={t("workspace:copy_api_key_btn", "Copy API Key")}
                  >
                    <Copy size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom Base URL (Optional) */}
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
              {t("workspace:txt_1207")}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://api.openai.com/v1"
                value={formData.baseUrl}
                onChange={(e) =>
                  setFormData({ ...formData, baseUrl: e.target.value })
                }
                className="w-full bg-panel border border-surface-hover hover:border-gray-600 focus:border-primary-main rounded-xl pl-4 pr-12 py-3 text-sm text-text-main focus:outline-none transition-all placeholder-gray-600 font-mono"
              />
              {formData.baseUrl && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.baseUrl);
                      toast.success(t("workspace:endpoint_copied", "Custom endpoint URL copied!"));
                    }}
                    className="p-1 text-text-muted hover:text-primary-light hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all cursor-pointer"
                    title={t("workspace:copy_base_url_btn", "Copy Base URL")}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="grid grid-cols-2 border-t border-divider">
          <button
            onClick={onClose}
            className="py-4 text-sm font-bold text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 border-r border-divider transition-colors"
            type="button"
          >
            {t("workspace:txt_1209")}
          </button>
          <button
            onClick={handleSaveApiKey}
            className="py-4 text-sm font-black text-primary-light hover:text-primary-light hover:bg-primary-hover/5 transition-colors"
            type="button"
          >
            {t("workspace:txt_1210")}
          </button>
        </div>
      </div>
    </div>
  );
}
