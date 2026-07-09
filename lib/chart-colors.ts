import { issues } from "@/data/issues";
import { zipCodes } from "@/data/jurisdictions";
import { candidates } from "@/data/candidates";

// Fixed categorical color slots (validated with the dataviz skill's
// palette validator for both light and dark chart surfaces). Colors are
// assigned by entity identity in a stable domain order, never by a
// chart's current sort/rank, so a given issue/ZIP/candidate always reads
// the same color across every chart.
const slots = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

function buildColorMap(keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key, i) => [key, slots[i % slots.length]]));
}

export const issueColorMap = buildColorMap(issues.map((i) => i.title));
export const zipColorMap = buildColorMap([...zipCodes]);
export const candidateColorMap = buildColorMap(candidates.map((c) => c.name));
