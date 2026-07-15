import { cn } from "@/lib/utils";

export function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const common = {
    className: cn("size-4 shrink-0", className),
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;

  switch (platform) {
    case "Facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-8h2.75l.41-3.2H13.5V7.76c0-.93.26-1.56 1.6-1.56h1.71V3.34a23 23 0 0 0-2.49-.13c-2.46 0-4.14 1.5-4.14 4.26V9.8H7.4V13h2.78v8h3.32Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...common}>
          <path d="M5.34 7.67A1.84 1.84 0 1 0 5.33 4a1.84 1.84 0 0 0 .01 3.67ZM3.75 20h3.18V9.38H3.75V20Zm5.27 0h3.18v-5.93c0-1.56.3-3.08 2.24-3.08 1.91 0 1.94 1.79 1.94 3.18V20h3.18v-6.57c0-3.23-.7-5.72-4.47-5.72-1.81 0-3.02.99-3.52 1.93h-.04V9.38H9.02V20Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...common}>
          <path d="M21.58 7.19a2.85 2.85 0 0 0-2-2C17.82 4.7 12 4.7 12 4.7s-5.82 0-7.58.48a2.85 2.85 0 0 0-2 2A29.8 29.8 0 0 0 1.94 12c0 1.61.16 3.22.48 4.81a2.85 2.85 0 0 0 2 2C6.18 19.3 12 19.3 12 19.3s5.82 0 7.58-.48a2.85 2.85 0 0 0 2-2c.32-1.59.48-3.2.48-4.81 0-1.62-.16-3.23-.48-4.82ZM10 15.12V8.88L15.2 12 10 15.12Z" />
        </svg>
      );
    case "X / Twitter":
      return (
        <svg {...common}>
          <path d="M4.3 3h4.23l4.38 5.86L18.05 3h1.65l-6.03 7.08L20.2 21h-4.22l-4.85-6.48L5.61 21H3.95l6.42-7.7L4.3 3Zm3.4 1.32H6.94l9.7 15.36h.76L7.7 4.32Z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
  }
}
