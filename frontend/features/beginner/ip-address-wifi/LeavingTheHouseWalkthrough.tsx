"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { GatewayLayers } from "./GatewayLayers";
import { NaptTable } from "./NaptTable";
import { DEFAULT_DEVICES, isPrivateIpv4, type Device } from "./network";
import {
  ScenePipsPhone,
  SceneCheesePhoto,
  SceneAddressCheck,
  SceneGatewayDoor,
  SceneCgnatCity,
  SceneCheckpoint,
  ScenePrivateGlobal,
  SceneOceanCrossing,
} from "./StorybookScenes";

const ADDRESS_EXAMPLES = [
  { label: "This home network", firstOctet: 192, secondOctet: 168, example: "192.168.1.10" },
  { label: "A public DNS server", firstOctet: 8, secondOctet: 8, example: "8.8.8.8" },
  { label: "Another home network", firstOctet: 10, secondOctet: 0, example: "10.0.0.5" },
] as const;

/** Chapter 1: Pip the mouse photographs his cheese and uploads it to a
 * website out on the internet — the "long way," following
 * docs/stories/module1-unit1-chapter1.md's beats. The whole chapter is one
 * continuous, chronological story from the moment Pip snaps the photo to
 * the moment it lands on the destination server: photo → hits send → self
 * -check → default gateway → CGNAT → NAT/NAPT → across the internet. Every
 * foundational vocabulary term (LAN vs internet, IP address format/math,
 * private vs global) is taught as a "zoom-in" at the point in that journey
 * where it first becomes relevant, rather than as an upfront, separate
 * lesson — so the picture-book story above the divider never has to jump
 * backward in time. (MAC address is taught in Chapter 2 instead, right
 * where ARP first needs it — this chapter's outbound story never resolves
 * a MAC address of its own.) Two Sections split the journey chronologically
 * (before Pip hits send / the journey out); see StorybookScenes.tsx for the
 * reused illustrations. */
