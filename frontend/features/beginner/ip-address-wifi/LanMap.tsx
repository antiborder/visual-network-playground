import { devicesAtOctet, formatIp, type Device } from "./network";
import type { PacketState } from "./usePacketSend";

const WIDTH = 400;
const HEIGHT = 290;
const ROUTER_X = WIDTH / 2;
const ROUTER_Y = 205;
const DEVICE_Y = 80;
/** Extra canvas width reserved to the right of the LAN box for the
 * internet cloud, only added to the viewBox when `showInternet` is set —
 * every other caller's layout is completely unaffected. */
const INTERNET_WIDTH = 150;
const INTERNET_CX = WIDTH + 70;

const KIND_LABEL: Record<Device["kind"], string> = {
  router: "Router",
  pc: "PC",
  phone: "Phone",
  iot: "Smart bulb",
};

function devicePositions(devices: Device[]) {
  const others = devices.filter((d) => d.kind !== "router");
  const n = others.length;
  return others.map((d, i) => ({
    device: d,
    x: n === 1 ? ROUTER_X : 70 + i * ((WIDTH - 140) / (n - 1)),
    y: DEVICE_Y,
  }));
}

function DeviceIcon({ kind, conflicted }: { kind: Device["kind"]; conflicted: boolean }) {
  const stroke = conflicted ? "#dc2626" : "#525252";
  const fill = conflicted ? "#fee2e2" : "#fafafa";
  if (kind === "pc") {
    return <rect x={-18} y={-14} width={36} height={24} rx={3} fill={fill} stroke={stroke} strokeWidth={2} />;
  }
  if (kind === "phone") {
    return <rect x={-10} y={-16} width={20} height={32} rx={4} fill={fill} stroke={stroke} strokeWidth={2} />;
  }
  return <circle r={14} fill={fill} stroke={stroke} strokeWidth={2} />;
}

/** Hand-rolled inline SVG diagram of a home LAN: a router at the center
 * broadcasting Wi-Fi (dotted lines) to a row of devices, each labeled with
 * its kind and current IP address. Purely a function of props — all
 * animation timing (the ARP broadcast/reply, the conflict flash) lives in
 * the caller's `usePacketSend` hook, not in here. */
