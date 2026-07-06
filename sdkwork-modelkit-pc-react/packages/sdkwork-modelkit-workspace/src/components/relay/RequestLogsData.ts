import { RequestLog } from "../../services/types";

export function getLogPricingInfo(log: RequestLog) {
  let seed = 0;
  for (let i = 0; i < log.id.length; i++) {
    seed += log.id.charCodeAt(i) * (i + 1);
  }

  const timeClean = log.time.replace(/:/g, "");
  const requestId =
    `20260520${timeClean}${(seed * 11).toString().padEnd(6, "0")}2608268d9d611EzWlfx6`.substring(
      0,
      38,
    );

  const cacheTokens = ((seed * 853) % 200000) + 40000;
  const inputTokens = ((seed * 113) % 15000) + 2500;
  const outputTokens = ((seed * 79) % 3000) + 400;

  let pin = 5.0;
  let pout = 30.0;
  let pcache = 3.0;
  let multiplier = 2;
  let reasoningEffort = "xhigh";

  const m = (log.model || "").toLowerCase();
  if (m.includes("gemini")) {
    pin = 1.25;
    pout = 5.0;
    pcache = 0.75;
    multiplier = 1;
    reasoningEffort = "medium";
  } else if (m.includes("gpt-4o-mini")) {
    pin = 0.15;
    pout = 0.6;
    pcache = 0.075;
    multiplier = 1;
    reasoningEffort = "low";
  } else if (m.includes("claude-3-5-sonnet")) {
    pin = 3.0;
    pout = 15.0;
    pcache = 1.5;
    multiplier = 2;
    reasoningEffort = "high";
  }

  const inputCost = (inputTokens / 1000000) * pin;
  const cacheCost = (cacheTokens / 1000000) * pcache;
  const outputCost = (outputTokens / 1000000) * pout;
  const totalCost = ((inputCost + cacheCost + outputCost) * multiplier).toFixed(6);

  return {
    requestId,
    cacheTokens,
    inputTokens,
    outputTokens,
    pin,
    pout,
    pcache,
    multiplier,
    reasoningEffort,
    totalCost,
  };
}

export function detectProviderAndModel(log: Partial<RequestLog>): {
  provider: string;
  model: string;
} {
  const toolLower = (log.tool || "").toLowerCase();
  const pathLower = (log.path || "").toLowerCase();
  let payloadObj: Record<string, unknown> = {};
  try {
    payloadObj = JSON.parse(log.payload || "{}") as Record<string, unknown>;
  } catch {
    payloadObj = {};
  }

  let model = String(payloadObj.model || payloadObj.target_adapter || "");
  if (!model && pathLower.includes("embeddings")) {
    model = "text-embedding-3-small";
  } else if (!model && pathLower.includes("audio")) {
    model = "whisper-1";
  }

  let provider = log.provider || "";

  if (!provider) {
    if (toolLower.includes("gemini") || model.includes("gemini")) {
      provider = "Google Gemini";
      if (!model) model = "gemini-1.5-pro";
    } else if (toolLower.includes("claude") || model.includes("claude")) {
      provider = "Anthropic";
      if (!model) model = "claude-3-5-sonnet";
    } else if (model.includes("gpt")) {
      provider = "OpenAI";
      if (!model) model = "gpt-4o-mini";
    } else {
      provider = "Relay";
      if (!model) model = "unknown";
    }
  }

  return { provider, model };
}

export function getProviderBadgeStyle(provider: string = ""): string {
  const p = provider.toLowerCase();
  if (p.includes("openai")) {
    return "bg-primary-main/10 border-primary-main/15 text-primary-light";
  }
  if (p.includes("anthropic") || p.includes("claude")) {
    return "bg-emerald-500/10 border-emerald-500/15 text-emerald-400";
  }
  if (p.includes("gemini") || p.includes("google")) {
    return "bg-primary-main/10 border-[var(--color-primary-alpha)] text-primary-light";
  }
  return "bg-zinc-500/10 border-zinc-500/15 text-zinc-450";
}

export function getModelBadgeStyle(model: string = ""): string {
  const m = model.toLowerCase();
  if (m.includes("gpt-4o-mini")) {
    return "bg-teal-500/10 border-teal-500/15 text-teal-400";
  }
  if (m.includes("gpt-4o") || m.includes("gpt-4")) {
    return "bg-emerald-500/10 border-emerald-500/15 text-emerald-400";
  }
  if (m.includes("claude")) {
    return "bg-orange-500/10 border-orange-500/15 text-orange-400";
  }
  if (m.includes("gemini")) {
    return "bg-primary-main/10 border-[var(--color-primary-alpha)] text-primary-light";
  }
  return "bg-slate-500/10 border-slate-500/15 text-slate-400";
}