export function LeavingTheHouseWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Getting Ready to Send" sandbox ---
  const [introDevices] = useState<Device[]>(DEFAULT_DEVICES);

  // --- "The Journey Out" sandbox ---
  const [exampleIdx, setExampleIdx] = useState(0);

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
            Meet Pip, a mouse who just photographed the perfect wedge of cheese and wants to
            share it with the world.
          </p>
          <p>
            You&rsquo;ll see what makes up the address on Pip&rsquo;s phone, and follow his photo
            the long way — out the door, through the internet provider&rsquo;s own hidden city,
            past a border checkpoint, and across the open internet.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Getting Ready to Send</li>
            <li>The Journey Out</li>
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
          In short: this chapter follows one photo, from the moment it leaves Pip&rsquo;s phone to
          the moment it lands on a website far outside this house — and traces the reply all the
          way back.
        </p>
      ),
      visual: <GatewayLayers activeLayer="house" packetAddress="192.168.1.10" />,
    },
    // --------------------- 1. Getting Ready to Send -------------------
    {
      section: "1. Getting Ready to Send",
      title: "A photo for the cheese board",
      story: {
        text: "Pip has just taken the perfect photo of his prized wedge of emmental — a website far outside this house is calling his name.\nPip: \"Let's post this to the Cheese-Lovers' Board, way out there in the city!\"\nPhone, Dad's PC, and a smart bulb, all tied to one router — together, that's his home network.",
        illustration: <SceneCheesePhoto />,
      },
      body: (
        <p>
          Here&rsquo;s Pip&rsquo;s home network: his phone, Dad&rsquo;s PC, and a smart bulb, all
          connected to one router tucked in the corner of the study. Before this photo can go
          anywhere, it first has to leave this network entirely.
        </p>
      ),
      visual: <LanMap devices={introDevices} conflictIds={new Set()} packet={null} showIp={false} />,
    },
    {
      section: "1. Getting Ready to Send",
      title: "Pip hits send",
      story: {
        text: "Pip taps Send.\nPhone: \"A whole photo won't fit through in one go — better slice it into small pieces, and label each one, so it knows exactly where to go.\"\nEach little piece, sliced down to a size small enough to send, is a packet — and the label stuck on it is his phone's IP address.",
        illustration: <ScenePipsPhone />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The phone chops the photo into small <Term id="packet">packets</Term>, each one
            carrying its own little parcel of the picture — and its own address label.
          </p>
          <p>
            That label is the phone&rsquo;s <Term id="ip-address">IP address</Term>, like{" "}
            <span className="font-mono text-neutral-800">192.168.1.10</span>: a number every
            device on a network is given so other devices know where to send data back to it —
            the same way a street address picks out one house from every other house on the
            block.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-2">
            <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12" role="img" aria-label="A house">
              <path
                d="M6 24 L24 8 L42 24"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <rect x={12} y={22} width={24} height={18} rx={2} fill="#fafafa" stroke="#a3a3a3" strokeWidth={2} />
            </svg>
            <div className="text-xs text-neutral-500">Street address</div>
            <div className="font-mono text-sm text-neutral-800">742 Evergreen Terrace</div>
            <div className="text-xs text-neutral-500">Picks out one house on the block</div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-2">
            <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12" role="img" aria-label="A device">
              <rect x={10} y={12} width={28} height={20} rx={3} fill="#ecfeff" stroke="#0891b2" strokeWidth={2.5} />
              <rect x={18} y={34} width={12} height={3} rx={1.5} fill="#0891b2" />
            </svg>
            <div className="text-xs text-neutral-500">IP address</div>
            <div className="font-mono text-sm text-neutral-800">192.168.1.10</div>
            <div className="text-xs text-neutral-500">Picks out one device on the network</div>
          </div>
        </div>
      ),
    },
    {
      section: "1. Getting Ready to Send",
      title: "A closer look at the address",
      story: {
        text: "Pip peers closer at the number now stamped on every packet.\nPip: \"Four little numbers — and that's really enough to find one exact device out of billions?\"\nFour numbers, each just one byte wide — that's the whole shape of an IP address, written out in full.",
        illustration: <ScenePipsPhone />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Here&rsquo;s an IP address written out fully: four numbers separated by dots, each a
            full byte — so each can be anywhere from 0 to 255, which is 2<sup>8</sup> = 256
            possible values.
          </p>
          <p>
            Multiply four of those together and the whole IPv4 system has 2<sup>32</sup> ≈ 4.3
            billion possible addresses — a lot, though in practice it&rsquo;s run short of spare
            capacity, which is why a newer, longer format called <Term id="ipv6">IPv6</Term>{" "}
            exists alongside it.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex gap-2">
            {[192, 168, 1, 10].map((n, i) => (
              <div key={i} className="flex-1 rounded-md bg-neutral-50 p-2 text-center">
                <div className="font-mono text-lg text-neutral-800">{n}</div>
                <div className="text-xs text-neutral-500">0&ndash;255 (2⁸=256)</div>
              </div>
            ))}
          </div>
          <div className="text-center font-mono text-sm text-neutral-800">
            256 × 256 × 256 × 256 = 2<sup>32</sup> ≈ 4.3 billion addresses
          </div>
        </div>
      ),
    },
    {
      section: "1. Getting Ready to Send",
      title: "A quick check at home",
      story: {
        text: "Before sending anything, Pip's phone does a quick check in its head.\nPhone: \"My address starts 192.168.1. ... and this destination starts 203.0.113. — that's not this house at all!\"\nAnything past his own network's edge, it turns out, is simply... the internet.",
        illustration: <SceneAddressCheck />,
      },
      body: (
        <div className="space-y-2">
          <p>
            That&rsquo;s an easy check here because this home network happens to split cleanly at
            the third number: whenever the first three don&rsquo;t match, the destination
            isn&rsquo;t a neighbor on the same LAN.
          </p>
          <p>
            That&rsquo;s a shortcut, though, not a general rule — the real rule works off however
            many bits a <Term id="subnet-mask">subnet mask</Term> says belong to the network,
            which Chapter 2 covers in full.
          </p>
          <p>
            A network confined to one place like this — a home, an office — is called a{" "}
            <Term id="lan">LAN</Term>. Beyond it lies <strong>the internet</strong>: every other
            network in the world, all connected together.
          </p>
        </div>
      ),
      visual: <LanMap devices={introDevices} conflictIds={new Set()} packet={null} showInternet />,
    },
    // ---------------------- 2. The Journey Out ----------------------
    {
      section: "2. The Journey Out",
      title: "First stop: the default gateway",
      story: {
        text: "Router: \"Not home. Can't hand this to a neighbor, then — same as any letter addressed somewhere else, it goes out the door for me to forward.\"\nThat one always-reachable address every device turns to first is the default gateway.",
        illustration: <SceneGatewayDoor />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Really, Pip&rsquo;s phone simply hands the packet to the router — known here as its{" "}
            <Term id="default-gateway">default gateway</Term>, at 192.168.1.1 — the one address
            every device already knows to try whenever a destination isn&rsquo;t local.
          </p>
          <p>
            The packet rides <Term id="wifi">Wi-Fi</Term> radio waves to reach it — the router is
            what every device on this LAN actually talks to, whether connected by Wi-Fi or by a
            cable, and it forwards messages on to wherever they&rsquo;re really headed.
          </p>
          <p>
            Once it confirms this delivery is headed outside the LAN, it pushes the packet out
            over its fiber connection to the provider.
          </p>
        </div>
      ),
      visual: <LanMap devices={introDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "2. The Journey Out",
      title: "The provider's own city",
      story: {
        text: "Pip's packet steps past the router into an enormous, unfamiliar city.\nPacket: \"Whoa — where am I?\"\nPassing signal: \"You're in our network now. Every house on this street has a router just like yours — we all share this one, before anyone reaches the real internet.\"\nThis shared, hidden network wrapping around thousands of homes has a name of its own: CGNAT.",
        illustration: <SceneCgnatCity />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Real public internet addresses are scarce, so providers often give each household a
            second, provider-only address alongside its own. Pip&rsquo;s packet keeps its house
            address (192.168.1.10), but now also carries a fresh provider-issued tag: 10.64.20.5.
          </p>
          <p>
            (In the real world, providers often reserve a special block just for this —{" "}
            <Term id="cgnat">100.64.0.0/10</Term> — precisely so it never collides with a
            household&rsquo;s own private range.)
          </p>
        </div>
      ),
      visual: <GatewayLayers activeLayer="isp" packetAddress="10.64.20.5" />,
    },
    {
      section: "2. The Journey Out",
      title: "The border checkpoint",
      story: {
        text: "Checkpoint: \"Hold on — your return address is still your house's own address. Leave it like that, and you won't be able to get back.\"\nPip: \"Huh? Really?\"\nCheckpoint: \"Really. The moment you step outside, telling everyone 'I'm in such-and-such room of my house' won't get you anywhere — nobody out there knows where your house is.\"\nPip: \"Oh no, that's a problem. What do I do?\"\nCheckpoint: \"Don't worry. Let's swap that address for this checkpoint's own address instead — now you can go out there and still find your way home.\"\nPip: \"Wow, thank you!\"\nSwapping one address for another so a reply can find its way back — that's NAT, or more precisely, NAPT.",
        illustration: <SceneCheckpoint />,
      },
      body: (
        <div className="space-y-2">
          <p>
            With that, it rewrites Pip&rsquo;s packet one final time — swapping the provider-only
            address for its own single public address, 198.51.100.7, plus a port number — and
            carefully writes the swap down in a logbook so it remembers exactly whose packet this
            was.
          </p>
          <p>
            This is <Term id="nat">NAT</Term> (specifically NAPT, since a port number is
            involved).
          </p>
        </div>
      ),
      visual: (
        <NaptTable rows={[{ privateAddr: "10.64.20.5 : 51422", publicAddr: "198.51.100.7 : 40001" }]} />
      ),
    },
    {
      section: "2. The Journey Out",
      title: "Private vs. global, one more time",
      story: {
        text: "Pip's packet looks back at the trip so far.\nPacket: \"Hold on — I've been carrying two different addresses this whole time, my house's, and then the provider's own. Why two?\"\nOne of those addresses only means something inside his own house — a private address.",
        illustration: <ScenePrivateGlobal />,
      },
      body: (
        <div className="space-y-2">
          <p>
            This whole home network lives inside a <Term id="private-ip">private IP</Term> range —
            reusable by every household in the world because it&rsquo;s never routed on the open
            internet. Reaching the internet needs a <Term id="global-ip">global IP</Term>, unique
            worldwide. Try a few examples:
          </p>
        </div>
      ),
      controls: (
        <div className="flex flex-wrap gap-2">
          {ADDRESS_EXAMPLES.map((ex, i) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setExampleIdx(i)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                exampleIdx === i ? "bg-storybook-accent text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {ex.label}
            </button>
          ))}
        </div>
      ),
      visual: (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 max-w-xl w-full space-y-1">
          <div className="font-mono text-lg text-neutral-800">{ADDRESS_EXAMPLES[exampleIdx].example}</div>
          <div
            className={`text-sm font-medium ${
              isPrivateIpv4(ADDRESS_EXAMPLES[exampleIdx].firstOctet, ADDRESS_EXAMPLES[exampleIdx].secondOctet)
                ? "text-emerald-600"
                : "text-cyan-700"
            }`}
          >
            {isPrivateIpv4(ADDRESS_EXAMPLES[exampleIdx].firstOctet, ADDRESS_EXAMPLES[exampleIdx].secondOctet)
              ? "Private — only meaningful inside its own LAN"
              : "Global — unique across the whole internet"}
          </div>
        </div>
      ),
      resetAction: () => setExampleIdx(0),
    },
    {
      section: "2. The Journey Out",
      title: "Comparing private and global",
      story: {
        text: "Checkpoint: \"Because each one has its own job — one only has to make sense inside your own house, the other has to make sense to the entire world.\"\nPrivate for home, global for the whole wide world — two very different kinds of address.",
        illustration: <ScenePrivateGlobal />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Both kinds exist because of the address math you saw earlier: 4.3 billion global
            addresses isn&rsquo;t enough for every device on Earth, so almost every device instead
            gets a <Term id="private-ip">private</Term> address that only has to be unique inside
            its own LAN.
          </p>
          <p>
            Or, like Pip&rsquo;s packet just now, inside the provider&rsquo;s{" "}
            <Term id="cgnat">CGNAT</Term> network too — while a much smaller pool of{" "}
            <Term id="global-ip">global</Term> addresses covers just each network&rsquo;s one
            outward-facing connection to the internet.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium"> </th>
                <th className="p-2 font-medium">Private</th>
                <th className="p-2 font-medium">Global</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Example range</td>
                <td className="p-2 font-mono text-xs">192.168.0.0/16</td>
                <td className="p-2 font-mono text-xs">198.51.100.7</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Unique across</td>
                <td className="p-2">Its own LAN only</td>
                <td className="p-2">The whole internet</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Routed on the internet?</td>
                <td className="p-2">No</td>
                <td className="p-2">Yes</td>
              </tr>
              <tr>
                <td className="p-2 text-neutral-500">Who assigns it</td>
                <td className="p-2">Your own router (DHCP)</td>
                <td className="p-2">Your internet provider</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "2. The Journey Out",
      title: "Crossing the ocean",
      story: {
        text: "Passport in hand, Pip's packet slips into the vast internet — router after router passing it along like a bucket brigade.\nRouters: \"203.0.113.50? That way!\"\nPiece by piece, his packets arrive and knit themselves back into one whole picture — and there it is, posted at last: his cheese, up on the Cheese-Lovers' Board for the whole world to admire.",
        illustration: <SceneOceanCrossing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Piece by piece, the packets reach the Cheese-Lovers&rsquo; Board&rsquo;s server, where
            they&rsquo;re reassembled back into one whole photo — and the upload finishes.
          </p>
          <p>
            When the server writes back, its reply finds its way all the way home only because it
            retraces that exact same checkpoint entry from before. No logbook entry, no way back.
          </p>
        </div>
      ),
      visual: <GatewayLayers activeLayer="internet" packetAddress="198.51.100.7 : 40001" />,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A <Term id="lan">LAN</Term> is a network confined to one place, connected to the wider internet through one router.</li>
            <li>Every device has an assigned <Term id="ip-address">IP address</Term>, four 0&ndash;255 numbers (2<sup>32</sup> ≈ 4.3 billion total, hence IPv6).</li>
            <li>Traffic outside a device&rsquo;s own subnet goes to its <Term id="default-gateway">default gateway</Term> — and from there may pass through an ISP&rsquo;s own <Term id="cgnat">CGNAT</Term> network before a <Term id="nat">NAT/NAPT</Term> translation table gives it a public address, which is also how a reply finds its way back.</li>
            <li><Term id="private-ip">Private</Term> addresses work only inside their own LAN; reaching the internet needs a <Term id="global-ip">global</Term> one — both exist because global addresses alone aren&rsquo;t enough for every device on Earth.</li>
          </ul>
          <p>
            A free-play version of this journey is now unlocked below — pick a destination and
            watch Pip&rsquo;s packet find its way there.
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
