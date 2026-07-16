"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PREVIEW_LENGTH = 300;

function normalizeBiography(value: string) {
  return value
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?|\u2028|\u2029/g, "\n")
    .trim();
}

export function ExpandableBiography({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const biography = React.useMemo(() => normalizeBiography(text), [text]);
  const canExpand = biography.length > PREVIEW_LENGTH;
  const displayedText =
    canExpand && !expanded
      ? `${biography.slice(0, PREVIEW_LENGTH).trimEnd()}…`
      : biography;
  const paragraphs = displayedText.split(/\n\s*\n+/);

  return (
    <div className={cn("text-foreground/90", className)}>
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {canExpand && (
        <button
          type="button"
          className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "See more…"}
        </button>
      )}
    </div>
  );
}
