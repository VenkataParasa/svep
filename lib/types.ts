// Shared domain types for the City of Detroit Voter Education Platform mock data layer.
// Nothing here touches a database — every record below is served from
// static seed data in /data and (for admin edits) mirrored into a
// client-side Zustand store.

export type Confidence = "verified" | "demo-data";

export type Party =
  | "Democratic"
  | "Republican"
  | "Independent"
  | "Nonpartisan"
  | "Other";

export type GovLevel = "federal" | "state" | "city";

export type SourceType =
  | "government"
  | "legislative"
  | "news"
  | "nonprofit"
  | "campaign";

export type VerificationStatus = "verified" | "pending" | "unverified";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  verificationStatus: VerificationStatus;
  lastUpdated: string; // ISO date
  notes?: string;
}

export interface ContactInfo {
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface IssuePosition {
  issueId: string;
  summary: string;
}

export interface Representative {
  id: string;
  name: string;
  office: string;
  level: GovLevel;
  party: Party;
  jurisdiction: string;
  district?: string;
  photoUrl: string;
  isDemoPhoto: boolean;
  confidence: Confidence;
  bio: string;
  responsibilities: string[];
  initiatives: string[];
  contact: ContactInfo;
  issuePositions: IssuePosition[];
  sourceIds: string[];
  demoDataNote?: string;
  
  // NLP Fields
  nlpBioHtml?: string | null;
  nlpReadabilityScore?: number | null;
  nlpRequiresReview?: boolean | null;
}

export type CandidateStatus = "active" | "withdrawn" | "incumbent";

export interface Candidate {
  id: string;
  name: string;
  office: string;
  election: string;
  level: GovLevel;
  party: Party;
  jurisdiction: string;
  electionDate: string; // ISO date
  status: CandidateStatus;
  filingStatus?: string;
  photoUrl: string;
  isDemoPhoto: boolean;
  confidence: Confidence;
  positionSummary: string;
  issuePositions: IssuePosition[];
  officialLinks: {
    website?: string;
    campaignSite?: string;
  };
  sourceIds: string[];
  demoDataNote?: string;
}

export type LegislationStatus =
  | "introduced"
  | "in committee"
  | "passed"
  | "signed into law"
  | "enacted";

export interface Legislation {
  id: string;
  billNumber: string;
  title: string;
  summary: string;
  status: LegislationStatus;
  sponsors: string[];
  relatedIssueId: string;
  level: GovLevel;
  confidence: Confidence;
  sourceIds: string[];
  lastUpdated: string;
  demoDataNote?: string;
  
  // NLP Fields
  nlpSummaryHtml?: string | null;
  nlpReadabilityScore?: number | null;
  nlpRequiresReview?: boolean | null;
}

export type IssueCategory =
  | "Housing"
  | "Education"
  | "Public Safety"
  | "Transportation"
  | "Economic Development"
  | "Environment"
  | "Healthcare"
  | "Parks & Recreation"
  | "Taxation"
  | "Government Accountability & Ethics";

export interface RelatedDepartment {
  name: string;
  url?: string;
}

export type PublicDocumentType =
  | "agenda"
  | "minutes"
  | "ordinance"
  | "resolution"
  | "bill"
  | "report"
  | "publication";

export interface PublicDocument {
  id?: string;
  title: string;
  type: PublicDocumentType;
  url: string;
  date?: string;
}

export interface Issue {
  id: string;
  slug: string;
  title: IssueCategory;
  icon: string; // lucide icon name
  summary: string;
  plainLanguageSummary: string;
  communityImpact: string;
  relatedDepartments: RelatedDepartment[];
  legislationIds: string[];
  representativeIds: string[];
  candidateIds: string[];
  publicDocuments: PublicDocument[];
  sourceIds: string[];
  status: "active" | "monitoring";
  confidence: Confidence;
  lastUpdated: string;
  demoDataNote?: string;
  
  // NLP Fields
  nlpSummaryHtml?: string | null;
  nlpCommunityImpactHtml?: string | null;
  nlpReadabilityScore?: number | null;
  nlpRequiresReview?: boolean | null;
}

export interface ZipJurisdiction {
  zip: string;
  city: string;
  county: string;
  neighborhood: string;
  councilDistrict: string;
  councilDistrictConfidence: Confidence;
  congressionalDistrict: string;
  congressionalConfidence: Confidence;
  stateSenateDistrict: string;
  stateSenateConfidence: Confidence;
  stateHouseDistrict: string;
  stateHouseConfidence: Confidence;
  representativeIds: string[];
  topIssueIds: string[];
  governmentOffice: string;
  lastUpdated: string;
  demoDataNote?: string;
  latitude?: number | null;
  longitude?: number | null;
  mapTargets?: Partial<Record<
    "city" | "county" | "council" | "stateHouse" | "stateSenate" | "congressional",
    { label: string }
  >>;
}

export type AuditStage = "retrieved" | "verified" | "processed" | "displayed";

export interface AuditRecord {
  id: string;
  entityType: "representative" | "candidate" | "issue" | "legislation" | "jurisdiction";
  entityId: string;
  entityLabel: string;
  stage: AuditStage;
  timestamp: string;
  source: string;
  version: string;
  status: "success" | "warning" | "error";
}

export interface MetadataField {
  id: string;
  field: string;
  value: string;
  source: string;
  lastUpdated: string;
  version: string;
  confidenceScore: number; // 0-100
}

export interface MostViewedIssue {
  issueId: string;
  issue: string;
  views: number;
}

export interface PopularZip {
  zip: string;
  neighborhood: string;
  searches: number;
}

export interface CandidateViewStat {
  candidateId: string;
  candidate: string;
  views: number;
}

export interface CivicInterestTrend {
  month: string;
  housing: number;
  education: number;
  publicSafety: number;
  transportation: number;
  economicDevelopment: number;
  environment: number;
  healthcare: number;
  parksRecreation: number;
}

export interface AnalyticsData {
  mostViewedIssues: MostViewedIssue[];
  popularZipCodes: PopularZip[];
  candidateViews: CandidateViewStat[];
  civicInterestTrends: CivicInterestTrend[];
}

export interface ApiServiceStatus {
  id: "government" | "legislative" | "election";
  name: string;
  status: "operational" | "degraded" | "outage";
  latencyMs: number;
  lastChecked: string;
}
