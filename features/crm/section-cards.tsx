// Adapted from the shadcn/ui dashboard-01 SectionCards block.
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  context: string;
  change?: string;
};

export function SectionCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="@container/main">
      <div
        className="grid grid-cols-1 gap-4 @[340px]/main:grid-cols-2 @4xl/main:grid-cols-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-muted/70 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs"
        aria-label="Workspace metrics"
      >
        {metrics.map(({ label, value, icon: Icon, context, change }) => (
          <Card key={label} className="@container/card gap-3 py-4">
            <CardHeader className="gap-y-2 px-4 sm:px-5">
              <CardDescription className="font-medium">{label}</CardDescription>
              <CardTitle className="col-span-full text-2xl leading-tight font-semibold tracking-tight tabular-nums @[205px]/card:text-3xl">
                {value}
              </CardTitle>
              <CardAction className="row-span-1">
                <Icon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </CardAction>
            </CardHeader>
            <CardFooter className="mt-auto flex-wrap gap-2 px-4 text-sm text-muted-foreground sm:px-5">
              {change && (
                <Badge variant="outline" className="tabular-nums">
                  {change}
                </Badge>
              )}
              {context}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
