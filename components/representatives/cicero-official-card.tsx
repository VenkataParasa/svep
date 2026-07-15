"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Identifier {
  identifier_type: string;
  identifier_value: string;
}

interface Office {
  title: string;
  district?: {
    subtype?: string;
    state?: string;
    district_type?: string;
  };
  chamber?: {
    election_frequency?: string;
  };
}

export interface CiceroOfficial {
  id: number;
  first_name: string;
  last_name: string;
  office: Office;
  photo_origin_url?: string;
  party?: string;
  identifiers?: Identifier[];
  urls?: string[];
}

export function CiceroOfficialCard({ official }: { official: CiceroOfficial }) {
  const fullName = `${official.first_name} ${official.last_name}`;
  const title = official.office?.title || "Elected Official";
  const party = official.party || "Nonpartisan/Unknown";

  const getPartyColor = (p: string) => {
    const lower = p.toLowerCase();
    if (lower.includes("democrat")) return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400";
    if (lower.includes("republican")) return "bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-400";
    return "bg-slate-500/10 text-slate-700 hover:bg-slate-500/20 dark:text-slate-400";
  };

  const getProfileLink = () => {
    return official.id ? `/representatives/rep-cicero-${official.id}` : null;
  };

  const profileLink = getProfileLink();

  const getSocialName = (type: string) => {
    switch (type.toUpperCase()) {
      case "TWITTER": return "Twitter";
      case "FACEBOOK":
      case "FACEBOOK-OFFICIAL":
      case "FACEBOOK-CAMPAIGN": return "Facebook";
      case "INSTAGRAM":
      case "INSTAGRAM-CAMPAIGN": return "Instagram";
      case "LINKEDIN": return "LinkedIn";
      case "YOUTUBE": return "YouTube";
      case "VOTESMART": return "VoteSmart";
      default: return type;
    }
  };

  const getSocialUrl = (type: string, value: string) => {
    if (value.startsWith("http")) return value;
    switch (type.toUpperCase()) {
      case "TWITTER":
        return `https://twitter.com/${value}`;
      case "INSTAGRAM":
      case "INSTAGRAM-CAMPAIGN":
        return `https://instagram.com/${value}`;
      default:
        return value;
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/50 bg-background/50 backdrop-blur-sm text-sm">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {official.photo_origin_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={official.photo_origin_url}
              alt={fullName}
              className="h-full w-full object-contain object-top transition-transform duration-500 group-hover:scale-105 p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=No+Photo';
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary/30">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {official.first_name[0]}
                {official.last_name[0]}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-row justify-between gap-2">
        <div className="flex-1 flex flex-col gap-1.5">
          <Badge variant="secondary" className={`w-fit text-[9px] uppercase font-bold tracking-wider ${getPartyColor(party)} border-0 px-1.5 py-0`}>
            {party}
          </Badge>
          {profileLink ? (
            <Link href={profileLink} className="hover:underline">
              <h3 className="font-serif text-lg font-bold leading-tight tracking-tight text-foreground">
                {fullName}
              </h3>
            </Link>
          ) : (
            <h3 className="font-serif text-lg font-bold leading-tight tracking-tight text-foreground">
              {fullName}
            </h3>
          )}
          <p className="text-xs font-medium text-muted-foreground">
            {title}
          </p>
        </div>
        
        <div className="flex flex-col gap-1.5 items-end justify-start min-w-[80px]">
          {official.urls && official.urls.length > 0 && (
            <Link 
              href={official.urls[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
              title="Official Website"
            >
              <span>Website</span>
              <ExternalLink className="size-3" />
            </Link>
          )}
          
          {official.identifiers && official.identifiers.map((ident, i) => {
            const name = getSocialName(ident.identifier_type);
            const url = getSocialUrl(ident.identifier_type, ident.identifier_value);
            
            return (
              <Link
                key={`${ident.identifier_type}-${i}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
                title={ident.identifier_type}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
