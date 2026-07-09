import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";

export function PersonAvatar({
  name,
  photoUrl,
  className,
  size = "md",
}: {
  name: string;
  photoUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass = {
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-20 text-lg",
    xl: "size-28 text-2xl",
  }[size];

  return (
    <Avatar className={cn(sizeClass, "border border-border", className)}>
      {photoUrl ? <AvatarImage src={photoUrl} alt={name} /> : null}
      <AvatarFallback className="bg-accent font-semibold text-accent-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
