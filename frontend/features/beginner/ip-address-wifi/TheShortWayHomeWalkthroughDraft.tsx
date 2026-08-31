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
  SceneDadRequest,
  SceneNeighborhoodMap,
  ScenePipsPhone,
  SceneSameCheckLocal,
  SceneArpBroadcast,
  SceneSwitchDecision,
  SceneDelivered,
} from "./StorybookScenes";

/** DRAFT — Chapter 3 "The Short Way Home" from the reordered beginner story
 * redesign (see docs/beginner-story-redesign.md and the chat that reordered
 * it). Now runs BEFORE "Leaving the House" (Chapter 4): Dad asks for a copy
 * of the cheese photo right as Pip is about to upload it to the internet
 * (Finding the Board's ending), so Pip detours to send it across the LAN to
 * Dad's PC first. Deliberately introduces the destination-agnostic concepts
 * — packet slicing, source labeling, the "is this a neighbor?" subnet check
 * — for the FIRST time here, since they now come first chronologically;
 * Chapter 4 only reviews them (with the opposite check result) instead of
 * re-teaching them. Ported from the old (soon-to-be-deleted)
 * ShortWayHomeWalkthrough.tsx, whose subnet/CIDR and ARP/switch content is
 * unchanged and still accurate — only the framing, section order, and the
 * new "Getting Ready to Send" section are new. Bodies are carried over
 * as-is for steps that are a straight port; the brand-new steps (the Dad
 * hook, and the moved-up packet-slicing/labeling/neighbor-check steps) are
 * left PENDING, matching this app's story-then-body phased workflow. */
export function TheShortWayHomeWalkthroughDraft({ onComplete }: { onComplete: () => void }) {
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
    visual?: ReactNode;
    controls?: ReactNode;
    resetAction?: () => void;
  }

  const PENDING = (
    <p className="text-storybook-ink/40 italic">(Technical explanation — not yet written.)</p>
  );

  const steps: Step[] = [
    // ----------------------------- Welcome ---------------------------
    {
      section: "Welcome",
      title: "What you learn from this chapter",
      body: (
        <div className="space-y-3">
          <p>
            Right as Pip&rsquo;s about to upload his cheese photo to the whole internet, Dad asks
            for a copy of his own. Pip realizes there&rsquo;s no need to send it the long way
            around — Dad&rsquo;s PC is right down the hall, on this very same home network.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>A Request from Dad</li>
            <li>Dividing into Subnets</li>
            <li>Getting Ready to Send</li>
            <li>The Short Way Home</li>
          </ol>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: PENDING,
    },
    // -------------------- 1. A Request from Dad -------------------
    {
      section: "1. A Request from Dad",
      title: "Dad Wants a Copy",
      story: {
        text: "Dad pokes his head in.\nDad: \"Cheese, huh? What'd you get this time? Send me a copy, would you?\"\nPip: \"Sure thing, Dad! ...actually, before I upload this to the whole internet, let me get yours over first — your PC's right down the hall anyway.\"",
        illustration: <SceneDadRequest />,
      },
      body: PENDING,
      visual: undefined,
    },
    // -------------------- 2. Dividing into Subnets -------------------
    {
      section: "2. Dividing into Subnets",
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
      section: "2. Dividing into Subnets",
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
      section: "2. Dividing into Subnets",
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
      section: "2. Dividing into Subnets",
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
      section: "2. Dividing into Subnets",
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
      section: "2. Dividing into Subnets",
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
    // -------------------- 3. Getting Ready to Send -------------------
    {
      section: "3. Getting Ready to Send",
      title: "Too Big to Send Whole",
      story: {
        text: "Pip taps to send Dad's copy.\nPhone: \"On it. But a whole photo this size won't fit through in one go — better slice it into small pieces.\"\nPip: \"Slice it? Won't that ruin the picture?\"\nPhone: \"Not if I label every piece so it knows exactly where it's going, and put it all back together on the other end.\"\nEach little piece, sliced down to a size small enough to send, is called a packet.",
        illustration: <ScenePipsPhone />,
      },
      body: PENDING,
    },
    {
      section: "3. Getting Ready to Send",
      title: "Every Piece, Labeled",
      story: {
        text: "Pip: \"So what's on the label?\"\nPhone: \"My own address, 192.168.1.10 — the very same one from Meet the Network. That way, whoever answers knows exactly where to send a reply.\"",
        illustration: <ScenePipsPhone />,
      },
      body: PENDING,
    },
    {
      section: "3. Getting Ready to Send",
      title: "Is Dad's PC a Neighbor?",
      story: {
        text: "Phone: \"Now, is Dad's PC — 192.168.1.15 — a neighbor on our own network, or somewhere else entirely?\"\nPip: \"How do you tell?\"\nPhone: \"My own address starts 192.168.1. ... and so does his. Same first 24 bits, same subnet — that's a neighbor! I don't need the gateway at all.\"",
        illustration: <SceneSameCheckLocal />,
      },
      body: PENDING,
    },
    // -------------------- 4. The Short Way Home -------------------
    {
      section: "4. The Short Way Home",
      title: "Find the Physical Address",
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
      section: "4. The Short Way Home",
      title: "The Switch's Quick Decision",
      story: {
        text: "Switch: \"Headed out to the internet? That's outbound — off to the provider's network, with an address swap along the way.\"\nSwitch: \"But Dad's PC's MAC address? That's wired port 2 — no provider, no swap, straight there.\"\nSomewhere inside that router, a tiny switch is the one actually making this call.",
        illustration: <SceneSwitchDecision />,
      },
      body: (
        <p>
          Every device&rsquo;s traffic actually passes through a small switch built into the
          router, deciding between <Term id="nat">NAT</Term>/the wider internet (as you&rsquo;ll
          see in the next chapter) and a direct local delivery. How the switch actually learns
          which port each device is on gets its own full chapter later in this app.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "4. The Short Way Home",
      title: "Delivered — the Short Way",
      story: {
        text: "A satisfying little click, and the transfer is complete.\nDad: \"Ooh, Pip! You put a photo in the shared folder. It came through so fast — and full size, too!\"\nPip: \"That's the short way home — no need to go anywhere near the internet for this one.\"",
        illustration: <SceneDelivered />,
      },
      body: (
        <p>
          The full-resolution photo lands in Dad&rsquo;s shared folder almost instantly — it
          never left the house, and never needed anything like the address-swapping trick the
          next chapter is about to introduce.
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
            <li>Before sending anything, a device slices data into labeled <Term id="packet">packets</Term> and checks whether the destination is a neighbor on its own subnet.</li>
            <li>A <Term id="mac-address">MAC address</Term> is a fixed, factory-burned ID — unlike an IP address, which the network assigns. <Term id="arp">ARP</Term> finds a device&rsquo;s MAC address by broadcasting the question, and the router&rsquo;s switch decides whether traffic needs to leave the house at all.</li>
          </ul>
          <p>
            With Dad&rsquo;s copy safely saved, Pip&rsquo;s ready to finish the real plan —
            getting that cheese photo up on the Cheese-Lovers&rsquo; Board for the whole world to
            see. That&rsquo;s a much longer trip, picked up in the next chapter.
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
