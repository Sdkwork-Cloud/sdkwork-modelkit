import { useAppContext } from "@sdkwork/modelkit-core";
import React from "react";
import { Filter, Download, Network, Flame } from "lucide-react";

interface UsageFiltersProps {
  timeRange: "today" | "yesterday" | "7days" | "30days";
  setTimeRange: (range: "today" | "yesterday" | "7days" | "30days") => void;
  selectedGateway: string;
  setSelectedGateway: (gateway: string) => void;
  uniqueGateways: string[];
  onExport: () => void;
}

export function UsageFilters({
  timeRange,
  setTimeRange,
  selectedGateway,
  setSelectedGateway,
  uniqueGateways,
  onExport,
}: UsageFiltersProps) {
  const { t } = useAppContext();
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl border border-divider bg-panel">
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-text-muted shrink-0" />
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2">
          {t("workspace:usage_analysis_interval", "Analysis interval")}
        </span>
        <div className="flex p-0.5 bg-canvas border border-divider rounded-lg">
          {[
            { id: "today", label: t("workspace:time_today", "Today") },
            { id: "yesterday", label: t("workspace:time_yesterday", "Yesterday") },
            { id: "7days", label: t("workspace:time_7days", "Last 7 Days") },
            { id: "30days", label: t("workspace:time_30days", "Last 30 Days") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                timeRange === item.id
                  ? "bg-primary-main text-white shadow-md"
                  : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-divider hover:bg-surface-hover text-xs font-semibold text-text-main hover:text-text-main transition-all cursor-pointer"
        >
          <Download size={13} />
          <span>{t("workspace:txt_1300")}</span>
        </button>

        <div className="relative">
          <Network
            size={12}
            className="absolute left-2.5 top-3 text-text-muted"
          />
          <select
            value={selectedGateway}
            onChange={(e) => setSelectedGateway(e.target.value)}
            className="bg-canvas hover:bg-panel border border-divider rounded-lg pl-8 pr-8 py-2 text-xs font-semibold text-text-main outline-none cursor-pointer focus:border-primary-main transition-colors appearance-none"
          >
            <option value="all">{t("workspace:txt_1301")}</option>
            {uniqueGateways.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-3.5 pointer-events-none border-l border-t border-gray-500 w-1.5 h-1.5 rotate-135"></div>
        </div>

        <div className="flex items-center gap-2 bg-primary-main/10 border border-primary-main/15 rounded-lg px-3 py-2">
          <Flame size={12} className="text-yellow-500 animate-pulse" />
          <div className="text-[10px] font-bold text-blue-300">
            {t("workspace:txt_1302")}{" "}
            <span className="text-text-main font-mono">2.41</span>
          </div>
        </div>
      </div>
    </div>
  );
}
