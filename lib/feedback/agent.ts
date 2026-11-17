import { readFile } from "node:fs/promises";
import path from "node:path";
import { feedbackLimits, llmConfig } from "./config";

export type AgentTurn = { role: "user" | "assistant"; content: string };
export type AgentResult = {
  reply: string;
  kind: "question" | "feedback" | "bug" | "idea";
  topic: string;
  sentiment: "positive" | "neutral" | "negative";
  summary: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
};

export const fallbackResult: AgentResult = {
  reply: "Thanks, your message is saved and the team will read it.",
  kind: "feedback",
  topic: "uncategorized",
  sentiment: "neutral",
  summary: null,
  inputTokens: null,
  outputTokens: null,
};

async function productContext() {
  const files = ["product-context.md", "product-map.generated.md"];
  const parts = await Promise.all(
    files.map((f) => readFile(path.join(process.cwd(), "content", f), "utf8").catch(() => "")),
  );
  return parts.filter(Boolean).join("\n\n");
}

function system(context: string, topics: string[]) {
  return `You are the Feedback agent inside a software product. Answer questions about the product using ONLY the context below; if the answer is not there, say you do not know. Also collect feedback: when the user gives an opinion, problem or idea, thank them in one sentence and ask at most one short follow-up. Keep replies under 80 words, plain text. Reply in the language the user writes in.

Reply with JSON only, no markdown fence:
{"reply": string, "kind": "question"|"feedback"|"bug"|"idea", "topic": string, "sentiment": "positive"|"neutral"|"negative", "summary": string|null}
- topic: 1-3 lowercase English words, whatever language the user writes in. Reuse one of the existing topics when it fits: ${topics.length ? topics.join(", ") : "(none yet)"}.
- summary: one English sentence describing the user's feedback in third person; null for a pure question.

Product context:
${context}`;
}

type Parsed = Omit<AgentResult, "inputTokens" | "outputTokens">;

function parse(text: string): Parsed | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) return null;
  try {
    const raw = JSON.parse(text.slice(start, end + 1));
    if (typeof raw.reply !== "string" || !raw.reply.trim()) return null;
    const kinds = ["question", "feedback", "bug", "idea"] as const;
    const moods = ["positive", "neutral", "negative"] as const;
    return {
      reply: raw.reply.slice(0, 800),
      kind: kinds.includes(raw.kind) ? raw.kind : "feedback",
      topic: String(raw.topic ?? "uncategorized").toLowerCase().slice(0, 40) || "uncategorized",
      sentiment: moods.includes(raw.sentiment) ? raw.sentiment : "neutral",
      summary: typeof raw.summary === "string" && raw.summary.trim() ? raw.summary.slice(0, 300) : null,
    };
  } catch {
    return null;
  }
}

export async function runAgent(history: AgentTurn[], topics: string[]): Promise<AgentResult> {
  const cfg = llmConfig();
  if (!cfg) return fallbackResult;
  const sys = system(await productContext(), topics);
  const turns = history.slice(-feedbackLimits.maxHistory);
  const signal = AbortSignal.timeout(feedbackLimits.timeoutMs);
  try {
    let text = "";
    let usage = { input: 0, output: 0 };
    if (cfg.provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal,
        headers: { "x-api-key": cfg.apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: cfg.model, max_tokens: feedbackLimits.maxOutputTokens, system: sys, messages: turns }),
      });
      if (!res.ok) throw new Error(`anthropic ${res.status}`);
      const data = await res.json();
      text = data.content?.map((c: { text?: string }) => c.text ?? "").join("") ?? "";
      usage = { input: data.usage?.input_tokens ?? 0, output: data.usage?.output_tokens ?? 0 };
    } else {
      const base = cfg.provider === "openai" ? "https://api.openai.com/v1" : cfg.baseUrl!.replace(/\/$/, "");
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        signal,
        headers: { Authorization: `Bearer ${cfg.apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ model: cfg.model, max_tokens: feedbackLimits.maxOutputTokens, messages: [{ role: "system", content: sys }, ...turns] }),
      });
      if (!res.ok) throw new Error(`llm ${res.status}`);
      const data = await res.json();
      text = data.choices?.[0]?.message?.content ?? "";
      usage = { input: data.usage?.prompt_tokens ?? 0, output: data.usage?.completion_tokens ?? 0 };
    }
    const tokens = { inputTokens: usage.input, outputTokens: usage.output };
    return { ...(parse(text) ?? { ...fallbackResult, reply: text.trim().slice(0, 800) || fallbackResult.reply }), ...tokens };
  } catch (error) {
    console.error("feedback agent failed", error);
    return fallbackResult;
  }
}
