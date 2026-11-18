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

<!-- The source fingerprints below are automatically refreshed by npm run ui:catalog. -->
<!-- ui-catalog accordion.tsx b377229353f9b05e295e5cef03cbd88fe6f98d25 -->
<!-- ui-catalog alert.tsx f99164ed4b320790482f514342dab5e72f284aca -->
<!-- ui-catalog avatar.tsx dceaf96a6227c0d10105c833adeac2b8a3d22539 -->
<!-- ui-catalog badge.tsx 2b41c16fb6f4a78ebab05088c1451c8f8cff0f3d -->
<!-- ui-catalog breadcrumb.tsx fdeada10c485d8b8c02d50ad04e77a5dced2ab28 -->
<!-- ui-catalog button.tsx 0d202d63f7724dc27b426c2376d28c7fd7198084 -->
<!-- ui-catalog card.tsx 6c922ec27ab7bb6a3c19253e1b3f5912ee861f91 -->
<!-- ui-catalog chart.tsx e81f68ce6b6224c02eaa53bd7dcc32db28838032 -->
<!-- ui-catalog dropdown-menu.tsx 3faa9f76f1f4c0c656cf0e4733d22ff8bf8c69b0 -->
<!-- ui-catalog empty.tsx 8ad1a987eec7f07226be7217e77db43480fa25a3 -->
<!-- ui-catalog input.tsx 1e3b9328903bda2e241ad19fffd804770f30f082 -->
<!-- ui-catalog item.tsx 8904bc69e130d8ae2b3a6519f149dfbc13670710 -->
<!-- ui-catalog kanban.tsx c23872bffa591cb6dbf38d38cf13802ec54b79a3 -->
<!-- ui-catalog label.tsx 1ac80f701ebfe9dc02d632c08cafade732e46625 -->
<!-- ui-catalog navigation-menu.tsx 65b562acbb64896a629d9e5353990e9c9b5bb3cc -->
<!-- ui-catalog select.tsx 18b305581d4ab93da1c1005f76cc87616145705e -->
<!-- ui-catalog separator.tsx baf5a66815ecdc0acfba7f45ea70765838bfe339 -->
<!-- ui-catalog sheet.tsx ce2be06dcef94c03e0a2b2b2e77edc0e9726f75e -->
<!-- ui-catalog sidebar.tsx af8a8e4f6b8563e31fc7b5196af0c71c3b43dc87 -->
<!-- ui-catalog skeleton.tsx 3ec6be770b846170b8e7f8916e5f165e2d1730df -->
<!-- ui-catalog table.tsx c707725e85a3a6852aff84e01c31999af6317d38 -->
<!-- ui-catalog tabs.tsx 27365d8b3361a1354178d8295c455763b2858b6b -->
<!-- ui-catalog textarea.tsx 8d02e03e18a4ddca3d4626aea8ccd24aef8ebbda -->
<!-- ui-catalog toggle-group.tsx 1f8a0ae5c58e7b6c5b618e5680e94f1cc9925110 -->
<!-- ui-catalog toggle.tsx d27756842b1da38412ab61237d90200ed230a6d3 -->
<!-- ui-catalog tooltip.tsx d10e766a14bc9c122271308fd1e7ca00a0e1c5f1 -->
