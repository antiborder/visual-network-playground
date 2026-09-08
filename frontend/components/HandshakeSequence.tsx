export interface HandshakeStep {
  from: "left" | "right";
  label: string;
  detail?: string;
}

const WIDTH = 400;
const LEFT_X = 90;
const RIGHT_X = WIDTH - 90;
const ROW_HEIGHT = 44;
const TOP_PADDING = 40;

/** Generic sequence-diagram: two vertical lifelines (left/right actors) with
 * one arrow per step, revealed up to `currentStep`. Pure function of props —
 * whatever drives `currentStep` (a "Connect" button stepping through a
 * DHCP exchange, a TCP handshake, an OAuth token exchange) owns the timing,
 * not this component. Built for `beginner/ip-address-wifi`'s DHCP DORA
 * sequence; reused as-is by any later chapter with a message exchange to
 * show (TCP's 3-way handshake, OAuth's code-for-token exchange). */
export function HandshakeSequence({
  leftLabel,
  rightLabel,
  steps,
  currentStep,
}: {
  leftLabel: string;
  rightLabel: string;
  steps: HandshakeStep[];
  /** Number of steps revealed so far (0 = none, steps.length = all). */
  currentStep: number;
}) {
  const height = TOP_PADDING * 2 + steps.length * ROW_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label={`Sequence diagram between ${leftLabel} and ${rightLabel}`}
    >
      <text x={LEFT_X} y={22} textAnchor="middle" fontSize={14} fontWeight={600} fill="#171717">
        {leftLabel}
      </text>
      <text x={RIGHT_X} y={22} textAnchor="middle" fontSize={14} fontWeight={600} fill="#171717">
        {rightLabel}
      </text>
      <line x1={LEFT_X} y1={30} x2={LEFT_X} y2={height - 10} stroke="#d4d4d4" strokeWidth={2} />
      <line x1={RIGHT_X} y1={30} x2={RIGHT_X} y2={height - 10} stroke="#d4d4d4" strokeWidth={2} />

      {steps.map((step, i) => {
        const revealed = i < currentStep;
        const isLatest = i === currentStep - 1;
        const y = TOP_PADDING + i * ROW_HEIGHT;
        const [x1, x2] = step.from === "left" ? [LEFT_X, RIGHT_X] : [RIGHT_X, LEFT_X];
        const dir = step.from === "left" ? 1 : -1;

        return (
          <g key={i} opacity={revealed ? 1 : 0.15}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke={isLatest ? "#0891b2" : "#737373"}
              strokeWidth={isLatest ? 2.5 : 1.5}
            />
            <text
              x={(x1 + x2) / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize={14}
              fontWeight={isLatest ? 600 : 400}
              fill={isLatest ? "#0891b2" : "#404040"}
            >
              {step.label}
            </text>
            {step.detail && revealed && (
              <text x={(x1 + x2) / 2} y={y + 14} textAnchor="middle" fontSize={13} fill="#737373">
                {step.detail}
              </text>
            )}
            <polygon
              points={dir === 1 ? `${x2 - 8},${y - 4} ${x2},${y} ${x2 - 8},${y + 4}` : `${x2 + 8},${y - 4} ${x2},${y} ${x2 + 8},${y + 4}`}
              fill={isLatest ? "#0891b2" : "#737373"}
            />
          </g>
        );
      })}
    </svg>
  );
}
