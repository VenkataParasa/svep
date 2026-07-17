"use client";

import * as React from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Newspaper,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IssueIcon } from "@/components/issues/issue-icon";
import type {
  LiveBill,
  LiveIssueCategory,
  LiveNewsArticle,
} from "@/lib/live-issues";
import { formatDate } from "@/lib/utils";

type SelectedItem =
  | { type: "bill"; item: LiveBill }
  | { type: "news"; item: LiveNewsArticle };

const INITIAL_ITEMS_PER_SECTION = 2;

export function LiveIssueCard({ category }: { category: LiveIssueCategory }) {
  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectedItem | null>(null);
  const visibleBills = expanded
    ? category.bills
    : category.bills.slice(0, INITIAL_ITEMS_PER_SECTION);
  const visibleNews = expanded
    ? category.news
    : category.news.slice(0, INITIAL_ITEMS_PER_SECTION);
  const hasMore =
    category.bills.length > INITIAL_ITEMS_PER_SECTION ||
    category.news.length > INITIAL_ITEMS_PER_SECTION;

  return (
    <>
      <Card className="flex h-full flex-col rounded-2xl border-border/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IssueIcon name={category.icon} className="size-5.5" />
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Live coverage
            </Badge>
          </div>
          <CardTitle className="mt-4 text-xl">{category.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 pt-4">
          <section>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Activity className="size-3.5 text-primary" /> Recent Legislation
            </h4>
            {visibleBills.length > 0 ? (
              <ul className="space-y-3">
                {visibleBills.map((bill) => (
                  <li key={bill.id}>
                    <button
                      type="button"
                      onClick={() => setSelected({ type: "bill", item: bill })}
                      className="w-full rounded-md border bg-background p-2.5 text-left transition-colors hover:border-primary/35 hover:bg-accent/30"
                    >
                      <span className="mb-1.5 flex items-start justify-between gap-2">
                        <span className="font-semibold text-primary">{bill.billNumber}</span>
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] leading-tight">
                          {bill.status}
                        </Badge>
                      </span>
                      <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {bill.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md bg-muted/30 p-3 text-center text-sm italic text-muted-foreground">
                No active legislation found for this issue.
              </p>
            )}
          </section>

          <section>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Newspaper className="size-3.5 text-primary" /> Recent News
            </h4>
            {visibleNews.length > 0 ? (
              <ul className="space-y-3">
                {visibleNews.map((article) => (
                  <li key={article.id}>
                    <button
                      type="button"
                      onClick={() => setSelected({ type: "news", item: article })}
                      className="w-full rounded-md border bg-background p-2.5 text-left transition-colors hover:border-primary/35 hover:bg-accent/30"
                    >
                      <span className="line-clamp-2 text-xs font-medium leading-relaxed">
                        {article.title}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                        <span>{article.source}</span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md bg-muted/30 p-3 text-center text-sm italic text-muted-foreground">
                No recent news found for this issue.
              </p>
            )}
          </section>
        </CardContent>

        {hasMore && (
          <CardFooter className="justify-center border-t bg-muted/5 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {expanded ? "View less" : "View more"}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.type === "bill" ? selected.item.billNumber : "News article"}
                </DialogTitle>
                <DialogDescription>
                  {selected.type === "bill"
                    ? `Legislation information from ${selected.item.source}`
                    : `Published by ${selected.item.source}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold leading-snug">{selected.item.title}</h3>
                {selected.type === "bill" ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selected.item.status}</Badge>
                      {selected.item.updatedAt && (
                        <Badge variant="outline">Updated {formatDate(selected.item.updatedAt)}</Badge>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Summary</h4>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {selected.item.summary || "No additional bill summary was returned by the legislative source."}
                      </p>
                    </div>
                    {selected.item.url !== "#" && (
                      <Button render={<a href={selected.item.url} target="_blank" rel="noopener noreferrer" />} className="gap-2">
                        View complete bill record <ExternalLink className="size-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {selected.item.publishedAt && (
                      <p className="text-sm text-muted-foreground">
                        Published {formatDate(selected.item.publishedAt)}
                      </p>
                    )}
                    <p className="text-sm leading-6 text-muted-foreground">
                      The publisher hosts the complete article. Open the original source to read its full reporting and verify any subsequent updates or corrections.
                    </p>
                    <Button render={<a href={selected.item.url} target="_blank" rel="noopener noreferrer" />} className="gap-2">
                      Read full article <ExternalLink className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
