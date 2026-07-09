"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { CivicInterestTrend } from "@/lib/types";

const chartConfig: ChartConfig = {
  housing: { label: "Housing", color: "var(--chart-1)" },
  education: { label: "Education", color: "var(--chart-2)" },
  publicSafety: { label: "Public Safety", color: "var(--chart-3)" },
  transportation: { label: "Transportation", color: "var(--chart-4)" },
  economicDevelopment: { label: "Economic Development", color: "var(--chart-5)" },
  environment: { label: "Environment", color: "var(--chart-6)" },
  healthcare: { label: "Healthcare", color: "var(--chart-7)" },
  parksRecreation: { label: "Parks & Recreation", color: "var(--chart-8)" },
};

export function CivicInterestTrendChart({ data }: { data: CivicInterestTrend[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {Object.keys(chartConfig).map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
