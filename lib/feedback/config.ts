
export const feedbackLimits = { maxInput: 1000, maxHistory: 10, maxOutputTokens: 400, timeoutMs: 20_000 };

const defaultModels = { openai: "gpt-4o-mini", anthropic: "claude-haiku-5-5", "openai-compatible": "" } as const;

export function llmConfig() {
  const provider = (process.env.FEEDBACK_LLM_PROVIDER ?? "openai") as keyof typeof defaultModels;
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
