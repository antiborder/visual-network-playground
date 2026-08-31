/** Small hand-rolled SVG diagrams for the "Meet the Network" chapter's
 * technical explanation halves — kept separate from StorybookScenes.tsx,
 * which is reserved for the picture-book story illustrations above the
 * divider. Palette matches the existing LanMap/GatewayLayers diagrams
 * (cyan accent, neutral grays) so every chapter's figures feel consistent. */

const INK = "#171717";
const SUBTLE = "#737373";
const LINE = "#a3a3a3";
const ACCENT = "#0891b2";
const ACCENT_FILL = "#ecfeff";
const CARD = "#fafafa";
const CLOUD_STROKE = "#a8a29e";
const CLOUD_FILL = "#f5f5f4";

function PhoneIcon({ x, y }: { x: number; y: number }) {
  return <rect x={x - 9} y={y - 15} width={18} height={30} rx={4} fill={CARD} stroke={LINE} strokeWidth={2} />;
}

function BoxIcon({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  return (
    <rect
      x={x - 22}
      y={y - 15}
      width={44}
      height={30}
      rx={4}
      fill={accent ? ACCENT_FILL : CARD}
      stroke={accent ? ACCENT : LINE}
      strokeWidth={2}
    />
  );
}

function CloudIcon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={46} ry={24} fill={CLOUD_FILL} stroke={CLOUD_STROKE} strokeWidth={1.5} />
    </g>
  );
}

/** Phone → Router → Modem → Internet, the whole chain in one row. This is
 * the chapter's "hero visual" (see docs/guideline.md): shown plain on the
 * chapter-at-a-glance step, then reused with one node highlighted right
 * where that node's own step explains it. */
export function NetworkChainDiagram({ highlight }: { highlight?: "router" | "modem" }) {
  const y = 60;
  const phoneX = 40;
  const routerX = 160;
  const modemX = 280;
  const cloudX = 400;
  return (
    <svg
      viewBox="0 0 440 120"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label="Diagram: phone connects over Wi-Fi to the router, which connects by cable to the modem, which connects to the internet"
    >
      <line x1={phoneX + 14} y1={y} x2={routerX - 26} y2={y} stroke={LINE} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={routerX + 26} y1={y} x2={modemX - 26} y2={y} stroke={LINE} strokeWidth={1.5} />
      <line x1={modemX + 26} y1={y} x2={cloudX - 44} y2={y} stroke={LINE} strokeWidth={1.5} />

      <PhoneIcon x={phoneX} y={y} />
      <text x={phoneX} y={y + 32} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Phone
      </text>

      <BoxIcon x={routerX} y={y} accent={highlight === "router"} />
      <text x={routerX} y={y + 32} textAnchor="middle" fontSize={13} fontWeight={highlight === "router" ? 700 : 400} fill={highlight === "router" ? ACCENT : SUBTLE}>
        Router
      </text>

      <BoxIcon x={modemX} y={y} accent={highlight === "modem"} />
      <text x={modemX} y={y + 32} textAnchor="middle" fontSize={13} fontWeight={highlight === "modem" ? 700 : 400} fill={highlight === "modem" ? ACCENT : SUBTLE}>
        Modem
      </text>

      <CloudIcon x={cloudX} y={y} />
      <text x={cloudX} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#44403c">
        Internet
      </text>
    </svg>
  );
}

/** Two markers at different distances from one router, each carrying the
 * same qualitative signal-strength language the story just used ("full
 * strength" close by, "barely holding on" far away) — so the diagram
 * illustrates the exact words Pip said, not a different vocabulary. */
export function SignalDistanceDiagram() {
  const routerX = 60;
  const routerY = 60;
  return (
    <svg
      viewBox="0 0 400 130"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label="Diagram: Wi-Fi signal is strong close to the router and weak far away from it"
    >
      {[18, 30, 42].map((r, i) => (
        <path
          key={r}
          d={`M ${routerX - r} ${routerY} A ${r} ${r} 0 0 1 ${routerX + r} ${routerY}`}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.85 - i * 0.22}
        />
      ))}
      <BoxIcon x={routerX} y={routerY + 20} accent />
      <text x={routerX} y={routerY + 52} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Router
      </text>

      <PhoneIcon x={210} y={routerY} />
      <text x={210} y={routerY + 32} textAnchor="middle" fontSize={13} fill={INK} fontWeight={600}>
        Full strength
      </text>

      <PhoneIcon x={350} y={routerY} />
      <text x={350} y={routerY + 32} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Barely holding on
      </text>
    </svg>
  );
}

