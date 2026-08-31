"use client";

import { useState } from "react";
import { Slider } from "@/components/Slider";
import { StatCard } from "@/components/StatCard";
import { Term } from "@/components/Term";
import { HandshakeSequence, type HandshakeStep } from "@/components/HandshakeSequence";
import { DhcpWalkthrough } from "./DhcpWalkthrough";
import { LanMap } from "./LanMap";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, clampOctet, findConflicts, formatIp, type Device } from "./network";

const DORA_STEPS: HandshakeStep[] = [
  { from: "left", label: "DHCP Discover", detail: "“Is anyone offering an address?” (broadcast)" },
  { from: "right", label: "DHCP Offer", detail: "“You can have 192.168.1.20”" },
  { from: "left", label: "DHCP Request", detail: "“I'll take that one”" },
  { from: "right", label: "DHCP Ack", detail: "Address leased, for a limited time" },
];

export function DhcpLab() {
  const [walkthroughComplete, setWalkthroughComplete] = useState(false);
  const [doraStep, setDoraStep] = useState(0);
  const [devices, setDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const packet = usePacketSend();

  const conflictIds = findConflicts(devices);
  const sendable = devices.filter((d) => d.kind !== "router");

  const setOctet = (id: string, n: number) =>
    setDevices((ds) => ds.map((d) => (d.id === id ? { ...d, lastOctet: clampOctet(n) } : d)));

  const resetScenario = () => {
    setDevices(DEFAULT_DEVICES);
    packet.reset();
    setDoraStep(0);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Every device needs its own <Term id="ip-address">IP address</Term> to be reachable on
          the network — give two devices the same one and neither can receive messages reliably.
        </p>
        <DhcpWalkthrough onComplete={() => setWalkthroughComplete(true)} />
      </div>

      {walkthroughComplete && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Replay Momo&rsquo;s DHCP handshake, or drag any address onto another device&rsquo;s to
            create a conflict and send a message to watch it happen.
          </p>
          <div className="grid md:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setDoraStep((s) => Math.min(DORA_STEPS.length, s + 1))}
                  disabled={doraStep >= DORA_STEPS.length}
                  className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
                >
                  {doraStep === 0
                    ? "Start DORA"
                    : doraStep >= DORA_STEPS.length
                      ? "Done"
                      : `Next: ${DORA_STEPS[doraStep].label}`}
                </button>
                <button
                  type="button"
                  onClick={() => setDoraStep(0)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  ↺ Replay
                </button>
              </div>

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

              <button
                type="button"
                onClick={() => packet.send("pc", devices.find((d) => d.id === "iot")!.lastOctet)}
                className="w-full px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
              >
                Who has that address?
              </button>

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

            <div className="space-y-4">
              <HandshakeSequence leftLabel="Momo" rightLabel="Router" steps={DORA_STEPS} currentStep={doraStep} />
              <LanMap devices={devices} conflictIds={conflictIds} packet={packet.packet} showMac />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
