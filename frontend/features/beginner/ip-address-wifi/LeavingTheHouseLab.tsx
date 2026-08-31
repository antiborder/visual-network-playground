"use client";

import { useState } from "react";
import { Term } from "@/components/Term";
import { LeavingTheHouseWalkthrough } from "./LeavingTheHouseWalkthrough";
import { GatewayLayers, type NetworkLayer } from "./GatewayLayers";
import { NaptTable, type NaptRow } from "./NaptTable";
import type { ChapterId } from "./IpAddressWifiPlayground";

const HOPS: NetworkLayer[] = ["house", "isp", "internet"];

const DESTINATIONS = [
  { label: "Cheese-Lovers' Board", address: "203.0.113.50" },
  { label: "A public DNS server", address: "8.8.8.8" },
  { label: "A weather site", address: "192.0.2.15" },
] as const;

export function LeavingTheHouseLab({
  onNavigateToChapter,
}: {
  onNavigateToChapter?: (id: ChapterId) => void;
}) {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [destIdx, setDestIdx] = useState(0);
  const [hopIndex, setHopIndex] = useState(0);
  const [rows, setRows] = useState<NaptRow[]>([]);

  const atLastHop = hopIndex >= HOPS.length - 1;

  const advance = () => {
    if (atLastHop) return;
    const next = hopIndex + 1;
    setHopIndex(next);
    if (HOPS[next] === "internet") {
      const port = 40000 + rows.length + 1;
      setRows((r) => [...r, { privateAddr: `10.64.20.5 : ${51420 + r.length}`, publicAddr: `198.51.100.7 : ${port}` }]);
    }
  };

  const resetJourney = () => setHopIndex(0);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Follow Pip&rsquo;s photo out of the house, through the provider&rsquo;s own network, and
          onto the open internet — and see how a <Term id="nat">NAT/NAPT</Term> table keeps track
          of every trip.
        </p>
        <LeavingTheHouseWalkthrough
          onComplete={() => {
            setWalkthroughComplete(true);
            onNavigateToChapter?.("short-way-home");
          }}
        />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Pick a destination, then click through each hop of the journey.
          </p>
          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {DESTINATIONS.map((d, i) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => {
                      setDestIdx(i);
                      setHopIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm text-left ${
                      destIdx === i ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {d.label}
                    <div className="text-xs opacity-80 font-mono">{d.address}</div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={advance}
                disabled={atLastHop}
                className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
              >
                {atLastHop ? "Arrived" : `Send to ${HOPS[hopIndex + 1]}`}
              </button>
              <button
                type="button"
                onClick={resetJourney}
                className="text-xs text-neutral-500 hover:text-neutral-800"
              >
                ↺ Restart this journey
              </button>
            </div>

            <div className="space-y-4">
              <GatewayLayers
                activeLayer={HOPS[hopIndex]}
                packetAddress={
                  HOPS[hopIndex] === "house"
                    ? "192.168.1.10"
                    : HOPS[hopIndex] === "isp"
                      ? "10.64.20.5"
                      : (rows[rows.length - 1]?.publicAddr ?? "198.51.100.7")
                }
              />
              {rows.length > 0 && <NaptTable rows={rows} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
