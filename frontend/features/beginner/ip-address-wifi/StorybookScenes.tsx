import type { ReactNode } from "react";

/** A small, reusable library of hand-rolled SVG "picture book" scenes for
 * Pip the mouse's story (Chapters 1–2) and Momo the smart bulb's story
 * (Chapter 3). Kept deliberately simple — a handful of shapes per
 * character/prop, no libraries — matching the app's existing hand-rolled
 * SVG convention (see LanMap.tsx, GatewayLayers.tsx). Each named `Scene*`
 * export is reused across every Step that shares its story beat, rather
 * than redrawn per Step. */

const INK = "#2a2420";
const ACCENT = "#e2703a";
const PAPER = "#faf3e1";
const SAGE = "#7a9b7c";
const SKY = "#8aa8c8";

function frame(children: ReactNode) {
  return (
    <svg viewBox="0 0 300 130" className="w-full max-w-sm mx-auto h-auto">
      {children}
    </svg>
  );
}

/** A small mouse, ears/head/body/tail — reused for Pip (accent-colored
 * body) and, at a larger scale, Dad (ink-colored body, plain). */
function Mouse({ x, y, scale = 1, color = ACCENT }: { x: number; y: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M14 12 Q24 6 20 -4" stroke={INK} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="10" rx="15" ry="12" fill={color} fillOpacity="0.18" stroke={INK} strokeWidth="1.5" />
      <circle cx="-9" cy="-9" r="5.5" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <circle cx="7" cy="-10" r="5.5" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <circle cx="0" cy="1" r="10" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <circle cx="-3.5" cy="0" r="1.1" fill={INK} />
      <circle cx="3.5" cy="0" r="1.1" fill={INK} />
      <path d="M-1.5 4.5 Q0 6.5 1.5 4.5" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Bulb({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="13" fill="#f5d97a" fillOpacity="0.5" stroke={INK} strokeWidth="1.5" />
      <path d="M-6 12 L-5 20 L5 20 L6 12" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M-4 20 L4 20 M-4 23 L4 23" stroke={INK} strokeWidth="1.2" />
      <circle cx="-4" cy="-1" r="1.1" fill={INK} />
      <circle cx="4" cy="-1" r="1.1" fill={INK} />
      <path d="M-3 4 Q0 6.5 3 4" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  );
}

function House({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M-22 6 L0 -18 L22 6" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="-16" y="6" width="32" height="24" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="-5" y="14" width="10" height="16" fill={SAGE} fillOpacity="0.35" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

function RouterBox({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-9 -12 A9 9 0 0 1 9 -12" stroke={SKY} strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="-13" y="-6" width="26" height="16" rx="3" fill="#eaf3fb" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function CloudShape({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx="0" cy="6" rx="26" ry="12" fill="#f2f2ee" stroke={INK} strokeWidth="1.5" />
      <circle cx="-14" cy="-2" r="11" fill="#f2f2ee" stroke={INK} strokeWidth="1.5" />
      <circle cx="0" cy="-8" r="13" fill="#f2f2ee" stroke={INK} strokeWidth="1.5" />
      <circle cx="14" cy="-2" r="11" fill="#f2f2ee" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function CheeseWedge({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-14 10 L14 10 L2 -12 Z" fill="#f5d97a" fillOpacity="0.6" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="-2" cy="4" r="1.6" fill={INK} fillOpacity="0.5" />
      <circle cx="4" cy="-1" r="1.2" fill={INK} fillOpacity="0.5" />
    </g>
  );
}

function Gate({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-20" y="-22" width="6" height="34" fill={INK} />
      <rect x="14" y="-22" width="6" height="34" fill={INK} />
      <rect x="-22" y="-26" width="46" height="6" fill={ACCENT} fillOpacity="0.6" stroke={INK} strokeWidth="1" />
    </g>
  );
}

function Signpost({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1="0" y1="-4" x2="0" y2="22" stroke={INK} strokeWidth="2" />
      <path d="M0 -14 L20 -8 L0 -2 Z" fill={SAGE} fillOpacity="0.5" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <text x="4" y="-7" fontSize="7" fill={INK} fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

function PhoneShape({ x, y }: { x: number; y: number }) {
  return <rect x={x - 6} y={y - 11} width="12" height="22" rx="2.5" fill={PAPER} stroke={INK} strokeWidth="1.5" />;
}

function PcShape({ x, y }: { x: number; y: number }) {
  return <rect x={x - 12} y={y - 8} width="24" height="16" rx="2" fill={PAPER} stroke={INK} strokeWidth="1.5" />;
}

function Bubble({ x, y, text, width = 60 }: { x: number; y: number; text: string; width?: number }) {
  const half = width / 2;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-half} y="-14" width={width} height="22" rx="8" fill="white" stroke={INK} strokeWidth="1.2" />
      <path d="M-6 8 L-10 16 L2 8 Z" fill="white" stroke={INK} strokeWidth="1.2" />
      <text x="0" y="0" textAnchor="middle" fontSize="7.5" fill={INK}>
        {text}
      </text>
    </g>
  );
}

function GroundLine() {
  return <line x1="10" y1="112" x2="290" y2="112" stroke={INK} strokeOpacity="0.15" strokeWidth="1.5" />;
}

/** A small building housing one counter — one of the stops a DNS lookup visits along
 * the way (root, TLD, authoritative), reused at whatever position/count a
 * given beat needs. */
function Building({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-16" y="-34" width="32" height="46" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <rect x="-10" y="-26" width="6" height="6" fill={SKY} fillOpacity="0.5" stroke={INK} strokeWidth="1" />
      <rect x="4" y="-26" width="6" height="6" fill={SKY} fillOpacity="0.5" stroke={INK} strokeWidth="1" />
      <rect x="-10" y="-14" width="6" height="6" fill={SKY} fillOpacity="0.5" stroke={INK} strokeWidth="1" />
      <rect x="4" y="-14" width="6" height="6" fill={SKY} fillOpacity="0.5" stroke={INK} strokeWidth="1" />
      <rect x="-4" y="0" width="8" height="12" fill={INK} fillOpacity="0.15" stroke={INK} strokeWidth="1" />
    </g>
  );
}

/** A short personal notebook — the hosts file's small handwritten list, or
 * any other "jot it down" beat. */
function Notebook({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-10" y="-13" width="20" height="26" rx="1.5" fill={PAPER} stroke={INK} strokeWidth="1.3" />
      <line x1="-6" y1="-6" x2="6" y2="-6" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="-6" y1="-1" x2="6" y2="-1" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="-6" y1="4" x2="6" y2="4" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
    </g>
  );
}

/** An open record book with entries on both pages — the authoritative
 * desk's book of many different kinds of records, not just one line. */
function RecordBook({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path
        d="M-16 -10 L0 -13 L16 -10 L16 10 L0 13 L-16 10 Z"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="0" y1="-13" x2="0" y2="13" stroke={INK} strokeWidth="1.2" />
      <line x1="-11" y1="-5" x2="-3" y2="-6" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="-11" y1="0" x2="-3" y2="-1" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="3" y1="-6" x2="11" y2="-5" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
      <line x1="3" y1="-1" x2="11" y2="0" stroke={INK} strokeOpacity="0.4" strokeWidth="1" />
    </g>
  );
}

/** A small clock face — an entry's "please forget me after this long" note. */
function ClockFace({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="12" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <line x1="0" y1="0" x2="0" y2="-7" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="0" y1="0" x2="5" y2="2" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

/** The Cheese-Lovers' Board itself — a small corkboard with two pins,
 * `whole` toggling between an assembled cheese photo (posted) and a
 * scatter of loose fragment squares still finding their spot
 * (mid-reassembly). */
function BoardShape({ x, y, whole }: { x: number; y: number; whole: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-24" y="-20" width="48" height="40" rx="2" fill="#d9c9a3" stroke={INK} strokeWidth="1.5" />
      <circle cx="-16" cy="-12" r="1.6" fill={INK} fillOpacity="0.5" />
      <circle cx="16" cy="-12" r="1.6" fill={INK} fillOpacity="0.5" />
      {whole ? (
        <CheeseWedge x={0} y={4} />
      ) : (
        <>
          <rect x="-14" y="-6" width="9" height="9" fill="#f5d97a" fillOpacity="0.6" stroke={INK} strokeWidth="1" />
          <rect x="2" y="-10" width="9" height="9" fill="#f5d97a" fillOpacity="0.6" stroke={INK} strokeWidth="1" />
          <rect x="-4" y="6" width="9" height="9" fill="#f5d97a" fillOpacity="0.6" stroke={INK} strokeWidth="1" />
        </>
      )}
    </g>
  );
}

/** A simple bed — Pip finally turning in for the night, right before the
 * dream that opens the "train world" framing used from Chapter 2 on. */
function Bed({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-22" y="-4" width="44" height="14" rx="2" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <rect x="-22" y="-11" width="12" height="11" rx="2" fill="#eaf3fb" stroke={INK} strokeWidth="1.2" />
      <line x1="-22" y1="10" x2="-22" y2="17" stroke={INK} strokeWidth="1.4" />
      <line x1="22" y1="10" x2="22" y2="17" stroke={INK} strokeWidth="1.4" />
    </g>
  );
}

/** A little cluster of "Zzz" marks, for a sleeping character. */
function ZzzMarks({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} fill={INK} fillOpacity="0.45" fontWeight={700} fontFamily="serif">
      <text x="0" y="0" fontSize="11">Z</text>
      <text x="8" y="-9" fontSize="8">Z</text>
      <text x="14" y="-16" fontSize="6">Z</text>
    </g>
  );
}

/** A short stretch of double-rail track — the literal railway that every
 * "train world" scene from the dream onward is built on. */
function RailLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g stroke={INK} strokeWidth="2">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x1} y1={y1 + 5} x2={x2} y2={y2 + 5} />
    </g>
  );
}

/** A small train car on the rails — the vehicle carrying packets (crates)
 * between stations; not itself a stand-in for data. */
function TrainCar({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-15" y="-11" width="30" height="15" rx="2" fill={SKY} fillOpacity="0.5" stroke={INK} strokeWidth="1.4" />
      <rect x="-10" y="-8" width="7" height="6" fill="#eaf3fb" stroke={INK} strokeWidth="1" />
      <rect x="3" y="-8" width="7" height="6" fill="#eaf3fb" stroke={INK} strokeWidth="1" />
      <circle cx="-8" cy="6" r="3.2" fill={INK} fillOpacity="0.6" />
      <circle cx="8" cy="6" r="3.2" fill={INK} fillOpacity="0.6" />
    </g>
  );
}

/** A small station building beside the rails — any device in the "train
 * world" framing (phone, router, server, ...) is one of these. */
function StationBuilding({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <rect x="-15" y="-20" width="30" height="20" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <path d="M-17 -20 L0 -30 L17 -20 Z" fill={ACCENT} fillOpacity="0.35" stroke={INK} strokeWidth="1.2" />
      <rect x="-5" y="-10" width="10" height="10" fill="#eaf3fb" fillOpacity="0.6" stroke={INK} strokeWidth="1" />
    </g>
  );
}

// ------------------------- Chapter 1 scenes -------------------------

export function ScenePipsHouse() {
  return frame(
    <>
      <GroundLine />
      <House x={150} y={70} scale={1.3} />
      <Mouse x={95} y={95} />
    </>,
  );
}

export function ScenePipsPhone() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={130} y={90} />
      <PhoneShape x={158} y={78} />
    </>,
  );
}

export function ScenePipsFixedId() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={130} y={90} />
      <PhoneShape x={158} y={78} />
      <text x={158} y={100} textAnchor="middle" fontSize="7" fill={INK} fontStyle="italic">
        (a tag, since birth)
      </text>
    </>,
  );
}

