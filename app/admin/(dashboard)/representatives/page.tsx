"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { PartyBadge } from "@/components/shared/party-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RepresentativeFormDialog } from "@/components/admin/representative-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { useMockDataStore } from "@/store/mock-data-store";
import { toast } from "sonner";

export default function ManageRepresentativesPage() {
  const representatives = useMockDataStore((s) => s.representatives);
  const deleteRepresentative = useMockDataStore((s) => s.deleteRepresentative);
  const [query, setQuery] = React.useState("");

  const filtered = representatives.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Representatives</h1>
          <p className="mt-1 text-muted-foreground">Add, edit, or remove elected official profiles.</p>
        </div>
        <RepresentativeFormDialog />
      </div>

      <div className="relative mt-6 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search representatives..." className="pl-9" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((representative) => (
              <TableRow key={representative.id}>
                <TableCell className="flex items-center gap-2.5 font-medium">
                  <PersonAvatar name={representative.name} photoUrl={representative.photoUrl} size="sm" />
                  {representative.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{representative.office}</TableCell>
                <TableCell>
                  <PartyBadge party={representative.party} />
                </TableCell>
                <TableCell>
                  <ConfidenceBadge confidence={representative.confidence} note={representative.demoDataNote} />
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <RepresentativeFormDialog representative={representative} />
                  <DeleteConfirmDialog
                    itemLabel={representative.name}
                    onConfirm={() => {
                      deleteRepresentative(representative.id);
                      toast.success("Representative deleted");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No representatives found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
