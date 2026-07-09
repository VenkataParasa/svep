"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { MostViewedIssue } from "@/lib/types";
import { issueColorMap } from "@/lib/chart-colors";

const chartConfig: ChartConfig = {
  views: { label: "Views" },
};

export function IssueViewsChart({ data }: { data: MostViewedIssue[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="issue"
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fontSize: 11 }}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((entry) => (
            <Cell key={entry.issueId} fill={issueColorMap[entry.issue]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
