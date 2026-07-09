import { Badge } from "@/components/ui/badge";
import type { Party } from "@/lib/types";
import { cn } from "@/lib/utils";

const partyStyles: Record<Party, string> = {
  Democratic: "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400",
  Republican: "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400",
  Independent: "border-violet-600/30 bg-violet-600/10 text-violet-700 dark:text-violet-400",
  Nonpartisan: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Other: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

export function PartyBadge({ party, className }: { party: Party; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", partyStyles[party], className)}>
      {party}
    </Badge>
  );
}
