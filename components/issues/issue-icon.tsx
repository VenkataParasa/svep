import {
  Bus,
  GraduationCap,
  HeartPulse,
  Home,
  Leaf,
  ShieldCheck,
  TreePine,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home,
  GraduationCap,
  ShieldCheck,
  Bus,
  HeartPulse,
  Leaf,
  TrendingUp,
  TreePine,
};

export function IssueIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Home;
  return <Icon className={className} />;
}
