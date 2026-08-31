import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Beginner" };

const UNITS = [
  {
    href: "/beginner/pips-network-story",
    label: "DRAFT: Pip's Network Story",
    description: "The redesigned Beginner track, told as one continuous story — will eventually replace the units below.",
    status: "ready" as const,
  },
  {
    href: "/beginner/ip-address-wifi",
    label: "[old] IP Address & Wi-Fi Connection [to be deleted]",
    description: "How devices are identified and addressed on a network, how subnets and DHCP work, and what happens when two devices share an address.",
    status: "ready" as const,
  },
  {
    href: "/beginner/dns",
    label: "DNS",
    description: "Why typing a name like example.com reaches the right server.",
    status: "ready" as const,
  },
  {
    href: "/beginner/http-status",
    label: "HTTP Methods & Status Codes",
    description: "The common language of the web, and how to tell 502 from 504.",
    status: "ready" as const,
  },
  {
    href: "/beginner/firewall-basics",
    label: "Firewall Basics",
    description: "How a firewall allows or blocks traffic at the network's edge.",
    status: "ready" as const,
  },
];

export default function BeginnerPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Beginner" }]} />
      <h1 className="text-2xl font-semibold mb-1">Beginner</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        Everyday questions about how devices &ldquo;connect&rdquo; — addresses, names, wireless
        signals, and the first line of defense at the edge of the network.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {UNITS.map((s) =>
          s.status === "ready" ? (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-400 transition-colors"
            >
              <div className="font-medium text-neutral-900">{s.label}</div>
              <p className="text-sm text-neutral-600 mt-1">{s.description}</p>
            </Link>
          ) : (
            <div
              key={s.href}
              className="block rounded-lg border border-neutral-200 bg-neutral-50 p-4 opacity-50"
            >
              <div className="font-medium text-neutral-400 flex items-center gap-2">
                {s.label}
                <span className="text-xs uppercase tracking-wide text-neutral-500 border border-neutral-200 rounded px-1.5 py-0.5">
                  coming soon
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">{s.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
