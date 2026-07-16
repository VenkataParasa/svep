// Sourced issue positions for CURRENT officeholders covering ZIP codes
// 48226, 48201, 48244 (downtown/Midtown Detroit) and 48230 (Grosse Pointe
// Park), compiled from official government sources, news coverage, and
// bills/resolutions each official has personally sponsored or signed.
//
// Representatives are synced dynamically from the Cicero API (see
// app/api/legislative-districts/route.ts), so a person's Representative.id
// is not stable ahead of time. This file keys each entry by the official's
// full name instead; prisma/seed.ts matches every current Representative
// row with that name and attaches the same IssuePosition + FieldMetadata
// records to each match, so the profile renders correctly regardless of
// which Cicero-derived id is currently live.

export interface RepresentativeIssuePositionEntry {
  matchNames: string[];
  positions: Array<{
    issueId: string;
    summary: string;
    sourceId: string;
    confidenceScore: number;
    lastUpdated: string;
  }>;
}

export const representativeIssuePositions: RepresentativeIssuePositionEntry[] = [
  {
    matchNames: ["Gretchen Whitmer"],
    positions: [
      {
        issueId: "issue-housing",
        summary:
          "Signed Senate Bill 23 of 2025 (Public Act 58), easing municipal platting rules to allow more buildable lots without a full subdivision review — a measure aimed at increasing Michigan's housing supply.",
        sourceId: "src-legislature-sb23-2025",
        confidenceScore: 96,
        lastUpdated: "2025-12-15",
      },
      {
        issueId: "issue-education",
        summary:
          "Signed the FY2026 School Aid Budget, raising per-pupil funding to $10,050, funding free school meals statewide, and allocating $122 million for literacy support.",
        sourceId: "src-michigan-school-aid-budget",
        confidenceScore: 97,
        lastUpdated: "2025-10-07",
      },
      {
        issueId: "issue-public-safety",
        summary:
          "Signed Executive Order 2026-13, re-establishing a statewide Gun Violence Prevention Task Force to coordinate prevention strategy across state agencies.",
        sourceId: "src-michigan-eo-2026-13",
        confidenceScore: 96,
        lastUpdated: "2026-06-04",
      },
    ],
  },
  {
    matchNames: ["Mary Sheffield"],
    positions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Her first proposed budget expands the Affordable Housing Development and Preservation Fund from 40% to 100% of city-owned commercial property sale proceeds, and her administration has continued the Motor City Match small-business grant program.",
        sourceId: "src-detroitmi-motorcitymatch",
        confidenceScore: 93,
        lastUpdated: "2026-05-06",
      },
      {
        issueId: "issue-public-safety",
        summary:
          "Joined Detroit law enforcement to announce the city's continued multi-year decline in violent crime, including a drop to 165 criminal homicides in 2025 — the first time in six decades below 200.",
        sourceId: "src-detroitnews-crime-2026",
        confidenceScore: 92,
        lastUpdated: "2026-01-01",
      },
      {
        issueId: "issue-healthcare",
        summary:
          "Released Detroit's first comprehensive Community Health Assessment since 2018 and a 2026-2029 Community Health Improvement Plan focused on maternal health, chronic disease, food access, and healthcare access.",
        sourceId: "src-detroitmi-health-roadmap",
        confidenceScore: 94,
        lastUpdated: "2026-04-01",
      },
    ],
  },
  {
    matchNames: ["Shri Thanedar"],
    positions: [
      {
        issueId: "issue-healthcare",
        summary:
          "Sponsored the Improving Access to Institutional Mental Health Care Act (H.R. 5662), the Fight Hunger Act (H.R. 5809) targeting food insecurity, and the Health Disparity Zones Act of 2026 (H.R. 9488).",
        sourceId: "src-congress-hr5662",
        confidenceScore: 95,
        lastUpdated: "2025-09-30",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Sponsored the One Stop Shop for Small Business Licensing Act of 2025 (H.R. 4824), which would streamline and consolidate small-business licensing requirements across federal agencies.",
        sourceId: "src-congress-hr4824",
        confidenceScore: 95,
        lastUpdated: "2025-07-29",
      },
    ],
  },
  {
    matchNames: ["Joe Tate"],
    positions: [
      {
        issueId: "issue-public-safety",
        summary:
          "As House Speaker, worked with Gov. Whitmer and Senate Democrats in 2023 to pass gun-reform legislation, including judicial extreme risk protection orders ('red flag' laws) allowing courts to temporarily remove firearms from someone in a mental-health or domestic-violence crisis.",
        sourceId: "src-bridgemi-tate-productive-year",
        confidenceScore: 92,
        lastUpdated: "2023-12-01",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Led the House repeal of Michigan's Snyder-era Right-to-Work law and the expansion of the Earned Income Tax Credit for lower-income earners during his 2023 'most productive year' as Speaker.",
        sourceId: "src-michiganadvance-tate-tenure",
        confidenceScore: 91,
        lastUpdated: "2026-03-25",
      },
    ],
  },
  {
    matchNames: ["Erika Geiss"],
    positions: [
      {
        issueId: "issue-environment",
        summary:
          "Sponsored Senate Bills 225 and 226, signed into law June 20, 2024, requiring background checks for asbestos remediation inspectors and increasing transparency in Michigan's asbestos-abatement program.",
        sourceId: "src-senatedems-geiss-2024review",
        confidenceScore: 93,
        lastUpdated: "2025-02-11",
      },
      {
        issueId: "issue-public-safety",
        summary:
          "Sponsored Senate Bill 599, signed into law July 23, 2024, allowing parole for certain medically frail prisoners so the corrections system can focus resources where most needed.",
        sourceId: "src-senatedems-geiss-2024review",
        confidenceScore: 93,
        lastUpdated: "2024-07-23",
      },
    ],
  },
  {
    matchNames: ["Jocelyn Benson"],
    positions: [
      {
        issueId: "issue-government-accountability",
        summary:
          "As Secretary of State, oversaw record-turnout 2020, 2022, and 2024 elections with more than 250 post-election audits affirming their accuracy, and implemented Proposal 2's expanded early-voting and absentee-ballot options for the 2024 general election.",
        sourceId: "src-bridgemi-benson-bio",
        confidenceScore: 94,
        lastUpdated: "2026-05-01",
      },
    ],
  },
  {
    matchNames: ["Dana Nessel"],
    positions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Her Consumer Protection Team recouped $1.88 million for Michigan consumers and businesses in 2025 alone after reviewing more than 12,000 written complaints, and her office has secured over $1.8 billion in opioid-settlement funds for Michigan governments since 2019.",
        sourceId: "src-michigan-ag-nessel-consumer2025",
        confidenceScore: 93,
        lastUpdated: "2026-03-03",
      },
      {
        issueId: "issue-government-accountability",
        summary:
          "Has intervened in utility rate cases on behalf of Michigan customers, helping secure more than $3.7 billion in savings since 2019, including nearly $439 million in 2024 alone.",
        sourceId: "src-michigan-ag-nessel-utility",
        confidenceScore: 90,
        lastUpdated: "2026-03-06",
      },
    ],
  },
  {
    matchNames: ["Gary Peters"],
    positions: [
      {
        issueId: "issue-transportation",
        summary:
          "Voted for the Infrastructure Investment and Jobs Act, which has funded repairs to Michigan roads and bridges and initiatives to protect the Great Lakes.",
        sourceId: "src-peters-senate-manufacturing",
        confidenceScore: 90,
        lastUpdated: "2026-01-01",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "As a member of the Commerce, Science and Transportation Committee, led bipartisan legislation promoting vehicle-to-infrastructure technology investment to keep next-generation vehicles built in Michigan.",
        sourceId: "src-peters-senate-manufacturing",
        confidenceScore: 90,
        lastUpdated: "2026-01-01",
      },
    ],
  },
  {
    matchNames: ["Elissa Slotkin"],
    positions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Introduced the Connected Vehicle Security Act and the Protecting America from Chinese Cars Act of 2026 with Sen. Bernie Moreno (R-OH), aimed at protecting Michigan's auto industry and blocking Chinese-made vehicle technology and data collection.",
        sourceId: "src-slotkin-senate-chinese-vehicles",
        confidenceScore: 92,
        lastUpdated: "2026-04-29",
      },
      {
        issueId: "issue-housing",
        summary: "Introduced the National Housing Emergency Act of 2026.",
        sourceId: "src-slotkin-senate-chinese-vehicles",
        confidenceScore: 82,
        lastUpdated: "2026-04-29",
      },
    ],
  },
  {
    matchNames: ["Kevin Hertel"],
    positions: [
      {
        issueId: "issue-housing",
        summary:
          "Sponsored Senate Bill 23 of 2025 (Public Act 58), which eased municipal platting rules to allow more buildable lots without a full subdivision review — a measure aimed at increasing Michigan's housing supply.",
        sourceId: "src-legislature-sb23-2025",
        confidenceScore: 96,
        lastUpdated: "2025-12-15",
      },
      {
        issueId: "issue-healthcare",
        summary:
          "Sponsored Senate Bill 1011 of 2026, creating a small-business health insurance pool (passed the Senate 35-0), and Senate Bill 973 of 2026, establishing a state-based health insurance exchange (passed 20-16).",
        sourceId: "src-michiganvotes-hertel-sponsorships",
        confidenceScore: 88,
        lastUpdated: "2026-06-25",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Sponsored Senate Bill 1048 of 2026, which would require project labor agreements and prevailing wage and fringe-benefit rates for certain data-center construction contracts.",
        sourceId: "src-michiganvotes-hertel-sponsorships",
        confidenceScore: 85,
        lastUpdated: "2026-06-18",
      },
    ],
  },
  {
    matchNames: ["Veronica Paiz"],
    positions: [
      {
        issueId: "issue-housing",
        summary:
          "Cosponsored the 2025 Tenants' Rights legislative package, a 17-bill effort led by Rep. Amos O'Neal to modernize landlord-tenant law, including shorter security-deposit return windows and stronger habitability requirements.",
        sourceId: "src-housedems-tenants-rights-package",
        confidenceScore: 90,
        lastUpdated: "2025-09-18",
      },
      {
        issueId: "issue-taxation",
        summary:
          "Sponsored House Bill 5866 of 2026, a HOPE zone property-tax exemption reducing the property-tax burden for eligible low-income homeowners in her district.",
        sourceId: "src-michiganvotes-paiz-sponsorships",
        confidenceScore: 85,
        lastUpdated: "2026-04-22",
      },
      {
        issueId: "issue-environment",
        summary: "Lists water-infrastructure quality and standards among her legislative priorities.",
        sourceId: "src-michiganvotes-paiz-sponsorships",
        confidenceScore: 80,
        lastUpdated: "2026-07-16",
      },
    ],
  },
  {
    matchNames: ["Mary Waters"],
    positions: [
      {
        issueId: "issue-housing",
        summary:
          "Spearheaded a one-stop-shop and call center for residents seeking housing help, a $203 million housing plan, and the creation of a Tenants' Rights Commission to advocate for residential renters.",
        sourceId: "src-wdet-waters-record",
        confidenceScore: 90,
        lastUpdated: "2025-10-07",
      },
      {
        issueId: "issue-public-safety",
        summary:
          "Supports Detroit's Community Violence Intervention program and a curfew for minors, and has called for more foot patrols and restored funding for neighborhood block clubs.",
        sourceId: "src-wdet-waters-record",
        confidenceScore: 88,
        lastUpdated: "2025-10-07",
      },
    ],
  },
  {
    matchNames: ["Coleman Young", "Coleman Young II", "Coleman A. Young II"],
    positions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Helped launch the Jump Start Program, providing $100 million in adult scholarships for job training that put 1,200 previously out-of-work Detroiters back to work, and focuses on minority small-business development.",
        sourceId: "src-detroitchamber-young-bio",
        confidenceScore: 88,
        lastUpdated: "2026-01-01",
      },
      {
        issueId: "issue-taxation",
        summary: "Lists lowering taxes among his priorities for his second council term.",
        sourceId: "src-detroitnews-young-council-race",
        confidenceScore: 82,
        lastUpdated: "2025-10-30",
      },
    ],
  },
  {
    matchNames: ["Gabriela Santiago-Romero"],
    positions: [
      {
        issueId: "issue-environment",
        summary:
          "A leader on environmental justice in District 6, pushing for truck-route ordinances to reduce industrial pollution and traffic in Southwest Detroit and holding polluters accountable.",
        sourceId: "src-bridgedetroit-santiago-romero-priorities",
        confidenceScore: 89,
        lastUpdated: "2026-01-10",
      },
      {
        issueId: "issue-housing",
        summary: "Lists housing and affordability among her top priorities for 2026, alongside safe streets and transportation.",
        sourceId: "src-bridgedetroit-santiago-romero-priorities",
        confidenceScore: 87,
        lastUpdated: "2026-01-10",
      },
    ],
  },
];
