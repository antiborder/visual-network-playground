const CHAIN_STEPS = [
  { name: "Root", caption: "Knows only who handles each ending (.com, .jp, ...)" },
  { name: "TLD", caption: "Handles one ending (e.g. .com) — knows who handles this domain" },
  { name: "Authoritative", caption: "Has the real, final answer for this exact domain" },
] as const;

/** Who your device actually talks to during a lookup, drawn as an actual
 * vertical hierarchy rather than a flat row: your device (in the house) →
 * the recursive resolver (out on the internet) → the resolver's own
 * step-by-step walk down through root, TLD, and authoritative servers,
 * visually nested inside a dashed box to show that whole walk is the
 * resolver's own business, not a second hop your device makes. Pure,
 * static diagram; its only prop is the example domain shown in the sample
 * question, so other chapters can swap in their own story's domain. */
export function ResolverRoles({ domain = "example.com" }: { domain?: string }) {
  return (
    <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-5 flex flex-col items-center gap-1.5">
      <div className="rounded-lg border-2 border-cyan-400 bg-cyan-50 px-4 py-2 text-center w-64">
        <div className="text-sm font-semibold text-cyan-800">Your Device</div>
        <div className="text-xs text-neutral-500">at home — runs the stub resolver</div>
      </div>
      <div className="text-neutral-400 text-xs text-center">↓ &ldquo;Where&rsquo;s {domain}?&rdquo;</div>
      <div className="rounded-lg border-2 border-cyan-500 bg-cyan-100 px-4 py-2 text-center w-64">
        <div className="text-sm font-semibold text-cyan-900">Recursive Resolver</div>
        <div className="text-xs text-neutral-600">out on the internet — your ISP, or 8.8.8.8</div>
      </div>
      <div className="text-neutral-400 text-xs mt-1 text-center">↓ walks this chain for you, one hop at a time</div>
      <div className="w-full rounded-lg border border-dashed border-neutral-300 p-3 flex flex-col items-center gap-1">
        {CHAIN_STEPS.map((step, i) => (
          <div key={step.name} className="w-full flex flex-col items-center gap-1">
            {i > 0 && <span className="text-neutral-300 text-xs">↓</span>}
            <div className="rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-center w-full max-w-56">
              <div className="text-[13px] font-medium text-neutral-700">{step.name}</div>
              <div className="text-xs text-neutral-400">{step.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
