import type { AnalyticsData } from "@/lib/types";

// Static, illustrative usage analytics for the Admin > Analytics page.
export const analyticsData: AnalyticsData = {
  mostViewedIssues: [
    { issueId: "issue-public-safety", issue: "Public Safety", views: 4820 },
    { issueId: "issue-housing", issue: "Housing", views: 4310 },
    { issueId: "issue-education", issue: "Education", views: 3475 },
    { issueId: "issue-economic-development", issue: "Economic Development", views: 2640 },
    { issueId: "issue-transportation", issue: "Transportation", views: 2190 },
    { issueId: "issue-healthcare", issue: "Healthcare", views: 1860 },
    { issueId: "issue-parks-recreation", issue: "Parks & Recreation", views: 1610 },
    { issueId: "issue-environment", issue: "Environment", views: 1502 },
  ],
  popularZipCodes: [
    { zip: "48226", neighborhood: "Downtown Detroit", searches: 3120 },
    { zip: "48201", neighborhood: "Midtown / Corktown", searches: 2740 },
    { zip: "48202", neighborhood: "New Center / Boston-Edison", searches: 1980 },
    { zip: "48203", neighborhood: "North End / Highland Park border", searches: 1215 },
  ],
  candidateViews: [
    { candidateId: "cand-benson-jocelyn", candidate: "Jocelyn Benson", views: 5230 },
    { candidateId: "cand-james-john", candidate: "John James", views: 4795 },
    { candidateId: "cand-duggan-mike", candidate: "Mike Duggan", views: 3080 },
  ],
  civicInterestTrends: [
    { month: "Feb 2026", housing: 820, education: 640, publicSafety: 910, transportation: 410, economicDevelopment: 300, environment: 280, healthcare: 350, parksRecreation: 210 },
    { month: "Mar 2026", housing: 940, education: 690, publicSafety: 980, transportation: 455, economicDevelopment: 340, environment: 300, healthcare: 380, parksRecreation: 230 },
    { month: "Apr 2026", housing: 1050, education: 720, publicSafety: 1040, transportation: 500, economicDevelopment: 385, environment: 335, healthcare: 410, parksRecreation: 255 },
    { month: "May 2026", housing: 1180, education: 780, publicSafety: 1120, transportation: 540, economicDevelopment: 430, environment: 365, healthcare: 445, parksRecreation: 280 },
    { month: "Jun 2026", housing: 1260, education: 810, publicSafety: 1205, transportation: 575, economicDevelopment: 465, environment: 390, healthcare: 470, parksRecreation: 300 },
    { month: "Jul 2026", housing: 1340, education: 845, publicSafety: 1275, transportation: 610, economicDevelopment: 500, environment: 415, healthcare: 495, parksRecreation: 320 },
  ],
};
