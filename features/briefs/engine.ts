import { formatDeadline, type Opportunity } from "@/features/opportunities/model";

/**
 * This demo runs entirely in the browser. A hosted provider belongs behind a
 * separate authenticated server endpoint with its own limits.
 */
export function buildBidBrief(record: Opportunity): string {
  return [
    record.title,
    "",
    "Buyer: " + record.buyer,
    "Region: " + (record.region || "To confirm"),
    "Deadline: " + formatDeadline(record.deadline),
    "Decision: " + record.stage,
    "",
    "Next step",
    record.nextStep || "Assign an owner and record the next action.",
    "",
    "Before the bid review",
    "- Verify the submission deadline and mandatory criteria in the official notice.",
    "- Confirm the owner and evidence needed to make the decision.",
  ].join("\n");
}
