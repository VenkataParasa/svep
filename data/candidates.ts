import type { Candidate } from "@/lib/types";

// Real, sourced candidates for the 2026 Michigan primary (Aug. 4, 2026) and
// general (Nov. 3, 2026) elections, scoped to the races that cover ZIP
// codes 48226, 48201, 48244 (downtown/Midtown Detroit) and 48230 (Grosse
// Pointe Park). This is a curated snapshot, not a live feed — candidate
// fields, endorsements, and fundraising totals change during a campaign.
// Every entry below is a real, currently-filed candidate as of the source
// dates cited in sourceIds; candidates who withdrew, were disqualified, or
// suspended their campaigns (e.g. Mallory McMorrow, Tom Leonard, Aric
// Nesbitt, Ralph Rebandt, Mike Duggan) are excluded from race rosters,
// though a couple are kept as records (status: "withdrawn") because
// data/issues.ts already references their candidateId.
//
// Race → ZIP eligibility for this demo lives in `racesByZip` below.

// `legislationIds` links to real bills/resolutions in data/legislation.ts
// that the candidate personally sponsored or cosponsored (current or
// former legislators only) — rendered as "Related Legislation" on the
// candidate's profile page, separate from the generic issue-level
// legislation shown on /issues/[slug].
export type CandidateRecord = Candidate & {
  raceId: string;
  legislationIds?: string[];
};

export interface Race {
  id: string;
  officeTitle: string;
  jurisdiction: string;
  level: Candidate["level"];
  primaryDate: string;
  generalDate: string;
  description: string;
  rosterNote?: string;
}

export const races: Race[] = [
  {
    id: "governor-2026",
    officeTitle: "Governor of Michigan",
    jurisdiction: "Statewide",
    level: "state",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Gov. Gretchen Whitmer is term-limited, leaving an open seat. Both major-party primaries are contested.",
  },
  {
    id: "us-senate-2026",
    officeTitle: "U.S. Senator",
    jurisdiction: "Michigan",
    level: "federal",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Sen. Gary Peters announced in January 2025 that he would not seek re-election, opening the seat.",
  },
  {
    id: "us-house-mi13-2026",
    officeTitle: "U.S. Representative",
    jurisdiction: "Michigan's 13th Congressional District",
    level: "federal",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Covers Detroit (including downtown, Midtown, and New Center) and Downriver/Grosse Pointe-area suburbs. Rated the most Democratic district in Michigan (Cook PVI D+22), so the Aug. 4 Democratic primary effectively decides the seat.",
    rosterNote:
      "No Republican candidate had filed for this seat as of the sources cited below.",
  },
  {
    id: "mi-senate-3-2026",
    officeTitle: "State Senator",
    jurisdiction: "Michigan Senate District 3",
    level: "state",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Covers downtown/Midtown/New Center Detroit, Hamtramck, and Highland Park. Open seat: Sen. Stephanie Chang is term-limited.",
    rosterNote: "No Republican candidate had filed for this seat as of the sources cited below.",
  },
  {
    id: "mi-house-9-2026",
    officeTitle: "State Representative",
    jurisdiction: "Michigan House District 9",
    level: "state",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Covers downtown/Midtown/New Center Detroit and Corktown. Open seat: House Speaker Joe Tate is retiring. Nine Democrats filed for the Aug. 4 primary; five with substantive public platforms are profiled here.",
    rosterNote:
      "5 of 9 declared Democratic primary candidates are profiled here — see the Ballotpedia and MLCM district guides linked in each profile for the complete filing list.",
  },
  {
    id: "mi-senate-12-2026",
    officeTitle: "State Senator",
    jurisdiction: "Michigan Senate District 12",
    level: "state",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Covers Grosse Pointe Park, St. Clair Shores, and nearby Macomb/Wayne communities. Incumbent Sen. Kevin Hertel is seeking re-election, unopposed in the Democratic primary.",
    rosterNote:
      "Five Republicans also filed for this seat (Joseph Backus, Patrick Biange, John Goldwater, Eileen Tesch, Shelley Wright) — see the official Macomb County candidate list linked in Sen. Hertel's profile.",
  },
  {
    id: "mi-house-10-2026",
    officeTitle: "State Representative",
    jurisdiction: "Michigan House District 10",
    level: "state",
    primaryDate: "2026-08-04",
    generalDate: "2026-11-03",
    description:
      "Covers northeast Detroit, Harper Woods, and the Grosse Pointes (including Grosse Pointe Park). Incumbent Rep. Veronica Paiz faces two Democratic primary challengers; one Republican has also filed.",
  },
];

