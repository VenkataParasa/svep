import { BadgeCheck, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Confidence } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ConfidenceBadge({
  confidence,
  note,
  className,
}: {
  confidence: Confidence;
  note?: string;
  className?: string;
}) {
  const isVerified = confidence === "verified";
  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        isVerified
          ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
          : "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
        className
      )}
    >
      {isVerified ? <BadgeCheck className="size-3.5" /> : <FlaskConical className="size-3.5" />}
      {isVerified ? "Verified" : "Demo Data"}
    </Badge>
  );

  if (!note) return badge;

  return (
    <Tooltip>
      <TooltipTrigger render={badge} />
      <TooltipContent className="max-w-xs">{note}</TooltipContent>
    </Tooltip>
  );
}
