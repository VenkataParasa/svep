"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { PopularZip } from "@/lib/types";
import { zipColorMap } from "@/lib/chart-colors";

const chartConfig: ChartConfig = {
  searches: { label: "Searches" },
};

export function ZipSearchesChart({ data }: { data: PopularZip[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="24%">
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="zip" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _name, item) => (
                <div className="flex w-full justify-between gap-4">
                  <span className="text-muted-foreground">{item.payload.neighborhood}</span>
                  <span className="font-mono font-medium tabular-nums">{Number(value).toLocaleString()}</span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="searches" radius={[4, 4, 0, 0]} maxBarSize={72}>
          {data.map((entry) => (
            <Cell key={entry.zip} fill={zipColorMap[entry.zip]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
