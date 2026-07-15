export type CiceroIdentifier = {
  identifier_type?: string;
  identifier_value?: string;
};

export type SocialLink = { label: string; url: string };

export function ciceroBiography(notes?: Array<string | null>) {
  return (
    notes
      ?.map((note) => note?.trim())
      .find((note): note is string => Boolean(note && note.length >= 40)) ?? null
  );
}

function absoluteSocialUrl(type: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "");
  if (type.includes("FACEBOOK")) return `https://www.facebook.com/${handle}`;
  if (type === "TWITTER" || type === "X") return `https://x.com/${handle}`;
  if (type.includes("INSTAGRAM")) return `https://www.instagram.com/${handle}`;
  if (type === "LINKEDIN") return `https://www.linkedin.com/in/${handle}`;
  if (type === "YOUTUBE") return `https://www.youtube.com/@${handle}`;
  return null;
}

export function ciceroSocialLinks(identifiers?: CiceroIdentifier[]) {
  const links = new Map<string, SocialLink>();
  for (const identifier of identifiers ?? []) {
    const type = identifier.identifier_type?.toUpperCase() ?? "";
    const value = identifier.identifier_value?.trim();
    if (!value) continue;

    let label: string | null = null;
    if (type.includes("FACEBOOK")) label = "Facebook";
    else if (type === "TWITTER" || type === "X") label = "X / Twitter";
    else if (type.includes("INSTAGRAM")) label = "Instagram";
    else if (type === "LINKEDIN") label = "LinkedIn";
    else if (type === "YOUTUBE") label = "YouTube";
    if (!label || links.has(label)) continue;

    const url = absoluteSocialUrl(type, value);
    if (url) links.set(label, { label, url });
  }
  return [...links.values()];
}
