"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateFormDialog } from "@/components/admin/candidate-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useMockDataStore } from "@/store/mock-data-store";
import { toast } from "sonner";

export default function ManageCandidatesPage() {
  const candidates = useMockDataStore((s) => s.candidates);
  const deleteCandidate = useMockDataStore((s) => s.deleteCandidate);
  const [query, setQuery] = React.useState("");

  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Candidates</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, or remove candidate profiles.</p>
        </div>
        <CandidateFormDialog />
      </div>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search candidates..." className="pl-9" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="flex items-center gap-2.5 font-medium">
                  <PersonAvatar name={candidate.name} photoUrl={candidate.photoUrl} size="sm" />
                  {candidate.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{candidate.office}</TableCell>
                <TableCell>
                  <PartyBadge party={candidate.party} />
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">{candidate.status}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <CandidateFormDialog candidate={candidate} />
                  <DeleteConfirmDialog
                    itemLabel={candidate.name}
                    onConfirm={() => {
                      deleteCandidate(candidate.id);
                      toast.success("Candidate deleted");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No candidates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
