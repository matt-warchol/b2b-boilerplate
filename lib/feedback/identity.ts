export type FeedbackIdentity = { userId: string; userEmail: string | null; workspaceId: string | null };

// The agent lives inside the product, so a message needs a signed-in user. The starter has no sign-in:
// set FEEDBACK_ALLOW_DEMO_USER=1 (Preview only) to attribute messages to one demo user.
// In a real product (e.g. RFPZen) replace this body with the session lookup and return null when signed out.
// Never trust user or workspace ids sent by the browser.
export async function resolveIdentity(request: Request): Promise<FeedbackIdentity | null> {
  void request;
  if (process.env.FEEDBACK_ALLOW_DEMO_USER === "1") {
    return { userId: "demo-user", userEmail: "demo@example.com", workspaceId: "demo-workspace" };
  }
  return null;
}
