# Folio UI audit

The original demo used bespoke sidebar markup, popovers, table markup and a CSS bar chart. The current version composes the official shadcn/ui Radix registry components below.

| Surface | Registry components in use | Folio-specific work |
| --- | --- | --- |
| CRM shell | Sidebar, SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarTrigger, Tooltip | Navigation items and icons, section grouping, brand, palette and spacing |
| CRM data | Table, Card, Avatar, Badge, Input, Textarea, Button | Record columns, sample data, status colors and search logic |
| CRM actions | Dropdown Menu and Sheet | Record, draft and sequence forms, filters, local persistence |
| Outbound dashboard | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, Card and Toggle Group | Recharts bar series, a 7/14-day range, palette, and sample time series |
| Landing | Navigation Menu, Dropdown Menu, Tabs, Card, Accordion and Button | Product copy, page layout, brand and screenshots from the running app |

The Folio wordmark, product views, charts' sample data and campaign workflow are project-specific. The kanban layout and the inbox split layout remain Folio compositions. The deal stage and timezone use native selects. The original procurement demo remains a separate example and retains its existing TanStack Table logic.

Framer Motion (Motion for React) animates CRM screen changes, deal layout transitions and product tour panel changes. Recharts animates the bar series. Radix and the registry's CSS animations handle menu, accordion and sheet transitions. Motion uses the user's reduced-motion preference. A global reduced-motion override covers CSS effects.

The registry's helper imports point at the project’s existing `cn` helper. The sidebar skeleton uses a deterministic width and its mobile hook uses React’s external-store API to comply with the project’s React lint rules.

References: [shadcn/ui registry](https://ui.shadcn.com/docs/components), [Chart](https://ui.shadcn.com/docs/components/chart), [Sidebar](https://ui.shadcn.com/docs/components/sidebar), [Motion for React](https://motion.dev/docs/react).

The Grill Me design review confirmed Campaigns as the landing’s primary destination and Overview as the secondary entry point. The product screenshot links to the Overview screen it depicts.

## Dashboard block pass

- **Copied and adapted from dashboard-01:** the inset shell, sidebar header, main and secondary navigation, account dropdown, site header, SectionCards and ChartAreaInteractive. Their implementations are in `features/crm/dashboard-shell.tsx`, `section-cards.tsx` and `outbound-chart.tsx`. Demo routes and Lucide icons replace the block's example links and icons. The area chart retains tooltips, keyboard navigation and a two-range control.
- **Composed from registry primitives:** the Inbox uses Item and Card with Avatar, Badge, Textarea and Button. The people and campaign views use the shared Table primitives and Folio's existing filters. The block's sample DataTable, document menu and unrelated libraries are omitted.
- **Folio-specific:** business data and workflows, the kanban and sequence layouts, inbox thread content, color tokens and Geist typography. Metric cards use tabular numerals; numeric table columns are right-aligned. Person illustrations use the Notionists style by Zoish through DiceBear (CC0 1.0), stored locally as small WebP files. Organization icons and avatar fallbacks use Lucide.
- **Motion:** screen entrance, deal transitions and landing tour changes use Motion for React. The area chart's entrance animation is Recharts and respects reduced motion. The sidebar, menus and sheet use the registry transitions.

[Dashboard block source and demo](https://ui.shadcn.com/blocks#dashboard-01) · [shadcn license](SHADCN-LICENSE.md) · [DiceBear Notionists](https://www.dicebear.com/styles/notionists/)

## Landing block pass

| Section | Starting point | Folio adaptation |
| --- | --- | --- |
| Header and mobile navigation | shadcn Navigation Menu, Dropdown Menu and Button | Folio links, addressable landing sections and a direct link to Campaigns. Header container is Folio's composition. |
| Hero | Tailark OSS `dusk-hero-section-2` | Split introduction and full-width product frame. Folio copy, responsive CRM screenshots, palette and Motion entrance. |
| Product story | Tailark OSS `dusk-content-2` | Two-column editorial layout with use cases tied to the working demo. |
| Feature grid | Tailark OSS `dusk-features-2` with shadcn Card | Three product cards using screenshots of pipeline, inbox and owner workspace. |
| Product tour | shadcn Tabs, Card and Button | Folio's content and tab transition. |
| Demo and template comparison | Tailark OSS `mist-pricing-2` with shadcn Card and Button | Two ways to use the starter. No commercial plans or prices are advertised. |
| FAQ, CTA and footer | Tailark OSS `dusk-faqs-1`, `dusk-call-to-action-1`, `dusk-footer-2` | shadcn Accordion, Folio copy and navigation. Example support, logos and AI links were removed. |

Motion for React animates the hero entrance, the first appearance of marketing sections and changes to the product tour. Feature image zoom is CSS. Both respect reduced-motion preferences. The hero background, screenshots, copy and section order are Folio-specific.

[Tailark OSS registry](https://tailark.com/docs) · [Tailark MIT license](TAILARK-LICENSE.md)

### SaaS owner demo

The owner panel uses the shadcn `dashboard-01` shell pattern, the shared CRM site header and metric cards, plus Table, Badge, Input, Dropdown Menu, Sheet, Select and Textarea for managing customers. Folio supplies the fictional records, filters and form behavior. The landing links to the owner demo, which keeps edits in its own browser storage namespace and simulates billing.
