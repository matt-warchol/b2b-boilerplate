import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

export const adminCookie = "feedback_admin";
const minTokenLength = 24;

export function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Returns the configured token only when it is long enough to resist guessing.
export function adminToken() {
  const token = process.env.FEEDBACK_ADMIN_TOKEN;
  return token && token.length >= minTokenLength ? token : null;
}

// The cookie holds a hash, never the token itself.
export function adminCookieValue(token: string) {
  return createHash("sha256").update("feedback-admin:" + token).digest("hex");
}

export async function isFeedbackAdmin() {
  const token = adminToken();
  if (!token) return false;
  const saved = (await cookies()).get(adminCookie)?.value ?? "";
  return sameSecret(saved, adminCookieValue(token));
}
