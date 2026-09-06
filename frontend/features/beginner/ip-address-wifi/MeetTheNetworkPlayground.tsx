"use client";

import { useState } from "react";
import { useTrainJourney, type Point } from "./useTrainJourney";

const INK = "#404040";
const SUBTLE = "#737373";
const LINE = "#a3a3a3";
const ACCENT = "#0891b2";
const ACCENT_FILL = "#ecfeff";
const CARD = "#fafafa";
const CLOUD_FILL = "#f5f5f4";
const CLOUD_STROKE = "#a8a29e";

interface StationDef {
  id: "phone" | "pc" | "iot";
  label: string;
  ip: string;
  pos: Point;
}

const STATIONS: StationDef[] = [
  { id: "phone", label: "Phone", ip: "192.168.1.10", pos: { x: 74, y: 55 } },
  { id: "pc", label: "Dad's PC", ip: "192.168.1.15", pos: { x: 74, y: 120 } },
  { id: "iot", label: "Smart bulb", ip: "192.168.1.20", pos: { x: 74, y: 185 } },
];

const ROUTER_POS: Point = { x: 236, y: 120 };
const MODEM_POS: Point = { x: 368, y: 120 };
const MAINLINE_POS: Point = { x: 488, y: 120 };

function StationIcon({ x, y, label, ip }: { x: number; y: number; label: string; ip: string }) {
  return (
    <g>
      <rect x={x - 32} y={y - 17} width={64} height={34} rx={4} fill={CARD} stroke={LINE} strokeWidth={1.5} />
      <text x={x} y={y - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>
        {label}
      </text>
      <text x={x} y={y + 13} textAnchor="middle" fontSize={10} fill={SUBTLE}>
        {ip}
      </text>
    </g>
  );
}

function JunctionIcon({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 28} y={y - 20} width={56} height={40} rx={4} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth={2} />
      <text x={x} y={y + 34} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>
        {label}
      </text>
    </g>
  );
}

function MainlineIcon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={46} ry={26} fill={CLOUD_FILL} stroke={CLOUD_STROKE} strokeWidth={1.5} />
      <text x={x} y={y - 2} textAnchor="middle" fontSize={11} fontWeight={600} fill="#44403c">
        The Mainline
      </text>
      <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={SUBTLE}>
        (the internet)
      </text>
    </g>
  );
}

function TrainIcon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 13} y={y - 9} width={26} height={15} rx={2} fill={ACCENT} stroke={INK} strokeWidth={1} />
      <rect x={x - 8} y={y - 6} width={7} height={6} fill={ACCENT_FILL} />
      <rect x={x + 1} y={y - 6} width={7} height={6} fill={ACCENT_FILL} />
      <circle cx={x - 7} cy={y + 8} r={2.4} fill={INK} />
      <circle cx={x + 7} cy={y + 8} r={2.4} fill={INK} />
    </g>
  );
}

function pathFor(sourceId: string, destId: string): Point[] {
  const source = STATIONS.find((s) => s.id === sourceId)!.pos;
  if (destId === "internet") {
    return [source, ROUTER_POS, MODEM_POS, MAINLINE_POS];
  }
  const dest = STATIONS.find((s) => s.id === destId)!.pos;
  return [source, ROUTER_POS, dest];
}

/** Chapter 1's trial playground: click a station to send a train from it,
 * pick a destination, and watch it travel — straight through the Router
 * alone if the destination is another station on the same home line, or
 * through the Router *and* the Modem if it's headed out to the Mainline.
 * One animation making the router/modem split and LAN-vs-internet
 * distinction visible, instead of only described in the walkthrough.
 * Deliberately its own small hand-rolled SVG (not LanMap, which uses the
 * pre-railway house/device visual language) so it matches the railway
 * skin the rest of this chapter now uses. */
export function MeetTheNetworkPlayground() {
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [lastTrip, setLastTrip] = useState<{ source: string; dest: string } | null>(null);
  const { journey, send, reset } = useTrainJourney();

  const pickSource = (id: string) => {
    setSourceId(id);
    setLastTrip(null);
    reset();
  };

  const sendTo = (destId: string) => {
    if (!sourceId) return;
    setLastTrip({ source: sourceId, dest: destId });
    send(pathFor(sourceId, destId));
  };

  const startOver = () => {
    setSourceId(null);
    setLastTrip(null);
    reset();
  };

  const destinations: { id: string; label: string }[] = [
    ...STATIONS.filter((s) => s.id !== sourceId).map((s) => ({ id: s.id, label: s.label })),
    { id: "internet", label: "The Internet" },
  ];

  const isInternetTrip = lastTrip?.dest === "internet";
  const traveling = journey && !journey.done;

  let status: string;
  if (!lastTrip) {
    status = "Pick a station to send a photo from, then choose where it should go.";
  } else if (traveling) {
    status = isInternetTrip
      ? "Through the Router, then the Modem — heading out to the Mainline..."
      : "Through the Router — staying right on the home line...";
  } else {
    status = isInternetTrip
      ? "Delivered — all the way out on the internet's mainline!"
      : "Delivered — never left the home line, no Modem needed.";
  }

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 520 230" className="w-full max-w-2xl rounded-lg border border-neutral-200 bg-white">
        {STATIONS.map((s) => (
          <line
            key={s.id}
            x1={s.pos.x + 32}
            y1={s.pos.y}
            x2={ROUTER_POS.x - 28}
            y2={ROUTER_POS.y}
            stroke={LINE}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ))}
        <line x1={ROUTER_POS.x + 28} y1={ROUTER_POS.y} x2={MODEM_POS.x - 28} y2={MODEM_POS.y} stroke={LINE} strokeWidth={1.5} />
        <line x1={MODEM_POS.x + 28} y1={MODEM_POS.y} x2={MAINLINE_POS.x - 46} y2={MAINLINE_POS.y} stroke={LINE} strokeWidth={1.5} />

        {STATIONS.map((s) => (
          <StationIcon key={s.id} x={s.pos.x} y={s.pos.y} label={s.label} ip={s.ip} />
        ))}
        <JunctionIcon x={ROUTER_POS.x} y={ROUTER_POS.y} label="Router" />
        <JunctionIcon x={MODEM_POS.x} y={MODEM_POS.y} label="Modem" />
        <MainlineIcon x={MAINLINE_POS.x} y={MAINLINE_POS.y} />

        {traveling && <TrainIcon x={journey.x} y={journey.y} />}
      </svg>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-neutral-500">Send from:</span>
        {STATIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pickSource(s.id)}
            className={`px-3 py-1.5 rounded-md ${
              sourceId === s.id ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {sourceId && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-neutral-500">Send to:</span>
          {destinations.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => sendTo(d.id)}
              className="px-3 py-1.5 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-neutral-600">{status}</p>

      {lastTrip && (
        <button type="button" onClick={startOver} className="text-xs text-neutral-500 hover:text-neutral-800">
          ↺ Start over
        </button>
      )}
    </div>
  );
}
