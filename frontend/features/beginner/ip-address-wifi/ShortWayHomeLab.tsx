"use client";

import { useState } from "react";
import { Slider } from "@/components/Slider";
import { StatCard } from "@/components/StatCard";
import { Term } from "@/components/Term";
import { ShortWayHomeWalkthrough } from "./ShortWayHomeWalkthrough";
import { LanMap } from "./LanMap";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, clampOctet, findConflicts, formatIp, type Device } from "./network";
import type { ChapterId } from "./IpAddressWifiPlayground";

export function ShortWayHomeLab({
  onNavigateToChapter,
}: {
  onNavigateToChapter?: (id: ChapterId) => void;
}) {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [devices, setDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const [fromId, setFromId] = useState("phone");
  const [toId, setToId] = useState("pc");
  const packet = usePacketSend();

  const conflictIds = findConflicts(devices);
  const sendable = devices.filter((d) => d.kind !== "router");

  const setOctet = (id: string, n: number) =>
    setDevices((ds) => ds.map((d) => (d.id === id ? { ...d, lastOctet: clampOctet(n) } : d)));

  const resetScenario = () => {
    setDevices(DEFAULT_DEVICES);
    packet.reset();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Every device needs its own <Term id="ip-address">IP address</Term> to be reachable on
          the network — give two devices the same one and neither can receive messages reliably.
        </p>
        <ShortWayHomeWalkthrough
          onComplete={() => {
            setWalkthroughComplete(true);
            onNavigateToChapter?.("momo-online");
          }}
        />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Same idea, now with full controls. Drag any address onto another device&rsquo;s to
            create a conflict, then send a message and watch it happen.
          </p>
          <div className="grid md:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              {sendable.map((d) => (
                <Slider
                  key={d.id}
                  label={d.label}
                  value={d.lastOctet}
                  min={2}
                  max={254}
                  step={1}
                  onChange={(n) => setOctet(d.id, n)}
                  format={formatIp}
                />
              ))}

              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                <div className="flex gap-2 text-sm">
                  <select
                    value={fromId}
                    onChange={(e) => setFromId(e.target.value)}
                    className="flex-1 rounded border border-neutral-300 px-2 py-1"
                  >
                    {sendable.map((d) => (
                      <option key={d.id} value={d.id}>
                        From {d.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="flex-1 rounded border border-neutral-300 px-2 py-1"
                  >
                    {sendable.map((d) => (
                      <option key={d.id} value={d.id}>
                        To {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => packet.send(fromId, devices.find((d) => d.id === toId)!.lastOctet)}
                  className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
                >
                  Who has that address?
                </button>
              </div>

              <StatCard
                label="Conflicts"
                value={conflictIds.size === 0 ? "None" : `${conflictIds.size} devices`}
                tone={conflictIds.size === 0 ? "good" : "warn"}
              />

              <button
                type="button"
                onClick={resetScenario}
                className="text-xs text-neutral-500 hover:text-neutral-800"
              >
                ↺ New devices
              </button>
            </div>

            <LanMap devices={devices} conflictIds={conflictIds} packet={packet.packet} showMac />
          </div>
        </div>
      )}
    </div>
  );
}
