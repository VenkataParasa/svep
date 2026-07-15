import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Voter Services",
    links: [
      { href: "/dashboard", label: "My Civic Dashboard" },
      { href: "/leaders", label: "Officeholders" },
      { href: "/issues", label: "Civic Issues" },
      { href: "/search", label: "Search the Platform" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { href: "/sources", label: "Source Transparency" },
      { href: "/audit-trail", label: "Audit Trail" },
      { href: "/why-this-information", label: "Why This Information" },
    ],
  },
  {
    title: "Official Resources",
    links: [
      { href: "https://detroitmi.gov", label: "detroitmi.gov", external: true },
      { href: "https://detroitmi.gov/departments/department-elections", label: "Department of Elections", external: true },
      { href: "https://www.michigan.gov/sos/elections", label: "Michigan Secretary of State", external: true },
      { href: "/admin/login", label: "Staff Sign In" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/detroit-logo.png"
                alt="City of Detroit"
                width={44}
                height={51}
                className="h-12 w-auto rounded-sm bg-white p-0.5"
              />
              <span className="leading-tight">
                <span className="block text-sm font-semibold">City of Detroit</span>
                <span className="block text-xs text-muted-foreground">Voter Education Platform</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Issued by the Office of Contracting and Procurement on behalf of the Department of
              Elections. Demonstration platform built on publicly available government data.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 City of Detroit. Presales demonstration only — not an official city service.</p>
          <p>Data compiled from official City of Detroit, State of Michigan, and federal sources.</p>
        </div>
      </div>
    </footer>
  );
}
