"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { setAdminCookie, verifyDemoCredentials } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: FormValues) {
    if (verifyDemoCredentials(values.username, values.password)) {
      setAdminCookie();
      toast.success("Signed in to Admin Panel");
      router.push(searchParams.get("from") ?? "/admin");
      router.refresh();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm rounded-2xl border-border/80 shadow-lg">
        <CardHeader className="items-center text-center">
          <Image
            src="/detroit-logo.png"
            alt="City of Detroit"
            width={52}
            height={60}
            className="mx-auto h-14 w-auto"
            priority
          />
          <CardTitle className="mt-3 text-xl">Staff Sign In</CardTitle>
          <CardDescription>City of Detroit Voter Education Platform — administration</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Sign-in failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
                <Lock className="size-4" />
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent/40 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Demo credentials: <span className="font-mono font-medium">admin</span> /{" "}
              <span className="font-mono font-medium">admin123</span>. For demonstration purposes
              only — not a production authentication system.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to the public site
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
