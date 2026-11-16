"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";

const points = [12,17,13,22,18,25,20,28,24,32,27,34,29,31].map((replies, i) => ({
  date: "Nov " + (i + 2), replies, meetings: [2,3,2,4,3,5,4,5,4,6,5,7,6,8][i],
}));
const config = {
  replies: { label: "Replies", color: "#5967c4" },
  meetings: { label: "Meetings", color: "#b3bff4" },
} satisfies ChartConfig;

export function OutboundChart() {
  const [range, setRange] = useState("14");
  const reduced = useReducedMotion();
  return <Card className="crm-panel performance">
    <CardHeader className="flex flex-row items-center justify-between gap-3">
      <div><CardTitle>Outbound performance</CardTitle><CardDescription>Replies and meetings per day · Sample data</CardDescription></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Last {range} days <ChevronDown /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end"><DropdownMenuRadioGroup value={range} onValueChange={setRange}>
          <DropdownMenuRadioItem value="7">Last 7 days</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="14">Last 14 days</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup></DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config} className="aspect-auto h-[245px] w-full">
        <BarChart accessibilityLayer data={points.slice(-Number(range))} margin={{ left: -18, right: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={20} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="replies" fill="var(--color-replies)" radius={4} isAnimationActive={!reduced} />
          <Bar dataKey="meetings" fill="var(--color-meetings)" radius={4} isAnimationActive={!reduced} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>;
}
