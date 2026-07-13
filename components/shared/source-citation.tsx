"use client";

import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface SourceCitationProps {
  sourceName?: string;
  sourceUrl?: string;
  confidenceScore?: number;
  lastUpdated?: Date | string;
  field?: string;
}

export function SourceCitation({
  sourceName,
  sourceUrl,
  confidenceScore,
  lastUpdated,
  field,
}: SourceCitationProps) {
  if (!sourceName) return null;

  return (
    <Popover>
      <PopoverTrigger
        className="ml-1.5 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="View source information"
      >
        <Info className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 shadow-md" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">Transparency Data</h4>
            {field && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Data Point: <span className="font-medium text-foreground">{field}</span>
              </p>
            )}
          </div>
          
          <div className="space-y-1.5 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Source:</span>
              <a
                href={sourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline text-right"
              >
                {sourceName}
              </a>
            </p>
            {confidenceScore !== undefined && (
              <p className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidence:</span>
                <Badge variant={confidenceScore > 90 ? "default" : "secondary"} className="h-5 px-1.5 text-[10px]">
                  {confidenceScore}%
                </Badge>
              </p>
            )}
            {lastUpdated && (
              <p className="flex justify-between">
                <span className="text-muted-foreground">Last Verified:</span>
                <span className="font-medium">
                  {formatDate(typeof lastUpdated === 'string' ? lastUpdated : lastUpdated.toISOString())}
                </span>
              </p>
            )}
          </div>
          
          <div className="rounded bg-muted p-2 text-xs text-muted-foreground">
            This information was automatically extracted from an official source to ensure auditable data pathways.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
