import type { RequestLog } from '../services/types';
import type {
  ChartDataPoint,
  EndpointStat,
  ModelDistributionPoint,
} from '../components/relay/usage/types';

export type UsageTimeRange = 'today' | 'yesterday' | '7days' | '30days';
export type UsageChartMode = 'hour' | 'day' | 'week' | 'month';

const MODEL_COLORS = ['#3B82F6', '#10A37F', '#D13BF6', '#8B5CF6', '#F59E0B', '#EF4444'];

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function parseLogDate(log: RequestLog): Date {
  const parsed = new Date(log.time);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function estimateTokens(log: RequestLog): { tokensIn: number; tokensOut: number } {
  const tokensIn = Math.max(0, Math.floor((log.payload || '').length / 4));
  const tokensOut = Math.max(0, Math.floor((log.response || '').length / 4));
  return { tokensIn, tokensOut };
}

export function filterLogsByTimeRange(
  logs: RequestLog[],
  timeRange: UsageTimeRange,
): RequestLog[] {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  return logs.filter((log) => {
    const logDate = parseLogDate(log);
    switch (timeRange) {
      case 'today':
        return logDate >= todayStart;
      case 'yesterday':
        return logDate >= yesterdayStart && logDate < todayStart;
      case '7days': {
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 6);
        return logDate >= weekStart;
      }
      case '30days': {
        const monthStart = new Date(todayStart);
        monthStart.setDate(monthStart.getDate() - 29);
        return logDate >= monthStart;
      }
      default:
        return true;
    }
  });
}

export function filterLogsByGateway(logs: RequestLog[], gateway: string): RequestLog[] {
  if (gateway === 'all') {
    return logs;
  }
  return logs.filter((log) => log.relay === gateway);
}

export function aggregateEndpointStats(logs: RequestLog[]): EndpointStat[] {
  const groups = new Map<string, EndpointStat & { successCount: number }>();

  for (const log of logs) {
    const model = log.model || 'unknown';
    const key = `${log.path}::${log.relay}::${model}`;
    const tokens = estimateTokens(log);
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        endpoint: log.path,
        gateway: log.relay,
        model,
        requests: 1,
        tokensIn: tokens.tokensIn,
        tokensOut: tokens.tokensOut,
        latency: log.duration,
        successRate: log.status < 400 ? 100 : 0,
        successCount: log.status < 400 ? 1 : 0,
      });
      continue;
    }

    existing.requests += 1;
    existing.tokensIn += tokens.tokensIn;
    existing.tokensOut += tokens.tokensOut;
    existing.latency += log.duration;
    if (log.status < 400) {
      existing.successCount += 1;
    }
    existing.successRate = (existing.successCount / existing.requests) * 100;
  }

  return Array.from(groups.values()).map((entry) => ({
    endpoint: entry.endpoint,
    gateway: entry.gateway,
    model: entry.model,
    requests: entry.requests,
    tokensIn: entry.tokensIn,
    tokensOut: entry.tokensOut,
    latency: entry.requests > 0 ? Math.round(entry.latency / entry.requests) : 0,
    successRate: Number(entry.successRate.toFixed(1)),
  }));
}

function formatHourLabel(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:00`;
}

function formatDayLabel(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function aggregateChartData(
  logs: RequestLog[],
  chartMode: UsageChartMode,
): ChartDataPoint[] {
  const buckets = new Map<string, ChartDataPoint>();

  for (const log of logs) {
    const logDate = parseLogDate(log);
    const tokens = estimateTokens(log);
    let bucketKey = '';
    let label = '';

    switch (chartMode) {
      case 'hour':
        bucketKey = `${logDate.toDateString()}-${logDate.getHours()}`;
        label = formatHourLabel(logDate);
        break;
      case 'day':
        bucketKey = logDate.toDateString();
        label = formatDayLabel(logDate);
        break;
      case 'week': {
        const weekStart = startOfDay(logDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        bucketKey = weekStart.toDateString();
        label = `Wk${Math.ceil((weekStart.getDate() + 1) / 7)}`;
        break;
      }
      case 'month':
        bucketKey = `${logDate.getFullYear()}-${logDate.getMonth()}`;
        label = logDate.toLocaleString('en', { month: 'short' });
        break;
      default:
        bucketKey = logDate.toDateString();
        label = formatDayLabel(logDate);
    }

    const existing = buckets.get(bucketKey);
    if (!existing) {
      buckets.set(bucketKey, {
        hour: bucketKey,
        label,
        requests: 1,
        tokens: tokens.tokensIn + tokens.tokensOut,
        latency: log.duration,
      });
      continue;
    }

    existing.requests += 1;
    existing.tokens += tokens.tokensIn + tokens.tokensOut;
    existing.latency += log.duration;
  }

  return Array.from(buckets.values()).map((point) => ({
    ...point,
    latency: point.requests > 0 ? Math.round(point.latency / point.requests) : 0,
  }));
}

export function aggregateModelDistribution(logs: RequestLog[]): ModelDistributionPoint[] {
  const groups = new Map<string, { tokens: number; requests: number }>();
  let totalTokens = 0;

  for (const log of logs) {
    const model = log.model || 'Unknown';
    const tokens = estimateTokens(log);
    const tokenSum = tokens.tokensIn + tokens.tokensOut;
    totalTokens += tokenSum;
    const existing = groups.get(model) ?? { tokens: 0, requests: 0 };
    existing.tokens += tokenSum;
    existing.requests += 1;
    groups.set(model, existing);
  }

  if (totalTokens === 0) {
    return [];
  }

  const totalSpendBase = (totalTokens / 1_000_000) * 20;

  return Array.from(groups.entries()).map(([model, stats], index) => {
    const percent = Number(((stats.tokens / totalTokens) * 100).toFixed(1));
    const spend = Number(((percent / 100) * totalSpendBase).toFixed(2));
    return {
      model,
      tokens: stats.tokens,
      percent,
      color: MODEL_COLORS[index % MODEL_COLORS.length],
      spend,
      spendPercent: percent,
    };
  });
}

export function sumRequests(stats: EndpointStat[]): number {
  return stats.reduce((total, entry) => total + entry.requests, 0);
}

export function sumTokens(stats: EndpointStat[]): { in: number; out: number; total: number } {
  const tokensIn = stats.reduce((total, entry) => total + entry.tokensIn, 0);
  const tokensOut = stats.reduce((total, entry) => total + entry.tokensOut, 0);
  return { in: tokensIn, out: tokensOut, total: tokensIn + tokensOut };
}

export function weightedAverageLatency(stats: EndpointStat[]): number {
  const weightSum = stats.reduce((total, entry) => total + entry.latency * entry.requests, 0);
  const reqSum = sumRequests(stats);
  return reqSum > 0 ? Math.round(weightSum / reqSum) : 0;
}

export function weightedSuccessRate(stats: EndpointStat[]): string {
  const weightSum = stats.reduce((total, entry) => total + entry.successRate * entry.requests, 0);
  const reqSum = sumRequests(stats);
  return reqSum > 0 ? (weightSum / reqSum).toFixed(2) : '0.00';
}

export function uniqueGateways(stats: EndpointStat[]): string[] {
  return Array.from(new Set(stats.map((entry) => entry.gateway)));
}

export function estimateSpend(tokensIn: number, tokensOut: number): number {
  const cost = (tokensIn / 1_000_000) * 12 + (tokensOut / 1_000_000) * 28;
  return Number((Number.isNaN(cost) ? 0 : cost).toFixed(2));
}