/** Router and device stay put; 0, 1, or 2 wall panels between them fade in
 * as `wallCount` rises, and the strength readout drops a step each time —
 * the one interactive figure in this chapter, driven by the caller's own
 * `wallCount` state so its buttons live in the Step's `controls` slot. */
export function InterferenceDiagram({ wallCount }: { wallCount: 0 | 1 | 2 }) {
  const routerX = 50;
  const deviceX = 350;
  const y = 60;
  const wallSlots = [160, 240];
  const STRENGTH_LABEL = ["Full strength", "Getting weaker", "Barely holding on"][wallCount];
  const STRENGTH_COLOR = ["#16a34a", "#d97706", "#dc2626"][wallCount];
  const barCount = 3 - wallCount;
  return (
    <svg
      viewBox="0 0 400 130"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label={`Diagram: signal between router and device with ${wallCount} wall(s) in between`}
    >
      <line x1={routerX + 24} y1={y} x2={deviceX - 12} y2={y} stroke={LINE} strokeWidth={1.5} strokeDasharray="4 4" />

      <BoxIcon x={routerX} y={y} accent />
      <text x={routerX} y={y + 32} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Router
      </text>

      {wallSlots.map((x, i) => (
        <rect
          key={x}
          x={x - 6}
          y={y - 32}
          width={12}
          height={64}
          fill={i < wallCount ? "#e7e5e4" : "transparent"}
          stroke={i < wallCount ? "#a8a29e" : "transparent"}
          strokeWidth={1.5}
        />
      ))}

      <PhoneIcon x={deviceX} y={y} />
      <text x={deviceX} y={y + 32} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Pip&rsquo;s room
      </text>

      <g transform={`translate(${(routerX + deviceX) / 2}, ${y - 42})`}>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={i * 10 - 15}
            y={-((i + 1) * 4)}
            width={7}
            height={(i + 1) * 4}
            fill={i < barCount ? STRENGTH_COLOR : "#e5e5e5"}
          />
        ))}
      </g>
      <text x={(routerX + deviceX) / 2} y={y - 50} textAnchor="middle" fontSize={13} fontWeight={600} fill={STRENGTH_COLOR}>
        {STRENGTH_LABEL}
      </text>
    </svg>
  );
}

/** A handful of house-network icons wired to one shared "Internet" hub in
 * the middle — a literal picture of the word's own etymology, a network
 * that connects other networks together. */
export function NetworkOfNetworksDiagram() {
  const cx = 200;
  const cy = 65;
  const houses = [
    { x: 60, y: 25 },
    { x: 340, y: 25 },
    { x: 60, y: 105 },
    { x: 340, y: 105 },
  ];
  return (
    <svg
      viewBox="0 0 400 130"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label="Diagram: several separate home networks all connected through the internet"
    >
      {houses.map((h, i) => (
        <line key={i} x1={h.x} y1={h.y} x2={cx} y2={cy} stroke={LINE} strokeWidth={1.5} />
      ))}
      <CloudIcon x={cx} y={cy} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="#44403c">
        Internet
      </text>
      {houses.map((h, i) => (
        <g key={i} transform={`translate(${h.x}, ${h.y})`}>
          <path d="M -14 6 L 0 -8 L 14 6" fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <rect x={-9} y={4} width={18} height={12} fill={CARD} stroke={LINE} strokeWidth={1.5} />
        </g>
      ))}
    </svg>
  );
}

/** One device inside the password-locked network (a checkmark) and one
 * outside it (an X) trying the same router without the password. */
