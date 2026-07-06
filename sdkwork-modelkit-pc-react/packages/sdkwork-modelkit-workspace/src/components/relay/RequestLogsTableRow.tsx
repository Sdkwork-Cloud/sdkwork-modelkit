import React from "react";
import { ChevronDown, ChevronRight, Cpu, Terminal } from "lucide-react";
import { getProviderBadgeStyle, getModelBadgeStyle } from "./RequestLogsData";

export interface RequestLogsTableRowProps {
  log: any;
  isExpanded: boolean;
  toggleRowExpand: (id: string) => void;
  setSelectedLogId: (id: string) => void;
  t: (key: string, fallback?: string) => string;
  getLogPricingInfo: (log: any) => any;
}

export function RequestLogsTableRow({
  log,
  isExpanded,
  toggleRowExpand,
  setSelectedLogId,
  t,
  getLogPricingInfo,
}: RequestLogsTableRowProps) {
  const is200 = log.status === 200;
  const isSlow = log.duration > 400;
  const priceInfo = getLogPricingInfo(log);

  return (
    <React.Fragment key={log.id}>
      <tr
        onClick={() => toggleRowExpand(log.id)}
        className={`group hover:bg-surface/80 transition-colors cursor-pointer font-sans text-text-muted border-b border-divider/50 last:border-b-0 ${
          isExpanded ? "bg-surface/80 shadow-sm" : ""
        }`}
      >
        {/* Time with collapse/expand arrow */}
        <td className="py-3.5 px-5 font-mono text-[12px] text-text-main font-medium select-none">
          <span className="flex items-center gap-2">
            <span className="text-text-muted/50 group-hover:text-primary-main transition-colors">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            {log.time}
          </span>
        </td>
        {/* ID */}
        <td className="py-3.5 px-5 font-mono text-[11px] text-text-muted/80 select-text">
          {log.id}
        </td>
        {/* Tool Name */}
        <td className="py-3.5 px-5 font-medium text-text-main">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-divider shadow-sm text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-main/80" />
            <span
              className="truncate max-w-[140px] block font-semibold text-text-main"
              title={log.tool}
            >
              {log.tool}
            </span>
          </div>
        </td>
        {/* Provider */}
        <td className="py-3.5 px-5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold border text-[11px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px] shadow-sm ${getProviderBadgeStyle(
              log.provider
            )}`}
            title={log.provider || t("workspace:unknown_provider", "Unknown Provider")}
          >
            {log.provider || t("workspace:unknown_provider", "Unknown Provider")}
          </span>
        </td>
        {/* Model */}
        <td className="py-3.5 px-5 font-mono">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold border text-[11px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px] shadow-sm ${getModelBadgeStyle(
              log.model
            )}`}
            title={log.model || t("workspace:unknown_model", "Unknown Model")}
          >
            <Cpu size={12} className="shrink-0 opacity-80" />
            {log.model || t("workspace:unknown_model", "Unknown Model")}
          </span>
        </td>
        {/* Method & Path */}
        <td className="py-3.5 px-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black tracking-widest shadow-sm ${
                log.method === "POST"
                  ? "bg-blue-50 dark:bg-primary-main/10 text-primary-main dark:text-primary-light border border-blue-200 dark:border-primary-main/30"
                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
              }`}
            >
              {log.method}
            </span>
            <span
              className="font-mono text-[12px] font-medium text-text-main truncate max-w-[200px]"
              title={log.path}
            >
              {log.path}
            </span>
          </div>
        </td>
        {/* Relay node name */}
        <td
          className="py-3.5 px-5 text-text-muted/90 truncate max-w-[150px] font-medium font-mono text-[12px]"
          title={log.relay}
        >
          {log.relay}
        </td>
        {/* Latency */}
        <td
          className={`py-3.5 px-5 font-mono text-[12px] font-bold ${
            isSlow
              ? "text-amber-600"
              : log.duration < 150
              ? "text-emerald-600"
              : "text-primary-main"
          }`}
        >
          {log.duration}ms
        </td>
        {/* Package Size */}
        <td className="py-3.5 px-5 font-mono text-[12px] text-text-muted font-medium select-none">
          {log.size}
        </td>
        {/* Cost */}
        <td className="py-3.5 px-5 font-mono text-text-main font-semibold text-[12px]">
          <span className="text-amber-500 mr-0.5 font-sans">⚡️</span>{" "}
          {priceInfo.totalCost}
        </td>
        {/* Status code badge */}
        <td className="py-3.5 px-5 select-none">
          <span
            className={`inline-flex items-center gap-1.5 font-bold text-[12px] px-2 py-0.5 rounded-md border shadow-sm ${
              is200
                ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-500/20"
                : "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-500/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                is200
                  ? "bg-emerald-500 shadow-[0_0_4px_#10b981]"
                  : "bg-red-500 shadow-[0_0_4px_#ef4444]"
              }`}
            />
            {log.status === 200 && <span className="mr-0.5">OK</span>}
            <span>{log.status}</span>
          </span>
        </td>
        {/* Action Operations Column */}
        <td className="py-3.5 px-5 text-right select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLogId(log.id);
            }}
            className="p-1.5 text-primary-main justify-center hover:bg-surface-hover rounded-md transition-all cursor-pointer inline-flex shrink-0 border border-transparent hover:border-divider shadow-sm bg-panel opacity-0 group-hover:opacity-100"
            title="View Details"
          >
            <Terminal size={14} />
          </button>
        </td>
      </tr>

      {/* Inline Row Expansion Details Card */}
      {isExpanded && (
        <tr className="bg-[#fcfdfd] dark:bg-[#111112] shadow-[inset_0_4px_6px_-4px_rgba(0,0,0,0.05),inset_0_-4px_6px_-4px_rgba(0,0,0,0.05)] border-b border-divider">
          <td colSpan={12} className="py-8 px-10 select-text">
            <div className="grid grid-cols-[140px_1fr] gap-x-8 gap-y-4 text-xs font-sans text-text-muted max-w-7xl">
              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] flex items-center">
                {t("workspace:logs_req_id", "Request ID")}
              </div>
              <div className="font-mono text-text-muted font-medium break-all select-all selection:bg-blue-100">
                {priceInfo.requestId}
              </div>

              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] flex items-center">
                {t("workspace:logs_cache_tokens", "Cache Tokens")}
              </div>
              <div className="font-mono text-text-muted font-bold text-sm">
                {priceInfo.cacheTokens.toLocaleString()}
              </div>

              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] self-start pt-1">
                {t("workspace:logs_details", "Log Details")}
              </div>
              <div className="text-text-muted leading-relaxed">
                {t("workspace:logs_input_price", "Input price")}{" "}
                <span className="text-text-muted font-medium">
                  ⚡️ {priceInfo.pin.toFixed(6)}
                </span>{" "}
                / {t("workspace:logs_1m_tokens", "1M tokens")},{" "}
                {t("workspace:logs_output_price", "Output price")}{" "}
                <span className="text-text-muted font-medium">
                  ⚡️ {priceInfo.pout.toFixed(6)}
                </span>{" "}
                / {t("workspace:logs_1m_tokens", "1M tokens")},{" "}
                {t("workspace:logs_cache_read_price", "Cache read price")}{" "}
                <span className="text-text-muted font-medium">
                  ⚡️ {priceInfo.pcache.toFixed(6)}
                </span>{" "}
                / {t("workspace:logs_1m_tokens", "1M tokens")},{" "}
                {t("workspace:logs_group_multiplier", "Group Multiplier")}{" "}
                {priceInfo.multiplier}x
              </div>

              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] self-start pt-1.5">
                {t("workspace:logs_billing_formula", "Billing Formula")}
              </div>
              <div className="space-y-4 text-text-muted w-full pr-4">
                <div className="space-y-1">
                  <div>
                    {t("workspace:logs_input_price", "Input price")}:{" "}
                    <span className="text-text-muted font-medium">
                      ⚡️ {priceInfo.pin.toFixed(6)}
                    </span>{" "}
                    / {t("workspace:logs_1m_tokens", "1M tokens")}
                  </div>
                  <div>
                    {t("workspace:logs_output_price", "Output price")}:{" "}
                    <span className="text-text-muted font-medium">
                      ⚡️ {priceInfo.pout.toFixed(6)}
                    </span>{" "}
                    / {t("workspace:logs_1m_tokens", "1M tokens")}
                  </div>
                  <div>
                    {t("workspace:logs_cache_read_price", "Cache read price")}:{" "}
                    <span className="text-text-muted font-medium">
                      ⚡️ {priceInfo.pcache.toFixed(6)}
                    </span>{" "}
                    / {t("workspace:logs_1m_tokens", "1M tokens")}
                  </div>
                </div>
                <div className="font-mono text-[11px] text-text-muted bg-panel border border-divider shadow-sm p-4 rounded-lg leading-relaxed">
                  ({t("workspace:logs_input", "Input")} {priceInfo.inputTokens}{" "}
                  {t("workspace:logs_tokens", "tokens")} / 1M{" "}
                  {t("workspace:logs_tokens_en", "tokens")} *{" "}
                  <span className="text-text-muted font-medium">
                    ⚡️ {priceInfo.pin.toFixed(6)}
                  </span>{" "}
                  + {t("workspace:logs_cache", "Cache")} {priceInfo.cacheTokens}{" "}
                  {t("workspace:logs_tokens", "tokens")} / 1M{" "}
                  {t("workspace:logs_tokens_en", "tokens")} *{" "}
                  <span className="text-text-muted font-medium">
                    ⚡️ {priceInfo.pcache.toFixed(6)}
                  </span>{" "}
                  + {t("workspace:logs_output", "Output")} {priceInfo.outputTokens}{" "}
                  {t("workspace:logs_tokens", "tokens")} / 1M{" "}
                  {t("workspace:logs_tokens_en", "tokens")} *{" "}
                  <span className="text-text-muted font-medium">
                    ⚡️ {priceInfo.pout.toFixed(6)}
                  </span>
                  ) * {t("workspace:logs_multiplier", "Multiplier")}{" "}
                  {priceInfo.multiplier} ={" "}
                  <span className="text-primary-main font-bold text-[13px]">
                    ⚡️ {priceInfo.totalCost}
                  </span>
                </div>
                <div className="text-[10px] text-text-muted font-medium font-sans">
                  {t(
                    "workspace:logs_ref_only",
                    "For reference only, refer to the actual billing"
                  )}
                </div>
              </div>

              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] flex items-center">
                {t("workspace:logs_reasoning_effort", "Reasoning Effort")}
              </div>
              <div className="font-mono text-primary-main font-bold text-[11px] uppercase">
                {priceInfo.reasoningEffort}
              </div>

              <div className="text-text-muted font-bold uppercase tracking-widest text-[10px] flex items-center">
                {t("workspace:logs_request_path", "Request Path")}
              </div>
              <div className="font-mono text-text-muted font-medium">
                {log.path}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}
