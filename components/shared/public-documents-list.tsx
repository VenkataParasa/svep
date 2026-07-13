import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicDocument } from "@/lib/types";
import { NOT_AVAILABLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const typeLabel: Record<PublicDocument["type"], string> = {
  agenda: "Agenda",
  minutes: "Minutes",
  ordinance: "Ordinance",
  resolution: "Resolution",
  bill: "Bill",
  report: "Report",
  publication: "Publication",
};

export function PublicDocumentsList({ documents }: { documents: PublicDocument[] }) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">{NOT_AVAILABLE}</p>;
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc, i) => (
        <li key={doc.id || `${doc.url}-${i}`}>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {doc.title}
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                </p>
                {doc.date && <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(doc.date)}</p>}
              </div>
            </div>
            <Badge variant="outline" className="shrink-0 font-medium capitalize">
              {typeLabel[doc.type]}
            </Badge>
          </a>
        </li>
      ))}
    </ul>
  );
}