export function SceneCheesePhoto() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={92} />
      <CheeseWedge x={175} y={80} />
      <PhoneShape x={140} y={78} />
    </>,
  );
}

export function SceneAddressCheck() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={130} y={92} />
      <PhoneShape x={158} y={80} />
      <Bubble x={150} y={35} text="192.168.1. ≠ 203.0.113." />
    </>,
  );
}

export function SceneGatewayDoor() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={95} y={95} />
      <House x={190} y={70} scale={1.2} />
      <RouterBox x={190} y={92} />
    </>,
  );
}

export function SceneCgnatCity() {
  return frame(
    <>
      <GroundLine />
      <House x={90} y={95} scale={0.6} />
      <House x={140} y={90} scale={0.7} />
      <House x={195} y={95} scale={0.6} />
      <House x={245} y={90} scale={0.65} />
      <Mouse x={165} y={104} scale={0.85} />
    </>,
  );
}

export function SceneCheckpoint() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={92} />
      <Gate x={175} y={90} />
      <CloudShape x={250} y={45} scale={0.6} />
    </>,
  );
}

export function ScenePrivateGlobal() {
  return frame(
    <>
      <GroundLine />
      <Signpost x={100} y={80} label="private" />
      <Signpost x={210} y={80} label="global" />
    </>,
  );
}

