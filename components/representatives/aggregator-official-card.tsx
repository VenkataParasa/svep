"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Shield,
  Users,
  Globe,
  Phone,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Briefcase,
  Camera,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { ExpandableBiography } from "@/components/shared/expandable-biography";

interface IncumbentStance {
  category: string;
  evidence: string;
  action_id: string;
}

interface Opponent {
  name: string;
  party: string;
  inferred_stances: string[];
}

export interface DistrictData {
  office_title: string;
  representative_id?: string;
  incumbent: {
    name: string;
    party: string;
    photo_url?: string;
    photo_origin_url?: string;
    urls?: string[];
    phones?: string[];
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    bio?: string;
    inferred_stances: IncumbentStance[];
  };
  active_opponents: Opponent[];
}

interface AggregatorOfficialCardProps {
  data: DistrictData;
  ocdId: string;
}

export function AggregatorOfficialCard({
  data,
  ocdId,
}: AggregatorOfficialCardProps) {
  const router = useRouter();
  const { office_title, incumbent, active_opponents } = data;
  const profileHref = data.representative_id
    ? `/representatives/${data.representative_id}`
    : undefined;

  const partyColor = (party: string) => {
    const p = party.toLowerCase();
    if (p.includes("democrat"))
      return "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    if (p.includes("republican"))
      return "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    return "bg-slate-500/10 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800";
  };

  // Group stances by category to improve readability
  const groupedStances = (incumbent.inferred_stances || []).reduce(
    (acc, stance) => {
      if (!acc[stance.category]) acc[stance.category] = [];
      // Prevent exact duplicate evidence texts
      if (!acc[stance.category].includes(stance.evidence)) {
        acc[stance.category].push(stance.evidence);
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <Card
      className={`flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow ${
        profileHref ? "cursor-pointer" : ""
      }`}
      role={profileHref ? "link" : undefined}
      tabIndex={profileHref ? 0 : undefined}
      onClick={(event) => {
        if (!profileHref || (event.target as HTMLElement).closest("a, button"))
          return;
        router.push(profileHref);
      }}
      onKeyDown={(event) => {
        if (
          profileHref &&
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          router.push(profileHref);
        }
      }}
    >
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 items-start">
            <PersonAvatar
              name={incumbent.name || "Unknown Official"}
              photoUrl={incumbent.photo_url || undefined}
              fallbackUrl={incumbent.photo_origin_url || undefined}
              className="size-14 border-2 border-background shadow-sm"
            />

            <div>
              <CardDescription className="text-xs font-semibold tracking-wider uppercase mb-1 flex items-center gap-1.5 text-primary">
                <Shield className="w-3.5 h-3.5" />
                {office_title}
              </CardDescription>
              <CardTitle className="text-xl">
                {incumbent.name || "Vacant / Unknown"}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={partyColor(incumbent.party)}
                >
                  {incumbent.party || "Unknown Party"}
                </Badge>
                {incumbent.urls && incumbent.urls.length > 0 && (
                  <a
                    href={incumbent.urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                )}
                {incumbent.phones && incumbent.phones.length > 0 && (
                  <a
                    href={`tel:${incumbent.phones[0]}`}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" /> {incumbent.phones[0]}
                  </a>
                )}
                {incumbent.facebook && (
                  <a
                    href={
                      incumbent.facebook.startsWith("http")
                        ? incumbent.facebook
                        : `https://facebook.com/${incumbent.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" /> Facebook
                  </a>
                )}
                {incumbent.twitter && (
                  <a
                    href={
                      incumbent.twitter.startsWith("http")
                        ? incumbent.twitter
                        : `https://twitter.com/${incumbent.twitter}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" /> Twitter
                  </a>
                )}
                {incumbent.linkedin && (
                  <a
                    href={
                      incumbent.linkedin.startsWith("http")
                        ? incumbent.linkedin
                        : `https://linkedin.com/in/${incumbent.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Briefcase className="w-3 h-3" /> LinkedIn
                  </a>
                )}
                {incumbent.instagram && (
                  <a
                    href={
                      incumbent.instagram.startsWith("http")
                        ? incumbent.instagram
                        : `https://instagram.com/${incumbent.instagram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3 h-3" /> Instagram
                  </a>
                )}
              </div>
              {incumbent.bio && (
                <ExpandableBiography
                  text={incumbent.bio}
                  className="mt-3 text-sm text-muted-foreground"
                />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* <CardContent className="pt-6 flex-1">
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Inferred Policy Stances
        </h4>
        {Object.keys(groupedStances).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(groupedStances).map(
              ([category, evidences], idx) => (
                <div
                  key={idx}
                  className="bg-secondary/50 rounded-md p-3 text-sm"
                >
                  <Link
                    href={`/issues?search=${encodeURIComponent(category)}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline mb-1"
                  >
                    {category}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <ul className="text-muted-foreground text-xs leading-relaxed list-disc list-inside space-y-1">
                    {evidences.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-md">
            No policy stances inferred or available.
          </div>
        )}

        {active_opponents && active_opponents.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-orange-500">
              <Users className="w-4 h-4" />
              Active Challengers
            </h4>
            <div className="space-y-2">
              {active_opponents.map((opp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm border border-border rounded p-2"
                >
                  <span className="font-medium">{opp.name}</span>
                  <Badge variant="outline" className={partyColor(opp.party)}>
                    {opp.party}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent> */}
      {/* <CardFooter className="bg-muted/20 border-t py-3 px-6 text-xs text-muted-foreground flex items-center justify-between gap-3">
        <span className="truncate max-w-[220px]" title={ocdId}>{ocdId}</span>
        {profileHref && (
          <Link href={profileHref} className="shrink-0 font-medium text-primary hover:underline">
            View profile
          </Link>
        )}
      </CardFooter> */}
    </Card>
  );
}
