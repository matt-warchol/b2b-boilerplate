
export type FeedbackIdentity = { userId: string | null; userEmail: string | null; workspaceId: string | null };

// The starter has no sign-in, so every message is anonymous. In a product with auth (e.g. RFPZen),
// replace this body with the session lookup. Never trust user or workspace ids sent by the browser.
export async function resolveIdentity(_request: Request): Promise<FeedbackIdentity> {
  void _request;
  return { userId: null, userEmail: null, workspaceId: null };
}
