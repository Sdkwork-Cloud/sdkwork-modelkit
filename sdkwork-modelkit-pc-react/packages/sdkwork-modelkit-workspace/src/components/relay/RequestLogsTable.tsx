import React, { useState } from "react";
import { RequestLog } from "../../services/types";
import {
  getProviderBadgeStyle,
  getModelBadgeStyle,
  getLogPricingInfo,
} from "./RequestLogsData";
import { RequestLogsTableRow } from "./RequestLogsTableRow";
import {
  ArrowUpDown,
  Layers,
  Activity,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Cpu,
  Terminal,
} from "lucide-react";
import { useAppContext } from "@sdkwork/modelkit-core";

export interface RequestLogsTableProps {
  filteredLogs: RequestLog[];
  expandedRowIds: string[];
  toggleRowExpand: (id: string) => void;
  toggleSort: (field: "time" | "duration" | "size") => void;
  setSelectedLogId: (id: string) => void;
}

export function RequestLogsTable({
  filteredLogs,
  expandedRowIds,
  toggleRowExpand,
  toggleSort,
  setSelectedLogId,
}: RequestLogsTableProps) {
  const { t } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));

  // Reset pagination when filtered results change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredLogs]);

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex-1 overflow-auto min-h-0 flex flex-col p-4 sm:p-6 bg-surface">
      <div className="flex-1 bg-panel border gap-4 border-divider rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse text-[13px]">
            {/* Fixed visual Table Header */}
            <thead className="bg-[#f9fafb] dark:bg-[#151516] text-text-muted font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-divider select-none">
              <tr>
                <th className="py-4 px-5 w-[140px] font-sans font-bold">
                  <button
                    onClick={() => toggleSort("time")}
                    className="flex items-center gap-1.5 hover:text-text-main transition-colors"
                  >
                    {t("workspace:logs_time", "Time")}
                    <ArrowUpDown size={12} className="text-text-muted/60" />
                  </button>
                </th>
                <th className="py-4 px-5 w-[140px] font-sans font-bold">
                  {t("workspace:logs_request_id", "Request ID")}
                </th>
                <th className="py-4 px-5 w-[180px] font-sans font-bold">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Layers size={13} className="text-text-muted/60" />
                    {t("workspace:logs_invoker_tool", "Invoker Tool")}
                  </span>
                </th>
                <th className="py-4 px-5 w-[140px] font-sans font-bold">
                  {t("workspace:logs_provider", "Provider")}
                </th>
                <th className="py-4 px-5 w-[140px] font-sans font-bold">
                  {t("workspace:logs_model", "Model")}
                </th>
                <th className="py-4 px-5 min-w-[200px] font-sans font-bold">
                  {t("workspace:logs_target", "Target (Method & Path)")}
                </th>
                <th className="py-4 px-5 w-[170px] font-sans font-bold">
                  {t("workspace:logs_local_relay", "Local Relay Router")}
                </th>
                <th className="py-4 px-5 w-[120px] font-sans font-bold">
                  <button
                    onClick={() => toggleSort("duration")}
                    className="flex items-center gap-1.5 hover:text-text-main transition-colors"
                  >
                    {t("workspace:logs_duration", "Duration")}
                    <ArrowUpDown size={12} className="text-text-muted/60" />
                  </button>
                </th>
                <th className="py-4 px-5 w-[120px] font-sans font-bold">
                  <button
                    onClick={() => toggleSort("size")}
                    className="flex items-center gap-1.5 hover:text-text-main whitespace-nowrap transition-colors"
                  >
                    {t("workspace:logs_size", "Size")}
                    <ArrowUpDown size={12} className="text-text-muted/60" />
                  </button>
                </th>
                <th className="py-4 px-5 w-[120px] font-sans font-bold whitespace-nowrap">
                  {t("workspace:logs_cost", "Cost")}
                </th>
                <th className="py-4 px-5 w-[100px] font-sans font-bold">
                  {t("workspace:logs_status", "Status")}
                </th>
                <th className="py-4 px-5 w-[100px] text-right font-sans font-bold">
                  {t("workspace:logs_actions", "Actions")}
                </th>
              </tr>
            </thead>

            {/* Table Records Body */}
            <tbody className="divide-y divide-divider bg-panel">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-32 text-center bg-surface/50">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-panel border-2 border-divider shadow-sm flex items-center justify-center">
                        <Activity
                          size={28}
                          className="text-text-muted opacity-60"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-text-main font-bold text-sm">
                          {t(
                            "workspace:logs_no_gateway_comm",
                            "No Gateway Communication Logs",
                          )}
                        </p>
                        <p className="text-xs text-text-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
                          {t(
                            "workspace:logs_no_gateway_desc",
                            "No intercepted communication from tools yet. Click 'Simulate Payload' to run a local test.",
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => {
                  const isExpanded = expandedRowIds.includes(log.id);
                  return (
                    <RequestLogsTableRow
                      key={log.id}
                      log={log}
                      isExpanded={isExpanded}
                      toggleRowExpand={toggleRowExpand}
                      setSelectedLogId={setSelectedLogId}
                      t={t}
                      getLogPricingInfo={getLogPricingInfo}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bottom Bar */}
        {filteredLogs.length > 0 && (
          <div className="shrink-0 border-t border-divider bg-[#f9fafb] dark:bg-[#151516] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-muted gap-4 relative z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <span>
                {t("workspace:logs_total", "Total")}{" "}
                <span className="font-bold text-text-main">
                  {filteredLogs.length}
                </span>{" "}
                {t("workspace:logs_entries", "entries")}
              </span>
            </div>

            <div className="flex items-center gap-3 self-center sm:self-auto">
              <span className="flex items-center gap-2">
                <span className="hidden md:inline">
                  {t("workspace:logs_items_per_page", "Items per page")}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-panel border border-divider hover:border-primary-main/50 focus:border-primary-main rounded-md px-2 py-1 outline-none text-text-main font-mono text-[12px] transition-colors cursor-pointer shadow-sm"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </span>
              <div className="w-px h-4 bg-divider hidden sm:block"></div>

              <div className="flex items-center gap-1.5 border border-divider rounded-lg p-1 bg-panel shadow-sm">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="px-3 font-mono font-semibold text-text-main text-[12px]">
                  {currentPage} <span className="text-text-muted/50 font-normal">/</span> {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 rounded text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded text-text-muted hover:bg-surface-hover hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
