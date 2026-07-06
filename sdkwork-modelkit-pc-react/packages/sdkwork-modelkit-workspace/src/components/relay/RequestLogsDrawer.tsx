import { useAppContext } from "@sdkwork/modelkit-core";
import React from "react";
import {
  Terminal,
  CheckCircle2,
  X,
  FileJson,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { RequestLog } from "../../services/types";
import { getProviderBadgeStyle, getModelBadgeStyle } from "./RequestLogsData";

interface RequestLogsDrawerProps {
  log: RequestLog | undefined;
  onClose: () => void;
}

export function RequestLogsDrawer({ log, onClose }: RequestLogsDrawerProps) {
  const { t } = useAppContext();
  if (!log) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-panel border-l border-divider shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="px-6 py-5 border-b border-divider bg-[#f9fafb] dark:bg-[#151516] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-surface border border-divider shadow-sm text-text-muted shrink-0">
            <FileJson size={18} />
          </div>
          <div>
            <h3 className="text-[11px] text-text-muted font-bold font-mono tracking-widest uppercase mb-1">
              {t("workspace:txt_1279", "Gateway Diagnostic Payload")}
            </h3>
            <p className="text-sm font-semibold text-text-main font-mono flex items-center gap-2 truncate max-w-[360px] lg:max-w-[460px]">
              <span className="bg-surface border border-divider px-2 py-0.5 rounded textxs shadow-sm">{log.tool}</span>
              <ArrowRight size={14} className="text-text-muted/60" />{" "}
              <span>{log.path}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-text-main hover:bg-divider rounded-lg transition-all cursor-pointer flex-shrink-0"
          title={t("workspace:txt_1280", "Close Panel")}
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar bg-surface">
        {/* Quick Metadata Grid Card */}
        <div className="p-1 rounded-xl bg-panel border border-divider shadow-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-[13px] bg-surface rounded-lg p-5">
            <div>
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-1">
                {t("workspace:txt_1281", "Timestamp")}
              </span>
              <strong className="text-text-main font-semibold">{log.time}</strong>
            </div>
            <div>
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-1">
                {t("workspace:txt_1282", "Trace ID")}
              </span>
              <strong className="text-text-muted text-[11px] font-medium selection:bg-blue-100 dark:selection:bg-blue-900 truncate block">
                {log.id}
              </strong>
            </div>

            <div className="pt-4 border-t border-divider/50">
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-2">
                {t("workspace:txt_1283", "Provider Route")}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-bold shadow-sm border text-[11px] whitespace-nowrap ${getProviderBadgeStyle(log.provider)}`}
              >
                {log.provider || t("workspace:unspecified_provider", "Unspecified upstream provider")}
              </span>
            </div>
            <div className="pt-4 border-t border-divider/50">
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-2">
                {t("workspace:txt_1285", "Target Model")}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-bold shadow-sm border text-[11px] whitespace-nowrap ${getModelBadgeStyle(log.model)}`}
              >
                <Cpu size={12} className="opacity-80" />
                {log.model || t("workspace:unspecified_model", "No target model specified")}
              </span>
            </div>

            <div className="pt-4 border-t border-divider/50">
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-1">
                {t("workspace:txt_1287", "Round-Trip Latency")}
              </span>
              <strong className="text-primary-main font-bold">{log.duration}ms</strong>
            </div>
            <div className="pt-4 border-t border-divider/50">
              <span className="text-[11px] text-text-muted/80 font-bold uppercase tracking-wider block mb-1">
                {t("workspace:txt_1288", "Client Context IP")}
              </span>
              <strong className="text-text-muted font-medium">{log.ip}</strong>
            </div>
          </div>
        </div>

        {/* Request Payload Card */}
        <div className="space-y-3.5">
          <h4 className="text-[12px] font-bold text-text-muted flex items-center justify-between px-1">
            <span className="flex items-center gap-2 uppercase tracking-widest text-[#f59e0b] dark:text-[#fbbf24]">
              <Terminal size={15} />
              {t("workspace:txt_1289", "Request Payload")}
            </span>
            <span className="text-[11px] text-text-muted/60 font-mono font-medium tracking-wide">
              Content-Type: JSON
            </span>
          </h4>
          <div className="relative group">
            <pre className="p-5 rounded-xl bg-[#1e1e1e] dark:bg-[#0d0d0e] border border-divider shadow-inner overflow-x-auto font-mono text-[12px] text-[#d4d4d4] dark:text-[#a1a1aa] leading-relaxed max-h-[250px] custom-scrollbar focus:outline-none">
              {log.payload}
            </pre>
          </div>
        </div>

        {/* Response Payload Card */}
        <div className="space-y-3.5">
          <h4 className="text-[12px] font-bold text-text-muted flex items-center justify-between px-1">
            <span className={`flex items-center gap-2 uppercase tracking-widest ${log.status === 200 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              <CheckCircle2 size={15} />
              {t("workspace:request_logs_response_payload", "Response Payload")}
            </span>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border shadow-sm ${
                log.status === 200
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"
              }`}
            >
              HTTP {log.status}
            </span>
          </h4>
          <div className="relative">
            <pre className="p-5 rounded-xl bg-[#1e1e1e] dark:bg-[#0d0d0e] border border-divider shadow-inner overflow-x-auto font-mono text-[12px] text-[#d4d4d4] dark:text-[#a1a1aa] leading-relaxed max-h-[300px] custom-scrollbar focus:outline-none">
              {log.response}
            </pre>
          </div>
        </div>

        {/* Static secure diagnostic note */}
        <div className="border border-blue-200 dark:border-primary-main/30 bg-blue-50/80 dark:bg-primary-main/10 rounded-xl p-5 flex items-start gap-3.5 shadow-sm">
          <ShieldAlert size={18} className="text-primary-main shrink-0 mt-0.5" />
          <div className="text-[12px] text-text-muted leading-relaxed">
            <span className="font-bold text-text-main block mb-1">
              {t("workspace:request_logs_diagnostics_title", "Request diagnostics")}
            </span>
            {t("workspace:txt_1033")}
          </div>
        </div>
      </div>
    </div>
  );
}
