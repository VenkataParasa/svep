"use client";

import * as React from "react";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMockDataStore } from "@/store/mock-data-store";

export default function SettingsPage() {
  const resetToSeed = useMockDataStore((s) => s.resetToSeed);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [largerText, setLargerText] = React.useState(false);

  function handleReset() {
    resetToSeed();
    toast.success("Demo data reset to seed values");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Platform configuration for this demo environment.</p>
      </div>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>Displayed in the platform footer and admin metadata.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Organization Name</Label>
            <Input defaultValue="City of Detroit" />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input defaultValue="Department of Elections" />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Email</Label>
            <Input defaultValue="elections@detroitmi.gov" />
          </div>
          <div className="space-y-1.5">
            <Label>Official Website</Label>
            <Input defaultValue="https://detroitmi.gov" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Theme & Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Color Theme</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Interface display language.</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle>Accessibility Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations across the platform.</p>
            </div>
            <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>High Contrast</Label>
              <p className="text-sm text-muted-foreground">Increase color contrast for readability.</p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Larger Text</Label>
              <p className="text-sm text-muted-foreground">Increase base font size site-wide.</p>
            </div>
            <Switch checked={largerText} onCheckedChange={setLargerText} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-destructive/30 shadow-sm">
        <CardHeader>
          <CardTitle>Demo Data</CardTitle>
          <CardDescription>
            Admin edits are stored in this browser only. Reset at any time to restore the original
            seed data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset Demo Data to Seed
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
