const ITERATIVE_ROWS = [
  { server: "Root", badge: "referral", tone: "neutral" as const },
  { server: "TLD", badge: "referral", tone: "neutral" as const },
  { server: "Authoritative", badge: "answer", tone: "good" as const },
];

/** The one distinction that actually matters, shown rather than argued:
 * a recursive question gets exactly one round trip ending in an answer; an
 * iterative one takes several round trips, and every reply except the
 * last is just "ask someone else" — a referral, not an answer. Pure,
 * static diagram; its only prop is the example domain in the sample
 * question, so other chapters can swap in their own story's domain. */
export function RecursiveVsIterative({ domain = "example.com" }: { domain?: string }) {
  return (
    <div className="w-full max-w-xl grid sm:grid-cols-2 gap-4">
      <div className="rounded-lg border border-neutral-200 bg-white p-3 space-y-2">
        <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">Recursive</div>
        <div className="flex flex-col items-center gap-1 text-[13px] text-neutral-700">
          <div className="rounded border border-neutral-300 px-2 py-1">Your Device</div>
          <div className="text-neutral-400 text-xs">↕ &ldquo;Where&rsquo;s {domain}?&rdquo;</div>
          <div className="rounded border border-neutral-300 px-2 py-1">Recursive Resolver</div>
        </div>
        <div className="flex justify-center pt-1">
          <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">one final answer</span>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-3 space-y-2">
        <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">Iterative</div>
        <div className="space-y-1.5">
          {ITERATIVE_ROWS.map((row) => (
            <div key={row.server} className="flex items-center justify-between text-[13px] text-neutral-700">
              <span>Resolver ↔ {row.server}</span>
              <span
                className={`rounded-full text-xs px-2 py-0.5 ${
                  row.tone === "good" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {row.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
