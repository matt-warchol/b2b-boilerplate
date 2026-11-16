export const plans = { Starter: 29, Growth: 79, Scale: 199 } as const;
export const statuses = [
  "Active",
  "Trial",
  "Past due",
  "Paused",
  "Canceled",
] as const;

export type Customer = {
  id: string;
  company: string;
  email: string;
  plan: keyof typeof plans;
  status: (typeof statuses)[number];
  seats: number;
  since: string;
  notes: string;
};

export const sampleCustomers: Customer[] = [
  {
    id: "forma",
    company: "Forma Studio",
    email: "olivia@forma.example",
    plan: "Scale",
    status: "Active",
    seats: 24,
    since: "2026-04-08",
    notes: "Monthly check-in with the growth team.",
  },
  {
    id: "layers",
    company: "Layers",
    email: "marcus@layers.example",
    plan: "Growth",
    status: "Active",
    seats: 12,
    since: "2026-05-21",
    notes: "Interested in adding the partnerships team.",
  },
  {
    id: "orbit",
    company: "Orbit Systems",
    email: "sophie@orbit.example",
    plan: "Scale",
    status: "Past due",
    seats: 18,
    since: "2026-07-02",
    notes: "Sample account to review with the billing team.",
  },
  {
    id: "catalog",
    company: "Catalog Works",
    email: "james@catalog.example",
    plan: "Starter",
    status: "Trial",
    seats: 4,
    since: "2026-11-10",
    notes: "Testing the shared inbox.",
  },
  {
    id: "sonder",
    company: "Sonder",
    email: "amara@sonder.example",
    plan: "Growth",
    status: "Active",
    seats: 9,
    since: "2026-08-03",
    notes: "",
  },
  {
    id: "quotient",
    company: "Quotient",
    email: "daniel@quotient.example",
    plan: "Starter",
    status: "Paused",
    seats: 3,
    since: "2026-08-28",
    notes: "Seasonal account.",
  },
  {
    id: "capsule",
    company: "Capsule Labs",
    email: "isabella@capsule.example",
    plan: "Growth",
    status: "Trial",
    seats: 8,
    since: "2026-11-13",
    notes: "",
  },
  {
    id: "focal",
    company: "Focal",
    email: "noah@focal.example",
    plan: "Starter",
    status: "Canceled",
    seats: 2,
    since: "2026-09-16",
    notes: "",
  },
];

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function isCustomerPlan(plan: string): plan is Customer["plan"] {
  return Object.hasOwn(plans, plan);
}
