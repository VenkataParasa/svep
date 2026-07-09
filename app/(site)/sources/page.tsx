"use client";

import * as React from "react";
import { ArrowUpDown, ExternalLink, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sources } from "@/data/sources";
import type { Source, SourceType, VerificationStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const verificationStyles: Record<VerificationStatus, string> = {
  verified: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  pending: "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400",
  unverified: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

type SortKey = "name" | "type" | "verificationStatus" | "lastUpdated";

export default function SourcesPage() {
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<SourceType | "all">("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortAsc, setSortAsc] = React.useState(true);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const filtered = sources
    .filter((s) => (typeFilter === "all" ? true : s.type === typeFilter))
    .filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a: Source, b: Source) => {
      const dir = sortAsc ? 1 : -1;
      return a[sortKey] > b[sortKey] ? dir : a[sortKey] < b[sortKey] ? -dir : 0;
    });

  const SortButton = ({ label, sortKeyValue }: { label: string; sortKeyValue: SortKey }) => (
    <button
      onClick={() => toggleSort(sortKeyValue)}
      className="flex items-center gap-1 font-medium hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Source Transparency" }]} />
      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">Source Transparency</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Every fact on this platform traces back to a cataloged source. Search, filter, and sort the
          full catalog below.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sources..."
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as SourceType | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All source types</SelectItem>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="legislative">Legislative</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="nonprofit">Nonprofit</SelectItem>
            <SelectItem value="campaign">Campaign</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} of {sources.length} sources
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortButton label="Source Name" sortKeyValue="name" /></TableHead>
              <TableHead><SortButton label="Type" sortKeyValue="type" /></TableHead>
              <TableHead><SortButton label="Verification" sortKeyValue="verificationStatus" /></TableHead>
              <TableHead><SortButton label="Last Updated" sortKeyValue="lastUpdated" /></TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="max-w-xs font-medium">{source.name}</TableCell>
                <TableCell className="capitalize">{source.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", verificationStyles[source.verificationStatus])}>
                    {source.verificationStatus}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(source.lastUpdated)}</TableCell>
                <TableCell className="text-right">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Visit <ExternalLink className="size-3.5" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No sources match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
