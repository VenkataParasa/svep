import type { Candidate } from "@/lib/types";

// Real candidates in Michigan's 2026 Governor's race — the most relevant
// active election for Detroit voters this cycle (Gov. Whitmer is
// term-limited; the Detroit mayoral race concluded in Nov. 2025).
// Position summaries reflect each candidate's publicly reported platform
// and background; where specifics on a given issue category were not
// independently verified in research, this is noted via demoDataNote.
export const candidates: Candidate[] = [
  {
    id: "cand-benson-jocelyn",
    name: "Jocelyn Benson",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election",
    level: "state",
    party: "Democratic",
    jurisdiction: "State of Michigan",
    electionDate: "2026-11-03",
    status: "active",
    filingStatus: "Filed — active candidate, Democratic primary (August 4, 2026)",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    positionSummary:
      "Michigan's current Secretary of State and the Democratic frontrunner for Governor in the 2026 race. Benson's public record centers on election administration and voter access; her gubernatorial campaign has emphasized affordability, jobs, and continuing the state's infrastructure and education investments.",
    issuePositions: [
      { issueId: "issue-housing", summary: "Campaign messaging emphasizes housing affordability as part of a broader cost-of-living platform." },
      { issueId: "issue-education", summary: "Has voiced support for continued state investment in K-12 funding and literacy programs." },
      { issueId: "issue-public-safety", summary: "Platform references continuing state-level gun violence prevention efforts." },
    ],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-governor-2026", "src-michigan-sos", "src-michigan-sos-cfr"],
    demoDataNote:
      "Detailed issue-by-issue positions are general characterizations based on public campaign coverage, not verbatim policy-paper citations. Verify current platform language at the candidate's official campaign site before external use. Filing status is corroborated by news coverage; the Michigan SOS's own candidate-listing and campaign-finance database pages returned HTTP 403 to automated fetch during research and could not be directly confirmed.",
  },
  {
    id: "cand-james-john",
    name: "John James",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election",
    level: "state",
    party: "Republican",
    jurisdiction: "State of Michigan",
    electionDate: "2026-11-03",
    status: "active",
    filingStatus: "Filed — active candidate, Republican primary (August 4, 2026)",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    positionSummary:
      "Currently the U.S. Representative for Michigan's 10th Congressional District and the Republican frontrunner for Governor in 2026. James has built his political career on a business and public-safety-focused platform, including support for tax relief and law-enforcement funding.",
    issuePositions: [
      { issueId: "issue-public-safety", summary: "Has consistently emphasized law-enforcement funding and public safety in his congressional and gubernatorial campaigns." },
      { issueId: "issue-transportation", summary: "Campaign messaging has referenced infrastructure investment as part of an economic growth platform." },
    ],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-governor-2026", "src-michigan-sos", "src-michigan-sos-cfr"],
    demoDataNote:
      "Detailed issue-by-issue positions are general characterizations based on public campaign coverage, not verbatim policy-paper citations. Verify current platform language at the candidate's official campaign site before external use. Filing status is corroborated by news coverage; the Michigan SOS's own candidate-listing and campaign-finance database pages returned HTTP 403 to automated fetch during research and could not be directly confirmed.",
  },
  {
    id: "cand-duggan-mike",
    name: "Mike Duggan",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election",
    level: "state",
    party: "Independent",
    jurisdiction: "State of Michigan",
    electionDate: "2026-11-03",
    status: "withdrawn",
    filingStatus: "Independent candidacy withdrawn May 21, 2026",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "verified",
    positionSummary:
      "Former three-term Mayor of Detroit (2014-2025), known for the city's post-bankruptcy recovery, blight removal, and infrastructure investment. Duggan launched an independent campaign for Governor after leaving the mayor's office, but dropped out on May 21, 2026 citing polling and fundraising shortfalls.",
    issuePositions: [
      { issueId: "issue-housing", summary: "As Mayor, prioritized blight removal and neighborhood redevelopment throughout his three terms." },
      { issueId: "issue-transportation", summary: "Oversaw major Detroit infrastructure and transit investments as Mayor." },
    ],
    officialLinks: { campaignSite: "https://mikeduggan.com/" },
    sourceIds: ["src-ballotpedia-governor-2026", "src-michigan-sos-cfr"],
    demoDataNote: "Campaign ended May 21, 2026; retained here for transparency and to illustrate how the platform tracks a candidate's status change.",
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}