export function SceneOceanCrossing() {
  return frame(
    <>
      <path d="M10 108 Q40 100 70 108 T130 108 T190 108 T250 108 T290 108" fill="none" stroke={SKY} strokeWidth="2" />
      <CloudShape x={80} y={35} scale={0.55} />
      <CloudShape x={220} y={30} scale={0.7} />
      <PhoneShape x={150} y={92} />
    </>,
  );
}

// ------------------------- Chapter 2 scenes -------------------------

export function SceneNeighborhoodMap() {
  return frame(
    <>
      <GroundLine />
      <House x={90} y={95} scale={0.75} />
      <House x={150} y={92} scale={0.8} />
      <House x={215} y={95} scale={0.75} />
      <line x1="30" y1="112" x2="270" y2="112" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="3" strokeDasharray="6 5" />
    </>,
  );
}

export function SceneFasterIdea() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={90} y={92} />
      <path d="M110 88 L200 88" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
      <PcShape x={230} y={88} />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={ACCENT} />
        </marker>
      </defs>
    </>,
  );
}

export function SceneSameCheckLocal() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={92} />
      <PhoneShape x={138} y={80} />
      <Bubble x={150} y={35} text="192.168.1. = 192.168.1. — home!" />
      <PcShape x={225} y={88} />
    </>,
  );
}

