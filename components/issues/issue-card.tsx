import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueIcon } from "@/components/issues/issue-icon";
import type { Issue } from "@/lib/types";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.slug}`} className="block h-full">
      <Card className="group h-full rounded-2xl border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IssueIcon name={issue.icon} className="size-5.5" />
          </div>
          <CardTitle className="mt-3 flex items-center justify-between text-lg">
            {issue.title}
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{issue.summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
