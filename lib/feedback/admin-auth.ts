import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

export const adminCookie = "feedback_admin";

export function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function isFeedbackAdmin() {
  const token = process.env.FEEDBACK_ADMIN_TOKEN;
  if (!token) return false;
  const saved = (await cookies()).get(adminCookie)?.value ?? "";
  return sameSecret(saved, token);
}