export const candidates: CandidateRecord[] = [
  // ---------------------------------------------------------------------
  // Governor of Michigan — Democratic primary
  // ---------------------------------------------------------------------
  {
    id: "cand-benson-jocelyn",
    raceId: "governor-2026",
    name: "Jocelyn Benson",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/SOS_Jocelyn_Benson_web.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "Michigan's current Secretary of State is campaigning on affordability, healthcare access, and clean energy, built around a statewide 'Costs Down, Wages Up' tour.",
    issuePositions: [
      {
        issueId: "issue-healthcare",
        summary:
          "Proposes a new caregiver tax credit, a prescription-drug affordability board, and help resolving insurance disputes; has specifically highlighted Black maternal mortality, which is three times higher for Black women in Michigan.",
      },
      {
        issueId: "issue-environment",
        summary:
          "Campaign environmental plan centers on clean-energy expansion to lower utility bills, water-infrastructure investment (including lead-pipe replacement and Great Lakes protection), and new accountability guardrails on utilities and data centers.",
      },
    ],
    officialLinks: {
      website: "https://jocelynbenson.com/",
      campaignSite: "https://jocelynbenson.com/priorities/",
    },
    sourceIds: [
      "src-jocelynbenson-priorities",
      "src-michiganadvance-benson-maternal",
      "src-spectrumlocalnews-benson-environment",
      "src-wdet-benson-metro",
      "src-wikipedia-photo-jocelyn-benson",
    ],
    demoDataNote:
      "Position summary reflects Benson's published campaign platform as of July 2026; platforms can change before the Aug. 4 primary.",
  },
  {
    id: "cand-swanson-chris",
    raceId: "governor-2026",
    name: "Chris Swanson",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "The Genesee County Sheriff is running on a 'protect, serve, and unify' platform, emphasizing public-school funding, constitutional rights, and reproductive freedom.",
    issuePositions: [
      {
        issueId: "issue-education",
        summary:
          "Released a seven-point K-12 education plan focused on public-school funding and diverse graduation pathways, pledging to veto any legislation that diverts public-school funding to private-school vouchers.",
      },
      {
        issueId: "issue-healthcare",
        summary:
          "States he is pro-choice and would protect abortion access as governor, saying reproductive-care decisions are 'best made by women with their doctors, faith, and family.'",
      },
    ],
    officialLinks: { website: "https://swansonformichigan.com/" },
    sourceIds: [
      "src-michiganadvance-swanson-education",
      "src-swansonformichigan",
    ],
    demoDataNote:
      "Position summary reflects Swanson's published campaign platform as of mid-2026.",
  },
  {
    id: "cand-hogan-kevin",
    raceId: "governor-2026",
    name: "Kevin Hogan",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for governor. Detailed policy positions were not found in available public campaign coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-gov-dem-primary"],
    demoDataNote:
      "Included because he is an active, filed candidate; the platform does not estimate positions that have not been publicly documented.",
  },
  {
    id: "cand-sawicki-marni",
    raceId: "governor-2026",
    name: "Marni Sawicki",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for governor. Detailed policy positions were not found in available public campaign coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-gov-dem-primary"],
    demoDataNote:
      "Included because she is an active, filed candidate; the platform does not estimate positions that have not been publicly documented.",
  },
  {
    id: "cand-thomas-kim",
    raceId: "governor-2026",
    name: "Kim Thomas",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for governor. Detailed policy positions were not found in available public campaign coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-gov-dem-primary"],
    demoDataNote:
      "Included because she is an active, filed candidate; the platform does not estimate positions that have not been publicly documented.",
  },

  // ---------------------------------------------------------------------
  // Governor of Michigan — Republican primary
  // ---------------------------------------------------------------------
  {
    id: "cand-james-john",
    raceId: "governor-2026",
    name: "John James",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Republican Primary",
    level: "state",
    party: "Republican",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Republican primary candidate (frontrunner; former Michigan Secretary Aric Nesbitt suspended his campaign and endorsed James in June 2026)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Rep._John_James_official_photo%2C_118th_Congress.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The sitting U.S. Representative for Michigan's 10th District is campaigning on affordability, eliminating the state property tax, and government transparency.",
    issuePositions: [
      {
        issueId: "issue-taxation",
        summary:
          "Top campaign priority is eliminating Michigan's state property tax to relieve homeowners and seniors, offset by reduced state spending.",
      },
      {
        issueId: "issue-education",
        summary:
          "Proposes emphasizing phonics-based 'science of reading' instruction and requiring teachers to pass basic biology, civics, and economics exams to keep their credentials.",
      },
      {
        issueId: "issue-government-accountability",
        summary:
          "First major policy proposal of the campaign is ending Michigan's FOIA exemption for the governor's office, executive branch, and Legislature — Michigan and Massachusetts are the only two states where the governor and Legislature are exempt from public-records law.",
      },
    ],
    officialLinks: {
      website: "https://johnjamesmi.com/",
      campaignSite: "https://johnjamesmi.com/freedom-agenda/",
    },
    sourceIds: [
      "src-spectrumlocalnews-james-issues",
      "src-johnjamesmi-freedom-agenda",
      "src-wikipedia-photo-john-james",
      "src-michiganpublic-mi-foia-outlier",
      "src-detroitnews-james-transparency",
    ],
    demoDataNote:
      "Position summary reflects James's published campaign platform as of June 2026.",
  },
  {
    id: "cand-cox-mike",
    raceId: "governor-2026",
    name: "Mike Cox",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Republican Primary",
    level: "state",
    party: "Republican",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Republican primary candidate",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Mike_Cox_Summer_2009.JPG",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The former Michigan Attorney General is campaigning on eliminating the state income tax and an accountability-focused education plan.",
    issuePositions: [
      {
        issueId: "issue-taxation",
        summary:
          "Would eliminate the state income tax, proposing to offset the cost by ending corporate subsidies and cutting state spending.",
      },
      {
        issueId: "issue-education",
        summary:
          "Proposes assigning letter grades to public schools and requiring students to demonstrate reading proficiency before advancing past third grade.",
      },
    ],
    officialLinks: {
      website: "https://mikecox2026.com/",
      campaignSite: "https://mikecox2026.com/on-the-issues",
    },
    sourceIds: [
      "src-atr-cox-incometax",
      "src-clickondetroit-cox-education",
      "src-wikipedia-photo-mike-cox",
    ],
    demoDataNote:
      "Position summary reflects Cox's published campaign platform as of July 2026.",
  },
  {
    id: "cand-wagner-karla",
    raceId: "governor-2026",
    name: "Karla Wagner",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — General Election",
    level: "state",
    party: "Independent",
    jurisdiction: "Statewide",
    electionDate: "2026-11-03",
    status: "active",
    filingStatus: "Filed as an independent (no party affiliation) for the Nov. 3, 2026 general election, after leaving the Republican primary field on March 19, 2026",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "The founder of the Axe MI Tax movement left the Republican Party in March 2026 to run as an independent, saying she disagreed with the direction of Michigan GOP leadership. Her campaign centers on eliminating Michigan property taxes and shrinking state government budgets.",
    issuePositions: [
      {
        issueId: "issue-taxation",
        summary:
          "Campaign platform calls for eliminating Michigan property taxes and aggressively cutting state spending and regulation to offset the lost revenue.",
      },
      {
        issueId: "issue-government-accountability",
        summary:
          "Lists budget-reform and government-efficiency oversight among her priorities, alongside election-integrity measures.",
      },
    ],
    officialLinks: { website: "https://www.karla4mi.com/" },
    sourceIds: [
      "src-ballotpedia-karla-wagner",
      "src-abc12-wagner-independent",
      "src-karla4mi-issues",
    ],
    demoDataNote:
      "Position summary drawn from Ballotpedia's candidate profile and her campaign's issues page as of mid-2026; she is no longer part of the Republican primary field.",
  },
  {
    id: "cand-gipson-joyce",
    raceId: "governor-2026",
    name: "Joyce Gipson",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Republican Primary",
    level: "state",
    party: "Republican",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Republican primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Republican primary candidate for governor whose campaign focuses on social-conservative priorities; detailed policy positions were not found in available public coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: [
      "src-michiganrepublicanprimary-candidates",
      "src-ballotpedia-gov-rep-primary",
    ],
  },
  {
    id: "cand-space-evan",
    raceId: "governor-2026",
    name: "Evan Space",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election — Republican Primary",
    level: "state",
    party: "Republican",
    jurisdiction: "Statewide",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Republican primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A military veteran and entrepreneur making his third run for governor after 2018 and 2022; detailed 2026 policy positions were not found in available public coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: [
      "src-michiganrepublicanprimary-candidates",
      "src-ballotpedia-gov-rep-primary",
    ],
  },

  // A withdrawn candidate kept only because data/issues.ts already
  // references this candidateId — not part of any race roster shown to
  // voters (see racesByZip / getCandidatesForZip, which filter to "active").
  {
    id: "cand-duggan-mike",
    raceId: "governor-2026",
    name: "Mike Duggan",
    office: "Governor of Michigan",
    election: "2026 Michigan Gubernatorial Election",
    level: "state",
    party: "Independent",
    jurisdiction: "Statewide",
    electionDate: "2026-11-03",
    status: "withdrawn",
    filingStatus: "Withdrew from the race on May 21, 2026",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Mike_Duggan_%28Detroit_mayor%29_at_charity_preview_event_for_the_2025_Detroit_Auto_Show_%28542640846361%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "Detroit's former mayor ran an independent campaign for governor, then withdrew on May 21, 2026, citing fundraising challenges relative to the two major parties.",
    issuePositions: [],
    officialLinks: { website: "https://mikeduggan.com/" },
    sourceIds: ["src-detroitnews-duggan-ends", "src-wikipedia-photo-mike-duggan"],
    demoDataNote:
      "Retained as a historical record because earlier civic-issue entries (housing, transportation, taxation) cite his tenure as mayor; excluded from active candidate listings.",
  },

  // ---------------------------------------------------------------------
  // U.S. Senate (Michigan) — open seat
  // ---------------------------------------------------------------------
  {
    id: "cand-stevens-haley",
    raceId: "us-senate-2026",
    name: "Haley Stevens",
    office: "U.S. Senator",
    election: "2026 U.S. Senate Election (Michigan) — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed by outgoing Sen. Gary Peters",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Haley_Stevens%2C_official_portrait%2C_116th_Congress.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The sitting U.S. Representative for Michigan's 11th District is running as the primary's more centrist Democrat, emphasizing electability against the eventual Republican nominee.",
    issuePositions: [
      {
        issueId: "issue-healthcare",
        summary:
          "Supports expanding healthcare access through incremental reform rather than a single-payer 'Medicare for All' system.",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Campaign centers on manufacturing and the auto industry; in Congress she authored the American Manufacturing Leadership Act and worked to pass the USMCA, and has run 'Manufacturing Mondays' visits to Michigan factories to promote skills-gap workforce training.",
      },
    ],
    officialLinks: {},
    sourceIds: [
      "src-breakingbattlegrounds-mi-senate",
      "src-nbcnews-peters-retire",
      "src-wikipedia-photo-haley-stevens",
      "src-haleyformi-manufacturing",
    ],
    demoDataNote: "Position summary reflects reporting on the primary as of July 2026.",
  },
  {
    id: "cand-elsayed-abdul",
    raceId: "us-senate-2026",
    name: "Abdul El-Sayed",
    office: "U.S. Senator",
    election: "2026 U.S. Senate Election (Michigan) — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed by Sen. Bernie Sanders and Rep. Alexandria Ocasio-Cortez",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Abdul_El-Sayed_meet-and-greet_by_Conlan_Houston_5_%28cropped%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The former Wayne County health director is running as the primary's progressive candidate, built around Medicare for All and reducing corporate money in politics.",
    issuePositions: [
      {
        issueId: "issue-healthcare",
        summary:
          "Running explicitly on 'Medicare for All' and getting corporate and PAC money out of the healthcare debate.",
      },
      {
        issueId: "issue-housing",
        summary:
          "Campaign priorities page calls for zoning reform and direct investment in affordable housing to curb speculative buying amid Michigan's housing crisis.",
      },
      {
        issueId: "issue-environment",
        summary:
          "Priorities page frames climate action as a public-health issue, campaigning for clean air and water alongside his healthcare platform.",
      },
    ],
    officialLinks: { website: "https://abdulforsenate.com/" },
    sourceIds: [
      "src-abdulforsenate",
      "src-abdulforsenate-priorities",
      "src-cnn-elsayed-stevens",
      "src-detroitnews-senate-fundraising",
      "src-wikipedia-photo-abdul-elsayed",
    ],
    demoDataNote: "Position summary reflects reporting on the primary as of July 2026.",
  },
  {
    id: "cand-rogers-mike",
    raceId: "us-senate-2026",
    name: "Mike Rogers",
    office: "U.S. Senator",
    election: "2026 U.S. Senate Election (Michigan) — Republican Primary",
    level: "federal",
    party: "Republican",
    jurisdiction: "Michigan",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Presumptive Republican nominee (no primary opponent identified in available coverage)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Mike-Rogers-Head-Shot-2_%283x4_cropped%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "A former U.S. Representative and the 2024 Republican Senate nominee (lost to Elissa Slotkin by fewer than 20,000 votes), running again for Michigan's open Senate seat on an affordability-focused platform.",
    issuePositions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Platform calls for bringing manufacturing jobs back to Michigan and lowering costs for gas, groceries, and prescription drugs.",
      },
      {
        issueId: "issue-healthcare",
        summary: "Campaign says he will protect seniors' Social Security and Medicare benefits.",
      },
    ],
    officialLinks: { website: "https://rogersforsenate.com/" },
    sourceIds: [
      "src-nbcnews-peters-retire",
      "src-detroitnews-senate-fundraising",
      "src-wikipedia-photo-mike-rogers",
      "src-rogersforsenate",
      "src-michiganfarmnews-rogers",
    ],
  },

  // ---------------------------------------------------------------------
  // U.S. House — Michigan's 13th Congressional District
  // ---------------------------------------------------------------------
  {
    id: "cand-thanedar-shri",
    raceId: "us-house-mi13-2026",
    name: "Shri Thanedar",
    office: "U.S. Representative",
    election: "2026 Election — Michigan's 13th Congressional District — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan's 13th Congressional District",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate (incumbent, seeking a third term)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Shri_Thanedar%2C_official_portrait_%28119th_Congress%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The incumbent since 2022 is seeking renomination; The Detroit News editorial board endorsed him in July 2026, citing his voting record and committee work, while facing his most serious primary challenge to date.",
    issuePositions: [
      {
        issueId: "issue-healthcare",
        summary:
          "In the 119th Congress, sponsored the Improving Access to Institutional Mental Health Care Act (H.R. 5662), the Fight Hunger Act (H.R. 5809) targeting food insecurity, and the Health Disparity Zones Act of 2026 (H.R. 9488).",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Sponsored the One Stop Shop for Small Business Licensing Act of 2025 (H.R. 4824), which would streamline and consolidate small-business licensing requirements across federal agencies.",
      },
    ],
    officialLinks: {},
    sourceIds: [
      "src-detroitnews-thanedar-endorsement",
      "src-nbcnews-thanedar-challenge",
      "src-ballotpedia-mi13-dem-primary",
      "src-wikipedia-photo-shri-thanedar",
      "src-govtrack-thanedar-bills",
    ],
    legislationIds: [
      "leg-hr5662-2025-mental-health",
      "leg-hr5809-2025-fight-hunger",
      "leg-hr4824-2025-small-biz",
    ],
  },
  {
    id: "cand-mckinney-donavan",
    raceId: "us-house-mi13-2026",
    name: "Donavan McKinney",
    office: "U.S. Representative",
    election: "2026 Election — Michigan's 13th Congressional District — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan's 13th Congressional District",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed by Rep. Rashida Tlaib, Sen. Bernie Sanders, and the Justice Democrats",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/State_Rep_Donavan_McKinney_Swearing_In_12.12.22_%2852565631658%29_%28cropped%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "A Detroit native serving his second term in the Michigan House (District 11), running as a progressive challenger to incumbent Thanedar, with his campaign focused on affordability in what he calls one of the nation's poorest congressional districts.",
    issuePositions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Campaign is built around lowering the cost of living, specifically car insurance and child care, for a district he describes as one of the nation's poorest.",
      },
      {
        issueId: "issue-public-safety",
        summary:
          "As a state representative, sponsored House Bills 5586 and 5587 of 2026 creating a state office and grant program for community violence intervention services, plus a driver's-license restoration bill for parolees (HB 5477) and police-accountability and data-privacy legislation.",
      },
      {
        issueId: "issue-government-accountability",
        summary:
          "Sponsored House Bills 5975 and 5976 of 2026, which would bar regulated utilities like DTE Energy and Consumers Energy, and large state contractors, from making political contributions.",
      },
      {
        issueId: "issue-environment",
        summary:
          "Introduced House Bill 6041 of 2026 to authorize community solar facilities, aimed at extending solar-energy access to renters and homeowners hit hardest by rising energy costs.",
      },
      {
        issueId: "issue-taxation",
        summary:
          "Sponsored House Bill 5856 of 2026, a HOPE zone property-tax exemption intended to reduce or eliminate property taxes for eligible low-income homeowners in his district.",
      },
    ],
    officialLinks: { website: "https://www.donavanforcongress.com/" },
    sourceIds: [
      "src-wikipedia-mckinney",
      "src-michiganadvance-mckinney-launch",
      "src-nbcnews-thanedar-challenge",
      "src-michiganvotes-mckinney-sponsorships",
      "src-michiganadvance-mckinney-solar",
      "src-michiganadvance-utility-donation-ban",
    ],
    legislationIds: [
      "leg-hb5975-5976-2026-utility-donations",
      "leg-hb6041-2026-community-solar",
      "leg-hb5586-2026-cvi",
      "leg-hb5856-2026-hope-zone-mckinney",
    ],
  },
  {
    id: "cand-campbell-shelby",
    raceId: "us-house-mi13-2026",
    name: "Shelby Campbell",
    office: "U.S. Representative",
    election: "2026 Election — Michigan's 13th Congressional District — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan's 13th Congressional District",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for Michigan's 13th Congressional District. Detailed policy positions were not found in available public coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-mi13-dem-primary"],
  },
  {
    id: "cand-carbonaro-anthony",
    raceId: "us-house-mi13-2026",
    name: "Anthony Carbonaro",
    office: "U.S. Representative",
    election: "2026 Election — Michigan's 13th Congressional District — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan's 13th Congressional District",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for Michigan's 13th Congressional District. Detailed policy positions were not found in available public coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-mi13-dem-primary"],
  },
  {
    id: "cand-hassan-nazmul",
    raceId: "us-house-mi13-2026",
    name: "Nazmul Hassan",
    office: "U.S. Representative",
    election: "2026 Election — Michigan's 13th Congressional District — Democratic Primary",
    level: "federal",
    party: "Democratic",
    jurisdiction: "Michigan's 13th Congressional District",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Democratic primary candidate for Michigan's 13th Congressional District. Detailed policy positions were not found in available public coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-mi13-dem-primary"],
  },

  // ---------------------------------------------------------------------
  // Michigan Senate District 3 (downtown/Midtown/New Center Detroit,
  // Hamtramck, Highland Park) — open seat, ZIPs 48226 / 48201 / 48244
  // ---------------------------------------------------------------------
  {
    id: "cand-hollier-adam",
    raceId: "mi-senate-3-2026",
    name: "Adam Hollier",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 3 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 3",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; switched from the Secretary of State race in February 2026",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Adam_Hollier_at_Whitmer%27s_inauguration_%28January_1%2C_2023%29_%28cropped%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "A former state senator (2019–2023) and director of the Michigan Veterans Affairs Agency, running to reclaim the seat with a focus on the cost of living, housing, and criminal-justice reform.",
    issuePositions: [
      {
        issueId: "issue-housing",
        summary:
          "Highlights past legislative work to 'keep people in their homes' and supports continued lead-service-line replacement in Detroit.",
      },
      {
        issueId: "issue-public-safety",
        summary: "Lists criminal-justice reform among his top priorities for a second Senate term.",
      },
    ],
    officialLinks: { website: "https://www.adamhollier.com/" },
    sourceIds: [
      "src-arabamericannews-hollier",
      "src-cbsnews-hollier",
      "src-wikipedia-photo-adam-hollier",
    ],
  },
  {
    id: "cand-conyers-john",
    raceId: "mi-senate-3-2026",
    name: "John Conyers III",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 3 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 3",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A lifelong Detroiter and son of the late Congressman John Conyers Jr. and former City Council President Monica Conyers, running on affordability, economic mobility, and restoring trust in government.",
    issuePositions: [
      {
        issueId: "issue-economic-development",
        summary: "Platform centers on affordability and expanding economic mobility for Detroit residents.",
      },
    ],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-mi-senate-d3"],
  },
  {
    id: "cand-garrett-latanya",
    raceId: "mi-senate-3-2026",
    name: "LaTanya Garrett",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 3 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 3",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A former three-term state representative (District 7, 2015–2020) seeking a return to Lansing via the open Senate seat. Detailed 2026 platform positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-detroitchamber-senate-seats"],
  },
  {
    id: "cand-james-theodore",
    raceId: "mi-senate-3-2026",
    name: "Theodore James",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 3 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 3",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "An education-focused candidate who previously ran for the Michigan State Board of Education in 2024; campaign emphasizes strong public schools, student support services, and statewide educational equity.",
    issuePositions: [
      {
        issueId: "issue-education",
        summary:
          "Champions strong public schools, student support services, and statewide educational equity as his central legislative focus.",
      },
    ],
    officialLinks: {},
    sourceIds: ["src-detroitchamber-senate-seats"],
  },
  {
    id: "cand-taylor-eboni",
    raceId: "mi-senate-3-2026",
    name: "Eboni Taylor",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 3 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 3",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed early by term-limited Sen. Stephanie Chang",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A first-time candidate whose career has centered on expanding political power and economic opportunity for Black women through roles at Higher Heights and Mothering Justice; campaign priorities include affordability, child-care access, and holding payday lenders accountable.",
    issuePositions: [
      {
        issueId: "issue-economic-development",
        summary:
          "Campaign priorities include affordability, expanding child-care access, and holding payday lenders accountable.",
      },
      {
        issueId: "issue-education",
        summary: "Also lists public-school investment among her top legislative priorities.",
      },
    ],
    officialLinks: {},
    sourceIds: ["src-detroitchamber-senate-seats"],
  },

  // ---------------------------------------------------------------------
  // Michigan House District 9 (downtown/Midtown/New Center Detroit,
  // Corktown) — open seat, ZIPs 48226 / 48201 / 48244
  // ---------------------------------------------------------------------
  {
    id: "cand-harrington-arthur",
    raceId: "mi-house-9-2026",
    name: "Arthur Harrington",
    office: "State Representative",
    election: "2026 Election — Michigan House District 9 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 9",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed by retiring Rep. Joe Tate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A Wayne State University law student and former Detroit City Council staffer, running on a six-point platform covering public safety, jobs, schools, transit, environment, and housing.",
    issuePositions: [
      {
        issueId: "issue-public-safety",
        summary:
          "Priorities include funding community violence intervention and mental-health and reentry services aimed at preventing crime before it happens, saying 'safety comes from investment, not just enforcement.'",
      },
      {
        issueId: "issue-economic-development",
        summary: "Supports fair wages and good jobs, and expanding the Michigan Earned Income Tax Credit.",
      },
      {
        issueId: "issue-education",
        summary:
          "Campaign platform calls for every child in the district to have a 'fully funded public school,' opposing funding drains and expanding access to college and trades programs.",
      },
      {
        issueId: "issue-transportation",
        summary:
          "Committed to making public transit 'affordable and dependable,' connecting residents to work, school, and healthcare.",
      },
      {
        issueId: "issue-environment",
        summary:
          "Platform calls for standing up to polluters in the district and fighting for clean air and water, including green-jobs and renewable-energy investment.",
      },
      {
        issueId: "issue-housing",
        summary:
          "Supports tenant protections, anti-displacement policy, and real investment in affordable housing to prevent longtime residents from being priced out amid neighborhood growth.",
      },
    ],
    officialLinks: { website: "https://harringtonformi.com/" },
    sourceIds: [
      "src-harringtonformi",
      "src-detroitchamber-house-races",
      "src-mlcmi-house9-primary",
    ],
  },
  {
    id: "cand-ervin-darryl",
    raceId: "mi-house-9-2026",
    name: "Darryl Ervin",
    office: "State Representative",
    election: "2026 Election — Michigan House District 9 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 9",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Founder of the youth-focused nonprofit SLS Detroit and a former Michigan Senate District 3 staffer and Deloitte financial analyst, campaigning on reducing Michigan's cost of living.",
    issuePositions: [
      {
        issueId: "issue-economic-development",
        summary: "Campaign is centered on reducing the cost of living for Michigan families.",
      },
    ],
    officialLinks: {},
    sourceIds: ["src-thebeautifulmachine-ervin", "src-mlcmi-house9-primary"],
  },
  {
    id: "cand-mua-toni",
    raceId: "mi-house-9-2026",
    name: "Toni Mua",
    office: "State Representative",
    election: "2026 Election — Michigan House District 9 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 9",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A community organizer running in the redrawn District 9 after a previous, historic run in District 10 as the first openly trans woman to seek Michigan's state legislature. Detailed 2026 policy positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: { website: "https://www.tonimua.com/" },
    sourceIds: ["src-tonimua", "src-mlcmi-house9-primary"],
  },
  {
    id: "cand-burton-willie",
    raceId: "mi-house-9-2026",
    name: "Willie E. Burton",
    office: "State Representative",
    election: "2026 Election — Michigan House District 9 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 9",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate; endorsed by the 13th District Democrats",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A former Detroit Board of Police Commissioner whose campaign frames public safety as beginning with living-wage jobs, affordable housing, strong schools, and accessible mental-health care.",
    issuePositions: [
      {
        issueId: "issue-public-safety",
        summary:
          "Campaign argues real public safety starts long before a crime occurs — through living-wage jobs, affordable housing, strong schools, and mental-health care — alongside police accountability.",
      },
    ],
    officialLinks: { website: "https://willieburton.com/" },
    sourceIds: ["src-willieburton", "src-mlcmi-house9-primary"],
  },
  {
    id: "cand-eid-anthony",
    raceId: "mi-house-9-2026",
    name: "Anthony Eid",
    office: "State Representative",
    election: "2026 Election — Michigan House District 9 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 9",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A former Michigan Independent Citizens Redistricting Commissioner and senior director of public policy at Community Development Advocates of Detroit. Detailed 2026 policy positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-detroitchamber-house-races", "src-mlcmi-house9-primary"],
  },

  // ---------------------------------------------------------------------
  // Michigan Senate District 12 (Grosse Pointe Park and nearby Wayne/
  // Macomb communities) — ZIP 48230
  // ---------------------------------------------------------------------
  {
    id: "cand-hertel-kevin",
    raceId: "mi-senate-12-2026",
    name: "Kevin Hertel",
    office: "State Senator",
    election: "2026 Election — Michigan Senate District 12",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan Senate District 12",
    electionDate: "2026-11-03",
    status: "active",
    filingStatus: "Filed — incumbent, unopposed in the Democratic primary",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Veteran_Suicide_Prevention_Roundtable_Discusses_Commitment_to_Service_Members_%284%29_%28cropped%29.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The incumbent since 2023 (and a former state representative, 2017–2022) is running for a second Senate term. As a senator he sponsored the state's 2025 housing-supply law.",
    issuePositions: [
      {
        issueId: "issue-housing",
        summary:
          "Sponsored Senate Bill 23 of 2025 (Public Act 58), which eased municipal platting rules to allow more buildable lots without a full subdivision review — a measure aimed at increasing Michigan's housing supply.",
      },
      {
        issueId: "issue-healthcare",
        summary:
          "Sponsored Senate Bill 1011 of 2026, creating a small-business health insurance pool (passed the Senate 35-0), and Senate Bill 973 of 2026, establishing a state-based health insurance exchange (passed 20-16).",
      },
      {
        issueId: "issue-economic-development",
        summary:
          "Sponsored Senate Bill 1048 of 2026, which would require project labor agreements and prevailing wage and fringe-benefit rates for certain data-center construction contracts.",
      },
    ],
    officialLinks: { website: "https://www.kevinhertelforsenate.com/" },
    sourceIds: [
      "src-legislature-sb23-2025",
      "src-ballotpedia-kevin-hertel",
      "src-kevinhertelforsenate",
      "src-macomb-candidate-list-2026",
      "src-wikipedia-photo-kevin-hertel",
      "src-michiganvotes-hertel-sponsorships",
    ],
    legislationIds: [
      "leg-sb23-2025",
      "leg-sb1011-973-2026-health-pool",
      "leg-sb1048-2026-data-center-labor",
    ],
    demoDataNote:
      "Five Republicans have also filed for this seat (Joseph Backus, Patrick Biange, John Goldwater, Eileen Tesch, Shelley Wright); their individual platforms were not detailed in available coverage, so they are not profiled here — see the official Macomb County candidate list cited above.",
  },

  // ---------------------------------------------------------------------
  // Michigan House District 10 (northeast Detroit, Harper Woods, the
  // Grosse Pointes) — ZIP 48230
  // ---------------------------------------------------------------------
  {
    id: "cand-paiz-veronica",
    raceId: "mi-house-10-2026",
    name: "Veronica Paiz",
    office: "State Representative",
    election: "2026 Election — Michigan House District 10 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 10",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — incumbent seeking re-election (re-elected with 67.44% of the vote in 2024)",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Paiz_Headshot_2025-scaled.jpg",
    isDemoPhoto: false,
    confidence: "demo-data",
    positionSummary:
      "The incumbent since 2023 is running for a second term, citing recent legislation on tenants' rights, auto-insurance costs for seniors, and water-quality standards.",
    issuePositions: [
      {
        issueId: "issue-housing",
        summary:
          "Cosponsored the 2025 Tenants' Rights legislative package, a 17-bill effort led by Rep. Amos O'Neal to modernize landlord-tenant law, including shorter security-deposit return windows and stronger habitability requirements; campaign priorities include affordable housing and lower child-care costs.",
      },
      {
        issueId: "issue-environment",
        summary: "Lists water-infrastructure quality and standards among her legislative priorities.",
      },
      {
        issueId: "issue-taxation",
        summary:
          "Sponsored House Bill 5866 of 2026, a HOPE zone property-tax exemption reducing the property-tax burden for eligible low-income homeowners in her district.",
      },
    ],
    officialLinks: { website: "https://www.veronicaforstaterep.com/" },
    sourceIds: [
      "src-veronicaforstaterep",
      "src-housedems-paiz",
      "src-ballotpedia-veronica-paiz",
      "src-wikipedia-photo-veronica-paiz",
      "src-housedems-tenants-rights-package",
      "src-michiganvotes-paiz-sponsorships",
    ],
    legislationIds: ["leg-hb5866-2026-hope-zone-paiz"],
  },
  {
    id: "cand-nelson-ryan",
    raceId: "mi-house-10-2026",
    name: "Ryan Nelson",
    office: "State Representative",
    election: "2026 Election — Michigan House District 10 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 10",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate (Grosse Pointe Park)",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A Grosse Pointe Park resident challenging incumbent Rep. Paiz in the Democratic primary. Detailed policy positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-veronica-paiz", "src-mi-boe-official-candidate-listing"],
  },
  {
    id: "cand-cyburt-andrew",
    raceId: "mi-house-10-2026",
    name: "Andrew Cyburt",
    office: "State Representative",
    election: "2026 Election — Michigan House District 10 — Democratic Primary",
    level: "state",
    party: "Democratic",
    jurisdiction: "Michigan House District 10",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Democratic primary candidate (Harper Woods)",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "A Harper Woods resident challenging incumbent Rep. Paiz in the Democratic primary. Detailed policy positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-veronica-paiz", "src-mi-boe-official-candidate-listing"],
  },
  {
    id: "cand-ochs-peter",
    raceId: "mi-house-10-2026",
    name: "Peter Ochs",
    office: "State Representative",
    election: "2026 Election — Michigan House District 10 — Republican Primary",
    level: "state",
    party: "Republican",
    jurisdiction: "Michigan House District 10",
    electionDate: "2026-08-04",
    status: "active",
    filingStatus: "Filed — Republican primary candidate",
    photoUrl: "",
    isDemoPhoto: true,
    confidence: "demo-data",
    positionSummary:
      "Declared Republican primary candidate for Michigan House District 10. Detailed policy positions were not found in available coverage as of July 2026.",
    issuePositions: [],
    officialLinks: {},
    sourceIds: ["src-ballotpedia-veronica-paiz", "src-mi-boe-official-candidate-listing"],
  },
];

