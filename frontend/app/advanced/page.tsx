import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Advanced" };

const UNITS = [
  {
    label: "TCP Reliability (3-Way Handshake & Retransmission)",
    description: "How data arrives complete even when packets get lost along the way.",
  },
  {
    label: "Load Balancer",
    description: "Spreading traffic across servers, and automatically routing around a failed one.",
  },
];

export default function AdvancedPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Advanced" }]} />
      <h1 className="text-2xl font-semibold mb-1">Advanced</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        Controlling traffic at scale — reliable delivery guarantees and spreading load across many
        servers.
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
