import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueViewsChart } from "@/components/charts/issue-views-chart";
import { ZipSearchesChart } from "@/components/charts/zip-searches-chart";
import { CandidateViewsChart } from "@/components/charts/candidate-views-chart";
import { CivicInterestTrendChart } from "@/components/charts/civic-interest-trend-chart";
import { analyticsData } from "@/data/analytics";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-muted-foreground">
        Illustrative usage analytics for this demo, backed by static sample data.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Most Viewed Issue</CardTitle>
            <CardDescription>Page views by civic issue category.</CardDescription>
          </CardHeader>
          <CardContent>
            <IssueViewsChart data={analyticsData.mostViewedIssues} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Popular ZIP Codes</CardTitle>
            <CardDescription>Dashboard searches by ZIP code.</CardDescription>
          </CardHeader>
          <CardContent>
            <ZipSearchesChart data={analyticsData.popularZipCodes} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Candidate Views</CardTitle>
            <CardDescription>Profile views for 2026 Governor&rsquo;s race candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <CandidateViewsChart data={analyticsData.candidateViews} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Civic Interest Trends</CardTitle>
            <CardDescription>Monthly interest by issue category, last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <CivicInterestTrendChart data={analyticsData.civicInterestTrends} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