export function SceneArpBroadcast() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={95} y={92} />
      <PhoneShape x={122} y={80} />
      <circle cx="122" cy="80" r="35" fill="none" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="122" cy="80" r="50" fill="none" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1.5" />
      <PcShape x={225} y={88} />
    </>,
  );
}

export function SceneSwitchDecision() {
  return frame(
    <>
      <GroundLine />
      <RouterBox x={150} y={55} />
      <path d="M150 68 L90 100" stroke={SKY} strokeWidth="2" markerEnd="url(#arrowB)" />
      <path d="M150 68 L210 100" stroke={ACCENT} strokeWidth="2" markerEnd="url(#arrowB)" />
      <CloudShape x={70} y={112} scale={0.4} />
      <PcShape x={225} y={100} />
      <defs>
        <marker id="arrowB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
        </marker>
      </defs>
    </>,
  );
}

export function SceneDelivered() {
  return frame(
    <>
      <GroundLine />
      <PcShape x={150} y={85} />
      <CheeseWedge x={150} y={55} />
      <text x={150} y={110} textAnchor="middle" fontSize="8" fill={INK}>
        delivered!
      </text>
    </>,
  );
}

// ------------------------- Chapter 3 scenes -------------------------

export function SceneMomoArrives() {
  return frame(
    <>
      <GroundLine />
      <House x={160} y={75} scale={1.1} />
      <Bulb x={150} y={92} />
    </>,
  );
}

