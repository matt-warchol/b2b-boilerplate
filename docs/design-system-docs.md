# Design system: installed components and props

**Source of truth:** checked-in TypeScript files, not the agent's memory. This inventory lists the 26 installed shadcn/Dice UI modules in `components/ui`. Component names and custom prop contracts were inspected on 18 Nov 2026. Inherited HTML/Radix/Recharts props remain defined by the exact source annotations and TypeScript types; follow the links to check a specific prop before using it.

> Registry recommendations in [DESIGN.md](../DESIGN.md) are **not** a promise that each upstream block is installed. Read [the AI agent usage guide](USING-WITH-AI.md) before building or auditing. Run `npm run ui:catalog` to refresh this catalog from source.

## Installed components

| Source module | Available exports | Props: source contract and local additions |
| --- | --- | --- |
| [`accordion.tsx`](../components/ui/accordion.tsx) | Accordion, AccordionItem, AccordionTrigger, AccordionContent | Radix Accordion Root/Item/Trigger/Content props |
| [`alert.tsx`](../components/ui/alert.tsx) | Alert, AlertTitle, AlertDescription | React div props; Alert has `VariantProps<typeof alertVariants>` |
| [`avatar.tsx`](../components/ui/avatar.tsx) | Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount | Radix Avatar props; `Avatar.size?: default \| sm \| lg` |
| [`badge.tsx`](../components/ui/badge.tsx) | Badge | React span props + `VariantProps<typeof badgeVariants>` + `asChild?: boolean` |
| [`breadcrumb.tsx`](../components/ui/breadcrumb.tsx) | Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis | React nav/ol/li/a/span props; `BreadcrumbLink.asChild?: boolean` |
| [`button.tsx`](../components/ui/button.tsx) | Button | React button props + `VariantProps<typeof buttonVariants>` + `asChild?: boolean` (variants: default/destructive/outline/secondary/ghost/link; sizes: default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg) |
| [`card.tsx`](../components/ui/card.tsx) | Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent | React div props |
| [`chart.tsx`](../components/ui/chart.tsx) | ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle | Recharts props; `ChartContainer.config: ChartConfig`, `children: ResponsiveContainer children`, `initialDimension?: {width,height}`; TooltipContent indicator/hideLabel/hideIndicator/nameKey/labelKey |
| [`dropdown-menu.tsx`](../components/ui/dropdown-menu.tsx) | DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent | Radix DropdownMenu props; Item supports `inset?` and `variant?: default \| destructive` |
| [`empty.tsx`](../components/ui/empty.tsx) | Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia | React container/text props; EmptyMedia variants via `emptyMediaVariants` |
| [`input.tsx`](../components/ui/input.tsx) | Input | React input props |
| [`item.tsx`](../components/ui/item.tsx) | Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter | React container props; Item has `VariantProps<typeof itemVariants>` + `asChild?` |
| [`kanban.tsx`](../components/ui/kanban.tsx) | Kanban, KanbanBoard, KanbanColumn, KanbanColumnHandle, KanbanItem, KanbanItemHandle, KanbanOverlay | Dice UI Kanban + dnd-kit, local `KanbanProps`, `KanbanBoardProps`, `KanbanColumnProps`, `KanbanColumnHandleProps`, `KanbanItemProps`, `KanbanItemHandleProps`, `KanbanOverlayProps` |
| [`label.tsx`](../components/ui/label.tsx) | Label | Radix Label root props |
| [`navigation-menu.tsx`](../components/ui/navigation-menu.tsx) | NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport | Radix navigation-menu props; NavigationMenu has `viewport?: boolean` |
| [`select.tsx`](../components/ui/select.tsx) | Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue | Radix Select props; SelectTrigger has `size?: sm \| default` |
| [`separator.tsx`](../components/ui/separator.tsx) | Separator | Radix Separator root props |
| [`sheet.tsx`](../components/ui/sheet.tsx) | Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription | Radix Dialog props; SheetContent supports `side?: top \| right \| bottom \| left`, `showCloseButton?: boolean` |
| [`sidebar.tsx`](../components/ui/sidebar.tsx) | Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger | React element props plus local overrides: Sidebar `side`, `variant`, `collapsible`; SidebarMenuButton `asChild`, `isActive`, `tooltip`, variant/size; SidebarProvider `defaultOpen`, `open`, `onOpenChange` |
| [`skeleton.tsx`](../components/ui/skeleton.tsx) | Skeleton | React div props |
| [`table.tsx`](../components/ui/table.tsx) | Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption | Native React table/thead/tbody/tfoot/th/tr/td/caption props |
| [`tabs.tsx`](../components/ui/tabs.tsx) | Tabs, TabsList, TabsTrigger, TabsContent | Radix Tabs props; TabsList `VariantProps<typeof tabsListVariants>` (default/line) |
| [`textarea.tsx`](../components/ui/textarea.tsx) | Textarea | React textarea props |
| [`toggle-group.tsx`](../components/ui/toggle-group.tsx) | ToggleGroup, ToggleGroupItem | Radix ToggleGroup props + `VariantProps<typeof toggleVariants>`; ToggleGroup `spacing?: number` |
| [`toggle.tsx`](../components/ui/toggle.tsx) | Toggle | Radix Toggle root props + `VariantProps<typeof toggleVariants>` |
| [`tooltip.tsx`](../components/ui/tooltip.tsx) | Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | Radix Tooltip props |

## Additional reusable compositions

| Area | Source | Notes |
| --- | --- | --- |
| Public-site Tailark compositions | [marketing/blocks.tsx](../components/marketing/blocks.tsx) | Hero, features, FAQ, CTA, footer; use existing shadcn and layout tokens |
| Marketing product tour, navigation and FAQ | [folio-landing.tsx](../components/folio-landing.tsx) | NavigationMenu, Tabs and Accordion compositions |
| Product feedback agent | [components/feedback](../components/feedback), [FEEDBACK.md](FEEDBACK.md) | Chat widget, mount and copy-prompt action; Supabase/provider configuration required |
| CRM layout and navigation | [dashboard-shell.tsx](../features/crm/dashboard-shell.tsx) | Adapted from shadcn dashboard-01; reuse before designing a custom shell |
| Deal pipeline | [pipeline-board.tsx](../features/crm/pipeline-board.tsx) | Dice UI Kanban + dnd-kit, Card and Select |
| Analytics charts | [outbound-chart.tsx](../features/crm/outbound-chart.tsx) | shadcn Chart + Recharts; keep tooltips and accessible legends |
| Tender workspace records | [opportunities/table.tsx](../features/opportunities/table.tsx) | shadcn Table + TanStack Table |

## Agent rule: verify, then reuse

1. Choose the job and locate an **installed** export above; examine the source-linked props and at least one existing import/usage.
2. Prefer a complete installed block or composition over building a new primitive. If missing, consult official shadcn blocks first, then Tailark/Dice UI and verify licenses before installing.
3. Use `components.json`, `package.json` and TypeScript types to confirm library versions and API signatures. Never invent props/exports based on generic upstream examples.
4. Include the reuse map (section → component/block → source file), and distinguish already installed vs upstream-only.
5. After implementation, inspect actual imports and run `npm run check`. Document exceptions in [UI-AUDIT.md](UI-AUDIT.md).

`npm run ui:catalog` rebuilds this list from actual source exports/parameters. `npm run ui:catalog:check` verifies the checked-in inventory still names every installed UI module. TypeScript remains the ultimate validator for props.
