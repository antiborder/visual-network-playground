"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { Slider } from "@/components/Slider";
import { AddressRangeStrip } from "./AddressRangeStrip";
import { SubnetExplorer } from "./SubnetExplorer";
import { LanMap } from "./LanMap";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, MAX_PREFIX_LENGTH, MIN_PREFIX_LENGTH, formatIp, toBits, type Device } from "./network";
import {
  SceneNeighborhoodMap,
  SceneFasterIdea,
  SceneSameCheckLocal,
  SceneArpBroadcast,
  SceneSwitchDecision,
  SceneDelivered,
} from "./StorybookScenes";

/** Chapter 2: Pip realizes Dad's PC is on the very same LAN, so the same
 * cheese photo can take a much shorter route — following
 * docs/stories/module1-unit1-chapter2.md's beats. Two Sections: the full
 * subnet/CIDR mechanism (deferred here from Chapter 1's informal preview),
 * then the story itself (the formal same-subnet check, MAC address and ARP,
 * the router's internal switch choosing the LAN path, and delivery). MAC
 * address is defined here rather than in Chapter 1, since this chapter is
 * the first place a MAC address actually needs resolving. Every Step below
 * the Welcome/Wrap-up bookends carries a `story` half (illustration + pure
 * narrative text) above the unchanged technical half. */
