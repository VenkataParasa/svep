"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMockDataStore } from "@/store/mock-data-store";
import type { Candidate } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  office: z.string().min(1, "Office is required"),
  party: z.enum(["Democratic", "Republican", "Independent", "Nonpartisan", "Other"]),
  photoUrl: z.string().url().optional().or(z.literal("")),
  positionSummary: z.string().min(1, "Position summary is required"),
});

type FormValues = z.infer<typeof schema>;

export function CandidateFormDialog({ candidate }: { candidate?: Candidate }) {
  const [open, setOpen] = React.useState(false);
  const addCandidate = useMockDataStore((s) => s.addCandidate);
  const updateCandidate = useMockDataStore((s) => s.updateCandidate);
  const isEdit = Boolean(candidate);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: candidate?.name ?? "",
      office: candidate?.office ?? "",
      party: candidate?.party ?? "Nonpartisan",
      photoUrl: candidate?.photoUrl ?? "",
      positionSummary: candidate?.positionSummary ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: candidate?.name ?? "",
        office: candidate?.office ?? "",
        party: candidate?.party ?? "Nonpartisan",
        photoUrl: candidate?.photoUrl ?? "",
        positionSummary: candidate?.positionSummary ?? "",
      });
    }
  }, [open, candidate, form]);

  function onSubmit(values: FormValues) {
    const photoUrl = values.photoUrl ?? "";
    if (isEdit && candidate) {
      updateCandidate(candidate.id, { ...values, photoUrl, isDemoPhoto: !photoUrl });
      toast.success("Candidate updated");
    } else {
      addCandidate({
        ...values,
        photoUrl,
        isDemoPhoto: !photoUrl,
        election: "Not specified",
        level: "state",
        jurisdiction: "State of Michigan",
        electionDate: new Date().toISOString().slice(0, 10),
        status: "active",
        filingStatus: undefined,
        confidence: "demo-data",
        issuePositions: [],
        officialLinks: {},
        sourceIds: [],
        demoDataNote: "Created via Admin Panel — not sourced from official records.",
      });
      toast.success("Candidate created");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={isEdit ? <Button variant="ghost" size="icon-sm" /> : <Button className="gap-2" />}
      >
        {isEdit ? (
          <Pencil className="size-4" />
        ) : (
          <>
            <Plus className="size-4" />
            Add Candidate
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
          <DialogDescription>
            Changes are saved to local mock state for this demo session only.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="office"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Governor of Michigan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="party"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Democratic">Democratic</SelectItem>
                      <SelectItem value="Republican">Republican</SelectItem>
                      <SelectItem value="Independent">Independent</SelectItem>
                      <SelectItem value="Nonpartisan">Nonpartisan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="positionSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Summary</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save Changes" : "Create Candidate"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
