import type { Metadata } from "next";
import { LeadersDirectory } from "@/components/leaders/leaders-directory";

export const metadata: Metadata = {
  title: "Officeholders | City of Detroit Voter Education Platform",
};

export default function LeadersPage() {
  return <LeadersDirectory />;
}