export function ShortWayHomeWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Dividing into Subnets" sandbox ---
  const [addrDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const [prefixLength, setPrefixLength] = useState(24);

  // --- "The Short Way Home" sandbox ---
  const [arpDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const arpPacket = usePacketSend();

  interface Step {
    section: string;
    title: string;
    story?: { text: string; illustration: ReactNode };
    body: ReactNode;
    visual: ReactNode;
    controls?: ReactNode;
    onAdvance?: () => void;
    resetAction?: () => void;
  }

  const steps: Step[] = [
    // ----------------------------- Welcome ---------------------------
    {
      section: "Welcome",
      title: "What you learn from this chapter",
      body: (
        <div className="space-y-3">
          <p>
            Pip&rsquo;s cheese photo made it all the way to a website out on the internet in
            Chapter 1 — the long way. This time, Pip wants to save the same photo onto Dad&rsquo;s
            PC down the hall.
          </p>
          <p>He discovers a much shorter route exists when the destination never left the house to begin with.</p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Dividing into Subnets</li>
            <li>The Short Way Home</li>
          </ol>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: this chapter first explains exactly how a device tells &ldquo;same
          house&rdquo; from &ldquo;somewhere else,&rdquo; then follows Pip&rsquo;s photo on the
          short route to Dad&rsquo;s shared folder — no gateway, no provider, no ocean required.
        </p>
      ),
      visual: <LanMap devices={addrDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    // ---------------------- 1. Dividing into Subnets -------------------
    {
      section: "1. Dividing into Subnets",
      title: "Why divide a network into subnets?",
      story: {
        text: "Pip strolls past, taking in the neighborhood.\nPip: \"Every house on our street has its own little spot in the neighborhood. I bet every device needs a spot like that too.\"\nA neighborhood carved out of a bigger map, just for these houses — that's a subnet.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="subnet-mask">subnet</Term> is a smaller network carved out of a larger
            address range.
          </p>
          <p>
            Splitting a network into subnets keeps broadcast messages (like the device-discovery
            broadcast coming up soon) from reaching every device on a huge network at once, lets
            different parts of an organization manage their own address ranges independently, and
            groups related devices together on purpose.
          </p>
        </div>
      ),
      visual: <LanMap devices={addrDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "1. Dividing into Subnets",
      title: "What is a network address?",
      story: {
        text: "Pip eyes the very first address on the street.\nPip: \"Funny — nobody actually lives there. It just names the whole block.\"\nThat unclaimed first address, naming the block itself, is the network address.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every subnet reserves its very <strong>first</strong> address as the{" "}
            <Term id="subnet-mask">network address</Term> — it names the subnet itself, rather
            than any one device inside it, so it&rsquo;s never assigned to a device.
          </p>
          <p>
            Routers use it to refer to the whole subnet at once, for example when deciding where
            to send a packet.
          </p>
        </div>
      ),
      visual: <AddressRangeStrip start={64} end={71} emphasize="network" />,
    },
    {
      section: "1. Dividing into Subnets",
      title: "What is a broadcast address?",
      story: {
        text: "Pip: \"And the very last address on the street? That one doesn't belong to just one house either — shout there, and the whole block hears you at once.\"\nThat shout-to-everyone last address is the broadcast address.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Symmetrically, the very <strong>last</strong> address in a subnet is reserved as its
            broadcast address. A message sent there reaches every device in the subnet at once —
            exactly how the ARP question you&rsquo;ll see shortly finds a device without knowing
            which one to ask directly.
          </p>
          <p>Like the network address, it&rsquo;s never assigned to one device.</p>
        </div>
      ),
      visual: <AddressRangeStrip start={64} end={71} emphasize="broadcast" />,
    },
    {
      section: "1. Dividing into Subnets",
      title: "What is a host address?",
      story: {
        text: "Pip: \"So everything in between is just an ordinary house, ready for a family to move in.\"\nEvery other address on the block, free to move into, is a host address.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <p>
          Everything left over — between the network address and the broadcast address — is a{" "}
          <strong>host</strong> address: an ordinary, assignable address for one real device. An
          8-address block reserves 2 of them, leaving 6 usable hosts; in general, a block of N
          addresses always leaves N&minus;2 for actual devices.
        </p>
      ),
      visual: <AddressRangeStrip start={64} end={71} emphasize="host" />,
    },
    {
      section: "1. Dividing into Subnets",
      title: "Reading a subnet mask",
      story: {
        text: "Pip spots a little sign at the edge of the block.\nPip: \"Ah — that's how you'd know exactly where the neighborhood ends.\"\nThat little sign, written as a number like /24, is the subnet mask.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="subnet-mask">subnet mask</Term> marks where a subnet&rsquo;s boundary
            falls, written as a prefix length like <strong>/24</strong>: the first 24 of the
            address&rsquo;s 32 bits are the fixed network part, and the rest are free for hosts.
          </p>
          <p>
            The same idea is sometimes written as a dotted mask instead — /24 is 255.255.255.0.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-xs text-neutral-500">192.168.1.10 /24</div>
          <div className="flex gap-2">
            {[192, 168, 1, 10].map((n, octetIdx) => (
              <div key={octetIdx} className="flex gap-0.5">
                {toBits(n).map((bit, bitIdx) => {
                  const bitNumber = octetIdx * 8 + bitIdx;
                  const isNetwork = bitNumber < 24;
                  return (
                    <div
                      key={bitIdx}
                      className={`flex h-7 w-5 items-center justify-center rounded-sm font-mono text-xs font-semibold ${
                        isNetwork
                          ? "bg-cyan-100 text-cyan-800 border border-cyan-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-cyan-100 border border-cyan-300" />
              network (first 24 bits)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
              host (last 8 bits)
            </span>
          </div>
        </div>
      ),
    },
    {
      section: "1. Dividing into Subnets",
      title: "Splitting the address: network vs. host",
      story: {
        text: "Pip: \"Move that sign, and the whole block gets bigger — or smaller.\"\nSlide that boundary over, and the subnet's whole host range changes right along with it.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Move the boundary one bit and the block size changes: each extra network bit halves
            how many addresses the subnet contains (2<sup>32&minus;prefix</sup> addresses — /24
            has 256, /25 has 128, all the way down to /30&rsquo;s 4).
          </p>
          <p>
            Drag the slider to shrink the subnet and watch the network/broadcast addresses from
            the last few steps, and the number of usable hosts, change together.
          </p>
          <p>
            This is also why Pip&rsquo;s phone&rsquo;s address could take any value from 2 to 254
            by default back in Chapter 1 — with the default /24 mask, that&rsquo;s exactly this
            block&rsquo;s full host range.
          </p>
        </div>
      ),
      controls: (
        <Slider
          label="Subnet size"
          value={prefixLength}
          min={MIN_PREFIX_LENGTH}
          max={MAX_PREFIX_LENGTH}
          step={1}
          onChange={setPrefixLength}
          format={(v) => `/${v}`}
        />
      ),
      visual: (
        <SubnetExplorer
          prefixLength={prefixLength}
          sampleOctet={addrDevices.find((d) => d.id === "pc")!.lastOctet}
          devices={addrDevices.filter((d) => d.kind !== "router")}
        />
      ),
      resetAction: () => setPrefixLength(24),
    },
    {
      section: "1. Dividing into Subnets",
      title: "Same subnet, or not?",
      story: {
        text: "Pip: \"So two houses can only pop next door for a quick chat, if they're on this very same block.\"\nSame block means they can skip the router entirely — that's what being on the same subnet really buys you.",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Two devices can only talk directly if they fall in the same subnet — otherwise the
            message has to go through a router.
          </p>
          <p>
            Shrink the subnet further and watch the phone and smart bulb drop out of the
            PC&rsquo;s subnet (shown gray instead of green below), even though none of their
            addresses changed.
          </p>
          <p>
            Right now, at the default /24, Pip&rsquo;s phone and Dad&rsquo;s PC are both
            comfortably inside the same subnet — the very thing that makes the short way possible.
          </p>
        </div>
      ),
      controls: (
        <Slider
          label="Subnet size"
          value={prefixLength}
          min={MIN_PREFIX_LENGTH}
          max={MAX_PREFIX_LENGTH}
          step={1}
          onChange={setPrefixLength}
          format={(v) => `/${v}`}
        />
      ),
      visual: (
        <SubnetExplorer
          prefixLength={prefixLength}
          sampleOctet={addrDevices.find((d) => d.id === "pc")!.lastOctet}
          devices={addrDevices.filter((d) => d.kind !== "router")}
        />
      ),
      resetAction: () => setPrefixLength(24),
    },
    // ---------------------- 2. The Short Way Home -----------------------
    {
      section: "2. The Short Way Home",
      title: "A faster idea",
      story: {
        text: "Pip's cheese photo already made it to the Cheese-Lovers' Board; now he wants the full-resolution original saved straight onto Dad's PC.\nPip: \"If I send this over chat, it'll take the long way out to some cloud server. But Dad's PC is right down the hall, on this very same home network — his shared folder could have it in an instant!\"\nThis time, the destination lives inside the very same home network.",
        illustration: <SceneFasterIdea />,
      },
      body: (
        <p>
          Does the photo really need to repeat that whole trip through the provider and back? The
          next few steps find out.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "2. The Short Way Home",
      title: "The same check, a different answer",
      story: {
        text: "Pip's phone runs the very same check as before, only this time with a different destination.\nPhone: \"The address starts 192.168.1. ... and so does mine — same group, same house! This one's local. I don't need the gateway at all.\"\nSame first 24 bits, same subnet — no gateway needed this time.",
        illustration: <SceneSameCheckLocal />,
      },
      body: (
        <p>
          With a /24 mask, both devices share the first 24 bits — exactly the subnet check from
          Section 1.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "2. The Short Way Home",
      title: "Find the physical address",
      story: {
        text: "Phone: \"Broadcast! Does anyone have IP address 192.168.1.15? Tell me your MAC address!\"\nDad's PC: \"That's me! My MAC address is AA:BB:CC:11:22:33.\"\nThat broadcast-and-reply exchange, hunting down a MAC address, is called ARP.",
        illustration: <SceneArpBroadcast />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Knowing Dad&rsquo;s PC is on the same subnet still doesn&rsquo;t tell Pip&rsquo;s
            phone how to physically reach it — delivery on a LAN happens by{" "}
            <Term id="mac-address">MAC address</Term>, not IP address.
          </p>
          <p>
            Unlike an IP address, which the network assigns and which can change if a device
            joins a different network, a MAC address is burned in by the manufacturer and never
            changes for as long as you own the device.
          </p>
          <p>
            That&rsquo;s exactly why Pip&rsquo;s phone can&rsquo;t just guess it; it has to ask.
            This broadcast-and-reply exchange is <Term id="arp">ARP</Term>.
          </p>
        </div>
      ),
      controls: (
        <button
          type="button"
          onClick={() => arpPacket.send("phone", arpDevices.find((d) => d.id === "pc")!.lastOctet)}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Who has {formatIp(arpDevices.find((d) => d.id === "pc")!.lastOctet)}?
        </button>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={arpPacket.packet} showMac />,
      resetAction: arpPacket.reset,
    },
    {
      section: "2. The Short Way Home",
      title: "The switch's quick decision",
      story: {
        text: "Switch: \"Headed to a website? That's outbound — off to the provider's network, with a NAT/NAPT address swap.\"\nSwitch: \"But Dad's PC's MAC address? That's wired port 2 — no provider, no NAT, straight there.\"\nSomewhere inside that router, a tiny switch is the one actually making this call.",
        illustration: <SceneSwitchDecision />,
      },
      body: (
        <p>
          Every device&rsquo;s traffic actually passes through a small switch built into the
          router, deciding between <Term id="nat">NAT</Term>/the wider internet (as in Chapter 1)
          and a direct local delivery. How the switch actually learns which port each device is
          on gets its own full chapter later in this app.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "2. The Short Way Home",
      title: "Delivered — no ocean required",
      story: {
        text: "A satisfying little click, and the transfer is complete.\nDad: \"Ooh, Pip! You put a photo in the shared folder. It came through so fast — and full size, too!\"\nNo provider, no NAT translation — just a straight hop across the LAN.",
        illustration: <SceneDelivered />,
      },
      body: (
        <p>
          The full-resolution photo lands in Dad&rsquo;s shared folder almost instantly — it
          never left the house, never touched the provider&rsquo;s network, and never needed a
          NAT translation at all.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A subnet mask (like /24) splits an address into a network part and a host part — a subnet&rsquo;s first address is its network address, its last its broadcast address, and everything in between is an assignable host.</li>
            <li>Two devices can only talk directly if the network part of their addresses matches — otherwise the message needs a router.</li>
            <li>A <Term id="mac-address">MAC address</Term> is a fixed, factory-burned ID — unlike an IP address, which the network assigns. <Term id="arp">ARP</Term> finds a device&rsquo;s MAC address by broadcasting the question, and the router&rsquo;s switch decides whether traffic needs NAT at all.</li>
            <li>Same photo, same devices, a completely different route — because the destination never left the LAN.</li>
          </ul>
          <p>
            A free-play version of this network is now unlocked below — add devices, change
            addresses, and cause (or fix) conflicts yourself.
          </p>
        </div>
      ),
      visual: undefined,
    },
  ];

  const total = steps.length;
  const current = steps[step];
  const isLast = step === total - 1;
  const isFirst = step === 0;

  const goNext = () => {
    current.onAdvance?.();
    if (isLast) {
      onComplete();
      return;
    }
    setStep((s) => Math.min(total - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="rounded-lg bg-storybook-paper p-5 space-y-4 font-storybook-body text-storybook-ink">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
        <span className="text-xs uppercase tracking-wide text-storybook-accent-dark sm:flex-1">{current.section}</span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={goBack}
            disabled={isFirst}
            className="px-3 py-1.5 rounded-md bg-white/70 hover:bg-white disabled:opacity-40 text-sm text-storybook-ink border border-storybook-ink/10"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
        <span className="text-xs text-storybook-ink/60 sm:flex-1 sm:text-right">
          Step {step + 1} of {total}
        </span>
      </div>

      <SegmentedProgressBar
        sections={steps.map((s) => s.section)}
        currentStep={step}
        onSelectStep={setStep}
        proportional
      />

      <div className="space-y-4">
        {current.story && (
          <div className="space-y-3 pb-4 mb-1 border-b border-storybook-ink/15">
            {current.story.illustration}
            <StoryText text={current.story.text} />
          </div>
        )}

        <h3 className="text-2xl font-storybook-heading text-storybook-accent">{current.title}</h3>
        <div className="text-sm text-storybook-ink/90 leading-relaxed space-y-3">{current.body}</div>

        {current.controls && (
          <div className="rounded-md border border-storybook-ink/10 bg-white/50 p-3 flex flex-col items-start gap-2">
            {current.controls}
            {current.resetAction && (
              <button
                onClick={current.resetAction}
                className="text-xs text-storybook-ink/60 hover:text-storybook-ink"
              >
                ↺ Undo this step
              </button>
            )}
          </div>
        )}

        {current.visual && <div className="space-y-3">{current.visual}</div>}
      </div>
    </div>
  );
}
