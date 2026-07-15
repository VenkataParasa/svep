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

const schema = z.object({
  zip: z
    .string()
    .trim()
    .min(5, "Enter a full street address, ZIP code, or ZIP+4"),
});

type FormValues = z.infer<typeof schema>;

export function ZipSearchForm({
  className,
  destination = "jurisdictions",
}: {
  className?: string;
  destination?: "jurisdictions" | "dashboard";
}) {
  const router = useRouter();
  const setZip = useZipContextStore((s) => s.setZip);
  const storedLocation = useZipContextStore((s) => s.location);
  const setLocation = useZipContextStore((s) => s.setLocation);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { zip: "" },
  });

  React.useEffect(() => {
    if (storedLocation && !form.getValues("zip")) {
      form.setValue("zip", storedLocation);
    }
  }, [storedLocation, form]);

  async function onSubmit(values: FormValues) {
    const location = values.zip.trim();
    setLocation(location);

    if (destination === "jurisdictions") {
      router.push(`/jurisdictions?location=${encodeURIComponent(location)}`);
      return;
    }

    let resolvedZip = location;
    const postalMatch = location.match(/^\d{5}$/);

    if (postalMatch) {
      resolvedZip = location;
    } else {
      try {
        const response = await fetch(`/api/v1/geocode?address=${encodeURIComponent(location)}`);
        const payload = await response.json();
        if (!response.ok || !payload.address?.zipCode) {
          throw new Error(payload.error || "We could not find that address.");
        }
        resolvedZip = String(payload.address.zipCode).match(/\b\d{5}\b/)?.[0] ?? "";
      } catch (error) {
        form.setError("zip", {
          message: error instanceof Error ? error.message : "We could not find that address.",
        });
        return;
      }
    }

    if (!isValidZip(resolvedZip)) {
      form.setError("zip", {
        message: "The location service did not return a valid five-digit ZIP code.",
      });
      return;
    }

    setZip(resolvedZip);
    router.push(`/dashboard?zip=${resolvedZip}`);
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
                      type="text"
                      autoComplete="street-address"
                      placeholder="Enter full address, ZIP code, or ZIP+4"
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