export function SceneDoraExchange() {
  return frame(
    <>
      <GroundLine />
      <Bulb x={100} y={90} />
      <RouterBox x={210} y={70} />
      <path d="M120 82 L190 72" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M190 90 L120 100" stroke={SKY} strokeWidth="1.5" strokeDasharray="3 3" />
    </>,
  );
}

export function SceneMixUp() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={92} />
      <Bulb x={200} y={90} />
      <Bubble x={150} y={35} text="both wearing .10 ?!" />
    </>,
  );
}

export function SceneTwoAnswers() {
  return frame(
    <>
      <GroundLine />
      <RouterBox x={150} y={45} />
      <Mouse x={90} y={92} />
      <Bulb x={210} y={90} />
      <path d="M110 82 L140 55" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M190 82 L160 55" stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={150} y={20} textAnchor="middle" fontSize="8" fill={ACCENT} fontWeight={700}>
        ?!
      </text>
    </>,
  );
}

export function SceneFixed() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={90} y={92} />
      <Bulb x={210} y={90} />
      <text x={150} y={30} textAnchor="middle" fontSize="8" fill={SAGE}>
        two different addresses now
      </text>
    </>,
  );
}

// --------------------- "Meet the Network" scenes ---------------------
// New chapter drafted as part of the beginner story-based redesign (see
// docs/beginner-story-redesign.md). Chronologically the very first chapter
// of Pip's saga — precedes the events told in the scenes above.

export function SceneWeakSignal() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={130} y={92} />
      <PhoneShape x={158} y={80} />
      <path
        d="M152 62 A10 10 0 0 1 164 62"
        stroke={SKY}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
    </>,
  );
}

export function SceneHallwayBox() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={95} />
      <rect x={200} y={68} width={18} height={14} rx={2} fill="#f5d97a" fillOpacity="0.5" stroke={INK} strokeWidth="1.3" />
      <circle cx={209} cy={75} r="3" fill={SKY} fillOpacity="0.7" />
    </>,
  );
}

export function SceneRouterCloseup() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={98} scale={0.95} />
      <RouterBox x={175} y={70} />
    </>,
  );
}

export function SceneWalkingSignal() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={90} y={92} />
      <PhoneShape x={112} y={80} />
      <RouterBox x={230} y={70} />
      <line x1={155} y1={90} x2={205} y2={78} stroke={INK} strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3 3" />
    </>,
  );
}

export function SceneTwoBands() {
  return frame(
    <>
      <GroundLine />
      <RouterBox x={150} y={60} />
      <path d="M150 48 A34 34 0 0 1 184 60" stroke={SKY} strokeWidth="2" fill="none" strokeOpacity="0.5" />
      <path d="M150 48 A14 14 0 0 1 164 60" stroke={ACCENT} strokeWidth="2" fill="none" strokeOpacity="0.7" />
      <Mouse x={100} y={95} scale={0.9} />
    </>,
  );
}

export function SceneRouterModem() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={80} y={95} />
      <RouterBox x={170} y={70} />
      <rect x={195} y={62} width={20} height={16} rx={2} fill="#eee" stroke={INK} strokeWidth="1.5" />
      <line x1={215} y1={70} x2={230} y2={70} stroke={INK} strokeWidth="1.5" />
    </>,
  );
}

export function SceneLanDesk() {
  return frame(
    <>
      <GroundLine />
      <RouterBox x={150} y={55} />
      <PhoneShape x={100} y={90} />
      <PcShape x={205} y={90} />
      <line x1="150" y1="65" x2="112" y2="82" stroke={INK} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="150" y1="65" x2="195" y2="82" stroke={INK} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 3" />
    </>,
  );
}

export function SceneBeyondHouse() {
  return frame(
    <>
      <GroundLine />
      <House x={110} y={75} scale={1.1} />
      <CloudShape x={230} y={45} scale={0.6} />
    </>,
  );
}

