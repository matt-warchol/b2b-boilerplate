import "server-only";
import { deliverProductEmail } from "./delivery";

export type { EmailResult } from "./delivery";
export type { EmailMessage } from "./messages";

/** Call from a trusted server event with the same eventId on every retry. */
export function sendProductEmail(
  delivery: Parameters<typeof deliverProductEmail>[0],
) {
  return deliverProductEmail(delivery, process.env);
}
