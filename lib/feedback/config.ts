// Limits are per API call to /api/feedback/chat. Change them here.
export const feedbackLimits = {
  maxInput: 1000,
  maxHistory: 10,
  maxOutputTokens: 800,
  timeoutMs: 20_000,
  maxBodyBytes: 20_000,
  perUserPerHour: 20,
  perUserPerDay: 60,
  perSessionTotal: 30,
  perWorkspacePerDay: 300,
  perIpPerHour: 40,
  budgetStopAt: 0.9, // stop at 90% of the daily budget to leave room for requests already in flight
};

// Cheap default: Claude Haiku. Override with FEEDBACK_LLM_MODEL.
const defaultModels = { anthropic: "claude-haiku-5-5", openai: "gpt-4o-mini", "openai-compatible": "" } as const;

export function llmConfig() {
  const provider = (process.env.FEEDBACK_LLM_PROVIDER ?? "anthropic") as keyof typeof defaultModels;
  const apiKey = process.env.FEEDBACK_LLM_API_KEY;
  if (!apiKey || !(provider in defaultModels)) return null;
  const model = process.env.FEEDBACK_LLM_MODEL || defaultModels[provider];
  const baseUrl = process.env.FEEDBACK_LLM_BASE_URL;
  if (!model || (provider === "openai-compatible" && !baseUrl)) return null;
  return { provider, apiKey, model, baseUrl };
}

export function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

// Daily spend cap in USD across all users. Prices are USD per million tokens: set them to your model's real prices.
export function budget() {
  const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) ? Number(v) : d);
  return {
    dailyUsd: num(process.env.FEEDBACK_DAILY_BUDGET_USD, 2),
    priceIn: num(process.env.FEEDBACK_PRICE_IN_USD_PER_MTOK, 1),
    priceOut: num(process.env.FEEDBACK_PRICE_OUT_USD_PER_MTOK, 5),
  };
}

export function costUsd(inputTokens: number, outputTokens: number) {
  const b = budget();
  return (inputTokens * b.priceIn + outputTokens * b.priceOut) / 1_000_000;
}
