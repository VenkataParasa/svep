"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  FileClock,
  HelpCircle,
  ListChecks,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions({ zip }: { zip: string }) {
  const actions = [
    { href: `/officials?zip=${zip}`, label: "Elected Officials", icon: Users },
    { href: "/issues", label: "Browse All Issues", icon: ListChecks },
    // { href: "/sources", label: "Source Transparency", icon: BookOpenCheck },
    // { href: "/audit-trail", label: "View Audit Trail", icon: FileClock },
    {
      href: `/why-this-information?zip=${zip}`,
      label: "Why This Information",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {actions.map((action) => (
        <Button
          key={action.href}
          variant="outline"
          className="gap-2 rounded-xl"
          render={<Link href={action.href} />}
        >
          <action.icon className="size-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
