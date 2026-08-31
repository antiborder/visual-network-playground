import {
  broadcastOctetForPrefix,
  networkOctetForPrefix,
  toBits,
  usableHostCount,
} from "./network";

/** How a prefix length splits the last octet into a fixed "network" part
 * and a free "host" part — and what that means for one concrete address.
 * Pure function of props; the caller (the Walkthrough) owns the prefix
 * length slider and the sample address. */
export function SubnetExplorer({
  prefixLength,
  sampleOctet,
  devices,
}: {
  prefixLength: number;
  sampleOctet: number;
  devices: { id: string; label: string; lastOctet: number }[];
}) {
  const hostBits = 32 - prefixLength;
  const networkBitCount = 8 - hostBits;
  const bits = toBits(sampleOctet);
  const networkOctet = networkOctetForPrefix(sampleOctet, prefixLength);
  const broadcastOctet = broadcastOctetForPrefix(sampleOctet, prefixLength);
  const hostCount = usableHostCount(prefixLength);

  // The devices in this chapter all sit within a few addresses of each
  // other, so a fixed 0-255 number line would squash them into a handful
  // of indistinguishable pixels. Zoom the line to whatever span actually
  // matters right now — the current block plus every device — so "in or
  // out of this subnet" stays visible at every prefix length.
  const relevant = [networkOctet, broadcastOctet, ...devices.map((d) => d.lastOctet)];
  const rawMin = Math.min(...relevant);
  const rawMax = Math.max(...relevant);
  const padding = Math.max(3, Math.round((rawMax - rawMin) * 0.25));
  const rangeMin = Math.max(0, rawMin - padding);
  const rangeMax = Math.min(255, rawMax + padding);
  const span = Math.max(1, rangeMax - rangeMin);
  const pct = (octet: number) => ((octet - rangeMin) / span) * 100;

  return (
    <div className="w-full max-w-xl space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div>
        <div className="text-xs text-neutral-500 mb-1">
          Last octet of 192.168.1.{sampleOctet}, split at /{prefixLength}
        </div>
        <div className="flex gap-1">
          {bits.map((bit, i) => (
            <div
              key={i}
              className={`flex h-9 w-9 items-center justify-center rounded font-mono text-sm font-semibold ${
                i < networkBitCount
                  ? "bg-cyan-100 text-cyan-800 border border-cyan-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {bit}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-1.5 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-cyan-100 border border-cyan-300" />
            network bits (fixed for this subnet)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
            host bits (free to assign)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-neutral-50 p-2">
          <div className="text-xs text-neutral-500">Network address</div>
          <div className="font-mono text-neutral-800">192.168.1.{networkOctet}</div>
        </div>
        <div className="rounded-md bg-neutral-50 p-2">
          <div className="text-xs text-neutral-500">Broadcast address</div>
          <div className="font-mono text-neutral-800">192.168.1.{broadcastOctet}</div>
        </div>
        <div className="rounded-md bg-neutral-50 p-2">
          <div className="text-xs text-neutral-500">Usable hosts</div>
          <div className="font-mono text-neutral-800">{hostCount}</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-neutral-500 mb-1">Where this chapter&rsquo;s devices fall</div>
        <div className="relative h-8 rounded-full bg-neutral-100">
          <div
            className="absolute top-0 h-full rounded-full bg-cyan-200"
            style={{
              left: `${pct(networkOctet)}%`,
              width: `${pct(broadcastOctet) - pct(networkOctet)}%`,
            }}
          />
          {devices.map((d) => {
            const inside = d.lastOctet >= networkOctet && d.lastOctet <= broadcastOctet;
            return (
              <div
                key={d.id}
                title={`${d.label}: 192.168.1.${d.lastOctet}`}
                className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white ${
                  inside ? "bg-emerald-500" : "bg-neutral-400"
                }`}
                style={{ left: `${pct(d.lastOctet)}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-neutral-400 mt-0.5 font-mono">
          <span>.{rangeMin}</span>
          <span>.{rangeMax}</span>
        </div>
      </div>
    </div>
  );
}
