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
