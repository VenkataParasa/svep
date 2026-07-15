"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearchCommand } from "@/components/layout/global-search-command";
import { useZipContextStore } from "@/store/zip-context-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/jurisdictions", label: "Jurisdictions" },
  { href: "/dashboard", label: "Civic Dashboard" },
  { href: "/officials-new", label: "Elected Officials" },
  { href: "/issues", label: "Civic Issues" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const zip = useZipContextStore((s) => s.zip);
  const location = useZipContextStore((s) => s.location);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const withLocation = (href: string) => {
    const savedLocation = location || zip;
    if (!savedLocation) return href;
    if (href === "/jurisdictions")
      return `${href}?location=${encodeURIComponent(savedLocation)}`;
    if (href === "/dashboard" && zip)
      return `${href}?zip=${encodeURIComponent(zip)}`;
    if (href === "/officials-new")
      return `${href}?address=${encodeURIComponent(savedLocation)}`;
    if (href === "/issues")
      return `${href}?location=${encodeURIComponent(savedLocation)}`;
    return href;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/detroit-logo.png"
            alt="City of Detroit"
            width={34}
            height={39}
            className="h-9 w-auto rounded-sm bg-white p-0.5"
            priority
          />
          <span className="hidden leading-tight md:block">
            <span className="block text-sm font-semibold">City of Detroit</span>
            <span className="block text-xs text-muted-foreground">
              Voter Education Platform
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={withLocation(item.href)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-9 w-56 justify-start gap-2 text-muted-foreground xl:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
              Ctrl K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 xl:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 lg:hidden"
                  aria-label="Menu"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={withLocation(item.href)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <GlobalSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
