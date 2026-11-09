import { toBits } from "./network";

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

/** A small train riding the line — Dad's railway analogy made visible: data
 * traveling the chain the same way a train travels the rails. `y` is the
 * connecting line's own y-coordinate; the car sits on top of it, wheels
 * touching the line. */
function TrainIcon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 12} y={y - 14} width={24} height={12} rx={2} fill={CARD} stroke={LINE} strokeWidth={1.5} />
      <rect x={x - 7} y={y - 11} width={6} height={5} fill={ACCENT_FILL} stroke={LINE} strokeWidth={1} />
      <rect x={x + 1} y={y - 11} width={6} height={5} fill={ACCENT_FILL} stroke={LINE} strokeWidth={1} />
      <circle cx={x - 6} cy={y - 1} r={2.2} fill={SUBTLE} />
      <circle cx={x + 6} cy={y - 1} r={2.2} fill={SUBTLE} />
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

      <TrainIcon x={(routerX + modemX) / 2} y={y} />

      <PhoneIcon x={phoneX} y={y} />
      <text x={phoneX} y={y + 32} textAnchor="middle" fontSize={15} fill={SUBTLE}>
        Phone
      </text>

      <BoxIcon x={routerX} y={y} accent={highlight === "router"} />
      <text x={routerX} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={highlight === "router" ? 700 : 400} fill={highlight === "router" ? ACCENT : SUBTLE}>
        Router
      </text>

      <BoxIcon x={modemX} y={y} accent={highlight === "modem"} />
      <text x={modemX} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={highlight === "modem" ? 700 : 400} fill={highlight === "modem" ? ACCENT : SUBTLE}>
        Modem
      </text>

      <CloudIcon x={cloudX} y={y} />
      <text x={cloudX} y={y + 4} textAnchor="middle" fontSize={15} fontWeight={600} fill="#44403c">
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
      <text x={routerX} y={routerY + 52} textAnchor="middle" fontSize={15} fill={SUBTLE}>
        Router
      </text>

      <PhoneIcon x={210} y={routerY} />
      <text x={210} y={routerY + 32} textAnchor="middle" fontSize={15} fill={INK} fontWeight={600}>
        Full strength
      </text>

      <PhoneIcon x={350} y={routerY} />
      <text x={350} y={routerY + 32} textAnchor="middle" fontSize={15} fill={SUBTLE}>
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
      <text x={routerX} y={y + 32} textAnchor="middle" fontSize={15} fill={SUBTLE}>
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
      <text x={deviceX} y={y + 32} textAnchor="middle" fontSize={15} fill={SUBTLE}>
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
      <text x={(routerX + deviceX) / 2} y={y - 50} textAnchor="middle" fontSize={15} fontWeight={600} fill={STRENGTH_COLOR}>
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
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={15} fontWeight={600} fill="#44403c">
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
      <text x={routerX} y={routerY + 52} textAnchor="middle" fontSize={15} fill={SUBTLE}>
        Password-locked Wi-Fi
      </text>

      <line x1={routerX - 30} y1={routerY + 5} x2={90} y2={100} stroke="#16a34a" strokeWidth={1.5} strokeDasharray="4 4" />
      <PhoneIcon x={80} y={108} />
      <text x={80} y={128} textAnchor="middle" fontSize={15} fill="#16a34a" fontWeight={600}>
        Knows the password
      </text>

      <line x1={routerX + 30} y1={routerY + 5} x2={320} y2={100} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={320} y={92} textAnchor="middle" fontSize={18} fill="#dc2626" fontWeight={700}>
        ✕
      </text>
      <PhoneIcon x={320} y={108} />
      <text x={320} y={128} textAnchor="middle" fontSize={15} fill="#dc2626" fontWeight={600}>
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
              <td className={`p-2 text-[15px] ${row.matches ? "font-mono text-cyan-800 font-semibold" : "text-neutral-400 italic"}`}>
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
      <text x={(clientX + serverX) / 2} y={y - 10} textAnchor="middle" fontSize={14} fill={ACCENT}>
        uploading the photo
      </text>

      <PhoneIcon x={clientX} y={y} />
      <text x={clientX} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={600} fill={INK}>
        Client
      </text>
      <text x={clientX} y={y + 46} textAnchor="middle" fontSize={14} fill={SUBTLE}>
        Pip&rsquo;s phone
      </text>

      <CloudIcon x={serverX} y={y} />
      <text x={serverX} y={y + 32} textAnchor="middle" fontSize={15} fontWeight={600} fill={INK}>
        Server
      </text>
      <text x={serverX} y={y + 46} textAnchor="middle" fontSize={14} fill={SUBTLE}>
        Cheese-Lovers&rsquo; Board
      </text>
    </svg>
  );
}

