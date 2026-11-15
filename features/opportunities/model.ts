export const stages = ["Shortlisted", "In review", "New", "Passed"] as const;
export type Stage = (typeof stages)[number];

export type Opportunity = {
  id: string;
  title: string;
  buyer: string;
  region: string;
  deadline: string;
  stage: Stage;
  nextStep: string;
};

export const sampleOpportunities: Opportunity[] = [
  { id: "DR-1042", title: "Cloud migration discovery", buyer: "Westbridge Council", region: "United Kingdom", deadline: "2026-12-04", stage: "Shortlisted", nextStep: "Check the cloud migration references and name the technical lead." },
  { id: "DR-1038", title: "Case management replacement", buyer: "Northbank Health", region: "United Kingdom", deadline: "2026-12-09", stage: "In review", nextStep: "Confirm the requirement for healthcare references." },
  { id: "DR-1036", title: "Data platform modernization", buyer: "Rijnstad Transport", region: "Netherlands", deadline: "2026-12-11", stage: "New", nextStep: "Read the lot descriptions and check which work can be bid separately." },
  { id: "DR-1029", title: "Security testing framework", buyer: "Elmbrook University", region: "United Kingdom", deadline: "2026-12-15", stage: "Passed", nextStep: "Record the missing certification before closing the review." },
  { id: "DR-1024", title: "Public services portal rebuild", buyer: "Hafenstadt Digital", region: "Germany", deadline: "2026-12-18", stage: "In review", nextStep: "Ask the delivery lead about German language support." },
  { id: "DR-1021", title: "Digital records discovery", buyer: "Alderwick Archives", region: "United Kingdom", deadline: "2027-01-08", stage: "New", nextStep: "Check the discovery deliverables and submission timetable." },
];

export function formatDeadline(date: string) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(date + "T00:00:00Z"));
}
