import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Upper Intermediate" };

const UNITS = [
  {
    label: "Port Forwarding & NAT/NAPT",
    description: "Sharing one public address across a household, and opening a port for inbound access.",
  },
  {
    label: "TLS/SSL Encryption",
    description: "What the padlock in your browser guarantees, and how the encryption handshake works.",
  },
  {
    label: "CDN",
    description: "Why a site stays fast worldwide by serving cached copies from nearby edge servers.",
  },
];

export default function UpperIntermediatePage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Upper Intermediate" }]} />
      <h1 className="text-2xl font-semibold mb-1">Upper Intermediate</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        Keeping traffic safe and fast — sharing addresses, encrypting connections, and serving
        content from close by.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {UNITS.map((s) => (
          <div
            key={s.label}
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
        ))}
      </div>
    </div>
  );
}
