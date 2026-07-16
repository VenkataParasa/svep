"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, LocateFixed, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useZipContextStore } from "@/store/zip-context-store";

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
  showGeolocation = false,
}: {
  className?: string;
  destination?: "jurisdictions" | "dashboard";
  showGeolocation?: boolean;
}) {
  const router = useRouter();
  const storedLocation = useZipContextStore((s) => s.location);
  const setResolvedLocation = useZipContextStore((s) => s.setResolvedLocation);
  const [locating, setLocating] = React.useState(false);

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
    setResolvedLocation(location, null);

    // if (destination === "jurisdictions") {
    //   router.push(`/jurisdictions?location=${encodeURIComponent(location)}`);
    //   return;
    // }

    router.push(`/dashboard?location=${encodeURIComponent(location)}`);
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      form.setError("zip", {
        message: "Location detection is not supported by this browser.",
      });
      return;
    }

    setLocating(true);
    form.clearErrors("zip");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const params = new URLSearchParams({
          lat: coords.latitude.toFixed(6),
          lon: coords.longitude.toFixed(6),
        });
        router.push(`/jurisdictions?${params.toString()}`);
      },
      (error) => {
        setLocating(false);
        form.setError("zip", {
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location permission was denied. Enter your address or ZIP code instead."
              : error.code === error.TIMEOUT
              ? "Location detection timed out. Try again or enter your address."
              : "Your location could not be detected. Enter your address or ZIP code instead.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
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
            Find My Jurisdiction Information
          </Button>
        </div>
        {showGeolocation && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="mt-3 h-11 w-full gap-2 rounded-xl text-sm"
            onClick={useCurrentLocation}
            disabled={locating || form.formState.isSubmitting}
          >
            {locating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LocateFixed className="size-4" />
            )}
            {locating ? "Locating…" : "Use my current device location"}
          </Button>
        )}
      </form>
    </Form>
  );
}
