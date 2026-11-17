// The prompt copied from /admin/feedback. Edit freely; the feedback export is appended below it.
export const feedbackAnalysisPrompt = `You are my product analyst. Below is feedback from users of my product, collected by the in-app feedback agent and grouped by topic.

1. Rank the top 5 problems or requests by how many users raise them and how negative they are.
2. For each: who raised it (users, pages), the underlying need, and one concrete product change.
3. List questions users asked that our knowledge base should answer, so I can add them.
4. Flag anything urgent: bugs, confusion at a key step, signs a user may leave.

Be brief: bullets, no filler.`;
