import { useAppContext } from "@sdkwork/modelkit-core";
import React from "react";
import { Download, Monitor, Terminal, X, Check } from "lucide-react";
import { AgentTool } from "@sdkwork/modelkit-types";

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: AgentTool;
  selectedType: "cli" | "desktop";
  setSelectedType: (type: "cli" | "desktop") => void;
  onInstall?: (id: string, type: "cli" | "desktop") => void;
}

export function AppInstallModal({
  isOpen,
  onClose,
  activeTool,
  selectedType,
  setSelectedType,
  onInstall,
}: AppInstallModalProps) {
  const { t } = useAppContext();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-divider-strong rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-divider flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-primary-main animate-pulse" />
            <h3 className="text-base font-bold text-text-main font-sans">
              {t("workspace:txt_1211")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-sm text-text-muted">
            {t("workspace:txt_1212")}{" "}
            <strong className="text-primary-light font-semibold">
              {activeTool?.name}
            </strong>{" "}
            {t("workspace:txt_1213")}
          </div>

          <div className="space-y-3">
            {/* CLI Tool Option */}
            <div
              onClick={() => setSelectedType("cli")}
              className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                selectedType === "cli"
                  ? "bg-primary-main/10 border-primary-main/80 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "bg-panel border-divider hover:border-divider-strong hover:bg-surface"
              }`}
            >
              <div
                className={`p-2 rounded-lg border ${selectedType === "cli" ? "bg-primary-main/15 border-[var(--color-primary-alpha)] text-primary-light" : "bg-surface-hover/20 border-gray-700/30 text-text-muted"}`}
              >
                <Terminal size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-main">
                    {t("workspace:txt_1214")}
                  </span>
                  {selectedType === "cli" && (
                    <Check size={16} className="text-primary-light" />
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                  {t("workspace:txt_1215")}
                </p>
              </div>
            </div>

            {/* Desktop App Option */}
            <div
              onClick={() => setSelectedType("desktop")}
              className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                selectedType === "desktop"
                  ? "bg-primary-hover/10 border-primary-main/85 shadow-[0_0_12px_var(--color-primary-alpha)]"
                  : "bg-panel border-divider hover:border-divider-strong hover:bg-surface"
              }`}
            >
              <div
                className={`p-2 rounded-lg border ${selectedType === "desktop" ? "bg-primary-hover/15 border-primary-main/30 text-primary-light" : "bg-surface-hover/20 border-gray-700/30 text-text-muted"}`}
              >
                <Monitor size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-main">
                    {t("workspace:txt_1216")}
                  </span>
                  {selectedType === "desktop" && (
                    <Check size={16} className="text-primary-light" />
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                  {t("workspace:txt_1217")}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer within modal */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors"
            >
              {t("workspace:txt_1218")}
            </button>
            <button
              onClick={() => {
                if (onInstall) {
                  onInstall(activeTool.id, selectedType);
                }
                onClose();
              }}
              className="px-5 py-2 rounded-lg text-sm font-bold bg-primary-main hover:bg-primary-hover text-white transition-all shadow-[0_4px_16px_var(--color-primary-alpha)]"
            >
              {t("workspace:continue_deploy", "Deploy")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
