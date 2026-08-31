export type DeviceKind = "router" | "pc" | "phone" | "iot";

export interface Device {
  id: string;
  label: string;
  kind: DeviceKind;
  /** The device's last IP octet, e.g. 10 for 192.168.1.10. Kept as a
   * number (not the full dotted string) since that's the one part of the
   * address this chapter lets the user edit. */
  lastOctet: number;
  /** Fixed at manufacture time, unlike the IP address above — shown once
   * ARP is introduced to make that contrast concrete rather than asserted. */
  mac: string;
}

export const SUBNET_PREFIX = "192.168.1.";
export const MIN_OCTET = 1;
export const MAX_OCTET = 254;

/** The household cast shared by all three Chapters, addresses matching
 * docs/stories/module1-unit1-chapter1.md and chapter2.md exactly: Pip's
 * phone (.10) and Dad's PC (.15). Momo the smart bulb (.20) only becomes
 * a story character in Chapter 3, but lives in the same house throughout. */
export const DEFAULT_DEVICES: Device[] = [
  { id: "router", label: "Router", kind: "router", lastOctet: 1, mac: "AC:1F:6B:00:01:01" },
  { id: "pc", label: "PC", kind: "pc", lastOctet: 15, mac: "AA:BB:CC:11:22:33" },
  { id: "phone", label: "Phone", kind: "phone", lastOctet: 10, mac: "5C:E8:EB:44:7C:3D" },
  { id: "iot", label: "Smart bulb", kind: "iot", lastOctet: 20, mac: "B0:4E:26:8F:12:99" },
];

export const MIN_PREFIX_LENGTH = 24;
export const MAX_PREFIX_LENGTH = 30;

/** An 8-bit number as its binary digits, e.g. 10 -> ["0","0","0","0","1","0","1","0"]. */
export function toBits(n: number): string[] {
  return n.toString(2).padStart(8, "0").split("");
}

/** Number of addresses in a block of this prefix length, within the last
 * octet (this app only ever varies the last octet, so every prefix length
 * discussed is 24-30 — subdividing that one octet rather than modeling a
 * full 32-bit mask). */
export function blockSizeForPrefix(prefixLength: number): number {
  return 2 ** (32 - prefixLength);
}

/** The last octet of this block's network address — the "block start" that
 * identifies the subnet itself, not any host in it. */
export function networkOctetForPrefix(lastOctet: number, prefixLength: number): number {
  const blockSize = blockSizeForPrefix(prefixLength);
  return Math.floor(lastOctet / blockSize) * blockSize;
}

/** The last octet of this block's broadcast address — reserved for "every
 * host in this subnet at once", never assignable to one device. */
export function broadcastOctetForPrefix(lastOctet: number, prefixLength: number): number {
  return networkOctetForPrefix(lastOctet, prefixLength) + blockSizeForPrefix(prefixLength) - 1;
}

/** Addresses left over for actual devices once the network and broadcast
 * addresses are reserved. */
export function usableHostCount(prefixLength: number): number {
  return Math.max(0, blockSizeForPrefix(prefixLength) - 2);
}

export function isSameSubnet(aOctet: number, bOctet: number, prefixLength: number): boolean {
  return networkOctetForPrefix(aOctet, prefixLength) === networkOctetForPrefix(bOctet, prefixLength);
}

/** RFC1918: the three private-use IPv4 ranges, decided entirely by the
 * first two octets. Unlike everything else in this file, this isn't
 * specific to the 192.168.1.x LAN this chapter simulates — it's used to
 * contrast that LAN's own address against a public one (e.g. 8.8.8.8). */
export function isPrivateIpv4(firstOctet: number, secondOctet: number): boolean {
  if (firstOctet === 10) return true;
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true;
  if (firstOctet === 192 && secondOctet === 168) return true;
  return false;
}

export function formatIp(lastOctet: number): string {
  return `${SUBNET_PREFIX}${lastOctet}`;
}

export function clampOctet(n: number): number {
  if (Number.isNaN(n)) return MIN_OCTET;
  return Math.min(MAX_OCTET, Math.max(MIN_OCTET, Math.round(n)));
}

/** Every non-router device currently using the given last octet — 0, 1, or
 * (in a conflict) 2+ devices. Shared by the send-animation logic (to find
 * who a packet actually reaches) and conflict detection below. */
export function devicesAtOctet(devices: Device[], lastOctet: number): Device[] {
  return devices.filter((d) => d.kind !== "router" && d.lastOctet === lastOctet);
}

/** Every device (other than the router) whose address is shared by at
 * least one other device — the set that should render as "in conflict".
 * The router itself is never included: it's the one address every device
 * already agrees on, not a device competing for one. */
export function findConflicts(devices: Device[]): Set<string> {
  const counts = new Map<number, number>();
  for (const d of devices) {
    if (d.kind === "router") continue;
    counts.set(d.lastOctet, (counts.get(d.lastOctet) ?? 0) + 1);
  }
  const conflicted = new Set<string>();
  for (const d of devices) {
    if (d.kind === "router") continue;
    if ((counts.get(d.lastOctet) ?? 0) > 1) conflicted.add(d.id);
  }
  return conflicted;
}
