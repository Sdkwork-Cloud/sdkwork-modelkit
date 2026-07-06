import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState } from "react";
import {
  Settings,
  CheckCircle2,
  Circle,
  Wrench,
  Network,
  Plus,
  Search,
  Settings2,
  User,
  Terminal,
  Sliders,
  ShieldCheck,
  Activity,
  Layers,
  BarChart3,
  Key,
  Crown,
} from "lucide-react";
import { AgentTool } from "@sdkwork/modelkit-types";
import { getProviderIcon } from "../providers/ProviderIcon";
import { LocalRelay } from "../relay/LocalRelayManager";

export type SidebarTab =
  | "tools"
  | "relay"
  | "request-logs"
  | "usage"
  | "settings"
  | "vip";

interface SidebarProps {
  tools: AgentTool[];
  loading: boolean;
  activeToolId: string;
  setActiveToolId: (id: string) => void;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  activeRelayId: string | null;
  setActiveRelayId: (id: string | null) => void;
  relays?: LocalRelay[];
  onCreateRelay?: () => void;
  onAppConfigClick?: (relay: LocalRelay) => void;
}

export function Sidebar({
  tools,
  loading,
  activeToolId,
  setActiveToolId,
  activeTab,
  setActiveTab,
  activeRelayId,
  setActiveRelayId,
  relays,
  onCreateRelay,
  onAppConfigClick,
}: SidebarProps) {
  const { t, language } = useAppContext();
  const isZh = language === "zh";
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex shrink-0 h-full overflow-hidden select-none">
      {/* 1. WeChat-Style Narrow Left Icon Rail (最左侧极窄功能图标条) */}
      <div className="w-[68px] bg-[#e7e7e7] dark:bg-[#2e2e2e] border-r border-[#dbdbdb] dark:border-[#242424] flex flex-col items-center py-5 justify-between shrink-0">
        {/* Top: Navigation Icons directly starting without branding emblem */}
        <div className="flex flex-col items-center">
          {/* Core Module Navigation Icons */}
          <div className="flex flex-col gap-3">
            {/* Tools tab (Agents Network) */}
            <button
              onClick={() => {
                setActiveTab("tools");
                // Auto active first tool if non-setting view is empty
                if (
                  tools.length > 0 &&
                  (activeToolId === "system-settings" ||
                    activeToolId === "user-profile")
                ) {
                  setActiveToolId(tools[0].id);
                }
              }}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                activeTab === "tools"
                  ? "text-primary-main bg-black/8 dark:bg-white/10 font-bold"
                  : "text-[#555555] dark:text-[#a0a0a0] hover:text-primary-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
              title={t("workspace:sidebar_tools")}
            >
              <Wrench size={18} className={activeTab === "tools" ? "scale-105" : ""} />
              <span className={`text-[10px] font-display font-bold mt-1 tracking-tight scale-90 ${activeTab === "tools" ? "text-primary-main" : "text-[#7f7f7f]"}`}>
                {t("workspace:sidebar_tools")}
              </span>
              {activeTab === "tools" && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-main rounded-r-lg" />
              )}
            </button>

            {/* Local relay tab (MCP Router & Relays) */}
            <button
              onClick={() => {
                setActiveTab("relay");
                if (relays && relays.length > 0) {
                  setActiveRelayId(relays[0].id);
                } else {
                  setActiveRelayId(null);
                }
              }}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                activeTab === "relay"
                  ? "text-primary-main bg-black/8 dark:bg-white/10 font-bold"
                  : "text-[#555555] dark:text-[#a0a0a0] hover:text-primary-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
              title={t("workspace:sidebar_relay_desc")}
            >
              <Network size={18} className={activeTab === "relay" ? "scale-105" : ""} />
              <span className={`text-[10px] font-display font-bold mt-1 tracking-tight scale-90 ${activeTab === "relay" ? "text-primary-main" : "text-[#7f7f7f]"}`}>
                {t("workspace:sidebar_relay")}
              </span>
              {activeTab === "relay" && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-main rounded-r-lg" />
              )}
            </button>

            {/* Request Logs tab (请求日志) */}
            <button
              onClick={() => {
                setActiveTab("request-logs");
                setActiveRelayId("request-logs");
              }}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                activeTab === "request-logs"
                  ? "text-primary-main bg-black/8 dark:bg-white/10 font-bold"
                  : "text-[#555555] dark:text-[#a0a0a0] hover:text-primary-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
              title={t("workspace:sidebar_logs_desc")}
            >
              <Activity size={18} className={activeTab === "request-logs" ? "scale-105" : ""} />
              <span className={`text-[10px] font-display font-bold mt-1 tracking-tight scale-90 ${activeTab === "request-logs" ? "text-primary-main" : "text-[#7f7f7f]"}`}>
                {t("workspace:sidebar_logs")}
              </span>
              {activeTab === "request-logs" && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-main rounded-r-lg" />
              )}
            </button>

            {/* Usage tab (数据统计) */}
            <button
              onClick={() => {
                setActiveTab("usage");
              }}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                activeTab === "usage"
                  ? "text-primary-main bg-black/8 dark:bg-white/10 font-bold"
                  : "text-[#555555] dark:text-[#a0a0a0] hover:text-primary-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
              title={t("workspace:sidebar_stats_desc")}
            >
              <BarChart3 size={18} className={activeTab === "usage" ? "scale-105" : ""} />
              <span className={`text-[10px] font-display font-bold mt-1 tracking-tight scale-90 ${activeTab === "usage" ? "text-primary-main" : "text-[#7f7f7f]"}`}>
                {t("workspace:sidebar_stats")}
              </span>
              {activeTab === "usage" && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-main rounded-r-lg" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom: Settings Tab Icon */}
        <div className="flex flex-col items-center gap-3">
          {/* VIP Upgrade Feature Button */}
          <button
            onClick={() => {
              setActiveTab("vip");
            }}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative group cursor-pointer ${
              activeTab === "vip"
                ? "text-amber-500 bg-black/8 dark:bg-white/10 font-bold border border-amber-500/20"
                : "text-amber-600/70 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
            }`}
            title={t("workspace:sidebar_vip_desc")}
          >
            <Crown
              size={16}
              className={`transition-transform duration-300 ${activeTab === "vip" ? "animate-pulse text-amber-500 dark:text-amber-400 scale-105" : "group-hover:scale-110"}`}
            />
            <span className={`text-[9px] font-black mt-1 tracking-wider scale-90 font-mono ${activeTab === "vip" ? "text-amber-500 dark:text-amber-400" : "text-[#7f7f7f]"}`}>
              {t("workspace:sidebar_vip")}
            </span>
            {activeTab === "vip" && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r-lg" />
            )}
          </button>

          <div className="w-[30px] h-[1px] bg-[#dbdbdb] dark:bg-[#3a3a3a]" />

          <button
            onClick={() => {
              setActiveTab("settings");
              setActiveToolId("system-settings");
            }}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all relative cursor-pointer ${
              activeTab === "settings"
                ? "text-primary-main bg-black/8 dark:bg-white/10 font-bold"
                : "text-[#555555] dark:text-[#a0a0a0] hover:text-primary-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
            }`}
            title={t("workspace:sidebar_settings_desc")}
          >
            <Settings size={18} className={activeTab === "settings" ? "scale-105" : ""} />
            <span className={`text-[10px] font-display font-bold mt-1 tracking-tight scale-90 ${activeTab === "settings" ? "text-primary-main" : "text-[#7f7f7f]"}`}>
              {t("workspace:sidebar_settings")}
            </span>
            {activeTab === "settings" && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-main rounded-r-lg" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Secondary Content List Panel (中间二级列表部分) */}
      {activeTab !== "request-logs" &&
        activeTab !== "usage" &&
        activeTab !== "vip" && (
          <div className="w-[230px] bg-canvas border-r border-divider flex flex-col h-full shrink-0">
            {/* Dynamic List Header depending on active tab status */}
            {activeTab === "tools" && (
              <div className="flex-1 flex flex-col pt-5">
                <div className="px-4 mb-3 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Layers size={11} className="text-primary-main" />
                    {t("workspace:txt_1167")}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-[9px] text-primary-light font-bold font-mono">
                    {filteredTools.length}
                  </span>
                </div>

                {/* Filter Input */}
                <div className="px-3 mb-4 shrink-0">
                  <div className="relative">
                    <Search
                      size={12}
                      className="absolute left-2.5 top-2.5 text-text-muted"
                    />
                    <input
                      type="text"
                      placeholder={t("workspace:txt_1174")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface border border-divider hover:border-[#3B82F6]/35 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-text-main placeholder-gray-500 focus:outline-none focus:border-primary-main/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* List scrollbox */}
                <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
                  {loading ? (
                    <div className="text-xs text-text-muted px-3 py-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-hover animate-ping" />
                      {t("workspace:txt_1168")}
                    </div>
                  ) : filteredTools.length === 0 ? (
                    <div className="text-center py-8 text-xs text-text-muted">
                      {t("workspace:txt_1169")}
                    </div>
                  ) : (
                    filteredTools.map((tool) => (
                      <NavItem
                        key={tool.id}
                        icon={getProviderIcon(
                          tool.name,
                          "w-3.5 h-3.5",
                          tool.icon,
                        )}
                        label={tool.name}
                        status={tool.status}
                        active={activeToolId === tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "relay" && (
              <div className="flex-1 flex flex-col pt-5">
                <div className="px-4 mb-3 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal size={11} className="text-primary-main" />
                    {t("workspace:sidebar_relay_list")}
                  </span>
                  <button
                    onClick={onCreateRelay}
                    className="w-5 h-5 rounded-lg bg-primary-main/10 hover:bg-primary-main text-primary-light hover:text-text-main flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                    title={t("workspace:sidebar_relay_new")}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-4 custom-scrollbar">
                  {/* Category 1: Router List */}
                  <div className="space-y-1">
                    <div className="px-2 mb-1.5 text-[9px] text-text-muted font-extrabold uppercase tracking-wider">
                      {t("workspace:txt_1170")}
                    </div>
                    {relays?.map((relay) => (
                      <NavItem
                        key={relay.id}
                        icon={<Network size={12} />}
                        label={relay.name}
                        status={relay.status}
                        active={activeRelayId === relay.id}
                        onClick={() => setActiveRelayId(relay.id)}
                        rightAction={
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppConfigClick?.(relay);
                            }}
                            className="p-1 px-1.5 rounded bg-primary-main/10 hover:bg-primary-main text-primary-light hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                            title={t("workspace:app_config", "App Config")}
                          >
                            <Sliders size={11} />
                            <span>{t("workspace:app_config", "App Config")}</span>
                          </button>
                        }
                      />
                    ))}
                    {!relays?.length && (
                      <div className="text-center py-6 text-xs text-text-muted">
                        {t("workspace:txt_1171")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="flex-1 flex flex-col pt-5">
                <div className="px-4 mb-3 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders size={11} className="text-primary-light" />
                    {t("workspace:txt_1173")}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
                  <NavItem
                    icon={<Settings2 size={13} />}
                    label={t("workspace:sidebar_settings_system")}
                    active={activeToolId === "system-settings"}
                    onClick={() => setActiveToolId("system-settings")}
                  />
                  <NavItem
                    icon={<User size={13} />}
                    label={t("workspace:sidebar_settings_profile")}
                    active={activeToolId === "user-profile"}
                    onClick={() => setActiveToolId("user-profile")}
                  />
                </div>

                {/* Mini active diagnostics tag at bottom list */}
                <div className="p-3.5 m-3 bg-panel border border-divider rounded-xl font-mono text-[9px] text-text-muted flex flex-col gap-1.5 shrink-0">
                  <div className="flex justify-between">
                    <span>{t("workspace:sidebar_core_daemon")}</span>
                    <span className="text-emerald-500 font-bold">
                      {t("workspace:sidebar_active")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("workspace:sidebar_ipc_channel")}</span>
                    <span className="text-primary-main">PORT 3000</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  status?: string;
  active?: boolean;
  onClick: () => void;
  rightAction?: React.ReactNode;
}> = ({ icon, label, status, active = false, onClick, rightAction }) => {
  const isInstalled = status === "installed" || status === "running";
  const { t } = useAppContext();
  return (
    <div
      onClick={onClick}
      className={`p-2 py-2.5 flex items-center gap-2.5 cursor-pointer rounded-xl transition-all ${
        active
          ? "bg-primary-main/10 border border-primary-main/20 shadow-sm"
          : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-inner shrink-0 transition-all ${
          active
            ? "bg-primary-main/20 text-primary-main border border-primary-main/30 shadow-sm"
            : "bg-panel text-text-muted border border-divider"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className={`text-xs font-display font-bold truncate transition-colors ${active ? "text-primary-main font-extrabold" : "text-text-muted"}`}
        >
          {label}
        </div>
        {status !== undefined && (
          <div className="flex items-center gap-1 mt-0.5">
            {isInstalled ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-emerald-500 font-bold font-mono tracking-wider">
                  {t("workspace:status_installed", "Installed")}
                </span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <span className="text-[8px] text-text-muted font-bold font-mono tracking-wider">
                  {t("workspace:status_setup_required", "Setup Required")}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {rightAction && (
        <div className="shrink-0 flex items-center justify-center ml-1">
          {rightAction}
        </div>
      )}
      {active && (
        <div className="w-1.5 h-4.5 rounded-full bg-primary-main shrink-0 ml-1"></div>
      )}
    </div>
  );
};