export function LanMap({
  devices,
  conflictIds,
  packet,
  showMac = false,
  showIp = true,
  showCidr = false,
  showInternet = false,
}: {
  devices: Device[];
  conflictIds: Set<string>;
  packet: PacketState | null;
  /** Reveal each device's MAC address — off until the chapter has actually
   * introduced it, so the label doesn't appear unexplained. */
  showMac?: boolean;
  /** Reveal each device's IP address — on by default, but off for the very
   * first "meet the network" step, before IP addresses have been explained
   * at all. */
  showIp?: boolean;
  /** Append the /24 prefix length to each IP address — off by default.
   * Meant only for the couple of Chapter 1 steps where Dad's router-app
   * screen should plant an unexplained "I've seen that before" seed ahead
   * of Chapter 2 actually teaching what CIDR notation means; every other
   * caller should leave this off so it doesn't appear unexplained. */
  showCidr?: boolean;
  /** Draw a cloud labeled "The Internet" outside the LAN box, connected to
   * the router by a line crossing the dashed boundary — for the one step
   * that specifically contrasts the LAN with what lies beyond it. */
  showInternet?: boolean;
}) {
  const router = devices.find((d) => d.kind === "router")!;
  const positioned = devicePositions(devices);

  // An ARP query is a broadcast, not a point-to-point send: it plays out in
  // two phases — first a request ripples out from the sender to every
  // device (0 -> 0.5), then whichever device(s) hold the queried address
  // reply, converging back on the sender (0.5 -> 1). Two replies arriving
  // at once *is* the conflict — the sender can't tell them apart — so the
  // ambiguity is drawn at the sender, not at the targets.
  let arp: {
    senderX: number;
    senderY: number;
    broadcastProgress: number;
    replyProgress: number;
    replyPositions: { x: number; y: number }[];
    isConflict: boolean;
    arrived: boolean;
  } | null = null;
  if (packet) {
    const sender =
      packet.fromId === router.id
        ? { x: ROUTER_X, y: ROUTER_Y }
        : positioned.find((p) => p.device.id === packet.fromId) ?? { x: ROUTER_X, y: ROUTER_Y };
    const matches = devicesAtOctet(devices, packet.toOctet);
    const matchPositions = matches
      .map((m) => positioned.find((p) => p.device.id === m.id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
    arp = {
      senderX: sender.x,
      senderY: sender.y,
      broadcastProgress: Math.min(1, packet.progress / 0.5),
      replyProgress: Math.max(0, (packet.progress - 0.5) / 0.5),
      replyPositions: matchPositions.map((p) => ({ x: p.x, y: p.y })),
      isConflict: matchPositions.length > 1,
      arrived: packet.progress >= 1,
    };
  }

  return (
    <svg
      viewBox={`0 0 ${showInternet ? WIDTH + INTERNET_WIDTH : WIDTH} ${HEIGHT}`}
      className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white"
      role="img"
      aria-label={
        showInternet
          ? "Diagram of a home network with a router and connected devices, connected to the internet"
          : "Diagram of a home network with a router and connected devices"
      }
    >
      <rect
        x={12}
        y={12}
        width={WIDTH - 24}
        height={HEIGHT - 24}
        rx={12}
        fill="none"
        stroke="#d4d4d4"
        strokeDasharray="6 5"
      />
      <text x={24} y={32} fontSize={14} fill="#737373">
        Home network
      </text>

      {positioned.map(({ device, x, y }) => (
        <line
          key={`line-${device.id}`}
          x1={ROUTER_X}
          y1={ROUTER_Y}
          x2={x}
          y2={y}
          stroke={conflictIds.has(device.id) ? "#dc2626" : "#a3a3a3"}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      ))}

      {/* Wi-Fi arcs above the router */}
      {[26, 18, 10].map((r) => (
        <path
          key={r}
          d={`M ${ROUTER_X - r} ${ROUTER_Y - 22} A ${r} ${r} 0 0 1 ${ROUTER_X + r} ${ROUTER_Y - 22}`}
          fill="none"
          stroke="#0891b2"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}

      <g transform={`translate(${ROUTER_X}, ${ROUTER_Y})`}>
        <rect x={-24} y={-16} width={48} height={32} rx={4} fill="#ecfeff" stroke="#0891b2" strokeWidth={2} />
        <text x={0} y={30} textAnchor="middle" fontSize={15} fill="#171717" fontWeight={600}>
          {KIND_LABEL.router}
        </text>
        {showIp && (
          <text x={0} y={45} textAnchor="middle" fontSize={14} fill="#525252">
            {formatIp(router.lastOctet)}
            {showCidr && "/24"}
          </text>
        )}
        {showMac && (
          <text x={0} y={59} textAnchor="middle" fontSize={14} fill="#a3a3a3" fontFamily="monospace">
            {router.mac}
          </text>
        )}
      </g>

      {positioned.map(({ device, x, y }) => {
        const conflicted = conflictIds.has(device.id);
        return (
          <g key={device.id} transform={`translate(${x}, ${y})`}>
            {conflicted && <circle r={22} fill="#fecaca" opacity={0.7} />}
            <DeviceIcon kind={device.kind} conflicted={conflicted} />
            <text x={0} y={34} textAnchor="middle" fontSize={15} fill="#171717" fontWeight={600}>
              {KIND_LABEL[device.kind]}
            </text>
            {showIp && (
              <text
                x={0}
                y={49}
                textAnchor="middle"
                fontSize={14}
                fill={conflicted ? "#dc2626" : "#525252"}
                fontFamily="monospace"
              >
                {formatIp(device.lastOctet)}
                {showCidr && "/24"}
              </text>
            )}
            {showMac && (
              <text x={0} y={63} textAnchor="middle" fontSize={14} fill="#a3a3a3" fontFamily="monospace">
                {device.mac}
              </text>
            )}
            {conflicted && (
              <text x={0} y={-32} textAnchor="middle" fontSize={15} fill="#dc2626" fontWeight={600}>
                IP conflict
              </text>
            )}
          </g>
        );
      })}

      {arp && (
        <g>
          {arp.broadcastProgress < 1 && (
            <circle
              cx={arp.senderX}
              cy={arp.senderY}
              r={20 + arp.broadcastProgress * 160}
              fill="none"
              stroke="#0891b2"
              strokeWidth={2}
              opacity={0.9 - arp.broadcastProgress * 0.7}
            />
          )}

          {arp.replyProgress > 0 &&
            arp.replyPositions.map((p, i) => {
              const x = p.x + (arp!.senderX - p.x) * arp!.replyProgress;
              const y = p.y + (arp!.senderY - p.y) * arp!.replyProgress;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={6}
                  fill={arp!.isConflict ? "#dc2626" : "#16a34a"}
                />
              );
            })}

          {arp.arrived && arp.isConflict && (
            <>
              <circle cx={arp.senderX} cy={arp.senderY} r={24} fill="none" stroke="#dc2626" strokeWidth={3} opacity={0.8} />
              <text x={arp.senderX} y={arp.senderY - 32} textAnchor="middle" fontSize={15} fill="#dc2626" fontWeight={600}>
                2 replies — ambiguous
              </text>
            </>
          )}
          {arp.arrived && !arp.isConflict && arp.replyPositions.length > 0 && (
            <circle cx={arp.senderX} cy={arp.senderY} r={24} fill="none" stroke="#16a34a" strokeWidth={3} opacity={0.7} />
          )}
        </g>
      )}

      {showInternet && (
        <g>
          <line
            x1={ROUTER_X}
            y1={ROUTER_Y}
            x2={INTERNET_CX - 50}
            y2={ROUTER_Y}
            stroke="#a3a3a3"
            strokeWidth={1.5}
          />
          <ellipse cx={INTERNET_CX} cy={ROUTER_Y} rx={55} ry={26} fill="#f5f5f4" stroke="#a8a29e" strokeWidth={1.5} />
          <text x={INTERNET_CX} y={ROUTER_Y - 3} textAnchor="middle" fontSize={15} fontWeight={600} fill="#44403c">
            The Internet
          </text>
          <text x={INTERNET_CX} y={ROUTER_Y + 13} textAnchor="middle" fontSize={14} fill="#78716c">
            everything outside
          </text>
        </g>
      )}
    </svg>
  );
}
