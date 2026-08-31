export type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";

export interface DnsRecord {
  domain: string;
  type: RecordType;
  value: string;
}

/** A tiny fake zone — just enough domains and record types to demonstrate
 * every lookup this chapter covers, including a CNAME that has to be
 * chased to a second domain before an address comes back. */
export const DNS_RECORDS: DnsRecord[] = [
  { domain: "example.com", type: "A", value: "93.184.216.34" },
  { domain: "example.com", type: "AAAA", value: "2606:2800:220:1:248:1893:25c8:1946" },
  { domain: "example.com", type: "MX", value: "mail.example.com (priority 10)" },
  { domain: "example.com", type: "NS", value: "ns-1.awsdns-01.org" },
  { domain: "example.com", type: "TXT", value: "v=spf1 include:_spf.example.com ~all" },
  { domain: "shop.example.com", type: "CNAME", value: "example.com" },
];

/** Every distinct domain name the fake zone has any record for, in first-
 * seen order — for building a domain picker without listing the same name
 * once per record type. */
export const DOMAIN_NAMES: string[] = Array.from(new Set(DNS_RECORDS.map((r) => r.domain)));

export function findRecord(domain: string, type: RecordType): DnsRecord | undefined {
  return DNS_RECORDS.find((r) => r.domain === domain && r.type === type);
}

/** The plain A-record address for a domain, ignoring any CNAME — used
 * wherever a step just wants "the IP behind this exact name," as opposed
 * to `resolveHost`, which follows aliases the way a real lookup would. */
export function lookupRecord(domain: string): string | undefined {
  return findRecord(domain, "A")?.value;
}

export interface ResolveResult {
  /** Every domain name visited while resolving, in order — length 1 unless
   * a CNAME redirected the lookup partway through. */
  chain: string[];
  ip?: string;
}

/** Follows CNAME records, if any, until reaching a domain with its own A
 * record — mirroring how a real resolver quietly chases an alias before
 * ever getting to an address. Capped at a few hops so a misconfigured,
 * self-referencing CNAME can't loop forever. */
export function resolveHost(domain: string): ResolveResult {
  const chain = [domain];
  let current = domain;
  for (let i = 0; i < 5; i++) {
    const cname = findRecord(current, "CNAME");
    if (!cname) break;
    current = cname.value;
    chain.push(current);
  }
  return { chain, ip: findRecord(current, "A")?.value };
}

export const DEFAULT_TTL_TICKS = 4;

export interface CacheEntry {
  ip: string;
  /** The tick this entry was cached at — ticks stand in for time passing,
   * so TTL expiry can be demonstrated by advancing a counter rather than
   * waiting on a real clock. */
  cachedAtTick: number;
  ttlTicks: number;
}

/** Whether a cached answer is still usable at the given tick — false once
 * its TTL has elapsed, meaning the resolver must ask the authoritative
 * server again instead of trusting what it already has. */
export function isCacheValid(entry: CacheEntry | undefined, nowTick: number): boolean {
  if (!entry) return false;
  return nowTick - entry.cachedAtTick < entry.ttlTicks;
}