export function SceneWifiLock() {
  return frame(
    <>
      <GroundLine />
      <RouterBox x={150} y={60} />
      <g transform="translate(150,88)">
        <rect x={-7} y={-2} width={14} height={11} rx={2} fill="#f5d97a" fillOpacity="0.6" stroke={INK} strokeWidth="1.3" />
        <path d="M-4 -2 L-4 -6 A4 4 0 0 1 4 -6 L4 -2" fill="none" stroke={INK} strokeWidth="1.3" />
      </g>
    </>,
  );
}

export function ScenePhoneNumber() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={120} y={92} />
      <PhoneShape x={148} y={80} />
      <Bubble x={150} y={35} text="192.168.1.10" />
    </>,
  );
}

export function SceneTwoNumbers() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={92} />
      <PhoneShape x={138} y={80} />
      <Bubble x={150} y={35} text="192.168.1.10" />
      <text x={150} y={55} textAnchor="middle" fontSize="7" fill={INK} fontFamily="monospace" opacity={0.7}>
        AA:BB:CC:11:22:33
      </text>
    </>,
  );
}

export function SceneConflictQuestion() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={92} />
      <PcShape x={210} y={90} />
      <text x={155} y={40} textAnchor="middle" fontSize="16" fill={ACCENT} fontWeight={700}>
        ?
      </text>
    </>,
  );
}

export function SceneWorldNetworks() {
  return frame(
    <>
      <GroundLine />
      <StationBuilding x={90} y={65} scale={0.5} />
      <StationBuilding x={200} y={60} scale={0.6} />
      <StationBuilding x={250} y={80} scale={0.4} />
      <line x1={100} y1={62} x2={185} y2={58} stroke={INK} strokeOpacity="0.3" strokeWidth="1.3" strokeDasharray="3 3" />
      <line x1={212} y1={62} x2={243} y2={73} stroke={INK} strokeOpacity="0.3" strokeWidth="1.3" strokeDasharray="3 3" />
      <Mouse x={110} y={98} scale={0.9} />
    </>,
  );
}

export function SceneReadyToUpload() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={95} />
      <PhoneShape x={128} y={82} />
      <CheeseWedge x={128} y={60} />
      <CloudShape x={225} y={45} scale={0.6} />
    </>,
  );
}

/** Pip riding a train along the rails — the chapter-opening hero image
 * pairing the "what you'll learn" summary with the railway framing the
 * whole chapter uses, before the story proper (and the reason for it)
 * even begins. */
export function ScenePipOnTrain() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <TrainCar x={150} y={88} />
      <Mouse x={150} y={70} scale={0.65} />
    </>,
  );
}

export function SceneFallingAsleep() {
  return frame(
    <>
      <GroundLine />
      <Bed x={150} y={95} />
      <Mouse x={150} y={80} scale={0.75} />
      <ZzzMarks x={178} y={62} />
    </>,
  );
}

export function SceneWakingAtStation() {
  return frame(
    <>
      <RailLine x1={5} y1={100} x2={295} y2={100} />
      <StationBuilding x={65} y={100} scale={0.85} />
      <StationBuilding x={230} y={100} scale={0.95} />
      <RailLine x1={230} y1={100} x2={230} y2={40} />
      <StationBuilding x={230} y={40} scale={0.6} />
      <TrainCar x={195} y={88} />
      <Mouse x={130} y={100} scale={0.9} />
    </>,
  );
}

// --------------------- "Finding the Board" scenes ---------------------

export function SceneOpeningBookmark() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={95} />
      <PhoneShape x={138} y={82} />
      <Bubble x={150} y={38} text="cheeselovers.com" />
    </>,
  );
}

export function SceneUrlPieces() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={95} />
      <PhoneShape x={128} y={82} />
      <Bubble x={165} y={35} text="cheeselovers.com/upload" width={110} />
    </>,
  );
}

export function SceneRightToLeft() {
  return frame(
    <>
      <GroundLine />
      <rect x={90} y={28} width={150} height={72} rx={6} fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth={1.4} strokeDasharray="4 4" />
      <text x={100} y={42} fontSize="8.5" fill={INK} opacity={0.6}>
        .com
      </text>
      <rect x={125} y={54} width={90} height={34} rx={5} fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <text x={170} y={75} textAnchor="middle" fontSize="8.5" fill={INK} fontWeight={600}>
        cheeselovers
      </text>
      <Mouse x={105} y={100} scale={0.85} />
    </>,
  );
}

