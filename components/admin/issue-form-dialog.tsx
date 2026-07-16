"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Issue, IssueCategory } from "@/lib/types";

const categories: IssueCategory[] = [
  "Housing",
  "Education",
  "Public Safety",
  "Transportation",
  "Economic Development",
  "Environment",
  "Healthcare",
  "Parks & Recreation",
  "Taxation",
  "Government Accountability & Ethics",
];

const iconByCategory: Record<IssueCategory, string> = {
  Housing: "Home",
  Education: "GraduationCap",
  "Public Safety": "ShieldCheck",
  Transportation: "Bus",
  "Economic Development": "TrendingUp",
  Environment: "Leaf",
  Healthcare: "HeartPulse",
  "Parks & Recreation": "TreePine",
  Taxation: "BadgeDollarSign",
  "Government Accountability & Ethics": "Landmark",
};

const schema = z.object({
  title: z.enum([
    "Housing",
    "Education",
    "Public Safety",
    "Transportation",
    "Economic Development",
    "Environment",
    "Healthcare",
    "Parks & Recreation",
    "Taxation",
    "Government Accountability & Ethics",
  ]),
  summary: z.string().min(1, "Summary is required"),
  status: z.enum(["active", "monitoring"]),
});

type FormValues = z.infer<typeof schema>;

export function IssueFormDialog({ issue }: { issue?: Issue }) {
  const [open, setOpen] = React.useState(false);
  const addIssue = useMockDataStore((s) => s.addIssue);
  const updateIssue = useMockDataStore((s) => s.updateIssue);
  const isEdit = Boolean(issue);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: issue?.title ?? "Housing",
      summary: issue?.summary ?? "",
      status: issue?.status ?? "active",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: issue?.title ?? "Housing",
        summary: issue?.summary ?? "",
        status: issue?.status ?? "active",
      });
    }
  }, [open, issue, form]);

  function onSubmit(values: FormValues) {
    if (isEdit && issue) {
      updateIssue(issue.id, {
        ...values,
        icon: iconByCategory[values.title],
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
      toast.success("Issue updated");
    } else {
      addIssue({
        ...values,
        icon: iconByCategory[values.title],
        plainLanguageSummary: values.summary,
        communityImpact: "Added via Admin Panel — community impact not yet detailed.",
        relatedDepartments: [],
        legislationIds: [],
        representativeIds: [],
        candidateIds: [],
        publicDocuments: [],
        sourceIds: [],
        confidence: "demo-data",
        lastUpdated: new Date().toISOString().slice(0, 10),
        demoDataNote: "Created via Admin Panel — not sourced from official records.",
      });
      toast.success("Issue created");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button className="gap-2" />
          )
        }
      >
        {isEdit ? <Pencil className="size-4" /> : (
          <>
            <Plus className="size-4" />
            Add Issue
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Issue" : "Add Issue"}</DialogTitle>
          <DialogDescription>
            Changes are saved to local mock state for this demo session only.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title / Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isEdit ? "Save Changes" : "Create Issue"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
