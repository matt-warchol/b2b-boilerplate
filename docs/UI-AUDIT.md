# Folio UI audit

The original demo used bespoke sidebar markup, popovers, table markup and a CSS bar chart. The current version composes the official shadcn/ui Radix registry components below.

| Surface | Registry components in use | Folio-specific work |
| --- | --- | --- |
| CRM shell | Sidebar, SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarTrigger, Tooltip | Navigation items and icons, section grouping, brand, palette and spacing |
| CRM data | Table, Card, Avatar, Badge, Input, Textarea, Button | Record columns, sample data, status colors and search logic |
| CRM actions | Dropdown Menu and Sheet | Record, draft and sequence forms, filters, local persistence |
| Outbound dashboard | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, Card and Dropdown Menu | Recharts bar series, a 7/14-day range, palette, and sample time series |
| Landing | Navigation Menu, Dropdown Menu, Tabs, Card, Accordion and Button | Product copy, page layout, brand and screenshots from the running app |

The Folio wordmark, product views, charts' sample data and campaign workflow are project-specific. The kanban layout and the inbox split layout remain Folio compositions. The deal stage and timezone use native selects. The original procurement demo remains a separate example and retains its existing TanStack Table logic.

Framer Motion (Motion for React) animates CRM screen changes, deal layout transitions and product tour panel changes. Recharts animates the bar series. Radix and the registry's CSS animations handle menu, accordion and sheet transitions. Motion uses the user's reduced-motion preference. A global reduced-motion override covers CSS effects.

The registry's helper imports point at the project’s existing `cn` helper. The sidebar skeleton uses a deterministic width and its mobile hook uses React’s external-store API to comply with the project’s React lint rules.

References: [shadcn/ui registry](https://ui.shadcn.com/docs/components), [Chart](https://ui.shadcn.com/docs/components/chart), [Sidebar](https://ui.shadcn.com/docs/components/sidebar), [Motion for React](https://motion.dev/docs/react).

The Grill Me design review confirmed Campaigns as the landing’s primary destination and Overview as the secondary entry point. The product screenshot links to the Overview screen it depicts.
