import React, { useState, useMemo } from "react";
import { Search, Table, LayoutGrid, Cpu, ArrowUpDown } from "lucide-react";
import type { EndpointStat } from "./types";

interface UsageEndpointsListProps {
  selectedGateway: string;
  endpointStats: EndpointStat[];
}

export function UsageEndpointsList({
  selectedGateway,
  endpointStats,
}: UsageEndpointsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tableLayoutMode, setTableLayoutMode] = useState<"table" | "cards">(
    "table",
  );
  const [sortField, setSortField] = useState<
    "requests" | "tokens" | "latency" | "successRate"
  >("requests");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (
    field: "requests" | "tokens" | "latency" | "successRate",
  ) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Filtered and sorted list of statistics
  const filteredStats = useMemo(() => {
    return endpointStats.filter((stat) => {
      const matchesSearch =
        stat.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGateway =
        selectedGateway === "all" || stat.gateway === selectedGateway;
      return matchesSearch && matchesGateway;
    }).sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortField === "requests") {
        valA = a.requests;
        valB = b.requests;
      } else if (sortField === "tokens") {
        valA = a.tokensIn + a.tokensOut;
        valB = b.tokensIn + b.tokensOut;
      } else if (sortField === "latency") {
        valA = a.latency;
        valB = b.latency;
      } else if (sortField === "successRate") {
        valA = a.successRate;
        valB = b.successRate;
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [searchQuery, selectedGateway, sortField, sortOrder, endpointStats]);

  return (
    <div className="border border-divider bg-panel rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface">
        <div>
          <h3 className="text-sm font-bold text-text-main tracking-tight">
            Endpoint & Routing Node Statistics
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Detailed list of paths and traffic consumption across local relay
            nodes and routing gateways
          </p>
        </div>

        {/* Filter and search utilities inside the toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Display mode switcher */}
          <div className="flex p-0.5 bg-canvas border border-surface-hover rounded-lg">
            <button
              onClick={() => setTableLayoutMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                tableLayoutMode === "table"
                  ? "bg-primary-main text-white shadow-md font-bold"
                  : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              title="Table View"
            >
              <Table size={12} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setTableLayoutMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                tableLayoutMode === "cards"
                  ? "bg-primary-main text-white shadow-md font-bold"
                  : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              title="Card View"
            >
              <LayoutGrid size={12} />
              <span>Cards</span>
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search
              size={13}
              className="absolute left-2.5 top-2.5 text-text-muted"
            />
            <input
              type="text"
              placeholder="Filter endpoints or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-divider hover:border-divider-strong rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-main placeholder-gray-500 focus:outline-none focus:border-primary-main/50 transition-colors font-sans"
            />
          </div>
        </div>
      </div>

      {tableLayoutMode === "table" ? (
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-divider text-text-muted text-[10px] font-extrabold uppercase tracking-widest bg-canvas">
                <th className="py-3 px-5">Endpoint / Model</th>
                <th className="py-3 px-5">Local Router</th>
                <th
                  className="py-3 px-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => handleSort("requests")}
                >
                  <div className="flex items-center gap-1">
                    <span>Requests</span>
                    <ArrowUpDown
                      size={11}
                      className={
                        sortField === "requests"
                          ? "text-primary-main"
                          : "text-text-muted"
                      }
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => handleSort("tokens")}
                >
                  <div className="flex items-center gap-1">
                    <span>Tokens</span>
                    <ArrowUpDown
                      size={11}
                      className={
                        sortField === "tokens"
                          ? "text-primary-main"
                          : "text-text-muted"
                      }
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => handleSort("latency")}
                >
                  <div className="flex items-center gap-1">
                    <span>Latency</span>
                    <ArrowUpDown
                      size={11}
                      className={
                        sortField === "latency"
                          ? "text-primary-main"
                          : "text-text-muted"
                      }
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => handleSort("successRate")}
                >
                  <div className="flex items-center gap-1">
                    <span>Success Rate</span>
                    <ArrowUpDown
                      size={11}
                      className={
                        sortField === "successRate"
                          ? "text-primary-main"
                          : "text-text-muted"
                      }
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16181E] text-xs font-semibold">
              {filteredStats.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-text-muted font-sans"
                  >
                    No matching usage logs. Try adjusting filters or starting a
                    new test.
                  </td>
                </tr>
              ) : (
                filteredStats.map((stat, i) => {
                  const totalTokensRow = stat.tokensIn + stat.tokensOut;
                  return (
                    <tr
                      key={i}
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-panel border border-divider flex items-center justify-center text-primary-main shrink-0 font-extrabold text-[10px]">
                            API
                          </div>
                          <div>
                            <div className="text-text-main font-mono font-bold hover:text-primary-light cursor-pointer">
                              {stat.endpoint}
                            </div>
                            <div className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
                              <Cpu size={10} className="text-text-muted" />
                              <span>{stat.model}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-text-main font-medium">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-main/10 border border-[var(--color-primary-alpha)] text-[10px] text-primary-light font-bold font-mono">
                          {stat.gateway}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-text-main text-sm font-bold">
                        {stat.requests.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <span className="text-text-main font-mono font-bold text-sm">
                            {totalTokensRow >= 1000000
                              ? `${(totalTokensRow / 1000000).toFixed(2)}M`
                              : totalTokensRow.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2 text-[9px] text-text-muted">
                            <span className="truncate">
                              In: {(stat.tokensIn / 1000).toFixed(1)}k
                            </span>
                            <span className="text-primary-main">|</span>
                            <span className="truncate">
                              Out: {(stat.tokensOut / 1000).toFixed(1)}k
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-text-main">
                        <div className="flex items-center gap-2">
                          <span>{stat.latency}ms</span>
                          <div className="w-12 h-1 bg-divider rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                stat.latency > 300
                                  ? "bg-amber-500"
                                  : stat.latency > 150
                                    ? "bg-primary-hover"
                                    : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (stat.latency / 450) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              stat.successRate >= 99
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : stat.successRate >= 95
                                  ? "bg-primary-main/10 text-primary-light border border-[var(--color-primary-alpha)]"
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}
                          >
                            {stat.successRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-panel">
          {filteredStats.length === 0 ? (
            <div className="col-span-full py-12 text-center text-text-muted font-sans">
              No matching usage logs. Try adjusting filters or starting a new
              test.
            </div>
          ) : (
            filteredStats.map((stat, i) => {
              const totalTokensRow = stat.tokensIn + stat.tokensOut;
              return (
                <div
                  key={i}
                  className="p-5 border border-divider hover:border-[var(--color-primary-alpha)] bg-panel/80 rounded-2xl flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)] transition-all group cursor-pointer"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-primary-main/10 text-primary-light border border-primary-main/15 text-[9px] font-extrabold uppercase font-mono shadow-sm">
                        GET
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-main/10 border border-primary-main/15 text-[10px] text-primary-light font-bold font-mono truncate max-w-[150px]">
                        {stat.gateway}
                      </span>
                    </div>

                    {/* Endpoint Pattern */}
                    <div className="text-text-main hover:text-primary-light text-sm font-bold font-mono mt-3 break-all cursor-pointer truncate">
                      {stat.endpoint}
                    </div>

                    {/* Model Configuration */}
                    <div className="text-[10px] text-text-muted flex items-center gap-1 mt-1 border-b border-divider pb-3">
                      <Cpu
                        size={10}
                        className="text-text-muted animate-pulse"
                      />
                      <span>Engine: {stat.model}</span>
                    </div>
                  </div>

                  {/* Detail Metrics Matrix */}
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-3.5">
                    {/* Box 1: Requests Count */}
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">
                        Total Requests
                      </span>
                      <span className="block text-text-main font-mono text-sm font-black">
                        {stat.requests.toLocaleString()}
                      </span>
                    </div>

                    {/* Box 2: Total Tokens */}
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">
                        Throughput Tokens
                      </span>
                      <span className="block text-text-main font-mono text-sm font-black">
                        {totalTokensRow >= 1000000
                          ? `${(totalTokensRow / 1000000).toFixed(2)}M`
                          : totalTokensRow.toLocaleString()}
                      </span>
                      <span className="block text-[8.5px] text-text-muted font-mono">
                        In: {(stat.tokensIn / 1000).toFixed(1)}k / Out:{" "}
                        {(stat.tokensOut / 1000).toFixed(1)}k
                      </span>
                    </div>

                    {/* Box 3: Latency Rate */}
                    <div className="space-y-1">
                      <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">
                        Avg Latency
                      </span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-text-main text-xs font-black">
                          {stat.latency}ms
                        </span>
                        <div className="flex-1 max-w-[50px] h-1 bg-divider rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stat.latency > 300
                                ? "bg-amber-500"
                                : stat.latency > 150
                                  ? "bg-primary-hover"
                                  : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(100, (stat.latency / 450) * 105)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Box 4: Success Rate Health */}
                    <div className="space-y-0.5">
                      <span className="block text-[10px] text-text-muted font-bold uppercase tracking-wider">
                        Success Rate
                      </span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                          stat.successRate >= 99
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                            : stat.successRate >= 95
                              ? "bg-primary-main/10 text-primary-light border border-[var(--color-primary-alpha)]"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        {stat.successRate}% OK
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
