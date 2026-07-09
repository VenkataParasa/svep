import type { MetadataField } from "@/lib/types";

export const metadataFields: MetadataField[] = [
  { id: "meta-001", field: "ZIP Code Coverage", value: "37 Detroit-area ZIP codes (48201–48243), including enclave and border communities", source: "Platform configuration", lastUpdated: "2026-07-06", version: "v2.1.0", confidenceScore: 100 },
  { id: "meta-002", field: "Council District Map Vintage", value: "Detroit Council Districts 2026 (effective Jan. 1, 2026)", source: "data.detroitmi.gov", lastUpdated: "2026-01-01", version: "v2.0.1", confidenceScore: 65 },
  { id: "meta-003", field: "Congressional District", value: "Michigan's 13th District", source: "congress.gov", lastUpdated: "2026-03-01", version: "v1.6.2", confidenceScore: 96 },
  { id: "meta-004", field: "State Senate District (Downtown/Midtown)", value: "District 3 — Stephanie Chang", source: "senate.michigan.gov", lastUpdated: "2026-03-01", version: "v1.6.2", confidenceScore: 90 },
  { id: "meta-005", field: "State House District (48203)", value: "District 8 — Helena Scott", source: "house.mi.gov", lastUpdated: "2026-03-01", version: "v1.6.2", confidenceScore: 62 },
  { id: "meta-006", field: "Mayor of Detroit", value: "Mary Sheffield (sworn in Jan. 1, 2026)", source: "detroitmi.gov", lastUpdated: "2026-06-01", version: "v1.6.2", confidenceScore: 99 },
  { id: "meta-007", field: "Active Statewide Election", value: "2026 Michigan Governor's Race — Primary Aug. 4, General Nov. 3", source: "michigan.gov/sos", lastUpdated: "2026-05-01", version: "v1.1.0", confidenceScore: 97 },
  { id: "meta-008", field: "Source Count", value: "27 cataloged official/verified sources", source: "Platform data catalog", lastUpdated: "2026-07-01", version: "v2.0.1", confidenceScore: 100 },
  { id: "meta-009", field: "Data Refresh Interval", value: "Simulated hourly sync (demo)", source: "Platform configuration", lastUpdated: "2026-07-01", version: "v2.0.1", confidenceScore: 100 },
  { id: "meta-010", field: "Confidence Threshold for 'Verified' Badge", value: "Requires at least one .gov or .senate.gov / .house.gov primary source", source: "Platform data policy", lastUpdated: "2026-06-15", version: "v2.0.1", confidenceScore: 100 },
];
