import type { Confidence, ZipJurisdiction } from "@/lib/types";

// ZIP-code personalization for all Detroit and Detroit-border ZIP codes.
//
// How the mappings were built (and how honest they are):
// - Every PERSON named is real and verified against official sources.
// - Congressional assignments come from the official composition of
//   MI-12 (Rashida Tlaib) and MI-13 (Shri Thanedar); ZIPs deep inside one
//   district are marked "verified", boundary-area ZIPs are marked
//   "demo-data" because the exact line runs mid-ZIP.
// - State senate/house and council-district assignments are inferred
//   from each district's official community list or narrative
//   description — not a parcel-level GIS lookup — so most are marked
//   "demo-data" (approximate). Assignments directly confirmed by an
//   official community list (e.g. "all of River Rouge" on a senator's
//   district page) are marked "verified".
// - Border ZIPs primarily serving other municipalities (River Rouge,
//   Harper Woods, Ecorse, the Grosse Pointes, Redford Twp) say so
//   plainly: Detroit's mayor and council do not govern there.

const MAYOR = "rep-mayor-sheffield";
const AT_LARGE = ["rep-council-protem-young", "rep-council-atlarge-waters"];
const STATEWIDE = [
  "rep-governor-whitmer",
  "rep-ltgov-gilchrist",
  "rep-ussenate-peters",
  "rep-ussenate-slotkin",
];

const COUNCIL_IDS: Record<string, string> = {
  D1: "rep-council-president-tate",
  D2: "rep-council-d2-whitfield-calloway",
  D3: "rep-council-d3-benson",
  D4: "rep-council-d4-johnson",
  D5: "rep-council-d5-miller",
  D6: "rep-council-d6-santiago-romero",
  D7: "rep-council-d7-mccampbell",
};

const COUNCIL_LABELS: Record<string, string> = {
  D1: "District 1 (James E. Tate Jr.)",
  D2: "District 2 (Angela Whitfield-Calloway)",
  D3: "District 3 (Scott Benson)",
  D4: "District 4 (Latisha Johnson)",
  D5: "District 5 (Renata Miller)",
  D6: "District 6 (Gabriela Santiago-Romero)",
  D7: "District 7 (Denzel McCampbell)",
};

const CONG: Record<string, { label: string; id: string }> = {
  "12": { label: "Michigan's 12th Congressional District (Rashida Tlaib)", id: "rep-ushouse-tlaib" },
  "13": { label: "Michigan's 13th Congressional District (Shri Thanedar)", id: "rep-ushouse-thanedar" },
};

const SD: Record<string, { label: string; id: string }> = {
  "1": { label: "Senate District 1 (Erika Geiss)", id: "rep-misenate-geiss" },
  "2": { label: "Senate District 2 (Sylvia Santana)", id: "rep-misenate-santana" },
  "3": { label: "Senate District 3 (Stephanie Chang)", id: "rep-mistatesenate-chang" },
  "6": { label: "Senate District 6 (Mary Cavanagh)", id: "rep-misenate-cavanagh" },
  "7": { label: "Senate District 7 (Jeremy Moss)", id: "rep-misenate-moss" },
  "8": { label: "Senate District 8 (Mallory McMorrow)", id: "rep-misenate-mcmorrow" },
  "10": { label: "Senate District 10 (Paul Wojno)", id: "rep-misenate-wojno" },
  "11": { label: "Senate District 11 (Veronica Klinefelt)", id: "rep-misenate-klinefelt" },
};

const HD: Record<string, { label: string; id: string }> = {
  "1": { label: "House District 1 (Tyrone Carter)", id: "rep-mistatehouse-carter" },
  "3": { label: "House District 3 (Alabas Farhat)", id: "rep-mistatehouse-farhat" },
  "4": { label: "House District 4 (Karen Whitsett)", id: "rep-mistatehouse-whitsett" },
  "5": { label: "House District 5 (Regina Weiss)", id: "rep-mistatehouse-weiss" },
  "7": { label: "House District 7 (Tonya Myers Phillips)", id: "rep-mistatehouse-myersphillips" },
  "8": { label: "House District 8 (Helena Scott)", id: "rep-mistatehouse-scott-helena" },
  "9": { label: "House District 9 (Joe Tate)", id: "rep-mistatehouse-tate-joe" },
  "10": { label: "House District 10 (Veronica Paiz)", id: "rep-mistatehouse-paiz" },
  "11": { label: "House District 11 (Donavan McKinney)", id: "rep-mistatehouse-mckinney" },
  "12": { label: "House District 12 (Kimberly Edwards)", id: "rep-mistatehouse-edwards" },
  "16": { label: "House District 16 (Stephanie A. Young)", id: "rep-mistatehouse-young-stephanie" },
};

