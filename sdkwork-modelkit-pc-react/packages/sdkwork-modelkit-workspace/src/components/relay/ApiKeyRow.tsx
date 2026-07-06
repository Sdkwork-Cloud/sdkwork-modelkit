import React from "react";
import { Key, Eye, EyeOff, Copy, Play, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { LocalApiKey } from "../../services/types";
import { AgentTool } from "@sdkwork/modelkit-types";
import { QuickConfigButton } from "@sdkwork/modelkit-sdk-typescript";

interface ApiKeyRowProps {
  k: LocalApiKey;
  tools?: any[];
  isShown: boolean;
  onToggleShow: (id: string) => void;
  onToggleEnable: (k: LocalApiKey, newState: boolean) => void;
  onDuplicate: (k: LocalApiKey) => void;
  onEdit: (k: LocalApiKey) => void;
  onDelete: (k: LocalApiKey) => void;
  onTestConnection: (k: LocalApiKey) => void;
  t: any;
}

export function ApiKeyRow({
  k,
  tools,
  isShown,
  onToggleShow,
  onToggleEnable,
  onDuplicate,
  onEdit,
  onDelete,
  onTestConnection,
  t,
}: ApiKeyRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface border border-divider hover:border-divider-strong rounded-2xl transition-all gap-4">
      {/* Key Core Info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Logo / Badge */}
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg shadow-inner shrink-0 mt-0.5 transition-colors ${
            k.enabled
              ? "bg-primary-main/10 border-[var(--color-primary-alpha)] text-primary-light"
              : "bg-panel border-divider text-text-muted"
          }`}
        >
          <Key size={16} />
        </div>

        {/* Details Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <span className="font-extrabold text-sm text-text-main truncate max-w-[200px]">
              {k.name}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                k.enabled
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-panel border-divider text-text-muted"
              }`}
            >
              {k.enabled ? t("workspace:enabled", "Active") : t("workspace:disabled", "Disabled")}
            </span>
          </div>

          {/* Display secure key with show/hide toggle */}
          <div className="flex items-center flex-wrap gap-1 mt-2 text-[11px] font-mono group">
            <span className="text-text-muted font-sans font-bold bg-panel px-1.5 py-0.5 rounded border border-divider">
              Key:
            </span>
            <span className="text-primary-light/80 bg-panel px-2 py-0.5 rounded border border-divider break-all">
              {isShown ? k.key : "sk-••••••••••••••••••••••••••••"}
            </span>
            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity ml-1">
              <button
                type="button"
                onClick={() => onToggleShow(k.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-text-muted hover:text-text-main transition-colors cursor-pointer"
                title={isShown ? t("workspace:hide_sensitive", "Hide sensitive content") : t("workspace:show_key", "Show key")}
              >
                {isShown ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(k.key);
                  toast.success(t("workspace:api_key_copied", `[${k.name}] Key copied to clipboard!`));
                }}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-text-muted hover:text-text-main transition-colors cursor-pointer"
                title={t("workspace:copy_api_key_btn", "Copy raw key")}
              >
                <Copy size={11} />
              </button>
            </div>
          </div>

          {/* Base URL metadata */}
          {k.baseUrl && (
            <div className="flex items-center flex-wrap gap-1 mt-1.5 text-[11px] font-mono group">
              <span className="text-text-muted bg-panel px-1.5 py-0.5 rounded border border-divider">
                Base API:
              </span>
              <span className="text-text-muted break-all">
                {k.baseUrl}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(k.baseUrl!);
                  toast.success(t("workspace:endpoint_copied", `[${k.name}] Base URL copied to clipboard!`));
                }}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-text-muted hover:text-text-main transition-colors opacity-40 group-hover:opacity-100 cursor-pointer"
                title={t("workspace:copy_base_url_btn", "Copy Base URL")}
              >
                <Copy size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Key Actions Right Controls */}
      <div className="flex items-center justify-between md:justify-end gap-x-6 gap-y-3 shrink-0 flex-wrap border-t md:border-none border-divider pt-3 md:pt-0">
        {/* Left: display added time */}
        <div className="text-[10px] text-text-muted font-mono whitespace-nowrap">
          Added: {k.timeAdded}
        </div>

        <div className="flex items-center gap-4">
          {/* Enable Switch */}
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={k.enabled}
                onChange={(e) => onToggleEnable(k, e.target.checked)}
              />
              <div
                className={`block w-8 h-4.5 rounded-full transition-colors ${
                  k.enabled ? "bg-primary-main" : "bg-divider-strong"
                }`}
              ></div>
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-3.5 h-3.5 rounded-full transition-transform shadow-sm ${
                  k.enabled ? "transform translate-x-3.5" : ""
                }`}
              ></div>
            </div>
          </label>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-divider"></div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Quick Config Button */}
            <QuickConfigButton
              apiKey={k.key}
              baseUrl={k.baseUrl || ""}
              name={k.name}
              description="ModelKit Workspace Local Key Config"
              layoutMode="drawer"
              tools={tools?.length && tools.length > 0 ? tools : undefined}
              onDirectConfig={(toolId: string, toolName: string) => {
                toast.success(
                  `[Local Router - ${toolName}] Integration successful! Policy applied to ${toolId}.`,
                );
              }}
            />

            {/* Run connection check */}
            <button
              onClick={() => onTestConnection(k)}
              className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-divider text-text-muted hover:text-primary-light flex items-center justify-center transition-all cursor-pointer"
              title="Test Upstream Connection"
            >
              <Play
                size={14}
                className={k.enabled ? "text-emerald-500" : ""}
              />
            </button>

            {/* Clone/Duplicate key config */}
            <button
              onClick={() => onDuplicate(k)}
              className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-divider text-text-muted hover:text-text-main flex items-center justify-center transition-all cursor-pointer"
              title="Duplicate config"
            >
              <Copy size={14} />
            </button>

            {/* Edit configuration modal */}
            <button
              onClick={() => onEdit(k)}
              className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-divider text-text-muted hover:text-text-main flex items-center justify-center transition-all cursor-pointer"
              title="Edit"
            >
              <Edit3 size={14} />
            </button>

            {/* Delete key */}
            <button
              onClick={() => onDelete(k)}
              className="w-8 h-8 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-text-muted hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
              title="Delete key"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
