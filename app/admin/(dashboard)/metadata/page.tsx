import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { metadataFields } from "@/data/metadata";
import { formatDate } from "@/lib/utils";

export default function MetadataViewerPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Metadata Viewer</h1>
      <p className="mt-1 text-muted-foreground">
        Field-level data lineage and confidence scoring across the platform.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="w-40">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metadataFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.field}</TableCell>
                <TableCell className="max-w-xs text-muted-foreground">{field.value}</TableCell>
                <TableCell className="text-muted-foreground">{field.source}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(field.lastUpdated)}</TableCell>
                <TableCell className="text-muted-foreground">{field.version}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={field.confidenceScore} className="h-2" />
                    <span className="w-9 text-xs text-muted-foreground">{field.confidenceScore}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
