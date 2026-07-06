export interface EndpointStat {
  endpoint: string;
  gateway: string;
  model: string;
  requests: number;
  tokensIn: number;
  tokensOut: number;
  latency: number;
  successRate: number;
}

export interface ChartDataPoint {
  hour: string;
  label: string;
  requests: number;
  tokens: number;
  latency: number;
}

export interface ModelDistributionPoint {
  model: string;
  tokens: number;
  percent: number;
  color: string;
  spend: number;
  spendPercent: number;
}