export function WifiLockDiagram() {
  const routerX = 200;
  const routerY = 34;
  return (
    <svg
      viewBox="0 0 400 140"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label="Diagram: a password lets one device join the Wi-Fi and keeps another device out"
    >
      <BoxIcon x={routerX} y={routerY} accent />
      <g transform={`translate(${routerX}, ${routerY + 22})`}>
        <rect x={-8} y={0} width={16} height={13} rx={2} fill="#fef3c7" stroke="#d97706" strokeWidth={1.5} />
        <path d="M -5 0 L -5 -5 A 5 5 0 0 1 5 -5 L 5 0" fill="none" stroke="#d97706" strokeWidth={1.5} />
      </g>
      <text x={routerX} y={routerY + 52} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Password-locked Wi-Fi
      </text>

      <line x1={routerX - 30} y1={routerY + 5} x2={90} y2={100} stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4 4" />
      <PhoneIcon x={80} y={108} />
      <text x={80} y={128} textAnchor="middle" fontSize={13} fill="#16a34a" fontWeight={600}>
        Knows the password
      </text>

      <line x1={routerX + 30} y1={routerY + 5} x2={320} y2={100} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={320} y={92} textAnchor="middle" fontSize={16} fill="#dc2626" fontWeight={700}>
        ✕
      </text>
      <PhoneIcon x={320} y={108} />
      <text x={320} y={128} textAnchor="middle" fontSize={13} fill="#dc2626" fontWeight={600}>
        Doesn&rsquo;t know it
      </text>
    </svg>
  );
}

const ADDRESS_ROWS = [
  {
    label: "Building, city, country",
    postal: "221 Cheddar Lane, New York (Manhattan), United States",
    network: "A global IP address",
    matches: false,
  },
  { label: "Room", postal: "Room 203, 2nd Floor", network: "192.168.1.10", matches: true },
] as const;

/** Lines up a full postal address against Pip's IP address. The two only
 * agree at the most local level ("Room" / the address itself) — a postal
 * address's broader levels (building, city, country) don't each have their
 * own separate IP address; together they're just what a single global IP
 * address would stand in for. That's exactly why a private address like
 * Pip's can't be reached from outside the house: it's a room number with no
 * building attached. */
export function AddressAnalogyDiagram() {
  return (
    <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
            <th className="p-2 font-medium"> </th>
            <th className="p-2 font-medium">A full postal address</th>
            <th className="p-2 font-medium">Pip&rsquo;s address</th>
          </tr>
        </thead>
        <tbody className="text-neutral-700">
          {ADDRESS_ROWS.map((row) => (
            <tr
              key={row.label}
              className={`border-b border-neutral-100 last:border-b-0 ${row.matches ? "bg-cyan-50" : ""}`}
            >
              <td className="p-2 text-neutral-500">{row.label}</td>
              <td className="p-2">{row.postal}</td>
              <td className={`p-2 text-[13px] ${row.matches ? "font-mono text-cyan-800 font-semibold" : "text-neutral-400 italic"}`}>
                {row.network}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Phone (client) reaching out to a far-away server — the shape every
 * upload or page load takes, however many hops sit in between. */
export function ClientServerDiagram() {
  const y = 55;
  const clientX = 50;
  const serverX = 400;
  return (
    <svg
      viewBox="0 0 480 110"
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label="Diagram: Pip's phone, a client, uploading to a server out on the internet"
    >
      <line x1={clientX + 20} y1={y} x2={serverX - 50} y2={y} stroke={ACCENT} strokeWidth={2} markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
      </defs>
      <text x={(clientX + serverX) / 2} y={y - 10} textAnchor="middle" fontSize={12} fill={ACCENT}>
        uploading the photo
      </text>

      <PhoneIcon x={clientX} y={y} />
      <text x={clientX} y={y + 32} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>
        Client
      </text>
      <text x={clientX} y={y + 46} textAnchor="middle" fontSize={12} fill={SUBTLE}>
        Pip&rsquo;s phone
      </text>

      <CloudIcon x={serverX} y={y} />
      <text x={serverX} y={y + 32} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>
        Server
      </text>
      <text x={serverX} y={y + 46} textAnchor="middle" fontSize={12} fill={SUBTLE}>
        Cheese-Lovers&rsquo; Board
      </text>
    </svg>
  );
}
