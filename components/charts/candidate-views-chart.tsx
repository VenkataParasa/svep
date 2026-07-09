"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { CandidateViewStat } from "@/lib/types";
import { candidateColorMap } from "@/lib/chart-colors";

const chartConfig: ChartConfig = {
  views: { label: "Views" },
};

export function CandidateViewsChart({ data }: { data: CandidateViewStat[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="24%">
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="candidate" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={72}>
          {data.map((entry) => (
            <Cell key={entry.candidateId} fill={candidateColorMap[entry.candidate]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
