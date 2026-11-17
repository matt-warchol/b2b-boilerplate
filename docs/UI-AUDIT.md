# Folidock UI audit

The original demo used bespoke sidebar markup, popovers, table markup and a CSS bar chart. The current version composes the official shadcn/ui Radix registry components below.

| Surface | Registry components in use | Folidock-specific work |
| --- | --- | --- |
| CRM shell | Sidebar, SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarTrigger, Tooltip | Navigation items and icons, section grouping, brand, palette and spacing |
| CRM data | Table, Card, Avatar, Badge, Input, Textarea, Button | Record columns, sample data, status colors and search logic |
| CRM actions | Dropdown Menu and Sheet | Record, draft and sequence forms, filters, local persistence |
| Sales pipeline | Dice UI Radix Kanban, shadcn Card, Badge, Avatar, Button, Empty and Select | Four fixed deal stages, deal totals, touch and keyboard controls, and local saves on a valid drop |
| Visual styles | shadcn Button, Dropdown Menu and Radio Item | Three shared shadcn token palettes, responsive hero layouts, browser preference and screenshot selection |
| Outbound dashboard | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, Card and Toggle Group | Recharts area series, a 7/14-day range, palette, and sample time series |
| Landing | Navigation Menu, Dropdown Menu, Tabs, Card, Accordion and Button | Product copy, page layout, brand and screenshots from the running app |

The Folidock wordmark, product views, charts' sample data and campaign workflow are project-specific. The inbox split and deal card layouts are Folidock compositions. The deal stage, timezone, opportunity and brief pickers use the registry Select. The original procurement demo remains a separate example and retains its existing TanStack Table logic.

Framer Motion (Motion for React) animates CRM screen changes and product tour panel changes. dnd-kit handles drag feedback and sorting. Recharts animates the area series. Radix and the registry's CSS animations handle menu, accordion and sheet transitions. Motion uses the user's reduced-motion preference. A global reduced-motion override covers CSS effects.

The registry's helper imports point at the project’s existing `cn` helper. The sidebar skeleton uses a deterministic width and its mobile hook uses React’s external-store API to comply with the project’s React lint rules.

