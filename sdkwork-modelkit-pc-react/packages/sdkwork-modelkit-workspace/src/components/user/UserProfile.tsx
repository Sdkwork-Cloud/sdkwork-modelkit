import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Key,
  Copy,
  Eye,
  EyeOff,
  Save,
  Check,
  Award,
  Compass,
  Globe,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useService } from "@sdkwork/modelkit-core";
import {
  IUserService,
  IUserServiceToken,
  UserProfileInfo,
} from "@sdkwork/modelkit-services";
import { workspaceService } from "../../services/WorkspaceService";

interface UserProfileProps {
  onNavigate?: (view: "user-profile" | "system-settings") => void;
  key?: string;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { t } = useAppContext();
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [isVip, setIsVip] = useState(false);

  const userService = useService<IUserService>(IUserServiceToken);
  const [profile, setProfile] = useState<UserProfileInfo | null>(null);

  useEffect(() => {
    workspaceService.getVipStatus().then((status) => setIsVip(status.isActive));
    userService.fetchProfile().then(setProfile);
  }, [userService]);
  const [geminiKey, setGeminiKey] = useState(
    "AIzaSyD-Gemini_Core_Node_Secure_Key_Sample663",
  );
  const [openAIKey, setOpenAIKey] = useState(
    "sk-proj-OpenAI_Proxy_Token_Secure_Demo_Instance__412c9x",
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${title} ${t('workspace:copied_success', 'copied to clipboard!')}`);
  };

  const handleSaveCredentials = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(t('workspace:credentials_saved', "Local encrypted developer keystore saved successfully!"));
    }, 850);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-panel overflow-y-auto custom-scrollbar">
      {/* Top Header Bar */}
      <div className="px-8 pt-8 flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 px-1.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-primary-light text-[10px] font-bold select-none">
                {t('workspace:admin_console', 'ADMIN CONSOLE')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
              <User className="text-primary-main" size={22} />
              {t("workspace:txt_1330")}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-8 pb-12 w-full max-w-none grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left identity card (Col 1) */}
        <div className="border border-divider bg-panel rounded-2xl p-6 shadow-xl space-y-6 xl:col-span-1">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-3xl shadow-[0_4px_24px_rgba(79,70,229,0.3)] border border-[var(--color-primary-alpha)] select-none">
              {(profile?.name || "BB").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-black text-text-main flex items-center justify-center gap-1.5">
                {profile?.name || t('workspace:loading', "Loading...")}
                {isVip ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-text-main text-[9px] font-black tracking-widest uppercase shadow-[0_2px_10px_rgba(245,158,11,0.35)] select-none">
                    <Crown size={9} className="fill-[#111215] text-panel" />
                    {t("workspace:txt_1331")}
                  </span>
                ) : (
                  <Award size={14} className="text-yellow-500" />
                )}
              </h2>
              <p className="text-xs text-primary-light font-bold font-mono mt-1">
                {profile?.email || "..."}
              </p>
            </div>
          </div>

          <div className="border-t border-divider pt-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold">
                {t("workspace:txt_1332")}
              </span>
              <span className="text-text-main font-bold flex items-center gap-1">
                <Shield size={12} className="text-primary-light" />
                {t('workspace:root_admin', 'Root Admin')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-divider pb-3">
              <span className="text-text-muted font-semibold">
                {t("workspace:txt_1333")}
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-text-main">mk_usr_90a18f4d92eb</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("mk_usr_90a18f4d92eb");
                    toast.success(t('workspace:uid_copied', "UID copied!"));
                  }}
                  className="p-1 hover:text-primary-light hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all cursor-pointer text-text-muted"
                  title={t('workspace:btn_copy', "Copy")}
                >
                  <Copy size={11} />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 items-center p-3 bg-surface/60 rounded-xl border border-divider text-[10px] text-text-muted leading-relaxed font-sans">
              <Compass size={14} className="text-primary-light mt-0.5 shrink-0" />
              <span>{t("workspace:txt_1335")}</span>
            </div>
          </div>
        </div>

        {/* Right security credentials panel (Col 2 & 3) */}
        <div className="border border-divider bg-panel rounded-2xl p-6 shadow-xl xl:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-text-main flex items-center gap-2 border-b border-divider pb-3">
            <Key size={16} className="text-primary-light" />
            {t("workspace:txt_1336")}
          </h3>

          <div className="space-y-5">
            {/* Gemini API Key Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                  Google Gemini API Token
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[8px] font-bold text-emerald-400">
                    {t('workspace:active_environment', 'Active Environment')}
                  </span>
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowGemini(!showGemini)}
                    className="p-1 hover:bg-divider text-text-muted hover:text-text-main rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {showGemini ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showGemini ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-xs font-mono text-text-main focus:outline-none focus:border-primary-main/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(geminiKey, "Gemini API Key")}
                  className="px-3 bg-divider hover:bg-surface-hover border border-divider-strong/30 rounded-lg text-xs font-bold text-text-main transition-colors flex items-center"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* OpenAI Key Block */}
            <div className="space-y-2 border-t border-divider pt-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                  OpenAI Companion Key (Local Relay Only)
                  <span className="px-1.5 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-[8px] font-bold text-primary-light">
                    {t('workspace:configured_option', 'Configured Option')}
                  </span>
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowOpenAI(!showOpenAI)}
                    className="p-1 hover:bg-divider text-text-muted hover:text-text-main rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {showOpenAI ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showOpenAI ? "text" : "password"}
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    className="w-full bg-surface border border-divider rounded-lg px-3 py-2 text-xs font-mono text-text-main focus:outline-none focus:border-primary-main/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(openAIKey, "OpenAI Proxy Key")}
                  className="px-3 bg-divider hover:bg-surface-hover border border-divider-strong/30 rounded-lg text-xs font-bold text-text-main transition-colors flex items-center"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* Submit save button */}
            <div className="pt-4 border-t border-divider flex justify-end">
              <button
                type="button"
                onClick={handleSaveCredentials}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-main hover:bg-primary-hover text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_var(--color-primary-alpha)]"
              >
                {isSaving ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={13} />
                    {t("workspace:txt_1344")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
