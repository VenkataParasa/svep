import type { Issue } from "@/lib/types";

// Eight civic issue categories with Detroit-specific, sourced context.
// relatedDepartments without a `url` reflect a real department whose
// specific official landing page could not be directly confirmed during
// research — the name is still real, just not linked, rather than
// guessing at a URL.
export const issues: Issue[] = [
  {
    id: "issue-housing",
    slug: "housing",
    title: "Housing",
    icon: "Home",
    summary: "Affordable housing supply, blight removal, and protections against corporate landlords.",
    plainLanguageSummary:
      "Detroit and Michigan are working on two fronts at once: making it easier to build new housing (by cutting red tape in the platting process) and protecting existing housing stock from being bought up in bulk by out-of-state investors. Mayor Sheffield has also made inclusionary and affordable housing a top city priority.",
    communityImpact:
      "Easing lot-division rules could speed up new home construction on vacant land, a major issue in a city with significant vacant lots. A cap on corporate ownership of single-family homes would aim to keep more starter homes available to individual buyers rather than institutional landlords, potentially affecting rental costs and home prices across Detroit neighborhoods.",
    relatedDepartments: [{ name: "Housing and Revitalization Department (HRD)" }],
    legislationIds: ["leg-sb23-2025", "leg-sb971-2026"],
    representativeIds: ["rep-mayor-duggan", "rep-governor-whitmer", "rep-council-d5-sheffield"],
    candidateIds: ["cand-benson-jocelyn", "cand-duggan-mike"],
    publicDocuments: [
      { title: "Senate Bill 23 of 2025 (Public Act 58) — full bill text", type: "bill", url: "https://www.legislature.mi.gov/Bills/Bill?ObjectName=2025-SB-0023", date: "2025-12-15" },
      { title: "City of Detroit Code of Ordinances", type: "ordinance", url: "https://library.municode.com/mi/detroit/codes/code_of_ordinances" },
      { title: "Detroit City Council Agendas & Documents", type: "agenda", url: "https://detroitmi.gov/government/city-clerk/city-council-agendas-documents" },
    ],
    sourceIds: ["src-legislature-sb23-2025", "src-senatedems-housing-package", "src-detroitmi-mayor"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-05-14",
  },
  {
    id: "issue-education",
    slug: "education",
    title: "Education",
    icon: "GraduationCap",
    summary: "Literacy investment amid Detroit Public Schools' declining enrollment and school consolidation.",
    plainLanguageSummary:
      "Michigan passed new laws requiring early dyslexia screening and evidence-based reading instruction, backed by a FY2026 budget that raises per-pupil funding and funds free school meals. Meanwhile, Detroit Public Schools Community District enrollment has fallen from about 160,000 students in 2000 to roughly 49,000 today, with the district weighing school closures and consolidations for the 2025-26 year.",
    communityImpact:
      "State literacy investment could improve reading outcomes for Detroit's youngest students, but declining DPSCD enrollment — with an estimated 72,000 available seats districtwide — is forcing difficult decisions about which schools stay open, directly affecting families' school choices and neighborhood stability.",
    relatedDepartments: [
      { name: "Michigan Department of Education (MDE)", url: "https://www.michigan.gov/mde" },
      { name: "Detroit Public Schools Community District (DPSCD)" },
    ],
    legislationIds: ["leg-sb567-568-2024", "leg-school-aid-fy2026"],
    representativeIds: ["rep-governor-whitmer", "rep-mistatehouse-tate-joe"],
    candidateIds: ["cand-benson-jocelyn"],
    publicDocuments: [
      { title: "Gov. Whitmer Signs FY2026 Education Budget (official release)", type: "publication", url: "https://www.michigan.gov/whitmer/news/press-releases/2025/10/07/gov-whitmer-signs-education-budget", date: "2025-10-07" },
      { title: "Literacy & Dyslexia Screening Laws — official announcement", type: "publication", url: "https://www.michigan.gov/mde/news-and-information/press-releases/2024/10/10/children-win-with-gov-whitmers-signature-of-historic-literacy-dyslexia-laws", date: "2024-10-10" },
    ],
    sourceIds: ["src-michigan-literacy-laws", "src-michigan-school-aid-budget", "src-bridgedetroit-schools"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2025-10-07",
  },
  {
    id: "issue-public-safety",
    slug: "public-safety",
    title: "Public Safety",
    icon: "ShieldCheck",
    summary: "Detroit's historic multi-year decline in violent crime and continued gun-violence prevention efforts.",
    plainLanguageSummary:
      "Detroit ended 2025 with 165 criminal homicides — the first time in six decades the city has been below 200 — continuing a multi-year decline in violent crime, shootings, and carjackings. At the state level, Michigan has enacted gun-buyback destruction requirements and re-established a Gun Violence Prevention Task Force.",
    communityImpact:
      "The sustained drop in violent crime, nonfatal shootings (down 26%), and carjackings (down 46% year-over-year, 84% since 2015) reflects investment in both policing and the city's new Office of Neighborhood and Community Safety, which focuses on mental health, after-school programs, and job training as crime-prevention tools.",
    relatedDepartments: [
      { name: "Office of Neighborhood and Community Safety", url: "https://detroitmi.gov/news/mayor-sheffield-joins-law-enforcement-community-partners-announce-another-historic-drop-violent" },
      { name: "Detroit Police Department (DPD)" },
    ],
    legislationIds: ["leg-hb6144-6146-2025", "leg-eo-2026-13"],
    representativeIds: ["rep-mayor-duggan", "rep-governor-whitmer", "rep-council-d1-tate"],
    candidateIds: ["cand-james-john"],
    publicDocuments: [
      { title: "Executive Order 2026-13 — Gun Violence Prevention Task Force", type: "publication", url: "https://www.michigan.gov/whitmer/news/press-releases/2026/06/04/whitmer-re-establishes-gun-violence-prevention-task-force-to-keep-families-safe", date: "2026-06-04" },
      { title: "Detroit City Council Agendas & Documents", type: "agenda", url: "https://detroitmi.gov/government/city-clerk/city-council-agendas-documents" },
    ],
    sourceIds: ["src-detroitnews-crime-2026", "src-detroitmi-safety-office", "src-michigan-safety-bills", "src-michigan-eo-2026-13"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-06-04",
  },
  {
    id: "issue-transportation",
    slug: "transportation",
    title: "Transportation",
    icon: "Bus",
    summary: "Bus fleet and terminal investment, plus a possible regional transit funding measure.",
    plainLanguageSummary:
      "DDOT (Detroit's Department of Transportation) received a $50 million federal grant for 53 new buses and is completing a $160 million terminal at Coolidge, alongside a planned Rosa Parks Transit Center renovation. Regionally, the Regional Transit Authority of Southeast Michigan is finalizing an updated master plan and may pursue a funding millage in 2026.",
    communityImpact:
      "New buses and terminal capacity aim to improve reliability and reduce wait times on core DDOT routes. A potential regional transit millage would be a ballot question for voters across southeast Michigan, directly shaping whether Detroit gets expanded regional bus or rail service in the years ahead.",
    relatedDepartments: [
      { name: "Detroit Department of Transportation (DDOT)", url: "https://detroitmi.gov/departments/detroit-department-transportation" },
      { name: "Regional Transit Authority of Southeast Michigan (RTA)", url: "https://www.rtamichigan.org/planning-policy-programs/master-plan" },
    ],
    legislationIds: [],
    representativeIds: ["rep-mayor-duggan"],
    candidateIds: ["cand-duggan-mike", "cand-james-john"],
    publicDocuments: [
      { title: "DDOT Service Expansion Announcement", type: "publication", url: "https://detroitmi.gov/news/ddot-announces-new-service-expansions-effective-today" },
      { title: "RTA Regional Transit Master Plan", type: "report", url: "https://www.rtamichigan.org/planning-policy-programs/master-plan" },
    ],
    sourceIds: ["src-detroitmi-ddot", "src-rta-master-plan"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-03-01",
  },
  {
    id: "issue-economic-development",
    slug: "economic-development",
    title: "Economic Development",
    icon: "TrendingUp",
    summary: "Small-business grants, workforce development, and neighborhood commercial investment.",
    plainLanguageSummary:
      "Detroit's economic development work runs through several coordinated arms: the Detroit Economic Growth Corporation (DEGC) handles business attraction and incentives, the Housing and Revitalization Department runs grant and certification programs, and Detroit at Work (operated by the Detroit Employment Solutions Corporation) is the city's official workforce agency. The Motor City Match program has awarded small-business grants twice already in 2026 — $535,000 to 11 businesses in January and $370,000 to 8 businesses in May — and the city opened 2026 registration for its Grow Detroit's Young Talent summer youth jobs program in March.",
    communityImpact:
      "Motor City Match grants directly fund new storefronts and small businesses in Detroit neighborhoods, while Detroit at Work's nine career centers (one per council district) and the youth summer jobs program aim to connect residents to employment. Mayor Sheffield's first budget also proposed expanding the Affordable Housing Development and Preservation Fund from 40% to 100% of city-owned commercial property sale proceeds, tying land sales more directly to housing investment.",
    relatedDepartments: [
      { name: "Detroit Economic Growth Corporation (DEGC)", url: "https://detroitmi.gov/departments/detroit-economic-growth-corporation" },
      { name: "Housing and Revitalization Department (HRD) — Economic Development", url: "https://detroitmi.gov/departments/housing-and-revitalization-department/nonprofits-and-community-groups/economic-development" },
      { name: "Detroit Employment Solutions Corporation (Detroit at Work)", url: "https://detroitmi.gov/node/23931" },
    ],
    legislationIds: [],
    representativeIds: ["rep-mayor-duggan"],
    candidateIds: [],
    publicDocuments: [
      { title: "Motor City Match Round 26 Awards", type: "publication", url: "https://detroitmi.gov/news/motor-city-matchs-round-26-awards-help-launch-new-businesses-17-detroit-neighborhoods", date: "2026-01-20" },
      { title: "Grow Detroit's Young Talent 2026 Registration", type: "publication", url: "https://detroitmi.gov/news/detroit-youth-can-now-register-summer-jobs-mayor-sheffield-announces-opening-2026-gdyt-application", date: "2026-03-13" },
      { title: "Mayor Sheffield's First Proposed Budget", type: "report", url: "https://detroitmi.gov/news/detroit-rises-higher-mayor-mary-sheffield-presents-first-proposed-budget-keeping-promises-prioritize" },
    ],
    sourceIds: ["src-detroitmi-degc", "src-detroitmi-hrd-econdev", "src-detroitmi-motorcitymatch", "src-detroitmi-gdyt", "src-detroitatwork"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-05-06",
  },
  {
    id: "issue-environment",
    slug: "environment",
    title: "Environment",
    icon: "Leaf",
    summary: "Water affordability programs and ongoing industrial air-quality concerns in southwest Detroit.",
    plainLanguageSummary:
      "Detroit's Lifeline H2O water-affordability program offers an income-based flat rate and has enrolled 4,709 households, with a new enrollment window expected in summer 2026; the water department does not expect an increase in shutoffs this year. Separately, Detroit received an 'F' grade in the American Lung Association's 2026 State of the Air report, with the 48217 ZIP code remaining one of the state's most industrially polluted areas.",
    communityImpact:
      "Water affordability enrollment directly affects whether low-income households face shutoffs, while ongoing industrial air pollution — concentrated in southwest Detroit near the Stellantis Detroit Assembly Complex — continues to raise public health concerns that residents and city officials are actively contesting.",
    relatedDepartments: [{ name: "Detroit Water and Sewerage Department (DWSD)", url: "https://detroitmi.gov/departments/detroit-water-and-sewerage-department" }],
    legislationIds: [],
    representativeIds: ["rep-council-d6-santiago-romero"],
    candidateIds: [],
    publicDocuments: [
      { title: "Detroit Water Affordability Program (Lifeline H2O) Coverage", type: "report", url: "https://www.bridgedetroit.com/when-will-detroits-water-affordability-program-reopen/" },
      { title: "2026 State of the Air Report", type: "report", url: "https://planetdetroit.org/2026/04/detroit-air-quality-report/" },
    ],
    sourceIds: ["src-bridgedetroit-water", "src-planetdetroit-air"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-04-01",
  },
  {
    id: "issue-healthcare",
    slug: "healthcare",
    title: "Healthcare",
    icon: "HeartPulse",
    summary: "Detroit's first citywide health assessment since 2018 targets maternal health and access barriers.",
    plainLanguageSummary:
      "The Detroit Health Department released its first comprehensive Community Health Assessment since 2018, informed by more than 6,000 residents, and is launching a 2026-2029 Community Health Improvement Plan focused on maternal health, chronic disease, food access, and healthcare access. Reported barriers include provider proximity, long wait times, and insurance navigation difficulty.",
    communityImpact:
      "The new health plan is meant to guide where the city and partners direct resources over the next three years — including where new clinics, food access programs, or maternal health services are prioritized — directly shaping healthcare access in Detroit neighborhoods starting summer 2026.",
    relatedDepartments: [{ name: "Detroit Health Department", url: "https://detroitmi.gov/departments/detroit-health-department" }],
    legislationIds: [],
    representativeIds: ["rep-mayor-duggan"],
    candidateIds: [],
    publicDocuments: [
      { title: "Community Health Roadmap (CHA/CHIP 2026-2029)", type: "report", url: "https://detroitmi.gov/news/mayor-sheffield-detroit-health-department-release-community-health-roadmap-informed-6000-detroiters" },
    ],
    sourceIds: ["src-detroitmi-health-roadmap"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-04-01",
  },
  {
    id: "issue-parks-recreation",
    slug: "parks-recreation",
    title: "Parks & Recreation",
    icon: "TreePine",
    summary: "The Joe Louis Greenway build-out, Belle Isle Park, and ARPA-funded recreation center investment.",
    plainLanguageSummary:
      "Detroit Parks & Recreation and the General Services Department are building the Joe Louis Greenway, a planned 29-mile trail loop connecting Detroit, Dearborn, Hamtramck, and Highland Park; as of mid-2026 roughly 8.4 miles are open, 7.1 miles are under construction, and 5.9 miles are funded but not yet started, with full build-out expected in 5-10 years depending on fundraising. The city has also directed $107 million in American Rescue Plan Act funds toward projects including a new Chandler Park Athletic Fieldhouse, Roosevelt Park, and the Helen Moore Recreation Center. Belle Isle Park is city-owned but has been operated as a state park by the Michigan DNR since 2014 under a 30-year lease.",
    communityImpact:
      "Each completed Greenway segment extends safe walking and biking access between neighborhoods — the city estimates over 40,000 residents will live within a 10-minute walk of the trail once finished. ARPA-funded recreation center and park upgrades directly expand where Detroit families can access athletic facilities and green space today, while Belle Isle's state-park status continues to shape how that regional asset is funded and managed.",
    relatedDepartments: [
      { name: "Detroit Parks & Recreation", url: "https://detroitmi.gov/departments/detroit-parks-recreation" },
      { name: "General Services Department", url: "https://detroitmi.gov/departments/general-services-department" },
      { name: "Michigan Department of Natural Resources (Belle Isle Park)", url: "https://www.michigan.gov/recsearch/parks/belleisle" },
    ],
    legislationIds: [],
    representativeIds: ["rep-mayor-duggan"],
    candidateIds: ["cand-duggan-mike"],
    publicDocuments: [
      { title: "Joe Louis Greenway — Official Project Page", type: "publication", url: "https://detroitmi.gov/departments/general-services-department/joe-louis-greenway" },
      { title: "City Receives Federal Grants for Joe Louis Greenway", type: "publication", url: "https://detroitmi.gov/news/city-detroit-receives-millions-federal-grants-construction-and-planning-joe-louis-greenway" },
    ],
    sourceIds: ["src-detroitmi-parksrec", "src-detroitmi-joelouisgreenway", "src-michigan-dnr-belleisle"],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-05-01",
    demoDataNote:
      "Greenway mileage-progress figures and the reported Belle Isle privatization-plan rejection are sourced from local news coverage (Crain's Detroit, Model D, Planet Detroit), not a directly fetched official .gov press release — treat as well-corroborated but not primary-source-confirmed.",
  },
  {
    id: "issue-taxation",
    slug: "taxation",
    title: "Taxation",
    icon: "BadgeDollarSign",
    summary: "Local property tax assessments, state income tax policies, and corporate tax incentives.",
    plainLanguageSummary:
      "Taxation in Michigan involves state-level income and sales taxes, alongside local property taxes. In Detroit, property tax assessments and the use of tax abatements to spur development are major topics of debate. Recent legislative efforts have focused on adjusting tax rates and credits to balance state revenues with economic relief for residents.",
    communityImpact:
      "Changes to local property tax rates or state income tax credits directly impact residents' cost of living. Furthermore, the city's use of tax incentives for developers is heavily debated as it trades immediate tax revenue for long-term neighborhood revitalization and job creation.",
    relatedDepartments: [
      { name: "Michigan Department of Treasury", url: "https://www.michigan.gov/treasury" },
      { name: "Detroit Office of the Assessor", url: "https://detroitmi.gov/departments/office-chief-financial-officer/ocfo-divisions/office-assessor" },
    ],
    legislationIds: [],
    representativeIds: ["rep-mayor-duggan", "rep-governor-whitmer"],
    candidateIds: [],
    publicDocuments: [],
    sourceIds: [],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-05-15",
  },
  {
    id: "issue-government-accountability",
    slug: "government-accountability",
    title: "Government Accountability & Ethics",
    icon: "Landmark",
    summary: "Open-records (FOIA) reform and limits on political contributions from utilities and state contractors.",
    plainLanguageSummary:
      "Michigan is one of only two states — with Massachusetts — where the governor and state Legislature are exempt from the Freedom of Information Act. Senate Bills 1 and 2 of 2025, which would end that exemption, passed the Senate 33-2 in January 2025 but have stalled in the House Governmental Operations Committee, whose chair has said FOIA reform is not a 2026 priority. Separately, a bipartisan package of bills — including House Bills 5975 and 5976 — would bar regulated utilities like DTE Energy and Consumers Energy, and large state contractors, from making political contributions.",
    communityImpact:
      "If enacted, FOIA expansion would let Detroit residents and journalists request records directly from the Governor's office and the Legislature for the first time, the same way they can already request records from Detroit city departments. The utility-donation ban would limit DTE Energy and Consumers Energy's ability to fund the campaigns of the same lawmakers who regulate their electricity rates — a direct link Detroit ratepayers raise when utility bills rise.",
    relatedDepartments: [
      { name: "Michigan Department of State — Bureau of Elections", url: "https://www.michigan.gov/sos/elections" },
      { name: "Michigan House of Representatives — Government Operations Committee" },
    ],
    legislationIds: ["leg-sb1-2-2025-foia", "leg-hb5975-5976-2026-utility-donations"],
    representativeIds: [],
    candidateIds: ["cand-james-john", "cand-mckinney-donavan"],
    publicDocuments: [
      { title: "Senate Bill 1 of 2025 — Senate Fiscal Agency bill analysis", type: "bill", url: "https://legislature.mi.gov/documents/2025-2026/billanalysis/Senate/pdf/2025-SFA-0001-G.pdf", date: "2025-01-29" },
      { title: "House Bill 5975 of 2026 — full bill text", type: "bill", url: "https://www.legislature.mi.gov/Bills/Bill?ObjectName=2026-HB-5975" },
    ],
    sourceIds: [
      "src-michiganadvance-foia-senate-passes",
      "src-senatedems-moss-foia",
      "src-michiganadvance-foia-stalls",
      "src-michiganadvance-utility-donation-ban",
      "src-planetdetroit-utility-pledge",
    ],
    status: "active",
    confidence: "verified",
    lastUpdated: "2026-07-16",
    demoDataNote:
      "New issue category added after candidate research surfaced FOIA reform and utility/contractor campaign-finance bills as a recurring, sourced theme across multiple 2026 candidates.",
  },
];

export function getIssueBySlug(slug: string): Issue | undefined {
  return issues.find((i) => i.slug === slug);
}

export function getIssueById(id: string): Issue | undefined {
  return issues.find((i) => i.id === id);
}