const V: Confidence = "verified";
const A: Confidence = "demo-data"; // approximate / inferred

interface Row {
  zip: string;
  hood: string;
  /** Council district keys (D1-D7); empty = not applicable */
  council: string[];
  councilSuffix?: string;
  /** Congressional key "12" | "13"; extraCong adds the second rep for split ZIPs */
  cong: string;
  congConf: Confidence;
  congSplit?: boolean;
  sd?: string;
  sdConf: Confidence;
  sdLabelOverride?: string;
  hd?: string;
  hdConf: Confidence;
  hdLabelOverride?: string;
  hdExtra?: string;
  top: [string, string, string];
  note?: string;
  /** Set for ZIPs primarily serving another municipality */
  outsideDetroit?: string;
}

const NA = "Information not available";

const rows: Row[] = [
  { zip: "48201", hood: "Midtown", council: ["D5", "D6"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: V, hd: "9", hdConf: V, top: ["issue-housing", "issue-transportation", "issue-education"], note: "This ZIP likely straddles council Districts 5 (Midtown) and 6 (Corktown edge); both are shown pending a parcel-level boundary check." },
  { zip: "48202", hood: "New Center / North End", council: ["D5"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: V, hd: "9", hdConf: V, top: ["issue-housing", "issue-education", "issue-healthcare"], note: "District 5's official description names New Center and Boston-Edison, giving medium-high confidence for this mapping." },
  { zip: "48203", hood: "Highland Park (enclave) / North End", council: ["D2", "D3"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: A, hd: "7", hdConf: A, hdExtra: "8", top: ["issue-environment", "issue-public-safety", "issue-housing"], note: "Highland Park is an independent city with its own mayor and council, entirely surrounded by Detroit; the Detroit officials shown govern only the Detroit portion of this ZIP. State House District 7 covers Highland Park itself and District 8 covers adjacent northwest Detroit — the split within this ZIP is approximate." },
  { zip: "48204", hood: "West Side", council: ["D7"], councilSuffix: " — approximate", cong: "12", congConf: A, congSplit: true, sd: "2", sdConf: A, hd: "1", hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-economic-development"], note: "This ZIP sits in the MI-12/MI-13 boundary area — verify individual addresses at house.gov's Find Your Representative." },
  { zip: "48205", hood: "Northeast Side", council: ["D3", "D4"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "10", sdConf: A, hd: "11", hdConf: A, top: ["issue-public-safety", "issue-education", "issue-housing"] },
  { zip: "48206", hood: "Virginia Park / Boston-Edison", council: ["D5"], councilSuffix: " — approximate", cong: "13", congConf: A, sd: "3", sdConf: A, hd: "4", hdConf: A, top: ["issue-housing", "issue-healthcare", "issue-education"] },
  { zip: "48207", hood: "Lafayette Park / Rivertown", council: ["D5"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: A, hd: "9", hdConf: A, top: ["issue-housing", "issue-parks-recreation", "issue-transportation"] },
  { zip: "48208", hood: "Core City", council: ["D6"], councilSuffix: " — approximate", cong: "13", congConf: A, sd: "3", sdConf: A, hd: "1", hdConf: A, top: ["issue-housing", "issue-economic-development", "issue-environment"] },
  { zip: "48209", hood: "Southwest Detroit / Mexicantown", council: ["D6"], cong: "13", congConf: A, congSplit: true, sd: "1", sdConf: A, hd: "1", hdConf: A, top: ["issue-environment", "issue-economic-development", "issue-healthcare"], note: "This ZIP appears in both the MI-12 and MI-13 lists — the congressional boundary runs through the area, so verify individual addresses at house.gov." },
  { zip: "48210", hood: "Chadsey Condon", council: ["D6", "D7"], councilSuffix: " — approximate", cong: "13", congConf: A, sd: "2", sdConf: A, hd: "1", hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-economic-development"] },
  { zip: "48211", hood: "Milwaukee Junction", council: ["D3", "D5"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: A, hd: "7", hdConf: A, top: ["issue-economic-development", "issue-housing", "issue-transportation"] },
  { zip: "48212", hood: "Hamtramck (enclave) / Banglatown", council: ["D3"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: V, hd: "9", hdConf: A, hdExtra: "7", top: ["issue-housing", "issue-education", "issue-economic-development"], note: "Hamtramck is an independent city with its own mayor and council, entirely surrounded by Detroit; the Detroit officials shown govern only the Detroit portion of this ZIP. Hamtramck may be split between House Districts 7 and 9." },
  { zip: "48213", hood: "East Side", council: ["D4"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: A, hd: "9", hdConf: A, top: ["issue-public-safety", "issue-housing", "issue-education"] },
  { zip: "48214", hood: "Indian Village / Islandview", council: ["D5", "D4"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: A, hd: "9", hdConf: A, top: ["issue-housing", "issue-parks-recreation", "issue-public-safety"] },
  { zip: "48215", hood: "Jefferson Chalmers", council: ["D4"], cong: "13", congConf: V, sd: "11", sdConf: A, hd: "9", hdConf: A, top: ["issue-environment", "issue-housing", "issue-parks-recreation"] },
  { zip: "48216", hood: "Corktown", council: ["D6"], cong: "13", congConf: A, sd: "3", sdConf: A, hd: "9", hdConf: A, top: ["issue-economic-development", "issue-housing", "issue-transportation"] },
  { zip: "48217", hood: "Boynton / Oakwood Heights", council: ["D6"], cong: "13", congConf: A, sd: "1", sdConf: A, hd: "1", hdConf: A, top: ["issue-environment", "issue-healthcare", "issue-public-safety"], note: "ZIP 48217 is widely documented as one of Michigan's most industrially burdened areas — see the Environment issue page." },
  { zip: "48219", hood: "Old Redford / Brightmoor area", council: ["D1"], cong: "12", congConf: V, sd: "6", sdConf: A, hd: "16", hdConf: V, top: ["issue-housing", "issue-parks-recreation", "issue-public-safety"] },
  { zip: "48221", hood: "University District / Bagley", council: ["D2"], cong: "12", congConf: A, congSplit: true, sd: "8", sdConf: A, hd: "5", hdConf: A, top: ["issue-education", "issue-housing", "issue-parks-recreation"] },
  { zip: "48222", hood: "J.W. Westcott II (floating ZIP)", council: [], cong: "13", congConf: A, sdConf: A, hdConf: A, top: ["issue-transportation", "issue-environment", "issue-economic-development"], note: "ZIP 48222 is assigned to the J.W. Westcott II — the mail boat that delivers to freighters on the Detroit River — and is the only floating ZIP code in the United States. It has no residential population, so district-level assignments are not applicable." },
  { zip: "48223", hood: "Grandmont Rosedale", council: ["D1"], cong: "12", congConf: V, sd: "6", sdConf: A, hd: "16", hdConf: V, top: ["issue-housing", "issue-parks-recreation", "issue-public-safety"] },
  { zip: "48224", hood: "East English Village / Morningside", council: ["D4"], cong: "13", congConf: V, sd: "11", sdConf: A, hd: "10", hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-education"] },
  { zip: "48226", hood: "Downtown Detroit", council: ["D5"], councilSuffix: " — approximate", cong: "13", congConf: V, sd: "3", sdConf: V, hd: "9", hdConf: V, top: ["issue-public-safety", "issue-transportation", "issue-housing"], note: "District 5's official description names downtown, Greektown, and the Renaissance Center, giving medium-high confidence — inferred from narrative descriptions, not a parcel-level GIS lookup." },
  { zip: "48227", hood: "West Side", council: ["D1", "D7"], councilSuffix: " — approximate", cong: "12", congConf: A, congSplit: true, sd: "2", sdConf: A, hd: "4", hdConf: A, top: ["issue-public-safety", "issue-housing", "issue-economic-development"] },
  { zip: "48228", hood: "Warrendale", council: ["D7"], cong: "12", congConf: A, congSplit: true, sd: "2", sdConf: A, hd: "3", hdConf: A, top: ["issue-housing", "issue-economic-development", "issue-education"] },
  { zip: "48234", hood: "Osborn / Northeast", council: ["D3"], cong: "13", congConf: V, sd: "10", sdConf: A, hd: "11", hdConf: A, top: ["issue-public-safety", "issue-housing", "issue-healthcare"] },
  { zip: "48235", hood: "Greenfield / Northwest", council: ["D2"], councilSuffix: " — approximate", cong: "12", congConf: V, sd: "7", sdConf: A, hd: "4", hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-economic-development"] },
  { zip: "48238", hood: "Russell Woods / Dexter-Linwood", council: ["D2"], councilSuffix: " — approximate", cong: "12", congConf: A, congSplit: true, sd: "2", sdConf: A, hd: "4", hdConf: A, top: ["issue-housing", "issue-education", "issue-parks-recreation"] },
  { zip: "48241", hood: "Specialized / administrative postal ZIP", council: [], cong: "13", congConf: A, sdConf: A, hdConf: A, top: ["issue-economic-development", "issue-transportation", "issue-public-safety"], note: "ZIP 48241 is a specialized/administrative postal ZIP with no residential population; district-level assignments are not applicable." },
  { zip: "48243", hood: "Renaissance Center", council: ["D5"], cong: "13", congConf: V, sd: "3", sdConf: V, hd: "9", hdConf: V, top: ["issue-economic-development", "issue-transportation", "issue-public-safety"], note: "ZIP 48243 primarily serves the Renaissance Center office complex on the downtown riverfront and has few residents." },

  // ── Border ZIPs primarily serving other municipalities ──────────────
  { zip: "48218", hood: "River Rouge", outsideDetroit: "City of River Rouge", council: [], cong: "13", congConf: V, sd: "1", sdConf: V, hd: "1", hdConf: V, top: ["issue-environment", "issue-economic-development", "issue-healthcare"], note: "ZIP 48218 primarily serves the City of River Rouge, a separate municipality with its own mayor and council — Detroit's city government does not govern here. Senate District 1 (all of River Rouge) and House District 1 (River Rouge) are confirmed by the legislators' official district pages." },
  { zip: "48225", hood: "Harper Woods", outsideDetroit: "City of Harper Woods", council: [], cong: "13", congConf: V, sdConf: A, hd: "10", hdConf: V, top: ["issue-housing", "issue-public-safety", "issue-education"], note: "ZIP 48225 primarily serves the City of Harper Woods, a separate municipality with its own government. House District 10 (Harper Woods) is confirmed by Rep. Paiz's official page; the state senate assignment could not be confirmed." },
  { zip: "48229", hood: "Ecorse", outsideDetroit: "City of Ecorse", council: [], cong: "13", congConf: V, sd: "1", sdConf: V, hdConf: V, hdLabelOverride: "House District 2 (Tullio Liberati)", top: ["issue-environment", "issue-economic-development", "issue-healthcare"], note: "ZIP 48229 primarily serves the City of Ecorse, a separate municipality with its own government. Senate District 1 (all of Ecorse) is confirmed by Sen. Geiss's official district page; a House District 2 profile is not included in this demo." },
  { zip: "48230", hood: "Grosse Pointe / Grosse Pointe Park", outsideDetroit: "Cities of Grosse Pointe and Grosse Pointe Park", council: [], cong: "13", congConf: V, sdConf: A, hd: "10", hdConf: V, top: ["issue-education", "issue-parks-recreation", "issue-environment"], note: "ZIP 48230 serves the cities of Grosse Pointe and Grosse Pointe Park, separate municipalities with their own governments. House District 10 (all five Grosse Pointes) is confirmed by Rep. Paiz's official page; the state senate assignment could not be confirmed." },
  { zip: "48236", hood: "Grosse Pointe Woods / Farms / Shores", outsideDetroit: "Grosse Pointe Woods, Farms, and Shores", council: [], cong: "13", congConf: V, sdConf: A, hd: "10", hdConf: V, top: ["issue-education", "issue-parks-recreation", "issue-environment"], note: "ZIP 48236 serves Grosse Pointe Woods, Farms, and Shores — separate municipalities with their own governments. House District 10 (all five Grosse Pointes) is confirmed by Rep. Paiz's official page; the state senate assignment could not be confirmed." },
  { zip: "48239", hood: "Redford Township (south)", outsideDetroit: "Redford Charter Township", council: [], cong: "12", congConf: V, sd: "6", sdConf: V, hd: "16", hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-parks-recreation"], note: "ZIP 48239 primarily serves Redford Charter Township (a small sliver extends into Detroit). Senate District 6 (all of Redford Township) is confirmed by Sen. Cavanagh's official page; House District 16 covers southern Redford — approximate for this ZIP." },
  { zip: "48240", hood: "Redford Township (north)", outsideDetroit: "Redford Charter Township", council: [], cong: "12", congConf: V, sd: "6", sdConf: V, hdConf: A, top: ["issue-housing", "issue-public-safety", "issue-parks-recreation"], note: "ZIP 48240 primarily serves Redford Charter Township, which has its own township government. Senate District 6 (all of Redford Township) is confirmed; the state house assignment for this portion could not be confirmed." },
];

function buildJurisdiction(row: Row): ZipJurisdiction {
  const isDetroit = !row.outsideDetroit;

  const councilLabel = isDetroit
    ? row.council.length > 0
      ? row.council.map((d) => COUNCIL_LABELS[d]).join(" / ") + (row.councilSuffix ?? "")
      : "Not applicable — non-residential ZIP"
    : `Not applicable — ${row.outsideDetroit} has its own government`;

  const cong = CONG[row.cong];
  const congLabel = row.congSplit
    ? `${cong.label} — boundary area, verify by address`
    : cong.label;

  const sd = row.sd ? SD[row.sd] : undefined;
  const sdLabel = row.sdLabelOverride ?? (sd ? sd.label : isDetroit && row.council.length === 0 ? "Not applicable — non-residential ZIP" : NA);

  const hd = row.hd ? HD[row.hd] : undefined;
  let hdLabel = row.hdLabelOverride ?? (hd ? hd.label : isDetroit && row.council.length === 0 ? "Not applicable — non-residential ZIP" : NA);
  if (row.hdExtra && hd) {
    hdLabel = `${hd.label} / ${HD[row.hdExtra].label} — approximate`;
  }

  const representativeIds = [
    ...(isDetroit ? [MAYOR, ...row.council.map((d) => COUNCIL_IDS[d]), ...AT_LARGE] : []),
    ...STATEWIDE,
    cong.id,
    ...(sd ? [sd.id] : []),
    ...(hd ? [hd.id] : []),
    ...(row.hdExtra ? [HD[row.hdExtra].id] : []),
  ];

  return {
    zip: row.zip,
    city: isDetroit ? "City of Detroit" : `${row.outsideDetroit} (border ZIP)`,
    county: "Wayne County",
    neighborhood: row.hood,
    councilDistrict: councilLabel,
    councilDistrictConfidence: isDetroit && row.council.length > 0 ? A : V,
    congressionalDistrict: congLabel,
    congressionalConfidence: row.congConf,
    stateSenateDistrict: sdLabel,
    stateSenateConfidence: row.sdConf,
    stateHouseDistrict: hdLabel,
    stateHouseConfidence: row.hdConf,
    representativeIds,
    topIssueIds: [...row.top],
    governmentOffice: isDetroit
      ? "City of Detroit — Department of Elections"
      : "Wayne County Clerk — Elections Division",
    lastUpdated: "2026-07-06",
    demoDataNote: row.note,
  };
}

export const jurisdictions: ZipJurisdiction[] = rows.map(buildJurisdiction);

export const zipCodes: string[] = jurisdictions.map((j) => j.zip);

export function getJurisdictionByZip(zip: string): ZipJurisdiction | undefined {
  return jurisdictions.find((j) => j.zip === zip);
}
