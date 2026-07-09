"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useZipContextStore, isValidZip } from "@/store/zip-context-store";
import { zipCodes } from "@/data/jurisdictions";

const schema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Enter a 5-digit ZIP code")
    .refine(isValidZip, {
      message: `This demo covers ${zipCodes.length} Detroit-area ZIP codes (48201–48243). Try 48226 (Downtown) or 48219 (Northwest).`,
    }),
});

type FormValues = z.infer<typeof schema>;

export function ZipSearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const setZip = useZipContextStore((s) => s.setZip);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { zip: "" },
  });

  function onSubmit(values: FormValues) {
    setZip(values.zip);
    router.push(`/dashboard?zip=${values.zip}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="Enter your ZIP code, e.g. 48226"
                      className="h-12 rounded-xl pl-9 text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 gap-2 rounded-xl px-6 text-base"
            disabled={form.formState.isSubmitting}
          >
            <Search className="size-4" />
            Find My Civic Information
          </Button>
        </div>
      </form>
    </Form>
  );
}
