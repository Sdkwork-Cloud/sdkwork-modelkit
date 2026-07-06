import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChartDataPoint } from "./types";

interface UsageTrafficChartProps {
  chartMode: "hour" | "day" | "week" | "month";
  setChartMode: (mode: "hour" | "day" | "week" | "month") => void;
  currentChartData: ChartDataPoint[];
  maxRequestsGraph: number;
  maxTokensGraph: number;
}

export function UsageTrafficChart({
  chartMode,
  setChartMode,
  currentChartData,
  maxRequestsGraph,
  maxTokensGraph,
}: UsageTrafficChartProps) {
  const { t } = useAppContext();
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(840);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Debounce slightly or just set directly
        setGraphWidth(Math.max(400, entries[0].contentRect.width));
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const graphHeight = 380;
  const chartMarginLeft = 16;
  const chartMarginRight = 16;
  const paddingBottom = 25;
  const paddingTop = 10;
  const usableWidth = graphWidth - chartMarginLeft - chartMarginRight;
  const usableHeight = graphHeight - paddingBottom - paddingTop;

  return (
    <div className="lg:col-span-8 h-full min-h-[460px] border border-divider bg-panel rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-divider pb-4">
        <div>
          <h3 className="text-sm font-bold text-text-main tracking-tight">
            {chartMode === "hour"
              ? t("workspace:chart_hour_title", "Hourly Request Traffic Trend")
              : chartMode === "day"
                ? t("workspace:chart_day_title", "Daily Request Traffic Changes")
                : chartMode === "week"
                  ? t("workspace:chart_week_title", "Weekly Macro Traffic Analysis")
                  : t("workspace:chart_month_title", "Monthly Accumulated Operations Overview")}
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            {chartMode === "hour"
              ? t("workspace:chart_hour_desc", "Stats gathered every 2 hours, locally interpolated with high fidelity")
              : chartMode === "day"
                ? t("workspace:chart_day_desc", "Visualizing active requests per day to capture cyclical throughput patterns")
                : chartMode === "week"
                  ? t("workspace:chart_week_desc", "Aggregated by week to support long-term operations planning")
                  : t("workspace:chart_month_desc", "Segmented by natural calendar months to track structural changes")}
          </p>
        </div>

        {/* Chart Mode Control tab switcher */}
        <div className="flex items-center gap-3">
          <div className="flex p-0.5 bg-canvas border border-divider rounded-lg">
            {[
              { id: "hour", label: t("workspace:unit_hour", "Hourly") },
              { id: "day", label: t("workspace:unit_day", "Daily") },
              { id: "week", label: t("workspace:unit_week", "Weekly") },
              { id: "month", label: t("workspace:unit_month", "Monthly") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setChartMode(item.id as any);
                  setHoveredHour(null);
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  chartMode === item.id
                    ? "bg-primary-main text-white shadow-md font-extrabold scale-102"
                    : "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold text-text-muted shrink-0">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-primary-main/20 border border-primary-main/50 block" />
              <span>{t("workspace:txt_1318")}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-violet-500/20 border border-violet-500/50 block" />
              <span>Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Visual Chart */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] bg-canvas border border-divider rounded-xl flex items-center justify-center px-1 pt-2 select-none"
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          preserveAspectRatio="none"
        >
          {/* Horizontal Guide Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
            <line
              key={i}
              x1="0"
              y1={graphHeight - paddingBottom - r * usableHeight}
              x2={graphWidth}
              y2={graphHeight - paddingBottom - r * usableHeight}
              stroke="rgba(255,255,255,0.03)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Vertical Laser Guideline when hovered */}
          {hoveredHour !== null && hoveredHour < currentChartData.length && (
            <line
              x1={
                chartMarginLeft +
                (hoveredHour / Math.max(1, currentChartData.length - 1)) *
                  usableWidth
              }
              y1={0}
              x2={
                chartMarginLeft +
                (hoveredHour / Math.max(1, currentChartData.length - 1)) *
                  usableWidth
              }
              y2={graphHeight - paddingBottom}
              stroke="rgba(59, 130, 246, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="pointer-events-none"
            />
          )}

          {/* Draw Area Line for Tokens (Violet) */}
          {currentChartData.length > 0 && (
            <>
              <path
                d={
                  currentChartData.reduce((acc, curr, index) => {
                    const x =
                      chartMarginLeft +
                      (index / Math.max(1, currentChartData.length - 1)) *
                        usableWidth;
                    const y =
                      graphHeight -
                      paddingBottom -
                      (curr.tokens / maxTokensGraph) * usableHeight;
                    return acc + `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  }, "") +
                  ` L ${chartMarginLeft + usableWidth} ${graphHeight - paddingBottom} L ${chartMarginLeft} ${graphHeight - paddingBottom} Z`
                }
                fill="url(#violet-gradient)"
                opacity="0.15"
              />

              <path
                d={currentChartData.reduce((acc, curr, index) => {
                  const x =
                    chartMarginLeft +
                    (index / Math.max(1, currentChartData.length - 1)) *
                      usableWidth;
                  const y =
                    graphHeight -
                    paddingBottom -
                    (curr.tokens / maxTokensGraph) * usableHeight;
                  return acc + `${index === 0 ? "M" : "L"} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
                opacity="0.85"
              />
            </>
          )}

          {/* Draw Bar Chart for Requests (Blue Gradient) */}
          {currentChartData.map((d, index) => {
            const x =
              chartMarginLeft +
              (index / Math.max(1, currentChartData.length - 1)) * usableWidth;
            const barWidth = Math.max(
              6,
              Math.min(24, (usableWidth * 0.35) / currentChartData.length),
            );
            const barHeight = (d.requests / maxRequestsGraph) * usableHeight;
            const y = graphHeight - paddingBottom - barHeight;
            const isHovered = hoveredHour === index;

            return (
              <g key={index}>
                {/* Interactive Hover Area */}
                <rect
                  x={
                    x -
                    Math.max(12, usableWidth / (2 * currentChartData.length))
                  }
                  y={0}
                  width={Math.max(24, usableWidth / currentChartData.length)}
                  height={graphHeight}
                  fill="transparent"
                  className="cursor-pointer font-sans"
                  onMouseEnter={() => setHoveredHour(index)}
                  onMouseLeave={() => setHoveredHour(null)}
                />

                {/* Actual Request Bar with gradient and optional hover effects */}
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="2"
                  fill={
                    isHovered
                      ? "url(#blue-gradient-hover)"
                      : "url(#blue-gradient)"
                  }
                  fillOpacity={isHovered ? "0.8" : "0.4"}
                  stroke="#3B82F6"
                  strokeOpacity={isHovered ? "0.9" : "0.4"}
                  strokeWidth="1"
                  className="transition-all duration-150"
                />

                {/* X-axis Label text */}
                <text
                  x={x}
                  y={graphHeight - 6}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="8.5"
                  className="font-mono font-bold"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Draw Glowing Vertices for Token Line Chart */}
          {currentChartData.map((d, index) => {
            const x =
              chartMarginLeft +
              (index / Math.max(1, currentChartData.length - 1)) * usableWidth;
            const y =
              graphHeight -
              paddingBottom -
              (d.tokens / maxTokensGraph) * usableHeight;
            const isHovered = hoveredHour === index;

            return (
              <circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r={isHovered ? 4.5 : 2.5}
                fill={isHovered ? "#C084FC" : "#8B5CF6"}
                stroke="#0A0B0D"
                strokeWidth={isHovered ? 2 : 1.2}
                className="transition-all duration-150 pointer-events-none"
              />
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="violet-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient
              id="blue-gradient-hover"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Indicator Tooltip - Futuristic HUD */}
        {hoveredHour !== null &&
          hoveredHour < currentChartData.length &&
          (() => {
            const xPos =
              chartMarginLeft +
              (hoveredHour / Math.max(1, currentChartData.length - 1)) *
                usableWidth;
            const pct = (xPos / graphWidth) * 100;
            return (
              <div
                className="absolute p-3 rounded-xl bg-panel/95 backdrop-blur-md border border-divider-strong shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex flex-col gap-1 z-20 pointer-events-none transition-all duration-75"
                style={{
                  left: `${pct}%`,
                  transform: "translateX(-50%)",
                  bottom: "55px",
                }}
              >
                <div className="text-[10px] font-extrabold text-primary-light uppercase tracking-widest font-mono border-b border-divider pb-1">
                  {chartMode === "hour"
                    ? t("workspace:chart_latency_time", "Time")
                    : chartMode === "day"
                      ? t("workspace:chart_latency_date", "Date")
                      : chartMode === "week"
                        ? t("workspace:chart_latency_week", "Week")
                        : t("workspace:chart_latency_month", "Month")}
                  : {currentChartData[hoveredHour].label}
                </div>
                <div className="text-xs font-semibold text-text-main mt-1 flex items-center justify-between gap-6">
                  <span className="text-text-muted text-left">
                    {t("workspace:txt_1319")}
                  </span>
                  <span className="font-mono text-primary-light font-bold text-right">
                    {currentChartData[hoveredHour].requests.toLocaleString()} {t("workspace:unit_times", "times")}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-main flex items-center justify-between gap-6">
                  <span className="text-text-muted text-left">
                    {t("workspace:txt_1321")}
                  </span>
                  <span className="font-mono text-violet-400 font-bold text-right">
                    {currentChartData[hoveredHour].tokens.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-main flex items-center justify-between gap-6">
                  <span className="text-text-muted text-left">
                    {t("workspace:txt_1322")}
                  </span>
                  <span className="font-mono text-amber-500 font-bold text-right">
                    {currentChartData[hoveredHour].latency} ms
                  </span>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