// ZIP codes covered by this demo, and the races that appear on the ballot
// for each. Per project scope, the candidate roster is intentionally
// limited to these four ZIP codes.
export const racesByZip: Record<string, string[]> = {
  "48226": [
    "governor-2026",
    "us-senate-2026",
    "us-house-mi13-2026",
    "mi-senate-3-2026",
    "mi-house-9-2026",
  ],
  "48201": [
    "governor-2026",
    "us-senate-2026",
    "us-house-mi13-2026",
    "mi-senate-3-2026",
    "mi-house-9-2026",
  ],
  "48244": [
    "governor-2026",
    "us-senate-2026",
    "us-house-mi13-2026",
    "mi-senate-3-2026",
    "mi-house-9-2026",
  ],
  "48230": [
    "governor-2026",
    "us-senate-2026",
    "us-house-mi13-2026",
    "mi-senate-12-2026",
    "mi-house-10-2026",
  ],
};

export function getRaceById(raceId: string): Race | undefined {
  return races.find((r) => r.id === raceId);
}

export function getCandidateById(id: string): CandidateRecord | undefined {
  return candidates.find((c) => c.id === id);
}

// Active candidates for the races on the ballot in a given ZIP code,
// grouped by race, in the same order as `racesByZip[zip]`.
export function getRacesForZip(
  zip: string
): Array<{ race: Race; candidates: CandidateRecord[] }> {
  const raceIds = racesByZip[zip];
  if (!raceIds) return [];
  return raceIds
    .map((raceId) => ({
      race: getRaceById(raceId)!,
      candidates: candidates.filter(
        (c) => c.raceId === raceId && c.status === "active"
      ),
    }))
    .filter((entry) => entry.race);
}

export function isSupportedCandidateZip(zip: string | null | undefined): boolean {
  return Boolean(zip && zip in racesByZip);
}
