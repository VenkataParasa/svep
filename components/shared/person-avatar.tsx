"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";
import * as React from "react";

export function PersonAvatar({
  name,
  photoUrl,
  fallbackUrl,
  className,
  size = "md",
}: {
  name: string;
  photoUrl?: string;
  fallbackUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [imgSrc, setImgSrc] = React.useState(photoUrl);

  const sizeClass = {
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-20 text-lg",
    xl: "size-28 text-2xl",
  }[size];

  return (
    <Avatar className={cn(sizeClass, "border border-border", className)}>
      {imgSrc ? (
        <AvatarImage 
          src={imgSrc} 
          alt={name} 
          onLoadingStatusChange={(status) => {
            if (status === "error" && imgSrc !== fallbackUrl && fallbackUrl) {
              setImgSrc(fallbackUrl);
            }
          }}
        />
      ) : (
        <></>
      )}
      <AvatarFallback className="bg-accent font-semibold text-accent-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
