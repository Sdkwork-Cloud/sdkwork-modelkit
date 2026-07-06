import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UsageFilters } from "./usage/UsageFilters";
import { UsageStatsCards } from "./usage/UsageStatsCards";
import { UsageTrafficChart } from "./usage/UsageTrafficChart";
import { UsageModelDistribution } from "./usage/UsageModelDistribution";
import { UsageEndpointsList } from "./usage/UsageEndpointsList";
import { workspaceService } from "../../services/WorkspaceService";
import {
  aggregateChartData,
  aggregateEndpointStats,
  aggregateModelDistribution,
  estimateSpend,
  filterLogsByGateway,
  filterLogsByTimeRange,
  sumRequests,
  sumTokens,
  uniqueGateways,
  weightedAverageLatency,
  weightedSuccessRate,
  type UsageChartMode,
  type UsageTimeRange,
} from "../../utils/usageAnalytics";

interface UsageViewProps {
  onNavigate?: (viewId: "user-profile" | "system-settings") => void;
}

export function UsageView({ onNavigate }: UsageViewProps) {
  const { t } = useAppContext();
  const [timeRange, setTimeRange] = useState<UsageTimeRange>("today");
  const [selectedGateway, setSelectedGateway] = useState<string>("all");
  const [chartMode, setChartMode] = useState<UsageChartMode>("hour");
  const [requestLogs, setRequestLogs] = useState<Awaited<ReturnType<typeof workspaceService.getRequestLogs>>>([]);

  useEffect(() => {
    workspaceService.getRequestLogs().then(setRequestLogs);
  }, []);

  const filteredLogs = useMemo(() => {
    const byTime = filterLogsByTimeRange(requestLogs, timeRange);
    return filterLogsByGateway(byTime, selectedGateway);
  }, [requestLogs, timeRange, selectedGateway]);

  const endpointStats = useMemo(
    () => aggregateEndpointStats(filteredLogs),
    [filteredLogs],
  );

  const tokenTotals = useMemo(() => sumTokens(endpointStats), [endpointStats]);
  const totalRequests = useMemo(() => sumRequests(endpointStats), [endpointStats]);
  const totalSpend = useMemo(
    () => estimateSpend(tokenTotals.in, tokenTotals.out),
    [tokenTotals.in, tokenTotals.out],
  );
  const avgLatency = useMemo(() => weightedAverageLatency(endpointStats), [endpointStats]);
  const overallSuccessRate = useMemo(
    () => weightedSuccessRate(endpointStats),
    [endpointStats],
  );

  const currentChartData = useMemo(
    () => aggregateChartData(filteredLogs, chartMode),
    [filteredLogs, chartMode],
  );

  const modelDistribution = useMemo(
    () => aggregateModelDistribution(filteredLogs),
    [filteredLogs],
  );

  const maxRequestsGraph = useMemo(
    () => Math.max(...currentChartData.map((point) => point.requests), 1),
    [currentChartData],
  );
  const maxTokensGraph = useMemo(
    () => Math.max(...currentChartData.map((point) => point.tokens), 1),
    [currentChartData],
  );

  const gatewayOptions = useMemo(() => uniqueGateways(endpointStats), [endpointStats]);

  const handleExportData = () => {
    toast.success(
      t(
        "workspace:export_success_toast",
        "Dashboard usage analysis report has been generated and exported (.csv)",
      ),
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-panel text-text-main custom-scrollbar">
      <main className="px-8 py-6 space-y-6 w-full max-w-none">
        <UsageFilters
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          selectedGateway={selectedGateway}
          setSelectedGateway={setSelectedGateway}
          uniqueGateways={gatewayOptions}
          onExport={handleExportData}
        />

        <UsageStatsCards
          totalRequests={totalRequests}
          totalTokens={tokenTotals.total}
          totalTokensIn={tokenTotals.in}
          totalTokensOut={tokenTotals.out}
          avgLatency={avgLatency}
          overallSuccessRate={overallSuccessRate}
          totalSpend={totalSpend}
          baseRequests={totalRequests}
          baseTokensIn={tokenTotals.in}
          baseTokensOut={tokenTotals.out}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <UsageTrafficChart
            chartMode={chartMode}
            setChartMode={setChartMode}
            currentChartData={currentChartData}
            maxRequestsGraph={maxRequestsGraph}
            maxTokensGraph={maxTokensGraph}
          />
          <UsageModelDistribution
            distribution={modelDistribution}
            totalTokens={tokenTotals.total}
            totalSpend={totalSpend}
          />
        </div>

        <UsageEndpointsList
          selectedGateway={selectedGateway}
          endpointStats={endpointStats}
        />
      </main>
    </div>
  );
}