export function SceneNameVsNumber() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={95} />
      <PhoneShape x={128} y={82} />
      <text x={150} y={38} textAnchor="middle" fontSize="8.5" fill={INK} fontWeight={600}>
        cheeselovers.com
      </text>
      <text x={150} y={53} textAnchor="middle" fontSize="8" fill={INK} opacity={0.35} style={{ textDecoration: "line-through" }}>
        203.0.113.50
      </text>
    </>,
  );
}

export function SceneStubResolver() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={95} />
      <PhoneShape x={138} y={82} />
      <rect x={131} y={75} width={14} height={14} rx={2} fill="none" stroke={SKY} strokeWidth={1.3} strokeDasharray="2 2" />
    </>,
  );
}

export function SceneNobodyHomeYet() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={95} />
      <PhoneShape x={138} y={82} />
      <text x={138} y={45} textAnchor="middle" fontSize="16" fill={ACCENT} fontWeight={700}>
        ?
      </text>
    </>,
  );
}

export function SceneWhoToAskFirst() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={95} />
      <PhoneShape x={128} y={82} />
      <Notebook x={178} y={78} />
    </>,
  );
}

export function SceneOneQuestionOneAnswer() {
  return frame(
    <>
      <GroundLine />
      <PhoneShape x={95} y={90} />
      <Building x={215} y={100} />
      <line x1={107} y1={86} x2={195} y2={86} stroke={INK} strokeOpacity="0.3" strokeWidth={1.4} strokeDasharray="3 3" />
    </>,
  );
}

export function SceneStartingFromTop() {
  return frame(
    <>
      <GroundLine />
      <Building x={65} y={100} />
      <Building x={155} y={100} />
      <Building x={245} y={100} />
      <path d="M82 80 Q110 55 138 80" stroke={INK} strokeOpacity="0.3" strokeWidth={1.3} fill="none" strokeDasharray="3 3" />
      <path d="M172 80 Q200 55 228 80" stroke={INK} strokeOpacity="0.3" strokeWidth={1.3} fill="none" strokeDasharray="3 3" />
    </>,
  );
}

export function SceneDeadEnd() {
  return frame(
    <>
      <GroundLine />
      <Building x={165} y={100} />
      <text x={165} y={52} textAnchor="middle" fontSize="18" fill="#c0392b" fontWeight={700}>
        ✕
      </text>
    </>,
  );
}

export function SceneTwoCounters() {
  return frame(
    <>
      <GroundLine />
      <Building x={125} y={100} />
      <Building x={215} y={100} />
    </>,
  );
}

export function SceneRecordBook() {
  return frame(
    <>
      <GroundLine />
      <RecordBook x={165} y={80} />
    </>,
  );
}

export function SceneWritingItDown() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={110} y={95} />
      <PhoneShape x={138} y={82} />
      <Bubble x={150} y={36} text="203.0.113.50" />
    </>,
  );
}

export function SceneHowLongToRemember() {
  return frame(
    <>
      <GroundLine />
      <Notebook x={130} y={80} />
      <ClockFace x={180} y={62} />
    </>,
  );
}

export function SceneHandingOff() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={100} y={95} />
      <PhoneShape x={128} y={82} />
      <CloudShape x={225} y={45} scale={0.6} />
    </>,
  );
}

// ------------------------- "Leaving the House" scenes (v2) -------------------------

export function SceneLogbook() {
  return frame(
    <>
      <GroundLine />
      <Gate x={140} y={80} />
      <RecordBook x={220} y={68} />
    </>,
  );
}

