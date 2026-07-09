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
import type { Representative } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  office: z.string().min(1, "Office is required"),
  party: z.enum(["Democratic", "Republican", "Independent", "Nonpartisan", "Other"]),
  level: z.enum(["federal", "state", "city"]),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  photoUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().min(1, "Bio is required"),
});

type FormValues = z.infer<typeof schema>;

export function RepresentativeFormDialog({ representative }: { representative?: Representative }) {
  const [open, setOpen] = React.useState(false);
  const addRepresentative = useMockDataStore((s) => s.addRepresentative);
  const updateRepresentative = useMockDataStore((s) => s.updateRepresentative);
  const isEdit = Boolean(representative);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: representative?.name ?? "",
      office: representative?.office ?? "",
      party: representative?.party ?? "Nonpartisan",
      level: representative?.level ?? "city",
      jurisdiction: representative?.jurisdiction ?? "",
      photoUrl: representative?.photoUrl ?? "",
      bio: representative?.bio ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: representative?.name ?? "",
        office: representative?.office ?? "",
        party: representative?.party ?? "Nonpartisan",
        level: representative?.level ?? "city",
        jurisdiction: representative?.jurisdiction ?? "",
        photoUrl: representative?.photoUrl ?? "",
        bio: representative?.bio ?? "",
      });
    }
  }, [open, representative, form]);

  function onSubmit(values: FormValues) {
    const photoUrl = values.photoUrl ?? "";
    if (isEdit && representative) {
      updateRepresentative(representative.id, { ...values, photoUrl, isDemoPhoto: !photoUrl });
      toast.success("Representative updated");
    } else {
      addRepresentative({
        ...values,
        photoUrl,
        isDemoPhoto: !photoUrl,
        confidence: "demo-data",
        responsibilities: [],
        initiatives: [],
        contact: {},
        issuePositions: [],
        sourceIds: [],
        demoDataNote: "Created via Admin Panel — not sourced from official records.",
      });
      toast.success("Representative created");
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
            Add Representative
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Representative" : "Add Representative"}</DialogTitle>
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
                    <Input {...field} placeholder="e.g. City Council Member, District 5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="state">State</SelectItem>
                        <SelectItem value="federal">Federal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. City of Detroit — District 5" />
                  </FormControl>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save Changes" : "Create Representative"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
