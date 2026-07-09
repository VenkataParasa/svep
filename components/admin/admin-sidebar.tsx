"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  FileClock,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  Tags,
  Users,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminCookie } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/issues", label: "Manage Issues", icon: ListChecks },
  { href: "/admin/candidates", label: "Manage Candidates", icon: Vote },
  { href: "/admin/representatives", label: "Manage Representatives", icon: Users },
  { href: "/admin/api-monitor", label: "API Monitor", icon: Activity },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/metadata", label: "Metadata", icon: Tags },
  { href: "/admin/logs", label: "Logs", icon: FileClock },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminCookie();
    toast.success("Signed out of Admin Panel");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <Image
          src="/detroit-logo.png"
          alt="City of Detroit"
          width={30}
          height={35}
          className="h-9 w-auto rounded-sm bg-white p-0.5"
        />
        <span className="leading-tight">
          <span className="block text-sm font-semibold">City of Detroit</span>
          <span className="block text-xs text-muted-foreground">Admin Panel</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link href="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
          ← Back to public site
        </Link>
        <Button variant="outline" className="mt-1 w-full gap-2" onClick={handleLogout}>
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