/** Chapter 2: one IP packet, drawn as the story's labeled crate. The two
 * addresses ride on the packet itself; inside it sits the transport
 * wrapper carrying the sequence number, wrapped around the data piece.
 * Matches the wrapping order taught in §2: number inside, address
 * outside. */
export function PacketDiagram() {
  return (
    <svg
      viewBox="0 0 640 188"
      className="w-full"
      role="img"
      aria-label="Diagram: an IP packet addressed to 192.168.1.15 from 192.168.1.10, containing a sequence number and a piece of the photo"
    >
      <rect x={10} y={34} width={620} height={118} rx={10} fill={CARD} stroke={LINE} strokeWidth={2} />
      <text x={26} y={58} fontSize={13} fontWeight={600} fill={SUBTLE}>
        IP PACKET
      </text>
      <rect x={150} y={40} width={196} height={30} rx={6} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth={1.5} />
      <text x={248} y={60} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        To: 192.168.1.15
      </text>
      <rect x={358} y={40} width={196} height={30} rx={6} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth={1.5} />
      <text x={456} y={60} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        From: 192.168.1.10
      </text>
      <rect x={30} y={84} width={270} height={52} rx={8} fill="#fff" stroke={LINE} strokeWidth={1.5} />
      <text x={165} y={106} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        Sequence number: 3
      </text>
      <text x={165} y={126} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        the transport wrapper
      </text>
      <rect x={316} y={84} width={294} height={52} rx={8} fill="#fff" stroke={LINE} strokeWidth={1.5} />
      <text x={463} y={106} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        A piece of the photo
      </text>
      <text x={463} y={126} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        the data itself
      </text>
      <text x={320} y={176} textAnchor="middle" fontSize={14} fill={SUBTLE}>
        The addresses ride on the outside. The number rides inside.
      </text>
    </svg>
  );
}

/** Chapter 2: one frame, drawn as the story's locomotive and crate. The
 * frame names both ends (the two MAC plates), carries the whole IP
 * packet untouched, and ends with the check number. `highlight` picks
 * which part the current step is about. */
export function FrameDiagram({ highlight }: { highlight: "plates" | "fcs" }) {
  const seg = (active: boolean) => ({
    fill: active ? ACCENT_FILL : "#fff",
    stroke: active ? ACCENT : LINE,
    sw: active ? 2 : 1.5,
  });
  const plates = seg(highlight === "plates");
  const fcs = seg(highlight === "fcs");
  return (
    <svg
      viewBox="0 0 640 178"
      className="w-full"
      role="img"
      aria-label="Diagram: a frame with the destination and sender MAC addresses, the IP packet inside, and a check number at the end"
    >
      <text x={10} y={22} fontSize={13} fontWeight={600} fill={SUBTLE}>
        ONE FRAME, FRONT TO BACK
      </text>
      <rect x={10} y={36} width={168} height={76} rx={8} fill={plates.fill} stroke={plates.stroke} strokeWidth={plates.sw} />
      <text x={94} y={66} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        TO (MAC)
      </text>
      <text x={94} y={90} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        AA:BB:CC:11:22:33
      </text>
      <rect x={186} y={36} width={132} height={76} rx={8} fill={plates.fill} stroke={plates.stroke} strokeWidth={plates.sw} />
      <text x={252} y={66} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        FROM (MAC)
      </text>
      <text x={252} y={90} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        Pip&rsquo;s phone
      </text>
      <rect x={326} y={36} width={176} height={76} rx={8} fill={CARD} stroke={LINE} strokeWidth={1.5} />
      <text x={414} y={66} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        INSIDE
      </text>
      <text x={414} y={90} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        The whole IP packet
      </text>
      <rect x={510} y={36} width={120} height={76} rx={8} fill={fcs.fill} stroke={fcs.stroke} strokeWidth={fcs.sw} />
      <text x={570} y={66} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        AT THE END
      </text>
      <text x={570} y={90} textAnchor="middle" fontSize={14} fontWeight={600} fill={INK}>
        Check number
      </text>
      <text x={320} y={142} textAnchor="middle" fontSize={14} fill={SUBTLE}>
        {highlight === "plates"
          ? "The frame names both ends of the journey."
          : "The check number is worked out from everything before it."}
      </text>
      <text x={320} y={164} textAnchor="middle" fontSize={13} fill={SUBTLE}>
        Same packet inside, whichever stretch of line the frame was built for.
      </text>
    </svg>
  );
}

