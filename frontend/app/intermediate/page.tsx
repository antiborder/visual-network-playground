import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Intermediate" };

const UNITS = [
  {
    label: "Packet Fragmentation & Reassembly",
    description: "Why large data is broken into pieces, and how it's put back together correctly.",
  },
  {
    label: "Routing",
    description: "How data finds its way across many networks, and reroutes around a broken link.",
  },
  {
    label: "Ports & Application Routing",
    description: "How one device runs many apps at once without their traffic getting mixed up.",
  },
];

export default function IntermediatePage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Intermediate" }]} />
      <h1 className="text-2xl font-semibold mb-1">Intermediate</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        How data reaches you correctly — split into pieces, routed across the internet, and
        delivered to the right application.
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
