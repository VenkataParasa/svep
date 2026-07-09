import type { AuditRecord } from "@/lib/types";

// Illustrates the platform's data lineage: Retrieved -> Verified ->
// Processed -> Displayed, for a representative sample of entities.
export const auditRecords: AuditRecord[] = [
  // Housing issue
  { id: "audit-001", entityType: "issue", entityId: "issue-housing", entityLabel: "Housing", stage: "retrieved", timestamp: "2026-07-01T06:00:00Z", source: "Michigan Legislature (legislature.mi.gov)", version: "v1.4.0", status: "success" },
  { id: "audit-002", entityType: "issue", entityId: "issue-housing", entityLabel: "Housing", stage: "verified", timestamp: "2026-07-01T06:04:12Z", source: "Editorial review — official source cross-check", version: "v1.4.0", status: "success" },
  { id: "audit-003", entityType: "issue", entityId: "issue-housing", entityLabel: "Housing", stage: "processed", timestamp: "2026-07-01T06:05:47Z", source: "Content pipeline", version: "v1.4.0", status: "success" },
  { id: "audit-004", entityType: "issue", entityId: "issue-housing", entityLabel: "Housing", stage: "displayed", timestamp: "2026-07-01T06:06:00Z", source: "Voter Education Platform", version: "v1.4.0", status: "success" },

  // Education issue
  { id: "audit-005", entityType: "issue", entityId: "issue-education", entityLabel: "Education", stage: "retrieved", timestamp: "2026-07-01T06:10:00Z", source: "Michigan.gov press releases", version: "v1.4.0", status: "success" },
  { id: "audit-006", entityType: "issue", entityId: "issue-education", entityLabel: "Education", stage: "verified", timestamp: "2026-07-01T06:13:30Z", source: "Editorial review — official source cross-check", version: "v1.4.0", status: "success" },
  { id: "audit-007", entityType: "issue", entityId: "issue-education", entityLabel: "Education", stage: "processed", timestamp: "2026-07-01T06:14:55Z", source: "Content pipeline", version: "v1.4.0", status: "success" },
  { id: "audit-008", entityType: "issue", entityId: "issue-education", entityLabel: "Education", stage: "displayed", timestamp: "2026-07-01T06:15:10Z", source: "Voter Education Platform", version: "v1.4.0", status: "success" },

  // Public Safety issue
  { id: "audit-009", entityType: "issue", entityId: "issue-public-safety", entityLabel: "Public Safety", stage: "retrieved", timestamp: "2026-07-01T06:20:00Z", source: "Detroit News / detroitmi.gov", version: "v1.4.0", status: "success" },
  { id: "audit-010", entityType: "issue", entityId: "issue-public-safety", entityLabel: "Public Safety", stage: "verified", timestamp: "2026-07-01T06:24:02Z", source: "Editorial review — official source cross-check", version: "v1.4.0", status: "success" },
  { id: "audit-011", entityType: "issue", entityId: "issue-public-safety", entityLabel: "Public Safety", stage: "processed", timestamp: "2026-07-01T06:25:18Z", source: "Content pipeline", version: "v1.4.0", status: "warning" },
  { id: "audit-012", entityType: "issue", entityId: "issue-public-safety", entityLabel: "Public Safety", stage: "displayed", timestamp: "2026-07-01T06:25:40Z", source: "Voter Education Platform", version: "v1.4.0", status: "success" },

  // Jurisdiction 48226
  { id: "audit-013", entityType: "jurisdiction", entityId: "48226", entityLabel: "ZIP 48226 — Downtown Detroit", stage: "retrieved", timestamp: "2026-07-01T05:45:00Z", source: "detroitmi.gov council district pages", version: "v2.0.1", status: "success" },
  { id: "audit-014", entityType: "jurisdiction", entityId: "48226", entityLabel: "ZIP 48226 — Downtown Detroit", stage: "verified", timestamp: "2026-07-01T05:50:31Z", source: "Editorial review — boundary description cross-check", version: "v2.0.1", status: "warning" },
  { id: "audit-015", entityType: "jurisdiction", entityId: "48226", entityLabel: "ZIP 48226 — Downtown Detroit", stage: "processed", timestamp: "2026-07-01T05:51:44Z", source: "Content pipeline", version: "v2.0.1", status: "success" },
  { id: "audit-016", entityType: "jurisdiction", entityId: "48226", entityLabel: "ZIP 48226 — Downtown Detroit", stage: "displayed", timestamp: "2026-07-01T05:52:00Z", source: "Voter Education Platform", version: "v2.0.1", status: "success" },

  // Mayor Sheffield
  { id: "audit-017", entityType: "representative", entityId: "rep-mayor-sheffield", entityLabel: "Mayor Mary Sheffield", stage: "retrieved", timestamp: "2026-07-01T05:30:00Z", source: "detroitmi.gov/government/mayors-office", version: "v1.6.2", status: "success" },
  { id: "audit-018", entityType: "representative", entityId: "rep-mayor-sheffield", entityLabel: "Mayor Mary Sheffield", stage: "verified", timestamp: "2026-07-01T05:33:15Z", source: "Editorial review — official source cross-check", version: "v1.6.2", status: "success" },
  { id: "audit-019", entityType: "representative", entityId: "rep-mayor-sheffield", entityLabel: "Mayor Mary Sheffield", stage: "processed", timestamp: "2026-07-01T05:34:02Z", source: "Content pipeline", version: "v1.6.2", status: "success" },
  { id: "audit-020", entityType: "representative", entityId: "rep-mayor-sheffield", entityLabel: "Mayor Mary Sheffield", stage: "displayed", timestamp: "2026-07-01T05:34:20Z", source: "Voter Education Platform", version: "v1.6.2", status: "success" },

  // Candidate Benson
  { id: "audit-021", entityType: "candidate", entityId: "cand-benson-jocelyn", entityLabel: "Jocelyn Benson (Governor candidate)", stage: "retrieved", timestamp: "2026-07-01T07:00:00Z", source: "Ballotpedia / Michigan SOS", version: "v1.1.0", status: "success" },
  { id: "audit-022", entityType: "candidate", entityId: "cand-benson-jocelyn", entityLabel: "Jocelyn Benson (Governor candidate)", stage: "verified", timestamp: "2026-07-01T07:05:40Z", source: "Editorial review — filing cross-check", version: "v1.1.0", status: "warning" },
  { id: "audit-023", entityType: "candidate", entityId: "cand-benson-jocelyn", entityLabel: "Jocelyn Benson (Governor candidate)", stage: "processed", timestamp: "2026-07-01T07:06:58Z", source: "Content pipeline", version: "v1.1.0", status: "success" },
  { id: "audit-024", entityType: "candidate", entityId: "cand-benson-jocelyn", entityLabel: "Jocelyn Benson (Governor candidate)", stage: "displayed", timestamp: "2026-07-01T07:07:15Z", source: "Voter Education Platform", version: "v1.1.0", status: "success" },
];
