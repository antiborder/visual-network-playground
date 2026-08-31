import type { Action, Rule } from "./firewall";
import type { FirewallProgress } from "./useFirewallSend";

const WIDTH = 360;
const HEIGHT = 130;
const INSIDE_X = 50;
const GATE_X = 180;
const INTERNET_X = 310;
const Y = 70;

/** The rule list (in evaluation order, matched rule highlighted) beside a
 * gate diagram: a packet travels from its origin toward the gate, then
 * either continues through (allowed, green) or bounces back to where it
 * started (denied, red). Pure function of props — the caller owns the
 * rule list, the default policy, and the `useFirewallSend` animation. */
export function FirewallGate({
  rules,
  defaultPolicy,
  matchedRuleId,
  packet,
}: {
  rules: Rule[];
  defaultPolicy: Action;
  matchedRuleId?: string;
  packet: FirewallProgress | null;
}) {
  let dot: { x: number; color: string } | null = null;
  if (packet) {
    const originX = packet.direction === "OUT" ? INSIDE_X : INTERNET_X;
    const endX = packet.direction === "OUT" ? INTERNET_X : INSIDE_X;
    if (packet.progress < 0.5) {
      const t = packet.progress / 0.5;
      dot = { x: originX + (GATE_X - originX) * t, color: "#0891b2" };
    } else {
      const t = (packet.progress - 0.5) / 0.5;
      const target = packet.allowed ? endX : originX;
      dot = { x: GATE_X + (target - GATE_X) * t, color: packet.allowed ? "#16a34a" : "#dc2626" };
    }
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <ol className="space-y-1 text-sm font-mono">
        {rules.map((rule, i) => (
          <li
            key={rule.id}
            className={`px-2 py-1 rounded border ${
              rule.id === matchedRuleId
                ? "border-cyan-400 bg-cyan-50 text-cyan-800"
                : "border-neutral-200 bg-neutral-50 text-neutral-600"
            }`}
          >
            {i + 1}. {rule.direction} port {rule.port} → {rule.action}
          </li>
        ))}
        <li
          className={`px-2 py-1 rounded border text-xs ${
            !matchedRuleId && packet
              ? "border-cyan-400 bg-cyan-50 text-cyan-800"
              : "border-dashed border-neutral-200 text-neutral-400"
          }`}
        >
          default policy → {defaultPolicy}
        </li>
      </ol>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full rounded-lg border border-neutral-200 bg-white"
        role="img"
        aria-label="Firewall gate between the inside network and the internet"
      >
        <text x={INSIDE_X} y={25} textAnchor="middle" fontSize={12} fontWeight={600} fill="#171717">
          Inside
        </text>
        <text x={INTERNET_X} y={25} textAnchor="middle" fontSize={12} fontWeight={600} fill="#171717">
          Internet
        </text>
        <line x1={INSIDE_X} y1={Y} x2={GATE_X} y2={Y} stroke="#d4d4d4" strokeWidth={2} />
        <line x1={GATE_X} y1={Y} x2={INTERNET_X} y2={Y} stroke="#d4d4d4" strokeWidth={2} />
        <rect x={GATE_X - 14} y={Y - 30} width={28} height={60} rx={4} fill="#fafafa" stroke="#525252" strokeWidth={2} />
        <text x={GATE_X} y={Y + 45} textAnchor="middle" fontSize={12} fill="#737373">
          Gate
        </text>
        {dot && <circle cx={dot.x} cy={Y} r={7} fill={dot.color} />}
      </svg>
    </div>
  );
}
