"use client";

import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { DnsWalkthrough } from "./DnsWalkthrough";
import { DnsLookupChain } from "./DnsLookupChain";
import {
  DEFAULT_TTL_TICKS,
  DOMAIN_NAMES,
  findRecord,
  isCacheValid,
  resolveHost,
  type CacheEntry,
  type RecordType,
} from "./dns";

const FULL_CHAIN = ["Your Device", "Recursive Resolver", "Root", "TLD", "Authoritative"];
const CACHE_HIT_CHAIN = ["Your Device", "Recursive Resolver"];
const RECORD_TYPES: RecordType[] = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];

export function DnsLab() {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [domain, setDomain] = useState(DOMAIN_NAMES[0]);
  const [recordType, setRecordType] = useState<RecordType>("A");
  const [nowTick, setNowTick] = useState(0);
  const [cache, setCache] = useState<Record<string, CacheEntry>>({});
  const [lookupPath, setLookupPath] = useState<string[]>(FULL_CHAIN);
  const [visitedCount, setVisitedCount] = useState(0);
  const [resolved, setResolved] = useState(false);

  const isAddressType = recordType === "A" || recordType === "AAAA";
  const entry = cache[domain];
  const cacheIsValid = isCacheValid(entry, nowTick);

  const startLookup = () => {
    const path = isCacheValid(cache[domain], nowTick) ? CACHE_HIT_CHAIN : FULL_CHAIN;
    setLookupPath(path);
    setVisitedCount(1);
    setResolved(false);
  };

  const nextHop = () => {
    setVisitedCount((v) => {
      const next = Math.min(lookupPath.length, v + 1);
      if (next === lookupPath.length) {
        setResolved(true);
        if (lookupPath.length > 2) {
          const ip = recordType === "AAAA" ? findRecord(domain, "AAAA")?.value : resolveHost(domain).ip;
          if (ip) setCache((c) => ({ ...c, [domain]: { ip, cachedAtTick: nowTick, ttlTicks: DEFAULT_TTL_TICKS } }));
        }
      }
      return next;
    });
  };

  const reset = () => {
    setNowTick(0);
    setCache({});
    setVisitedCount(0);
    setResolved(false);
  };

  const rawRecord = !isAddressType ? findRecord(domain, recordType) : undefined;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          DNS turns a name into an address by walking a chain of servers — unless a cache already
          has the answer and hasn&rsquo;t expired — and holds several other kinds of record besides.
        </p>
        <DnsWalkthrough onComplete={() => setWalkthroughComplete(true)} />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Pick a domain and a record type. A/AAAA lookups walk the chain and use the cache;
            other record types are shown directly, the way a mail server or verification tool
            would see them.
          </p>
          <div className="grid md:grid-cols-[280px_1fr] gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {DOMAIN_NAMES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDomain(d);
                      setVisitedCount(0);
                      setResolved(false);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-mono ${
                      domain === d ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <select
                value={recordType}
                onChange={(e) => {
                  setRecordType(e.target.value as RecordType);
                  setVisitedCount(0);
                  setResolved(false);
                }}
                className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t} record
                  </option>
                ))}
              </select>

              {isAddressType ? (
                <>
                  <button
                    type="button"
                    onClick={visitedCount === 0 ? startLookup : nextHop}
                    disabled={resolved}
                    className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
                  >
                    {visitedCount === 0 ? "Look up" : resolved ? "Resolved" : `Next hop: ${lookupPath[visitedCount]}`}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNowTick((t) => t + 1)}
                    className="w-full px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-sm text-neutral-700"
                  >
                    Advance time (+1 tick)
                  </button>

                  <StatCard label="Now" value={`tick ${nowTick}`} />
                  <StatCard
                    label={`Cache for ${domain} (${recordType})`}
                    value={entry ? (cacheIsValid ? `valid (cached at ${entry.cachedAtTick})` : "expired") : "empty"}
                    tone={entry && cacheIsValid ? "good" : "default"}
                  />
                </>
              ) : (
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs text-neutral-700 break-all">
                  {rawRecord ? `${domain} ${recordType} → ${rawRecord.value}` : `No ${recordType} record for ${domain}`}
                </div>
              )}

              <button type="button" onClick={reset} className="text-xs text-neutral-500 hover:text-neutral-800">
                ↺ Clear cache & reset time
              </button>
            </div>

            {isAddressType ? (
              <DnsLookupChain path={lookupPath} visitedCount={visitedCount} resolved={resolved} answer={cache[domain]?.ip} />
            ) : (
              <div className="text-sm text-neutral-500 self-start">
                {recordType} records aren&rsquo;t resolved through the recursive chain the same way — they&rsquo;re
                just looked up directly from the authoritative answer.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
