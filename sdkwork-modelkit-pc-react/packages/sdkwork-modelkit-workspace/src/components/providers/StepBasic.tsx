import React from "react";
import { ProviderData } from "../../services/types";
import { useAppContext } from "@sdkwork/modelkit-core";

interface StepBasicProps {
  formData: ProviderData;
  setFormData: (data: ProviderData) => void;
}

export function StepBasic({ formData, setFormData }: StepBasicProps) {
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            {t("workspace:basic_provider_name", "Provider Name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("workspace:basic_provider_placeholder", "e.g.: openai, azure")}
            className="w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            {t("workspace:basic_remark", "Description Remark")}
          </label>
          <input
            type="text"
            value={formData.remark || ""}
            onChange={(e) =>
              setFormData({ ...formData, remark: e.target.value })
            }
            placeholder={t("workspace:basic_remark_placeholder", "e.g.: Company internal routing account")}
            className="w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            {t("workspace:basic_website_url", "Website Home Page URL")}
          </label>
          <input
            type="text"
            value={formData.url || ""}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder={t("workspace:basic_website_placeholder", "e.g.: https://openai.com")}
            className="w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-sm text-text-main focus:border-primary-main/50 focus:bg-surface transition-all"
          />
        </div>
      </div>
    </div>
  );
}
