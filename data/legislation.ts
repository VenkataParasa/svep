import type { Legislation } from "@/lib/types";

// Real Michigan/federal legislation relevant to each civic issue category,
// compiled from legislature.mi.gov and michigan.gov press releases.
export const legislation: Legislation[] = [
  {
    id: "leg-sb23-2025",
    billNumber: "Senate Bill 23 of 2025 (Public Act 58 of 2025)",
    title: "Land Division Act Amendment — Housing Supply Reform",
    summary:
      "Increases the number of buildable lots (from 4 up to 10 within the first 10 acres) that a landowner can create 'by right' without going through the full municipal platting process. Intended to ease zoning and administrative barriers to new housing construction.",
    status: "signed into law",
    sponsors: ["Sen. Kevin Hertel (D-St. Clair Shores)"],
    relatedIssueId: "issue-housing",
    level: "state",
    confidence: "verified",
    sourceIds: ["src-legislature-sb23-2025"],
    lastUpdated: "2025-12-15",
  },
  {
    id: "leg-sb971-2026",
    billNumber: "Senate Bill 971 (2026 session)",
    title: "Corporate Landlord Limitation Act",
    summary:
      "Introduced as part of a Senate Democratic housing-affordability package; would prohibit out-of-state investment groups from owning more than 10 single-family homes in Michigan, targeting institutional buyers blamed for reducing starter-home supply.",
    status: "introduced",
    sponsors: ["Sen. Veronica Klinefelt (D-Eastpointe)"],
    relatedIssueId: "issue-housing",
    level: "state",
    confidence: "demo-data",
    sourceIds: ["src-senatedems-housing-package"],
    lastUpdated: "2026-05-14",
    demoDataNote: "Introduced, not yet enacted. Exact bill object name should be reverified at legislature.mi.gov before external citation.",
  },
  {
    id: "leg-sb567-568-2024",
    billNumber: "Senate Bills 567 & 568 of 2024",
    title: "Literacy & Dyslexia Screening Laws",
    summary:
      "Requires K-3 dyslexia screening three times per year (phasing in for the 2027-28 school year) and mandates evidence-based, 'science of reading' literacy curricula statewide.",
    status: "signed into law",
    sponsors: ["Michigan Senate (bipartisan majority)"],
    relatedIssueId: "issue-education",
    level: "state",
    confidence: "verified",
    sourceIds: ["src-michigan-literacy-laws"],
    lastUpdated: "2024-10-10",
  },
  {
    id: "leg-school-aid-fy2026",
    billNumber: "FY2026 School Aid Budget",
    title: "Michigan School Aid Budget, Fiscal Year 2026",
    summary:
      "Raises per-pupil funding to $10,050, funds free school meals statewide, allocates $122 million for literacy support, and expands free pre-K and community college access.",
    status: "signed into law",
    sponsors: ["Michigan Legislature"],
    relatedIssueId: "issue-education",
    level: "state",
    confidence: "verified",
    sourceIds: ["src-michigan-school-aid-budget"],
    lastUpdated: "2025-10-07",
  },
  {
    id: "leg-hb6144-6146-2025",
    billNumber: "House Bills 6144-6146 (signed Jan. 2025)",
    title: "Firearm Buyback Destruction Requirement",
    summary:
      "Requires the Michigan State Police to destroy — rather than resell or auction — all firearms acquired through buybacks, forfeitures, or voluntary surrender. Part of a broader 19-bill package addressing school safety, hate crimes, and gun violence prevention.",
    status: "signed into law",
    sponsors: ["Rep. Felicia Brabec (D-Pittsfield Twp.)", "Rep. Natalie Price (D-Berkley)"],
    relatedIssueId: "issue-public-safety",
    level: "state",
    confidence: "demo-data",
    sourceIds: ["src-michigan-safety-bills"],
    lastUpdated: "2025-01-22",
    demoDataNote: "Public Act numbers for these three bills were not independently confirmed in research; verify directly at legislature.mi.gov before citing PA numbers.",
  },
  {
    id: "leg-eo-2026-13",
    billNumber: "Executive Order 2026-13",
    title: "Re-establishment of the Michigan Gun Violence Prevention Task Force",
    summary:
      "Signed June 4, 2026 by Gov. Whitmer, re-establishing a statewide task force coordinating gun violence prevention strategy across state agencies.",
    status: "enacted",
    sponsors: ["Gov. Gretchen Whitmer"],
    relatedIssueId: "issue-public-safety",
    level: "state",
    confidence: "verified",
    sourceIds: ["src-michigan-eo-2026-13"],
    lastUpdated: "2026-06-04",
  },
];

export function getLegislationById(id: string): Legislation | undefined {
  return legislation.find((l) => l.id === id);
}
