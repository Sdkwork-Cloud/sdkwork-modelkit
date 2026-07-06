import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState } from "react";
import { ProviderData } from "../../services/types";
import { Eye, EyeOff, Copy, Zap, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface StepConnectionProps {
  formData: ProviderData;
  setFormData: (data: ProviderData) => void;
}

export function StepConnection({ formData, setFormData }: StepConnectionProps) {
  const { t } = useAppContext();
  const [showKey, setShowKey] = useState(false);

  const getProviderType = () => {
    const name = formData.name?.toLowerCase() || "";
    if (name.includes("claude") || name.includes("anthropic")) return "claude";
    return "codex";
  };

  const providerType = getProviderType();

  const handleClaudeModelChange = (
    field: keyof NonNullable<ProviderData["claudeModels"]>,
    value: string,
  ) => {
    setFormData({
      ...formData,
      claudeModels: {
        ...(formData.claudeModels || {}),
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-panel border border-divider rounded-2xl p-4.5">
        <div className="text-[12px] text-text-muted font-bold mb-3">
          {t("workspace:txt_1237")}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="px-3.5 py-1.5 rounded-full border border-divider text-xs text-text-main font-bold bg-surface shrink-0">
            {formData.name || (providerType === "claude" ? "Claude" : "Codex")}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-divider text-xs text-text-muted bg-surface font-medium shrink-0">
            {formData.id ? t("workspace:edit_btn", "Edit") : t("workspace:add_btn", "Add")}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-[var(--color-primary-alpha)] text-xs text-primary-light bg-primary-main/10 shrink-0 font-bold tracking-wide">
            {t("workspace:txt_1239")}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-divider text-xs text-text-muted bg-surface font-medium shrink-0">
            {t("workspace:txt_1240")}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-divider text-xs text-text-muted bg-surface font-medium shrink-0">
            {t("workspace:txt_1241")}
          </span>
          <div className="flex-1 flex justify-end shrink-0 pl-4">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-[var(--color-primary-alpha)] text-[11px] font-mono font-bold text-primary-light bg-primary-main/10">
              3/5
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-bold text-text-main mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={formData.apiKey || ""}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              placeholder={
                providerType === "claude"
                  ? t("workspace:placeholder_claude_apikey", "Just fill this in, lower settings will autofill")
                  : t("workspace:placeholder_codex_apikey", "Just fill this in, lower auth.json will autofill")
              }
              className="w-full bg-surface border border-divider rounded-xl pl-4 pr-20 py-3 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono placeholder:font-sans placeholder:text-text-muted/60"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-text-muted">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 hover:text-text-main transition-colors cursor-pointer rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-[13px] font-bold text-text-main">
              {providerType === "claude" ? t("workspace:request_url_claude", "Request URL") : t("workspace:request_url_api", "API Request URL")}
            </label>
            <div className="text-[11px] text-text-muted flex items-center gap-1 cursor-pointer hover:text-text-main transition-colors">
              <Zap size={10} className="text-amber-400" />{" "}
              {t("workspace:txt_1244")}
            </div>
          </div>
          <input
            type="text"
            value={formData.endpoint || ""}
            onChange={(e) =>
              setFormData({ ...formData, endpoint: e.target.value })
            }
            placeholder={
              providerType === "claude"
                ? "https://your-api-endpoint.com"
                : "https://your-api-endpoint.com/v1"
            }
            className="w-full bg-surface border border-divider rounded-xl px-4 py-3 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all font-mono placeholder:font-sans placeholder:text-text-muted/60 mb-2"
          />
          <div className="bg-[#FFF8E6] dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 flex items-start gap-2 text-amber-800 dark:text-amber-500">
            <Lightbulb size={14} className="mt-0.5 shrink-0" />
            <span className="text-xs font-medium">
              {providerType === "claude"
                ? t("workspace:claude_endpoint_hint", "Fill in the service endpoint compatible with the Claude API, do not end with a slash")
                : t("workspace:openai_endpoint_hint", "Fill in the service endpoint compatible with the OpenAI Response format")}
            </span>
          </div>
        </div>

        {providerType === "claude" ? (
          <>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">
                {t("workspace:txt_1246")}
              </label>
              <select
                value={formData.apiFormat || t("workspace:txt_1247", "Anthropic Messages (native)")}
                onChange={(e) =>
                  setFormData({ ...formData, apiFormat: e.target.value })
                }
                className="w-full bg-surface border border-divider rounded-xl px-4 py-3 text-sm text-text-main focus:border-primary-main/50 appearance-none outline-none"
              >
                <option>{t("workspace:txt_1247")}</option>
                <option>{t("workspace:txt_1248")}</option>
              </select>
              <div className="mt-1.5 text-[11px] text-text-muted">
                {t("workspace:txt_1249")}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">
                {t("workspace:txt_1250")}
              </label>
              <select
                value={formData.authField || t("workspace:txt_1251", "ANTHROPIC_AUTH_TOKEN (default)")}
                onChange={(e) =>
                  setFormData({ ...formData, authField: e.target.value })
                }
                className="w-full bg-surface border border-divider rounded-xl px-4 py-3 text-sm text-text-main focus:border-primary-main/50 appearance-none outline-none"
              >
                <option>{t("workspace:txt_1251")}</option>
                <option>X-API-Key</option>
                <option>Authorization Bearer</option>
              </select>
              <div className="mt-1.5 text-[11px] text-text-muted">
                {t("workspace:txt_1252")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-text-main mb-2">
                  {t("workspace:txt_1253")}
                </label>
                <input
                  type="text"
                  value={formData.claudeModels?.mainModel || ""}
                  onChange={(e) =>
                    handleClaudeModelChange("mainModel", e.target.value)
                  }
                  className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-text-main mb-2">
                  {t("workspace:txt_1254")}
                </label>
                <input
                  type="text"
                  value={formData.claudeModels?.thinkingModel || ""}
                  onChange={(e) =>
                    handleClaudeModelChange("thinkingModel", e.target.value)
                  }
                  className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-text-main mb-2">
                  {t("workspace:txt_1255")}
                </label>
                <input
                  type="text"
                  value={formData.claudeModels?.haikuModel || ""}
                  onChange={(e) =>
                    handleClaudeModelChange("haikuModel", e.target.value)
                  }
                  className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-text-main mb-2">
                  {t("workspace:txt_1256")}
                </label>
                <input
                  type="text"
                  value={formData.claudeModels?.sonnetModel || ""}
                  onChange={(e) =>
                    handleClaudeModelChange("sonnetModel", e.target.value)
                  }
                  className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">
                {t("workspace:txt_1257")}
              </label>
              <input
                type="text"
                value={formData.claudeModels?.opusModel || ""}
                onChange={(e) =>
                  handleClaudeModelChange("opusModel", e.target.value)
                }
                className="w-full bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 font-mono"
              />
              <div className="mt-2 text-[11px] text-text-muted">
                {t("workspace:txt_1258")}
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">
              {t("workspace:txt_1259")}
            </label>
            <input
              type="text"
              value={formData.defaultModel || ""}
              onChange={(e) =>
                setFormData({ ...formData, defaultModel: e.target.value })
              }
              placeholder="gpt-5.4"
              className="w-full bg-surface border border-divider rounded-xl px-4 py-3 text-sm text-text-main focus:border-primary-main/50 transition-all font-mono placeholder:font-sans placeholder:text-text-muted/60"
            />
            <div className="mt-1.5 text-[11px] text-text-muted">
              {t("workspace:txt_1260")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
