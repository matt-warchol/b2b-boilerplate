import { FeedbackWidget } from "./feedback-widget";

// Off by default. Set FEEDBACK_ENABLED=1 where the agent should appear (after Supabase, the model key and sign-in are ready).
export function FeedbackMount() {
  return process.env.FEEDBACK_ENABLED === "1" ? <FeedbackWidget /> : null;
}