References: [shadcn/ui registry](https://ui.shadcn.com/docs/components), [Chart](https://ui.shadcn.com/docs/components/chart), [Sidebar](https://ui.shadcn.com/docs/components/sidebar), [Motion for React](https://motion.dev/docs/react).

The Grill Me design review confirmed Campaigns as the landing’s primary destination and Overview as the secondary entry point. The product screenshot links to the Overview screen it depicts.

## Dashboard block pass

- **Copied and adapted from dashboard-01:** the inset shell, sidebar header, main and secondary navigation, account dropdown, site header, SectionCards and ChartAreaInteractive. Their implementations are in `features/crm/dashboard-shell.tsx`, `section-cards.tsx` and `outbound-chart.tsx`. Demo routes and Lucide icons replace the block's example links and icons. The area chart retains tooltips, keyboard navigation and a two-range control.
- **Composed from registry primitives:** the Inbox uses Item and Card with Avatar, Badge, Textarea and Button. The people and campaign views use the shared Table primitives and Folidock's existing filters. The block's sample DataTable, document menu and unrelated libraries are omitted.
- **Folidock-specific:** business data and workflows, the deal card composition and sequence layouts, inbox thread content, color tokens and Geist typography. Metric cards use tabular numerals; numeric table columns are right-aligned. Person illustrations use the Notionists style by Zoish through DiceBear (CC0 1.0), stored locally as small WebP files. Organization icons and avatar fallbacks use Lucide.
- **Motion:** screen entrance and landing tour changes use Motion for React. dnd-kit handles deal transitions. The area chart's entrance animation is Recharts and respects reduced motion. The sidebar, menus and sheet use the registry transitions.

[Dashboard block source and demo](https://ui.shadcn.com/blocks#dashboard-01) · [shadcn license](SHADCN-LICENSE.md) · [DiceBear Notionists](https://www.dicebear.com/styles/notionists/)

## Landing block pass

| Section | Starting point | Folidock adaptation |
| --- | --- | --- |
| Header and mobile navigation | shadcn Navigation Menu, Dropdown Menu and Button | Folidock links, addressable landing sections and a direct link to Campaigns. Header container is Folidock's composition. |
| Hero | Tailark OSS `dusk-hero-section-2` | Split, centered, and side-by-side layouts. Folidock copy, responsive CRM screenshots for each preset and Motion entrance. |
| Product story | Tailark OSS `dusk-content-2` | Two-column editorial layout with use cases tied to the working demo. |
| Feature grid | Tailark OSS `dusk-features-2` with shadcn Card | Three product cards using screenshots of pipeline, inbox and owner workspace. |
| Product tour | shadcn Tabs, Card and Button | Folidock screenshots, copy, and tab transition. |
| Demo and template comparison | Tailark OSS `mist-pricing-2` with shadcn Card and Button | Two ways to use the starter. No commercial plans or prices are advertised. |
| FAQ, CTA and footer | Tailark OSS `dusk-faqs-1`, `dusk-call-to-action-1`, `dusk-footer-2` | shadcn Accordion, Folidock copy and navigation. Example support, logos and AI links were removed. |

Motion for React animates the hero entrance, the first appearance of marketing sections and changes to the product tour. Feature image zoom is CSS. Both respect reduced-motion preferences. The hero background, screenshots, copy and section order are Folidock-specific.

[Tailark OSS registry](https://tailark.com/docs) · [Tailark MIT license](TAILARK-LICENSE.md)

### SaaS owner demo

The owner panel uses the shadcn `dashboard-01` shell pattern, the shared CRM site header and metric cards, plus Table, Badge, Input, Dropdown Menu, Sheet, Select and Textarea for managing customers. Folidock supplies the fictional records, filters and form behavior. The landing links to the owner demo, which keeps edits in its own browser storage namespace and simulates billing.


## Registry audit (16 Nov 2026)

Goal: every screen built from ready-made components. Findings and what changed:

| Where | Was | Now |
| --- | --- | --- |
| Tender workspace shell (`/workspace`) | Custom `aside.sidebar` rail and top bar in `workspace.css` | shadcn Sidebar, SidebarInset, SidebarTrigger, Separator and Badge (same pattern as the CRM) |
| Opportunities view switch | Custom `button[aria-pressed]` row with a Motion underline | shadcn Tabs (`variant="line"`) |
| Opportunities search | Raw `input` with custom icon field | shadcn Input with a Lucide icon |
| Opportunities table | Raw `table` styled in `workspace.css` | shadcn Table (+ TanStack Table for sorting, filtering, paging) |
| Sort headers, record links | Custom `.sort-button`, `.record-link` buttons | shadcn Button (`ghost`, `link`) |
| Stage labels | Custom `.stage` spans | shadcn Badge with stage colour tokens |
| Storage warning | Custom `.notice` paragraph | shadcn Alert |
| Empty results | Custom `.empty-state` | shadcn Empty |
| Opportunity editor | Raw `input`, `textarea`, `select`, custom sheet CSS | shadcn Input, Textarea, Select, Label, SheetHeader; default SheetContent |
| Bid brief | Raw `textarea`, native `select` | shadcn Textarea, Select, Label |
| CRM deal stage, timezone | Native `select` | shadcn Select |
| CRM pipeline | Native pointer drag events | Dice UI Kanban with mouse, touch, keyboard and shadcn Select |
| CRM toast | Custom `div` + raw dismiss button | shadcn Alert + Button (`icon-sm`) |
| CRM and owner record links | Raw `button.crm-person` | shadcn Button (`ghost`) |
| CRM activity rows | Raw `button` | shadcn Item (`asChild`) |
| CRM empty lists | Custom `.crm-empty` | shadcn Empty |
| Settings divider | Raw `hr` | shadcn Separator |
| Global CSS | Unused `.button-*` classes | Removed |

New registry files: `components/ui/label.tsx`, `alert.tsx`, `empty.tsx` (shadcn/ui source).

### Allowed exceptions

No registry component covers these yet. Each carries an `eslint-disable` comment in the code.

- **Company and template tiles** (`features/crm/crm.tsx`): clickable Card-style tiles. Next step: Item (`variant="outline"`) or Card with a link.
- **Sequence step list** (`features/crm/crm.tsx`): no registry stepper. Next step: a Dice UI or Kibo UI stepper.
- **Native button under Item `asChild`** (`features/crm/crm.tsx`, `features/crm/inbox-panel.tsx`): the registry pattern itself; allowed.

### Follow-ups that need a new package

- Toasts: replace the Alert-based toast with shadcn Sonner (`npx shadcn@latest add sonner`).
- Stepper as above.

### Sales pipeline

The board uses the [Dice UI Radix Kanban](https://diceui.com/docs/components/radix/kanban) registry item ([MIT license](DICEUI-LICENSE.md)). Its vendored component uses Folidock’s `cn` helper and dnd-kit for sensor handling, sorting, and the drag overlay. The local adaptations keep card sorting vertical within each stage, skip nonmeasurable keyboard targets, and require a valid board target for pointer drops. The drag preview updates in memory. Completing a valid move saves the order and stage to the existing demo storage. The shadcn Select also moves deals by stage with keyboard or touch.

## Feedback agent

- Reuse map: Card, Button, Textarea (widget); Accordion, Table, Badge, Alert, Empty, Input (`/admin/feedback`). All from `components/ui`; nothing installed.
- Exceptions: none. The `<form>` and `<a>` in the admin page are not restricted elements.
