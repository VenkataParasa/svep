"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IssueFormDialog } from "@/components/admin/issue-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useMockDataStore } from "@/store/mock-data-store";
import { toast } from "sonner";

export default function ManageIssuesPage() {
  const issues = useMockDataStore((s) => s.issues);
  const deleteIssue = useMockDataStore((s) => s.deleteIssue);
  const [query, setQuery] = React.useState("");

  const filtered = issues.filter((i) => i.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Issues</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, or remove civic issue categories.</p>
        </div>
        <IssueFormDialog />
      </div>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search issues..." className="pl-9" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.title}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">{issue.summary}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <IssueFormDialog issue={issue} />
                  <DeleteConfirmDialog
                    itemLabel={issue.title}
                    onConfirm={() => {
                      deleteIssue(issue.id);
                      toast.success("Issue deleted");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No issues found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
