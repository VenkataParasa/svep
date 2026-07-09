import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
  href?: string;
}) {
  const content = (
    <Card className="h-full rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 py-5">
        <div className={cn("flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary", accent)}>
          <Icon className="size-5.5" />
        </div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
