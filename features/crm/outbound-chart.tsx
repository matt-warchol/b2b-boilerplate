"use client";

// Adapted from shadcn/ui dashboard-01's ChartAreaInteractive.
import { useId, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useReducedMotion } from "motion/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const points = [12, 17, 13, 22, 18, 25, 20, 28, 24, 32, 27, 34, 29, 31].map(
  (replies, i) => ({
    date: "Nov " + (i + 2),
    replies,
    meetings: [2, 3, 2, 4, 3, 5, 4, 5, 4, 6, 5, 7, 6, 8][i],
  }),
);
const config = {
  replies: { label: "Replies", color: "var(--folio-chart-replies)" },
  meetings: { label: "Meetings", color: "var(--folio-chart-meetings)" },
} satisfies ChartConfig;

export function OutboundChart() {
  const [range, setRange] = useState("14");
  const reduced = useReducedMotion();
  const id = useId();
  return (
    <Card className="@container/card min-w-0">
      <CardHeader className="max-sm:gap-3 max-sm:px-4">
        <CardTitle>
          <h2 className="text-lg font-semibold tracking-tight">
            Outbound performance
          </h2>
        </CardTitle>
        <CardDescription>
          Replies and meetings per day · Sample data
        </CardDescription>
        <CardAction className="col-start-1 row-start-3 justify-self-start @[480px]/card:col-start-2 @[480px]/card:row-start-1 @[480px]/card:justify-self-end">
          <ToggleGroup
            aria-label="Chart date range"
            type="single"
            variant="outline"
            size="sm"
            value={range}
            onValueChange={(value) => value && setRange(value)}
          >
            <ToggleGroupItem value="7">7 days</ToggleGroupItem>
            <ToggleGroupItem value="14">14 days</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="max-sm:px-3">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={points.slice(-Number(range))}
            margin={{ left: 0, right: 8 }}
          >
            <defs>
              {(["replies", "meetings"] as const).map((key) => (
                <linearGradient
                  key={key}
                  id={id + key}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.34}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.04}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
            />
            <YAxis
              width={30}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {(["replies", "meetings"] as const).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={`url(#${id + key})`}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                isAnimationActive={!reduced}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