/** Chapter 2: an address as 32 bit boxes, split at the prefix length —
 * the CIDR figure from the older Short Way Home walkthrough ("Reading a
 * subnet mask"), extracted so the story draft's §3 can use it too. Bits
 * before the boundary are the network part (cyan); bits after it are
 * the host part (emerald). Pass two rows to compare two addresses:
 * their network parts line up identically when they share a line. */
export function CidrBitStripDiagram({
  rows,
  prefix = 24,
}: {
  rows: { label: string; octets: [number, number, number, number] }[];
  prefix?: number;
}) {
  return (
    <div className="w-full max-w-xl space-y-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-4">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <div className="text-xs text-neutral-500">
            {row.label} /{prefix}
          </div>
          <div className="flex w-max gap-2">
            {row.octets.map((n, octetIdx) => (
              <div key={octetIdx} className="flex gap-0.5">
                {toBits(n).map((bit, bitIdx) => {
                  const bitNumber = octetIdx * 8 + bitIdx;
                  const isNetwork = bitNumber < prefix;
                  return (
                    <div
                      key={bitIdx}
                      className={`flex h-7 w-5 items-center justify-center rounded-sm font-mono text-xs font-semibold ${
                        isNetwork
                          ? "border border-cyan-300 bg-cyan-100 text-cyan-800"
                          : "border border-emerald-300 bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-cyan-300 bg-cyan-100" />
          network (first {prefix} bits)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-emerald-300 bg-emerald-100" />
          host (last {32 - prefix} bits)
        </span>
      </div>
    </div>
  );
}

/** Chapter 2: the whole /24 line as one bar, with the chapter's two
 * stations plotted inside it. Adapted from SubnetExplorer's number
 * line (old Short Way Home walkthrough) — that component's stat boxes
 * teach network/broadcast addresses, which this chapter defers, so
 * only the range line is carried over, endpoints unlabeled. */
export function SubnetRangeLine({
  devices,
}: {
  devices: { label: string; lastOctet: number }[];
}) {
  const pct = (octet: number) => (octet / 255) * 100;
  return (
    <div className="w-full max-w-xl space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">
        The whole 192.168.1 line, from .0 to .255 — one line-group
      </div>
      <div className="relative h-8 rounded-full bg-neutral-100">
        <div className="absolute top-0 h-full w-full rounded-full bg-cyan-200" />
        {devices.map((d) => (
          <div
            key={d.label}
            title={`${d.label}: 192.168.1.${d.lastOctet}`}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500"
            style={{ left: `${pct(d.lastOctet)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-xs text-neutral-400">
        <span>.0</span>
        <span>.255</span>
      </div>
      <div className="space-y-1 text-sm text-neutral-700">
        {devices.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            {d.label} — 192.168.1.{d.lastOctet}, inside the block
          </div>
        ))}
      </div>
    </div>
  );
}
