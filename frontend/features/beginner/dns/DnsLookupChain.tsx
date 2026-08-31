const NODE_WIDTH = 120;
const GAP = 20;
const HEIGHT = 130;

/** A chain of lookups, not one phonebook: draws whichever nodes the current
 * query actually has to visit — the full chain on a cache miss, or a short
 * one on a hit — and reveals hops one click at a time. Pure function of
 * props; the caller (the Walkthrough) owns `visitedCount`.
 *
 * `recursiveBoundary` marks how many *nodes* (from the start) belong to the
 * single recursive question your device asks — the leg(s) after that point
 * are the resolver's own iterative journey on your behalf, drawn dashed
 * with a small label the first time that style appears. */
export function DnsLookupChain({
  path,
  visitedCount,
  resolved,
  answer,
  recursiveBoundary = 1,
  showLegLabels = true,
}: {
  path: string[];
  /** How many nodes the outgoing query has reached so far, 0..path.length. */
  visitedCount: number;
  /** True once the answer has traveled all the way back to the client. */
  resolved: boolean;
  answer?: string;
  recursiveBoundary?: number;
  /** Set false when this chain isn't depicting resolver infrastructure at
   * all (e.g. a CNAME alias chain) — the "recursive"/"iterative" labels
   * wouldn't mean anything there. */
  showLegLabels?: boolean;
}) {
  const width = path.length * NODE_WIDTH + (path.length - 1) * GAP;
  const y = HEIGHT / 2;

  const nodeX = (i: number) => i * (NODE_WIDTH + GAP) + NODE_WIDTH / 2;

  return (
    <div className="w-full max-w-xl space-y-2 overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="rounded-lg border border-neutral-200 bg-white"
        style={{ width: `${width}px`, maxWidth: "100%" }}
        role="img"
        aria-label="DNS lookup chain"
      >
        {path.slice(0, -1).map((_, i) => {
          const reached = i + 1 < visitedCount;
          const returning = resolved && i + 1 <= visitedCount;
          const isIterative = i + 1 > recursiveBoundary;
          const isFirstIterative = isIterative && i + 1 === recursiveBoundary + 1;
          return (
            <g key={i}>
              <line
                x1={nodeX(i) + NODE_WIDTH / 2}
                y1={y}
                x2={nodeX(i + 1) - NODE_WIDTH / 2}
                y2={y}
                stroke={returning ? "#16a34a" : reached ? "#0891b2" : "#d4d4d4"}
                strokeWidth={2.5}
                strokeDasharray={isIterative ? "5 4" : undefined}
              />
              {showLegLabels && (i === 0 || isFirstIterative) && (
                <text
                  x={(nodeX(i) + nodeX(i + 1)) / 2}
                  y={y - 32}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#a3a3a3"
                >
                  {isIterative ? "iterative" : "recursive"}
                </text>
              )}
            </g>
          );
        })}

        {path.map((label, i) => {
          const reached = i < visitedCount;
          const words = label.split(" ");
          return (
            <g key={`${label}-${i}`} transform={`translate(${nodeX(i)}, ${y})`}>
              <rect
                x={-NODE_WIDTH / 2}
                y={-22}
                width={NODE_WIDTH}
                height={44}
                rx={6}
                fill={reached ? "#ecfeff" : "#fafafa"}
                stroke={reached ? "#0891b2" : "#d4d4d4"}
                strokeWidth={2}
              />
              {words.length > 1 ? (
                <>
                  <text x={0} y={-3} textAnchor="middle" fontSize={13} fontWeight={600} fill={reached ? "#0e7490" : "#a3a3a3"}>
                    {words[0]}
                  </text>
                  <text x={0} y={12} textAnchor="middle" fontSize={13} fontWeight={600} fill={reached ? "#0e7490" : "#a3a3a3"}>
                    {words.slice(1).join(" ")}
                  </text>
                </>
              ) : (
                <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={600} fill={reached ? "#0e7490" : "#a3a3a3"}>
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {resolved && answer && (
        <div className="text-sm text-emerald-700">
          Answer: <span className="font-mono font-medium">{answer}</span>
        </div>
      )}
    </div>
  );
}
