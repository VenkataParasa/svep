import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { IssueIcon } from "@/components/issues/issue-icon";
import { LiveIssueCategory } from "@/lib/live-issues";
import { ExternalLink, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveIssueCard({ category }: { category: LiveIssueCategory }) {
  return (
    <Card className="flex flex-col h-full rounded-2xl border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IssueIcon name={category.icon} className="size-5.5" />
          </div>
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Live via OpenStates
          </Badge>
        </div>
        <CardTitle className="mt-4 text-xl flex items-center justify-between">
          {category.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
          <Activity className="size-3.5 text-primary" /> Recent Legislation
        </h4>
        
        {category.bills.length > 0 ? (
          <ul className="space-y-3">
            {category.bills.map((bill) => (
              <li key={bill.id} className="text-sm border rounded-md p-2.5 bg-background">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className="font-semibold text-primary">{bill.billNumber}</span>
                  <Badge variant="secondary" className="text-[10px] leading-tight px-1.5 py-0">
                    {bill.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {bill.title}
                </p>
                {bill.url !== "#" && (
                  <a href={bill.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-[10px] text-blue-600 hover:underline">
                    View on OpenStates <ExternalLink className="ml-1 size-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-md text-center">
            No active legislation found for this issue.
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4 border-t border-border/40 mt-auto bg-muted/5 flex justify-center">
        <Link href="/officials-new" className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 mt-3">
          View your officials&apos; stances
          <ExternalLink className="w-3 h-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
