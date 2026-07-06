import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Save,
  Info,
  Link as LinkIcon,
  FileJson,
  SlidersHorizontal,
  Sliders,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";
import { getProviderIcon } from "./ProviderIcon";
import { StepBasic } from "./StepBasic";
import { StepConnection } from "./StepConnection";
import { StepConfig } from "./StepConfig";
import { StepAdvanced } from "./StepAdvanced";
import { ProviderData } from "../../services/types";
import { PRESET_SUPPLIERS, PresetSupplier } from "../../services/presetSuppliers";
import { useAppContext } from "@sdkwork/modelkit-core";

interface ProviderEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProviderData) => void;
  initialData?: ProviderData | null;
}

const STEPS = [
  {
    id: "basic",
    label: "Basic Info",
    icon: Info,
    desc: "Name and website link",
  },
  {
    id: "connection",
    label: "Connection",
    icon: LinkIcon,
    desc: "API Key and endpoints",
  },
  {
    id: "config",
    label: "Configuration",
    icon: FileJson,
    desc: "Adapt parameters for agents",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: SlidersHorizontal,
    desc: "Probes and rate limits",
  },
];

export function ProviderEditorDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProviderEditorDrawerProps) {
  const { t, language } = useAppContext();
  
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("config.json");
  const [presetSearchQuery, setPresetSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProviderData>(
    initialData || {
      id: "",
      name: "",
      url: "",
      enabled: false,
      remark: "",
      apiKey: "",
      endpoint: "",
      defaultModel: "",
      maxRetries: 3,
      timeoutMs: 30000,
      enableProxy: false,
      customHeaders: "",
      enableSpeedCheck: false,
      enableHealthCheck: false,
      concurrencyLimit: 0,
    },
  );

  // Keep internal state updated if initialData changes
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        name: "",
        url: "",
        enabled: false,
        remark: "",
        apiKey: "",
        endpoint: "",
        defaultModel: "",
        maxRetries: 3,
        timeoutMs: 30000,
        enableProxy: false,
        customHeaders: "",
        enableSpeedCheck: false,
        enableHealthCheck: false,
        concurrencyLimit: 0,
      });
    }
    setActiveStep(0);
    setActiveTab("config.json");
    setPresetSearchQuery("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEdit = !!(initialData && initialData.id);
  const currentStep = STEPS[activeStep];

  const activePreset = PRESET_SUPPLIERS.find(
    (p) =>
      p.name === formData.name &&
      (p.openaiUrl === (formData.url || "") || p.openaiUrl === (formData.endpoint || ""))
  );
  const isCustomActive = !activePreset && !formData.name;

  const handleSave = () => {
    if (!formData.name || !formData.name.trim()) {
      import("sonner").then((m) => m.toast.error("Provider Name is required"));
      setActiveStep(0);
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-start">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative z-10 w-[90vw] h-full bg-surface border-r border-divider flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-divider bg-panel">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-divider border border-divider-strong flex items-center justify-center text-text-main shrink-0 shadow-inner overflow-hidden">
                {formData.icon ? (
                  <img
                    src={formData.icon}
                    alt="Icon"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : formData.name ? (
                  getProviderIcon(formData.name, "w-5 h-5")
                ) : (
                  <Sliders className="w-4 h-4 text-text-muted" />
                )}
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-text-main flex items-center gap-2 leading-tight">
                  {isEdit ? t("workspace:modal_edit_provider", "Edit Provider") : t("workspace:modal_add_provider", "Add Provider")}
                  {formData.name && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-hover text-text-main font-medium">
                      {formData.name}
                    </span>
                  )}
                </h2>
                <span className="text-[10px] text-text-muted font-medium tracking-wide">
                  {t("workspace:provider_config_workbench", "Provider Configuration Workbench")}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar Steps */}
            <div className="w-[280px] bg-panel border-r border-divider p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">
                {t("workspace:workflow_steps_hdr", "Workflow Steps")}
              </div>
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const isPast = activeStep > idx;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`flex items-start gap-4 p-4 rounded-xl text-left transition-all border ${
                      isActive
                        ? "bg-primary-main/10 border-[var(--color-primary-alpha)]"
                        : "bg-transparent border-transparent hover:bg-surface hover:border-divider-strong"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-[11px] font-bold ${
                        isActive
                          ? "bg-primary-main border-primary-main text-white"
                          : isPast
                            ? "bg-divider border-divider-strong text-text-muted"
                            : "bg-surface border-divider-strong text-text-muted"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-bold text-sm mb-1 ${isActive ? "text-text-main" : "text-text-main"}`}
                      >
                        {t(`workspace:step_${step.id}_label`, step.label)}
                      </div>
                      <div
                        className={`text-xs leading-relaxed ${isActive ? "text-blue-200" : "text-text-muted"}`}
                      >
                        {t(`workspace:step_${step.id}_desc`, step.desc)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col bg-panel overflow-y-auto relative">
              <div className="p-6 lg:p-8 w-full h-full flex flex-col">
                {/* Step Content Container */}
                <div className="flex-1 flex flex-col h-full">
                  <div className="mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-text-main mb-1.5">
                      {t(`workspace:step_${currentStep.id}_label`, currentStep.label)}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {t(`workspace:step_${currentStep.id}_desc`, currentStep.desc)}
                    </p>
                  </div>

                  {/* Preset Suppliers list when adding new supplier */}
                  {!isEdit && activeStep === 0 && (
                    <div className="bg-[#f9fafb] dark:bg-[#151516] border border-divider dark:border-[#262629] p-6 rounded-2xl mb-8 select-none shadow-sm flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4.5">
                        <div className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                          <Sparkles size={13} className="text-amber-500 animate-pulse shrink-0" />
                          <span>{t("workspace:preset_suppliers_hdr", "Preset Suppliers")}</span>
                        </div>
                        <div className="relative w-full sm:max-w-[240px]">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/70" />
                          <input
                            type="text"
                            value={presetSearchQuery}
                            onChange={(e) => setPresetSearchQuery(e.target.value)}
                            placeholder={t("workspace:preset_search_placeholder", "Search preset suppliers...")}
                            className="bg-surface dark:bg-[#1f1f21] border border-divider dark:border-[#2d2d30] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary-main/50 transition-all w-full h-8"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2.5 max-h-[320px] overflow-y-auto pr-1.5 stylish-scrollbar select-none pb-1">
                        {/* Custom Config Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              id: "",
                              name: "",
                              url: "",
                              enabled: false,
                              remark: "",
                              apiKey: "",
                              endpoint: "",
                              defaultModel: "",
                              maxRetries: 3,
                              timeoutMs: 30000,
                              enableProxy: false,
                              customHeaders: "",
                              enableSpeedCheck: false,
                              enableHealthCheck: false,
                              concurrencyLimit: 0,
                            });
                          }}
                          className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 border uppercase tracking-wider ${
                            isCustomActive
                              ? "bg-[#0066ff] border-[#0066ff] text-white shadow-md font-black"
                              : "bg-surface dark:bg-[#202022] border-divider dark:border-transparent hover:border-text-muted text-text-main dark:text-gray-300"
                          }`}
                        >
                          {t("workspace:txt_1241", "Custom Configuration")}
                        </button>

                        {/* Preset Buttons */}
                        {PRESET_SUPPLIERS.filter((ps) => {
                          const query = presetSearchQuery.toLowerCase();
                          if (!query) return true;
                          return (
                            ps.name.toLowerCase().includes(query) ||
                            (ps.nameEn && ps.nameEn.toLowerCase().includes(query)) ||
                            ps.modelId.toLowerCase().includes(query)
                          );
                        }).map((preset) => {
                          const isSelected = activePreset && activePreset.name === preset.name;
                          const isStarred = preset.starred === true;
                          const displayName = preset.nameEn || preset.name;
                          
                          // Helper to generate website url from endpoint API
                          const getWebsiteUrl = (p: PresetSupplier) => {
                            const api = p.openaiUrl || p.anthropicUrl || p.geminiUrl || "";
                            if (!api) return "";
                            try {
                              const u = new URL(api);
                              return `${u.protocol}//${u.hostname}`;
                            } catch(e) {
                              return api;
                            }
                          };

                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  name: preset.name,
                                  url: getWebsiteUrl(preset),
                                  endpoint: preset.openaiUrl || preset.anthropicUrl || preset.geminiUrl || "",
                                  defaultModel: preset.modelId,
                                  id: preset.name.toLowerCase().replace(/\s+/g, "-"),
                                  claudeModels: {
                                    mainModel: preset.modelId,
                                    thinkingModel: preset.modelId,
                                    haikuModel: preset.modelId,
                                    sonnetModel: preset.modelId,
                                    opusModel: preset.modelId,
                                  }
                                });
                              }}
                              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all relative flex items-center gap-2 cursor-pointer border ${
                                isSelected
                                  ? "bg-[#0066ff]/10 border-[#0066ff] text-[#0066ff] dark:text-blue-400 font-extrabold shadow-sm"
                                  : "bg-surface dark:bg-[#202022] border-divider dark:border-[#2d2d30] hover:border-text-muted/60 dark:hover:border-text-muted text-text-muted dark:text-gray-300 hover:text-text-main"
                              }`}
                            >
                              {getProviderIcon(preset.name, isSelected ? "w-3.5 h-3.5 text-[#0066ff] shrink-0" : "w-3.5 h-3.5 text-text-muted shrink-0")}
                              <span className="whitespace-nowrap">{displayName}</span>
                              {isStarred && (
                                <span className="absolute -top-[5px] -right-[5px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 border border-white dark:border-[#202022] shadow select-none scale-90 text-[8px] text-white leading-none font-black">
                                  ★
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-3.5 pl-0.5 font-medium">
                        <span className="text-amber-500 text-sm">💡</span>
                        <span>
                          {t("workspace:custom_config_tip", "Custom configuration requires manual entry of all necessary fields")}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeStep === 0 && (
                    <StepBasic formData={formData} setFormData={setFormData} />
                  )}
                  {activeStep === 1 && (
                    <StepConnection
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                  {activeStep === 2 && (
                    <StepConfig
                      formData={formData}
                      setFormData={setFormData}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                  )}
                  {activeStep === 3 && (
                    <StepAdvanced
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="px-6 py-4 border-t border-divider bg-panel flex justify-between items-center shadow-[0_-4px_24px_rgba(0,0,0,0.2)] z-10">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className={`px-5 py-2 rounded-lg font-medium text-xs transition-colors ${activeStep === 0 ? "text-text-muted cursor-not-allowed" : "text-text-muted hover:text-text-main hover:bg-surface-hover"}`}
            >
              {t("workspace:prev_step", "Previous")}
            </button>

            <div className="flex items-center gap-3">
              {activeStep < STEPS.length - 1 && (
                <button
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="px-5 py-2 rounded-lg font-medium text-xs bg-divider text-text-main hover:bg-divider-strong border border-divider-strong transition-colors shadow-sm"
                >
                  {t("workspace:next_step", "Next")}
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-medium text-xs bg-primary-main text-white hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-[inset_0_1px_rgba(255,255,255,0.2)]"
              >
                <Save size={14} /> {t("workspace:save_config_btn", "Save Config")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
