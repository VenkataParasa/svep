import { FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Confidence } from "@/lib/types";

// RFP requirement: profiles must include "clear explanations detailing how
// the system determined the candidate's position." This card states the
// derivation method in plain language and points at the Sources section
// that holds the underlying public documents.
export function PositionMethodology({
  subjectName,
  confidence,
  demoDataNote,
  sourceCount,
}: {
  subjectName: string;
  confidence: Confidence;
  demoDataNote?: string;
  sourceCount: number;
}) {
  return (
    <Card className="mt-5 rounded-2xl border-primary/20 bg-accent/30 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSearch className="size-4.5 text-primary" />
          How these positions were determined
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-relaxed text-foreground/90">
        <p>
          Position summaries for {subjectName} are derived exclusively from the{" "}
          {sourceCount} public source{sourceCount === 1 ? "" : "s"} listed in the Sources
          section below — official government records, legislative actions, and publicly
          published campaign materials. The platform does not infer, predict, or generate
          political opinions: if a position has not been publicly stated, it is shown as
          &ldquo;Information not available&rdquo; rather than estimated.
        </p>
        {confidence === "verified" ? (
          <p className="text-muted-foreground">
            This profile is marked <span className="font-medium text-foreground">Verified</span>:
            its core facts are directly confirmed by at least one official .gov source.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Parts of this profile are marked{" "}
            <span className="font-medium text-foreground">Demo Data</span>
            {demoDataNote ? `: ${demoDataNote}` : "."}
          </p>
        )}
        {confidence === "verified" && demoDataNote && (
          <p className="text-muted-foreground">{demoDataNote}</p>
        )}
      </CardContent>
    </Card>
  );
}