export function SceneCheckpointReply() {
  return frame(
    <>
      <GroundLine />
      <CloudShape x={80} y={40} scale={0.5} />
      <Gate x={190} y={85} />
      <path
        d="M110 55 Q150 60 170 78"
        fill="none"
        stroke={SAGE}
        strokeWidth="1.8"
        strokeDasharray="4 4"
        markerEnd="url(#leaving-house-reply-arrow)"
      />
      <defs>
        <marker id="leaving-house-reply-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SAGE} />
        </marker>
      </defs>
    </>,
  );
}

// --------------------- "The Short Way Home" scenes (v2) ---------------------

export function SceneDadRequest() {
  return frame(
    <>
      <GroundLine />
      <Mouse x={95} y={95} scale={1.25} color={INK} />
      <Mouse x={175} y={95} />
      <PhoneShape x={195} y={80} />
      <CheeseWedge x={195} y={58} />
    </>,
  );
}

export function SceneReassembling() {
  return frame(
    <>
      <GroundLine />
      <BoardShape x={150} y={65} whole={false} />
    </>,
  );
}

export function SceneBoardPosted() {
  return frame(
    <>
      <GroundLine />
      <BoardShape x={150} y={65} whole />
      <Mouse x={90} y={98} scale={0.85} />
    </>,
  );
}

// -------- "The Short Way Home" (dream/train-world) scenes (v3) --------

/** A small crate — the photo, boxed up into one labeled parcel among many
 * once it's sliced into packets for the trip. */
function Crate({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-8" y="-8" width="16" height="16" fill={PAPER} stroke={INK} strokeWidth="1.3" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
      <line x1="0" y1="-8" x2="0" y2="8" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
    </g>
  );
}

/** A small station announcement horn — the broadcast-and-reply moment
 * (ARP) happening out loud over the platform speakers. */
function Megaphone({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-7 -4 L4 -9 L4 9 L-7 4 Z" fill={ACCENT} fillOpacity="0.4" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 -9 L13 -12 L13 12 L4 9 Z" fill={ACCENT} fillOpacity="0.2" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </g>
  );
}

export function SceneAtPhoneStation() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={90} y={100} scale={0.9} />
      <Building x={225} y={100} />
      <Mouse x={155} y={100} scale={0.85} />
    </>,
  );
}

export function SceneStationMap() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={235} y={100} scale={0.8} />
      <Mouse x={140} y={100} scale={0.85} />
      <Notebook x={185} y={70} />
    </>,
  );
}

export function SceneCargoSlicing() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={90} y={100} scale={0.85} />
      <Mouse x={150} y={100} scale={0.85} />
      <Crate x={195} y={78} />
      <Crate x={215} y={70} />
      <Crate x={210} y={90} />
    </>,
  );
}

export function SceneCheckingSameLine() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={80} y={100} scale={0.8} />
      <StationBuilding x={225} y={100} scale={0.8} />
      <Mouse x={150} y={100} scale={0.85} />
      <Bubble x={150} y={50} text="Same line!" width={72} />
    </>,
  );
}

export function SceneStationAnnouncement() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={225} y={100} scale={0.85} />
      <Mouse x={125} y={100} scale={0.85} />
      <Megaphone x={165} y={80} />
    </>,
  );
}

export function SceneJunctionSwitch() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={150} y2={100} />
      <RailLine x1={150} y1={100} x2={280} y2={62} />
      <RailLine x1={150} y1={100} x2={280} y2={100} />
      <Mouse x={105} y={100} scale={0.8} />
      <TrainCar x={195} y={90} />
    </>,
  );
}

export function SceneArrivalAtDadStation() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={225} y={100} scale={0.95} />
      <TrainCar x={150} y={88} />
      <Mouse x={95} y={100} scale={0.85} />
    </>,
  );
}

/** Pip boarding the train alongside the crates — the moment the "package
 * traveling through the network" analogy stops being something Pip only
 * watches and becomes something he rides along with. */
export function ScenePipBoardsTrain() {
  return frame(
    <>
      <RailLine x1={10} y1={100} x2={290} y2={100} />
      <StationBuilding x={230} y={100} scale={0.85} />
      <TrainCar x={150} y={88} />
      <Mouse x={110} y={100} scale={0.85} />
    </>,
  );
}
