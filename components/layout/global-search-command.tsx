"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Landmark, ScrollText, UserRound } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { buildSearchIndex, type SearchResultType } from "@/lib/search";

const typeIcon: Record<SearchResultType, React.ElementType> = {
  issue: FileText,
  candidate: UserRound,
  representative: Landmark,
  legislation: ScrollText,
};

const typeLabel: Record<SearchResultType, string> = {
  issue: "Issues",
  candidate: "Candidates",
  representative: "Representatives",
  legislation: "Legislation",
};

export function GlobalSearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const index = React.useMemo(() => buildSearchIndex(), []);

  const grouped = React.useMemo(() => {
    const groups: Record<SearchResultType, typeof index> = {
      issue: [],
      candidate: [],
      representative: [],
      legislation: [],
    };
    for (const item of index) groups[item.type].push(item);
    return groups;
  }, [index]);

  const runCommand = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Global Search"
      description="Search issues, candidates, representatives, and legislation"
    >
      <CommandInput placeholder="Search issues, candidates, representatives, bills..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {(Object.keys(grouped) as SearchResultType[]).map((type) => {
          const items = grouped[type];
          if (items.length === 0) return null;
          const Icon = typeIcon[type];
          return (
            <CommandGroup key={type} heading={typeLabel[type]}>
              {items.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.id}`}
                  value={`${item.title} ${item.subtitle}`}
                  onSelect={() => runCommand(item.href)}
                >
                  <Icon />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
