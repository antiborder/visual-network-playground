import type { DatabaseState, WebserverState } from "./http";
import type { RequestProgress } from "./useRequestSend";

const NODES = ["Client", "LB", "Webserver", "Database"];
const WIDTH = 420;
const HEIGHT = 120;
const Y = HEIGHT / 2;

function nodeX(i: number) {
  return 40 + i * ((WIDTH - 80) / (NODES.length - 1));
}

function nodeColor(i: number, webserver: WebserverState, database: DatabaseState) {
  if (i === 2 && webserver === "down") return { fill: "#fee2e2", stroke: "#dc2626" };
  if (i === 3 && database === "down") return { fill: "#fee2e2", stroke: "#dc2626" };
  if (i === 3 && database === "slow") return { fill: "#fef3c7", stroke: "#d97706" };
  return { fill: "#fafafa", stroke: "#525252" };
}

/** Client → LB → Webserver → Database, with each non-client node's health
 * reflected in its color, and a single request/response trip animated
 * along whatever leg `request` describes. Pure function of props — the
 * caller (the Walkthrough) owns node health and the `useRequestSend` hook
 * driving `request`. */
export function RequestPipeline({
  webserver,
  database,
  request,
}: {
  webserver: WebserverState;
  database: DatabaseState;
  request: RequestProgress | null;
}) {
  let dot: { x: number; color: string } | null = null;
  if (request) {
    const targetX = nodeX(request.forwardTargetIndex);
    if (request.progress < 0.5) {
      const t = request.progress / 0.5;
      dot = { x: nodeX(0) + (targetX - nodeX(0)) * t, color: "#0891b2" };
    } else {
      const t = (request.progress - 0.5) / 0.5;
      const color = request.outcome.category === "2xx" ? "#16a34a" : "#dc2626";
      dot = { x: targetX + (nodeX(0) - targetX) * t, color };
    }
  }

  return (
    <div className="w-full max-w-xl space-y-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full rounded-lg border border-neutral-200 bg-white"
        role="img"
        aria-label="Request pipeline from client to database"
      >
        {NODES.slice(0, -1).map((_, i) => (
          <line key={i} x1={nodeX(i)} y1={Y} x2={nodeX(i + 1)} y2={Y} stroke="#d4d4d4" strokeWidth={2} />
        ))}
        {NODES.map((label, i) => {
          const c = nodeColor(i, webserver, database);
          return (
            <g key={label} transform={`translate(${nodeX(i)}, ${Y})`}>
              <rect x={-42} y={-20} width={84} height={40} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text x={0} y={5} textAnchor="middle" fontSize={12} fontWeight={600} fill="#171717">
                {label}
              </text>
            </g>
          );
        })}
        {dot && <circle cx={dot.x} cy={Y} r={7} fill={dot.color} />}
      </svg>
      {request && request.progress >= 1 && (
        <div className={`text-sm font-medium ${request.outcome.category === "2xx" ? "text-emerald-600" : "text-red-600"}`}>
          {request.outcome.code} {request.outcome.text}
        </div>
      )}
    </div>
  );
}
