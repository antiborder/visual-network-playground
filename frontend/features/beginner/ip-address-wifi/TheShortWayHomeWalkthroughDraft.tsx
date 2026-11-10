"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { Equation } from "@/components/Equation";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import {
  ArrivalOrderDiagram,
  CheckTagDiagram,
  CidrBitStripDiagram,
  FrameDiagram,
  PacketDiagram,
  PacketLifeDiagram,
  ReassemblyDiagram,
  SubnetRangeLine,
} from "./NetworkDiagrams";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, formatIp, type Device } from "./network";
import {
  SceneStationMap,
  SceneCargoSlicing,
  SceneCheckingSameLine,
  SceneStationAnnouncement,
  SceneJunctionSwitch,
  ScenePipBoardsTrain,
  ScenePipOnTrain,
  SceneArrivalAtDadStation,
} from "./StorybookScenes";

/** DRAFT — Chapter 2 "The Short Way Home", fully rewritten (story half only)
 * to follow the actual technical send sequence in order, granularly, one
 * idea per step — see the chat that requested this rewrite for the
 * accurate order it's built on: (1) slice into packets, (2) stamp each
 * with its sequence number, then label each with the sender's own
 * address (the number rides inside, the address outside — the real
 * wrapping order), (3) compare the destination's address
 * against the subnet mask to tell same-line from elsewhere, (4) learn it's
 * a neighbor, (5) ARP for the physical address once "local" is confirmed,
 * (6) load the packets onto a train and send it — with Pip riding along
 * this time, not just watching from the platform. The old front-loaded
 * "Dividing into Subnets" vignette (a free-standing theory dump before any
 * sending even began) is gone; only the one subnet-mask idea actually
 * needed for the same-line check (§3, "Same Line or Not?") survives, taught
 * right when it's needed. Runs right after "Meet the Network": Dad's
 * request for a photo copy happens at the end of Chapter 1, right before
 * Pip falls asleep, so this whole chapter takes place inside that dream,
 * with the train analogy as the literal setting. Pip has no phone in his
 * hands here; he's standing inside "Phone Station" itself. A station clerk
 * (who turns out, much later, to be the stub resolver — see the DNS
 * chapter's own clerk once it's converted) helps him work out how to get
 * the photo to "Dad's PC Station." (The ARP and switch steps began as
 * ports of earlier copy; both were revised in the 2026-11-03 pass below.)
 * Every other step now has
 * its own body too — kept strictly to the minimum needed for the same-line
 * determination per the user's explicit scoping call, with network/
 * broadcast/host-address math and CIDR block sizing deferred to a later
 * chapter; the Wrap-up's bullet list was lightly adjusted so it stops
 * claiming content that this rewrite no longer teaches. Six new arrival
 * steps ("Checking In", "Nothing Broken?", "Unhitching", "One Last Address
 * Check", "Out of Order", "Back Together") dramatize the receiving side's
 * own MAC check, frame-corruption check, unhitching the locomotive, IP
 * check, and sequence-number reassembly — one concept per step, mirroring
 * the granularity of the sending-side steps earlier in the chapter, rather
 * than compressing multiple facts into one step. Port numbers and
 * packet-loss/retransmission are deliberately left out of all of this: both
 * are their own later curriculum chapters (`ports-and-apps` is intermediate,
 * `tcp-handshake` is advanced — see docs/curriculum.md), not part of
 * Chapter 2's beginner-level scope; "Nothing Broken?" deliberately doesn't
 * say what happens if the check fails, for the same reason. Bodies for
 * these six steps were left PENDING at first, matching this app's usual
 * story-then-body phased workflow; they were written in the 2026-11-10
 * pass below.
 *
 * 2026-11-03 story pass (accuracy fixes, beginner scope kept): the old
 * switch step claimed the switch decides between NAT and direct
 * delivery; that decision is the sender's, made in §3, so it was
 * removed from the switch entirely. What the §4 framing steps show is
 * the sender-side framing beat (the former "Plates and a Seal"): the destination
 * name plate ARP found, the sender's own name plate, and a check tag
 * whose number is worked out from the crate's contents — so the
 * arrival-side "Nothing Broken?" check compares against something the
 * sender actually attached. The switch's own real move — looking the
 * frame's destination name up in its list and forwarding it out the
 * matching track — is dramatized at its actual moment, mid-journey
 * inside "Riding the Rails", whose story also shows both legs
 * explicitly (invisible Wi-Fi rails to the Router, solid track on to
 * Dad's PC) and swaps the engine inside the shed — the packet comes
 * out of its wireless frame and into a fresh wired one, plates copied
 * unchanged — because the two stretches really do use different
 * frames; the switch explanation lives in that step's body. The
 * ARP step now ends with the Clerk noting the answer in a notebook
 * (the ARP cache), and the Wrap-up bullet matches all of the above.
 *
 * 2026-11-09 split pass: story lengths were measured (median ~434
 * characters per step) and the six steps far above that band were
 * split at their natural scene/theme boundaries, each new step
 * carrying its own body: "Too Big to Send Whole" (address confirmation
 * split off), "Where the Line Ends" (two-parts / slash-number),
 * ARP (announcement / the Clerk's notebook), "Plates and a Seal"
 * (name plates / check tag), "Why Not All at Once?" (sharing / leaves
 * when ready), and "Riding the Rails" (invisible rails / change of
 * engines / the junction operator's list). 26 steps became 33.
 *
 * 2026-11-09 section pass: sections re-cut by journey phase (sizes
 * were 1-14 steps; now 2-5). "Confirming the Address" moved into §1;
 * §4 renamed from the chapter's own title to "Names and Seals"; the
 * old 14-step §5 "All Aboard" split into §5 "All Aboard" (why packets
 * travel separately + departure), §6 "Through the Router" (the ride),
 * §7 "At Dad's PC Station" (arrival checks and unwrapping), and
 * §8 "Back Together" (reordering, reassembly, delivery).
 *
 * 2026-11-09 guideline pass: the whole chapter (story and bodies)
 * was audited against docs/guideline.md — no sentence over ~20 words,
 * no unbroken prose block over ~50 words. Long sentences were split
 * and long paragraphs broken into separate <p>s, meaning unchanged;
 * the audit now reports zero violations.
 *
 * 2026-11-09 readability pass: the explanation halves lean on
 * figures, tables and lists wherever a structure beats prose —
 * PacketDiagram/FrameDiagram (NetworkDiagrams.tsx) for the wrapping
 * steps, tables for sizes / address anatomy / the two mask writings /
 * the giant-train comparison, and lists for the ARP exchange, the
 * switch's three actions, and the engine-change untouched items.
 * Old-chapter figures carried over the same day: the CIDR bit strip
 * (Slash Number), SubnetRangeLine adapted from SubnetExplorer's
 * number line (Same Group!), and the LanMap at the switch step —
 * while AddressRangeStrip and the explorer's slider stayed behind
 * with the subnet-sizing material this chapter defers.
 *
 * 2026-11-10 arrival-bodies pass: the six arrival steps (§7-§8) got
 * their bodies and visuals, figure/table-first per the readability
 * pass's own rule — FrameDiagram (plates) for "Checking In", a new
 * CheckTagDiagram for "Nothing Broken?", go/stays and two-check
 * tables for "Unhitching" and "One Last Address Check", and new
 * ArrivalOrderDiagram / ReassemblyDiagram for §8. Bodies are bullet
 * lists with at most one lead sentence; no sentence over ~20 words. */
export function TheShortWayHomeWalkthroughDraft({
  onComplete,
  onNavigatePrevious,
}: {
  onComplete: () => void;
  /** When provided, the first step's disabled "Back" button is replaced
   * with an enabled "Previous Chapter" button that calls this instead —
   * lets the reader step back into Chapter 1 rather than hitting a dead
   * end at the start of this one. */
  onNavigatePrevious?: () => void;
}) {
  const [step, setStep] = useState(0);

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

  const steps: Step[] = [
    // ----------------------------- Welcome ---------------------------
    {
      section: "Welcome",
      title: "What you learn from this chapter",
      body: (
        <div className="space-y-3">
          <p>
            Pip wakes up inside his own phone — literally. Phone Station, platform and all.
            Somewhere out there, Dad&rsquo;s PC has a shared folder waiting for a cheese photo.
            Pip has no idea how to get it there. A helpful station clerk is about to change
            that.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Lost at Phone Station</li>
            <li>Getting Ready to Send</li>
            <li>Same Line or Not?</li>
            <li>The Short Way Home</li>
            <li>All Aboard</li>
          </ol>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      story: {
        text: "Pip: \"...huh?\"\nHe blinks.\nA sign overhead reads: PIP'S PHONE STATION.\nPip: \"Wait... why am I at a station? I can't remember...\"\nHe closes his eyes, trying to think it through.\nPip: \"Eh, whatever. I just need to send Dad that cheese photo.\"\nPip: \"...oh. I don't have my phone.\"\nPip: \"Great. Now what do I do?\"",
        illustration: (
          // eslint-disable-next-line @next/next/no-img-element -- static export (output: "export") has no image optimizer; a pre-sized WebP is served as-is.
          <img
            src="/images/pip/ch2-step2-glance.webp"
            alt="Pip at Phone Station in the morning, rubbing his eye as he looks down the empty tracks"
            className="w-full max-w-2xl mx-auto h-auto rounded-lg"
          />
        ),
      },
      body: (
        <p>
          In short: once Pip&rsquo;s photo is sliced into packets, his phone checks something
          important. Does Dad&rsquo;s PC live on the same line? It does — so the whole trip
          stays inside the house. ARP finds the exact station, and this time, Pip rides along
          for delivery.
        </p>
      ),
      visual: <LanMap devices={DEFAULT_DEVICES} conflictIds={new Set()} packet={null} showMac />,
    },
    // -------------------- 1. Lost at Phone Station -------------------
    {
      section: "1. Lost at Phone Station",
      title: "What's the Address?",
      story: {
        text: "A small booth by the platform slides open.\nClerk: \"Lost, are you?\"\nPip: \"Ah— !?\"\nClerk: \"Happens sometimes — kids wandering in like this. Can you tell me the destination?\"\nPip: \"(Oh — you scared me.) Um, I need to get a cheese photo to Dad's PC.\"\nClerk: \"Dad's PC? And where's that?\"\nPip: \"In his room.\"\nClerk: \"Room... no — do you happen to know its IP address?\"",
        illustration: (
          // eslint-disable-next-line @next/next/no-img-element -- static export (output: "export") has no image optimizer; a pre-sized WebP is served as-is.
          <img
            src="/images/pip/ch2-step3-clerk-booth.webp"
            alt="The station clerk greets a startled Pip from the station window"
            className="w-full max-w-2xl mx-auto h-auto rounded-lg"
          />
        ),
      },
      body: (
        <div className="space-y-2">
          <p>
            Wherever a packet is headed, it needs a destination address before anything can be
            sent. &ldquo;Dad&rsquo;s room&rdquo; means nothing on the network. That&rsquo;s why
            the Clerk cut Pip off: a location isn&rsquo;t an address.
          </p>
          <p>
            It works the same way as ordinary mail. A letter needs a street address before the
            postal service can deliver it. On a network, that address is the{" "}
            <Term id="ip-address">IP address</Term> — like 192.168.1.15 for Dad&rsquo;s PC.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-md rounded-lg border border-storybook-ink/10 bg-white/70 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-center">
              <div className="text-xs text-storybook-ink/60 mb-1">A letter</div>
              <div className="px-2 py-1 rounded bg-neutral-100 border border-neutral-300 text-sm font-mono">
                123 Maple St.
              </div>
            </div>
            <span className="text-storybook-ink/40">↔</span>
            <div className="flex-1 text-center">
              <div className="text-xs text-storybook-ink/60 mb-1">A packet</div>
              <div className="px-2 py-1 rounded bg-cyan-100 border border-cyan-300 text-sm font-mono">
                192.168.1.15
              </div>
            </div>
          </div>
          <p className="text-xs text-storybook-ink/60 text-center">
            No address, no delivery — on paper or on the network.
          </p>
        </div>
      ),
    },
    // -------------------- 2. Getting Ready to Send -------------------
    {
      section: "1. Lost at Phone Station",
      title: "Confirming the Address",
      story: {
        text: "Pip: \"The IP address? Oh — that's the number I saw on Dad's phone earlier.\"\nPip: \"Um... 192.168.1.15.\"\nClerk: \"192.168.1.15, got it. This way, then.\"\nPip: \"But, um, I don't have the cheese photo. I couldn't find my phone...\"",
        illustration: (
          // eslint-disable-next-line @next/next/no-img-element -- static export (output: "export") has no image optimizer; a pre-sized WebP is served as-is.
          <img
            src="/images/pip/ch2-step4-remembering.webp"
            alt="Pip thinks hard, trying to remember the address, while the clerk waits at the window"
            className="w-full max-w-2xl mx-auto h-auto rounded-lg"
          />
        ),
      },
      body: (
        <div className="space-y-2">
          <p>
            Before anything gets packed, one thing has to be pinned down: where it&rsquo;s
            going. Pip worked out this address at the start of the chapter: 192.168.1.15,
            Dad&rsquo;s PC. Every step from here on depends on it.
          </p>
          <p>
            In the dream, the photo itself is standing right here in the station. So this is
            where the sending really begins.
          </p>
        </div>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "Too Big to Send Whole",
      story: {
        text: "Clerk: \"Cheese? You mean... that?\"\nHe points — there, loaded onto a cart, sits a whole, magnificent wheel of Emmental cheese.\nPip: \"Oh! There it is!\"\nWait — he wanted to send a photo of the cheese. But... never mind that for now.\nPip: \"Wait, is it just me, or did this get bigger?\"\nIt's much bigger than the one he saw yesterday — bigger, even, than the school building he remembers. An undeniably splendid wheel of cheese.\nClerk: \"Well, size around here depends on the data size. Image files tend to come out like that.\"\nPip: \"No way.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every file has a size, measured in bytes. And photos, especially high-resolution
            ones, add up fast. A byte is the smallest practical unit. The table below shows how
            the bigger units stack up from it.
          </p>
          <p>
            A typical photo shared online usually runs a few hundred KB to a few MB. That&rsquo;s
            small on a phone screen, but large next to the tiny messages a network sends by
            default. That&rsquo;s why the cheese towers over Pip in this dream: its size mirrors
            the data behind it.
          </p>
          <p>
            Pip&rsquo;s photo is a big one: 6,973,500 bytes, about 7 MB. One packet on the home
            line can carry about 1,500 bytes. Divide the photo by one packet&rsquo;s load, and
            you get the packet count. The equation below works it out: 4,649 packets.
          </p>
        </div>
      ),
      visual: (
        <div className="space-y-3">
          <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium">Unit</th>
                <th className="p-2 font-medium">How big?</th>
                <th className="p-2 font-medium">Roughly</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 font-medium">Byte (B)</td>
                <td className="p-2">the smallest unit</td>
                <td className="p-2">one character of text</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="p-2 font-medium">Kilobyte (KB)</td>
                <td className="p-2">about 1,000 bytes</td>
                <td className="p-2">a short email</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="p-2 font-medium">Megabyte (MB)</td>
                <td className="p-2">about 1,000 KB</td>
                <td className="p-2">one photo</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Gigabyte (GB)</td>
                <td className="p-2">about 1,000 MB</td>
                <td className="p-2">a short video</td>
              </tr>
            </tbody>
          </table>
          </div>
          <div className="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-4">
            <div className="mb-1 text-xs text-neutral-500">How many packets does the photo become?</div>
            <Equation tex={"\\dfrac{\\text{data size}}{\\text{packet size}} = \\text{number of packets}"} />
            <Equation tex={"\\dfrac{6{,}973{,}500\\ \\text{bytes}}{1{,}500\\ \\text{bytes}} = 4{,}649\\ \\text{packets}"} />
          </div>
        </div>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "Small Enough to Send",
      story: {
        text: "Clerk: \"Let's get this cut down to size.\"\nPip: \"Ehh? I liked it just the way it was.\"\nHe can't believe what he's hearing — cutting up such a magnificent wheel of cheese?\nClerk: \"At this size, there's no way it fits on a train.\"\nPip: \"...\"\nFair enough — no train exists that could carry something bigger than a school building. Still, what a waste.\nHe looks back at the cheese, only to find it already sliced into neat, square blocks, stacked in tidy rows.\nPip: \"That was fast!\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A whole file this size can&rsquo;t be sent as a single piece. Every line has its own
            carrying limit. Anything larger than that simply won&rsquo;t fit through it.
          </p>
          <p>
            So the sender cuts it into smaller pieces first, each one already sized to fit. A
            bigger file just means more pieces to send, not any single piece growing bigger than
            the line allows.
          </p>
          <p>
            The diagram below shows the whole life of the photo&rsquo;s data, end to end. This
            chapter follows that trip stage by stage.
          </p>
        </div>
      ),
      visual: <PacketLifeDiagram />,
    },
    {
      section: "2. Getting Ready to Send",
      title: "What's a Packet?",
      story: {
        text: "The Clerk leads Pip back toward the platform.\nPip: \"That huge, splendid wheel of cheese... it's just blocks now.\"\nClerk: \"To carry it by train, it has to be divided into packets.\"\nPip: \"Packets?\"\nClerk: \"Right — every train can only carry so much in one trip. Anything bigger gets cut into small, matching pieces. Each one's called a packet.\"\nPip: \"I wonder if it'll ever go back to normal.\"\nClerk: \"Once the pieces reach their destination, they get put back together.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="packet">packet</Term> is just a small, standardized chunk of data.
            It&rsquo;s cut down so it&rsquo;s guaranteed to fit whatever line is carrying it.
            Splitting something up doesn&rsquo;t lose or damage any of it. Once every piece
            arrives, it goes back together exactly as it was.
          </p>
          <p>
            Only the destination does that reassembling — not any station along the way.
            Stations just forward each packet toward the next hop. Putting the pieces back
            together happens once, right at the very end.
          </p>
        </div>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "Numbered",
      story: {
        text: "The Clerk pulls out a stamp and taps a number onto the corner of each crate as it rolls by. 1, 2, 3, and so on, down the line.\nPip: \"What's that for?\"\nClerk: \"So whoever unpacks these knows what order they go in.\"\nPip: \"Don't they just arrive in the order we send them?\"\nClerk: \"Not always — some might take a hair longer than others down the line. The number's how the other end sorts it out, no matter what order they show up in.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <p>
          Every packet carries a sequence number stamped on as it&rsquo;s created. It&rsquo;s a
          small tag saying where it belongs in the original order. It travels along with the
          packet the whole way, from departure to arrival.
        </p>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "Labeled for Delivery",
      story: {
        text: "Before long, they arrive at the platform.\nClerk: \"Looks like the cheese has already arrived.\"\nOn the tracks ahead, a large block sits loaded on a cart.\nClerk: \"Is this the right destination?\"\nHe unfolds a piece of paper. Written on it: \"192.168.1.15\"\nThat should be right — Dad's PC's IP address.\nPip: \"Yeah, that's it.\"\nClerk: \"Then let's stick the destination address on.\"\nHe presses the paper onto the train stopped on the tracks.",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            That slip of paper is a packet&rsquo;s header in miniature. Writing 192.168.1.15 on
            it is exactly how a real packet gets its destination{" "}
            <Term id="ip-address">IP address</Term>. That&rsquo;s how every station along the
            way knows where it&rsquo;s headed.
          </p>
          <p>
            A packet also carries a return address — the sender&rsquo;s own IP, 192.168.1.10.
            That&rsquo;s so whoever receives it knows exactly where to send a reply. Both
            addresses ride along on every single packet, not just the first one.
          </p>
          <p>
            And notice the order things were added. The sequence number was stamped on each
            piece first. This address label wraps around the outside of it. The real wrapping
            works the same way — each layer encloses the one that came before it.
          </p>
        </div>
      ),
      visual: <PacketDiagram />,
    },
    // -------------------- 3. Same Line or Not? -------------------
    {
      section: "3. Same Line or Not?",
      title: "Inside or Outside?",
      story: {
        text: "Clerk: \"Before we send this off, we need to figure out something.\"\nClerk: \"Is the destination inside our own line-group, or outside it?\"\nPip: \"Huh? Why?\"\nClerk: \"If it's inside our own line-group, we can send it straight there. But if it's outside, it has to go through the router first, out toward the mainline.\"\nPip: \"So, how do you actually tell whether the destination is inside the local network or outside it?\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="private-ip">private network</Term> (like a home Wi-Fi) only reaches
            devices connected to that same local line. Its addresses only mean something inside
            that line. A <Term id="global-ip">public network</Term> (the wider internet) is
            everyone else, reachable only through a router.
          </p>
          <p>That&rsquo;s the real reason a device checks before sending anything:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Same private network:</strong> a short, direct hop, station to station.
            </li>
            <li>
              <strong>Anywhere else:</strong> out through the router first, toward the mainline.
            </li>
          </ul>
        </div>
      ),
    },
    {
      section: "3. Same Line or Not?",
      title: "Two Parts in One Address",
      story: {
        text: "Clerk: \"Every station's address actually has two parts hiding inside it.\"\nPip: \"Two parts? It's just one number to me.\"\nClerk: \"One part says which line-group a station belongs to. The other says which station, inside that group. Compare just the first part, and you'll know.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            An <Term id="ip-address">IP address</Term> like 192.168.1.15 is doing two jobs at
            once. One part names the group — the line this station belongs to. The other part
            names the station itself, inside that group.
          </p>
          <p>
            It&rsquo;s the same shape as a postal address. The town gets the letter to the
            right area. The house number picks out the exact door. To tell whether two
            stations share a line, only the first part has to match.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium">192.168.1.15</th>
                <th className="p-2 font-medium">Names</th>
                <th className="p-2 font-medium">Like a postal address</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 font-mono text-[15px] font-semibold text-cyan-800">192.168.1</td>
                <td className="p-2">the line-group</td>
                <td className="p-2">the town</td>
              </tr>
              <tr>
                <td className="p-2 font-mono text-[15px] font-semibold text-cyan-800">.15</td>
                <td className="p-2">the station itself</td>
                <td className="p-2">the house number</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "3. Same Line or Not?",
      title: "The Slash Number",
      story: {
        text: "Pip: \"So how do you know where one part ends and the other begins?\"\nClerk: \"There's a marker for that — a little plaque, written as a number like /24.\"\nPip: \"Wait — I've seen that before! On Dad's phone, right next to my address. I always wondered what that slash number meant.\"\nClerk: \"That's called CIDR notation. Now you know.\"\nPip: \"And that tells you where the line-group's boundary falls?\"\nClerk: \"Exactly. Everything before that boundary names the group; everything after names the station.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A subnet mask is written as a prefix, like /24. It marks exactly how many of an
            address&rsquo;s bits belong to the line-group part.
          </p>
          <p>
            Everything before that boundary has to match, for two stations to share a line.
            Everything after it is free to differ. The same boundary is sometimes written the
            long way, as a mask. And 255.255.255.0 says exactly what /24 says.
          </p>
        </div>
      ),
      visual: (
        <div className="space-y-3">
          <CidrBitStripDiagram rows={[{ label: "192.168.1.10", octets: [192, 168, 1, 10] }]} />
          <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium">Written as</th>
                <th className="p-2 font-medium">Looks like</th>
                <th className="p-2 font-medium">Means</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2">a prefix (short)</td>
                <td className="p-2 font-mono text-[15px]">192.168.1.15/24</td>
                <td className="p-2">first 24 bits name the group</td>
              </tr>
              <tr>
                <td className="p-2">a mask (long)</td>
                <td className="p-2 font-mono text-[15px]">255.255.255.0</td>
                <td className="p-2">exactly the same boundary</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      ),
    },
    {
      section: "3. Same Line or Not?",
      title: "Checking the Match",
      story: {
        text: "Clerk: \"Pip's own address is 192.168.1.10. Dad's PC is 192.168.1.15.\"\nClerk: \"Compare the part before the boundary — 192.168.1 — on both.\"\nPip: \"They're the same! 192.168.1 on both sides.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <p>
          Comparing two addresses&rsquo; line-group parts is just comparing the numbers before the
          boundary: 192.168.1.10 and 192.168.1.15 both start with 192.168.1. Only the part after
          it — the station number — differs.
        </p>
      ),
      visual: (
        <div className="w-full max-w-md rounded-lg border border-storybook-ink/10 bg-white/70 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
              192.168.1
            </span>
            <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-600 border border-neutral-300">
              .10
            </span>
            <span className="text-xs text-storybook-ink/60">Pip&rsquo;s phone</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
              192.168.1
            </span>
            <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-600 border border-neutral-300">
              .15
            </span>
            <span className="text-xs text-storybook-ink/60">Dad&rsquo;s PC</span>
          </div>
          <p className="text-xs text-storybook-ink/60">
            Cyan = line-group part (must match) · Gray = station part (free to differ)
          </p>
        </div>
      ),
    },
    {
      section: "3. Same Line or Not?",
      title: "Same Group!",
      story: {
        text: "Clerk: \"Same line-group, no doubt about it — Dad's PC is a neighbor, right here on our own line.\"\nPip: \"So I don't need the mainline at all for this one?\"\nClerk: \"Not even a little. Straight there, the short way.\"",
        illustration: <SceneCheckingSameLine />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Matching line-group parts mean the two stations share a line. A device only needs to
            reach out through the router when a destination&rsquo;s line-group differs from its own.
            That&rsquo;s exactly why Dad&rsquo;s PC doesn&rsquo;t need the mainline at all.
          </p>
          <p>The figure below shows the whole line, with both stations inside it.</p>
        </div>
      ),
      visual: (
        <SubnetRangeLine
          devices={[
            { label: "Pip's phone", lastOctet: 10 },
            { label: "Dad's PC", lastOctet: 15 },
          ]}
        />
      ),
    },
    // -------------------- 4. Names and Seals -------------------
    {
      section: "4. Names and Seals",
      title: "Who Has This Address?",
      story: {
        text: "Clerk: \"Knowing it's in our group still doesn't tell us which physical platform to send this to. Time for an announcement.\"\nStation announcement: \"Attention — does anyone have address 192.168.1.15? Please reply with your station name!\"\nDad's PC Station (over the speaker): \"That's me! My station name is AA:BB:CC:11:22:33.\"\nClerk: \"That broadcast-and-reply, hunting down a station's own fixed name, is called ARP.\"",
        illustration: <SceneStationAnnouncement />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Knowing Dad&rsquo;s PC is on the same subnet still doesn&rsquo;t tell Pip&rsquo;s
            phone how to physically reach it. Delivery on a LAN happens by{" "}
            <Term id="mac-address">MAC address</Term>, not IP address.
          </p>
          <p>
            In the station picture, it&rsquo;s a station&rsquo;s own fixed name. It is not the
            line-group number it happens to be using today.
          </p>
          <p>
            An IP address is assigned by the network, and can change if a device joins a
            different network. A MAC address is different. It&rsquo;s burned in by the
            manufacturer, and never changes for as long as you own the device.
          </p>
          <p>
            That&rsquo;s exactly why Pip&rsquo;s phone can&rsquo;t just guess it; it has to ask.
            This broadcast-and-reply exchange is <Term id="arp">ARP</Term>. It runs in three
            steps:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              The phone broadcasts one question to every station on the line: &ldquo;Who has
              192.168.1.15? Tell 192.168.1.10.&rdquo;
            </li>
            <li>Every station hears the question. Only the station with that address replies.</li>
            <li>The reply gives that station&rsquo;s MAC address: AA:BB:CC:11:22:33.</li>
          </ol>
          <p>
            Try it yourself with the button below. Watch the question go out to everyone, and
            the answer come back.
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
      section: "4. Names and Seals",
      title: "The Clerk's Notebook",
      story: {
        text: "The Clerk pulls a worn notebook from his pocket and scribbles the answer down.\nPip: \"You write it down?\"\nClerk: \"Every time. Next time a train leaves for that address, I check my notebook first. No need to shout the question down the whole line again.\"\nPip: \"And if the notebook's wrong?\"\nClerk: \"Then the reply that comes back sets it right. The notebook is only a memory — not the truth itself.\"",
        illustration: <SceneStationAnnouncement />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The answer is worth keeping. The phone stores it in a small list of its own. That
            list is its ARP cache — the Clerk&rsquo;s notebook. The next send to the same
            address looks it up there first. No need to broadcast the question all over again.
          </p>
          <p>
            A notebook is a memory, not the truth. Entries are kept only for a while. And if an
            answer ever stops working, the phone simply asks again. That can happen when a
            device is replaced, or an address moves. The fresh reply gets written down instead.
          </p>
        </div>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "4. Names and Seals",
      title: "A Name at Both Ends",
      story: {
        text: "Back at Pip's waiting cart, a small locomotive is backing up to hitch on.\nClerk: \"First, the name ARP just found goes on the front. That's who this delivery is for.\"\nHe bolts a plate to the front of the engine: AA:BB:CC:11:22:33.\nPip: \"And the smaller plate at the back?\"\nClerk: \"Your own station's name — so anyone can see where it set out from.\"",
        illustration: <SceneJunctionSwitch />,
      },
      body: (
        <div className="space-y-2">
          <p>
            This wrapping-up step has a name of its own: <strong>framing</strong>. Before the
            packet can ride the local line, the phone&rsquo;s network hardware wraps it into a
            frame. The frame carries the destination&rsquo;s{" "}
            <Term id="mac-address">MAC address</Term> at the front. That is the name ARP just
            found.
          </p>
          <p>
            The frame names where it came from, too: the sender&rsquo;s own MAC address rides
            along as well. So every frame on the line says both ends of its journey. And when
            Dad&rsquo;s PC sends a frame back, the two names simply swap places.
          </p>
        </div>
      ),
      visual: <FrameDiagram highlight="plates" />,
    },
    {
      section: "4. Names and Seals",
      title: "The Check Tag",
      story: {
        text: "At the crate's clasp, a porter fixes a small tag, its face stamped with a number.\nPorter: \"That number is worked out from everything inside the crate — always by the same recipe. At the far end, they'll work it out again from whatever actually arrives, and compare the two.\"\nPip: \"And if the numbers don't match?\"\nPorter: \"Then something changed on the way — and they'll know. That's a longer story, for another day.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            One last thing goes on, at the very end of the frame: a check value. It is a short
            number, worked out from everything in the frame. The recipe is always the same.
            It&rsquo;s the tag on the crate&rsquo;s clasp.
          </p>
          <p>
            The receiver will work out the same number from whatever actually arrives. Then it
            compares the two. That comparison gets its own step, once the train pulls in.
            Everything so far was preparation for departure — the slicing, the labels, ARP, the
            plates.
          </p>
        </div>
      ),
      visual: <FrameDiagram highlight="fcs" />,
    },
    // -------------------- 5. All Aboard -------------------
    {
      section: "5. All Aboard",
      title: "Why Not All at Once?",
      story: {
        text: "Down the tracks, Pip can see cart after cart, each one now hitched to its own locomotive, just like his.\nPip: \"That many...\"\nClerk: \"This time, the data came out to about 4,649 packets.\"\nPip: \"Why not hook all the trains together and send them off in one go?\"\nClerk: \"Because this line isn't ours alone. Every station in the house shares it. And on the invisible stretch especially, only one train can be on it at a time.\"\nClerk: \"Imagine one single train carrying all 4,649 crates. While it passes, everyone else simply waits. Your dad's PC, every other station — all held up behind your cheese.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The line belongs to the whole house, not to Pip. Every device shares it. And on
            the Wi-Fi stretch especially, only one transmission can use it at a time.
          </p>
          <p>
            So the real question is a simple one. When several devices want the line at once,
            how long does each one have to wait for the others? Small packets keep every turn
            short.
          </p>
          <p>
            If Pip&rsquo;s photo travelled as one giant shipment, it would hold the line for
            the whole transfer. Every other device would have to wait until it finished.
          </p>
          <p>
            Sent as separate packets, the line changes hands between one packet and the next.
            A packet of Pip&rsquo;s cheese, a packet of someone else&rsquo;s data, then
            another of Pip&rsquo;s. A device that&rsquo;s waiting only ever waits for a
            single small packet to pass.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium"> </th>
                <th className="p-2 font-medium">One giant train</th>
                <th className="p-2 font-medium">Separate packets</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">The line is held for</td>
                <td className="p-2">the whole photo, start to finish</td>
                <td className="p-2">one small packet at a time</td>
              </tr>
              <tr>
                <td className="p-2 text-neutral-500">Everyone else waits</td>
                <td className="p-2">until all 4,649 crates have passed</td>
                <td className="p-2">only for the packet in front of them</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "5. All Aboard",
      title: "Leaves When Ready",
      story: {
        text: "Clerk: \"Small trains have one more trick. One of yours slips out. Then someone else's, then another of yours. The line keeps changing hands, so nobody waits long.\"\nPip: \"And mine don't have to wait for each other, either?\"\nClerk: \"Right. Each crate leaves the moment it's ready. The first pieces are already rolling while the rest are still being packed — nothing waits for the whole photo.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            There&rsquo;s a second benefit to sending pieces separately. Each packet can leave
            the moment it&rsquo;s ready.
          </p>
          <p>
            The first pieces of the photo are already on their way. Meanwhile, the later ones
            are still being sliced and labeled. Sending and packing overlap. If everything had
            to travel as one shipment, nothing could move. Not until the very last piece was
            ready.
          </p>
        </div>
      ),
    },
    {
      section: "5. All Aboard",
      title: "Time to Go",
      story: {
        text: "Clerk: \"Alright — everything's packed, labeled, hitched up, and the route's confirmed. Time to go.\"\nPip: \"Wait, do I get to come too?\"\nClerk: \"Why not? It's your photo — climb aboard.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <p>
          Everything up to this point — slicing, labeling, checking the address — happens before a
          single packet actually moves. Only once all of it is settled does anything leave the
          platform.
        </p>
      ),
    },
    {
      section: "5. All Aboard",
      title: "All Aboard",
      story: {
        text: "Pip hops up onto the platform edge, right alongside the crates.\nA porter waves him toward an open door.\nPorter: \"Room for one more — hop in, we're about to head out.\"\nThe doors slide shut behind him with a soft chime.",
        illustration: <ScenePipBoardsTrain />,
      },
      body: (
        <p>
          Pip boarding alongside the crates is the picture-book version of something real. Once a
          packet is ready, it doesn&rsquo;t wait around. It heads out right away, along whatever
          path was just worked out.
        </p>
      ),
    },
    {
      section: "6. Through the Router",
      title: "Invisible Rails",
      story: {
        text: "The train pulls away from Phone Station — and underneath it, there is no track at all.\nPip: \"We're floating?!\"\nA porter's voice calls after them from the platform: \"Invisible rails! Same as always — that's the stretch from your station to the Router. Nothing under you but air.\"\nThe train glides down the invisible line and slips into the Router's junction shed.",
        illustration: <ScenePipOnTrain />,
      },
      body: (
        <div className="space-y-2">
          <p>
            This first stretch of the journey is the Wi-Fi hop. The frame travels from
            Pip&rsquo;s phone to the router as radio waves, through the air.
          </p>
          <p>
            In Chapter 1, the invisible rails were how every device in the house reaches the
            router. This delivery is short, but it still starts with that same hop.
          </p>
        </div>
      ),
    },
    {
      section: "6. Through the Router",
      title: "A Change of Engines",
      story: {
        text: "Inside the shed, porters are already unhitching the engine that floated them here. They back a different one in — heavier, built for solid rails.\nPip: \"We're changing engines?\"\nPorter: \"The engine that carries a crate over the air can't run on solid track. But look — the crate itself never changes. Same label, same number, same tag. Even the name plates are copied onto the new engine, just as they were. Only the engine is new.\"",
        illustration: <SceneJunctionSwitch />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Did you catch the change of engines inside the shed? The frame that carried the
            packet over Wi-Fi can&rsquo;t travel the wired stretch. So inside the router, the
            packet comes out of its wireless frame. It goes into a fresh wired one.
          </p>
          <p>The packet itself is never touched:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Its IP label — unchanged.</li>
            <li>Its sequence number — unchanged.</li>
            <li>Its check tag — unchanged.</li>
            <li>Even the MAC name plates are copied across, just as they were.</li>
          </ul>
          <p>Only the wrapper is new.</p>
        </div>
      ),
    },
    {
      section: "6. Through the Router",
      title: "The Junction Operator's List",
      story: {
        text: "At the front of the shed, the junction operator leans out, reading the plate on the new engine.\nJunction operator: \"AA:BB:CC:11:22:33... let me check my list.\"\nHe runs a finger down the big, worn list pinned beside the levers. Station names on the left, track numbers on the right.\nJunction operator: \"There it is — track 2!\" The points clatter over. \"Straight through!\"\nPip: \"You knew where to send us just from the name?\"\nJunction operator: \"That's all I ever look at — the name on the engine, and my list.\"\nOut of the shed, the train settles onto solid rails. It hums quietly through the walls of the house, on the last stretch of line.\nPorter: \"One more station. Dad's PC Station, coming up.\"",
        illustration: <ScenePipOnTrain />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The junction moment is the <strong>switch</strong> at work. It is a small switch,
            built into the router.
          </p>
          <p>The instant a frame arrives, the switch does three things:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              It reads the frame&rsquo;s destination <Term id="mac-address">MAC address</Term>.
            </li>
            <li>It looks that address up in its list of ports.</li>
            <li>It forwards the frame out the port the list names.</li>
          </ol>
          <p>
            It doesn&rsquo;t decide inside versus outside. That was the sender&rsquo;s call,
            back in §3. It was written into the frame&rsquo;s address before the frame left.
            How the switch learns its list is its own topic. It gets its own chapter later on.
          </p>
          <p>
            No provider, no address-swapping, no long detour. A same-line delivery like this one
            only ever passes through the router. That&rsquo;s the same router Pip met back in
            Meet the Network.
          </p>
        </div>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    {
      section: "7. At Dad's PC Station",
      title: "Checking In",
      story: {
        text: "The train rolls into the platform at Dad's PC Station.\nA porter steps out, clipboard in hand, and walks straight to the locomotive.\nPorter: \"Let's see here...\"\nHe reads the little nameplate bolted to its front: AA:BB:CC:11:22:33.\nPorter: \"Yep. That's us, alright. This one's really come to the right station.\"\nPip: \"You check that for every single train?\"\nPorter: \"Every one. Doesn't matter how many pull in.\"\nPorter: \"If the name on the engine doesn't match ours, it's not for us. We don't touch it.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <div className="space-y-3">
          <p>First, the PC checks who the frame is for.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              It reads the destination <Term id="mac-address">MAC address</Term> at the
              frame&rsquo;s front.
            </li>
            <li>It compares that address with its own burned-in address.</li>
            <li>The same? The frame is taken in.</li>
            <li>Different? The frame is left alone — it belongs to another station.</li>
          </ul>
        </div>
      ),
      visual: <FrameDiagram highlight="plates" />,
    },
    {
      section: "7. At Dad's PC Station",
      title: "Nothing Broken?",
      story: {
        text: "Satisfied, the porter moves to the tag fixed beside the crate's clasp. He reads the number stamped on it. Then he works through the crate's contents on his clipboard, counting quietly under his breath.\nPorter: \"Tag says one number. What arrived works out to the same. Nothing torn open, nothing changed on the way over.\"\nPip: \"You check that for every single crate?\"\nPorter: \"Every one. Before anyone touches what's inside.\"\nPip: \"And if the numbers hadn't matched?\"\nPorter: \"Let's just say — that's a story for another day.\"\nHe winks and moves on.",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Before leaving, the sender works out a number from the whole frame.</li>
          <li>That number rides at the end of the frame, as the check tag.</li>
          <li>Here, the same recipe runs over what actually arrived.</li>
          <li>The two numbers match — so nothing changed on the way.</li>
        </ul>
      ),
      visual: <CheckTagDiagram />,
    },
    {
      section: "7. At Dad's PC Station",
      title: "Unhitching",
      story: {
        text: "With both checks done, the porter unclips the locomotive from the crate.\nPorter: \"Alright, you're off duty.\"\nHe waves it toward a side track, where it rolls away on its own.\nPip: \"Where's it going?\"\nPorter: \"Back out — it was only ever here to get this one crate the last stretch of the way. Its job's done the moment we've got the crate in hand.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <div className="space-y-3">
          <p>Both checks passed. The frame&rsquo;s job is done.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>The locomotive is unhitched and sent away.</li>
            <li>
              What stays is the crate: the <Term id="packet">IP packet</Term> itself.
            </li>
            <li>Its own label and number were never touched.</li>
            <li>From here, the delivery continues as a packet — one layer up.</li>
          </ul>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium">Unhitched and sent away</th>
                <th className="p-2 font-medium">Stays with the delivery</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2">The frame&rsquo;s front and back — the name plates</td>
                <td className="p-2">The IP packet</td>
              </tr>
              <tr>
                <td className="p-2">The check tag at the end</td>
                <td className="p-2">The packet&rsquo;s own label and number</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "7. At Dad's PC Station",
      title: "One Last Address Check",
      story: {
        text: "The porter turns his attention to the crate itself now, alone on the platform without its engine.\nHe peels back a corner and checks the label glued underneath: 192.168.1.15.\nPorter: \"This address is ours, too. Matches the station name and the label both — no mix-ups.\"\nPip: \"Wait, didn't you already check the engine's name? Why check the crate too?\"\nPorter: \"Different question, really. The engine told us we're the right station.\"\nPorter: \"The label tells us this particular crate is really meant for us. It's not, say, a neighbor sharing our platform.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <div className="space-y-3">
          <p>One check remains — on the crate, not the engine.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              The porter reads the destination <Term id="ip-address">IP address</Term> on
              the packet: 192.168.1.15.
            </li>
            <li>It matches this PC&rsquo;s own address.</li>
            <li>Only now does the packet go any further.</li>
          </ul>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium"> </th>
                <th className="p-2 font-medium">Check 1: the engine&rsquo;s plate</th>
                <th className="p-2 font-medium">Check 2: the crate&rsquo;s label</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Looks at</td>
                <td className="p-2">The MAC address</td>
                <td className="p-2">The IP address</td>
              </tr>
              <tr>
                <td className="p-2 text-neutral-500">Answers</td>
                <td className="p-2">Is this the right station on this line?</td>
                <td className="p-2">Is this packet really for this machine?</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "8. Back Together",
      title: "Out of Order",
      story: {
        text: "More trains keep rolling in, one after another — but not in the order they left.\nPip: \"Wait, that one says 12 on it. Didn't we just see number 4?\"\nPorter: \"Happens all the time. No two trains take exactly the same amount of time down the line.\"\nPip: \"So... is that a problem?\"\nPorter: \"Not even a little. Watch.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Packets do not arrive in the order they left.</li>
          <li>One train is held up. The next one sails through.</li>
          <li>So number 12 can pull in before number 4.</li>
          <li>That is normal — not a fault.</li>
          <li>Each crate still carries its stamped number.</li>
        </ul>
      ),
      visual: <ArrivalOrderDiagram />,
    },
    {
      section: "8. Back Together",
      title: "Back Together",
      story: {
        text: "The porter checks the little number stamped on each crate as it arrives.\nHe lines them up on the platform in the order the numbers say: 1, 2, 3.\nThat's not the order they showed up in.\nAs each one clicks into place beside the last, the blocks melt seamlessly back together.\nPip: \"It's — it's whole again!\"\nPorter: \"As long as we know the order, it doesn't matter which one shows up first.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <ul className="list-disc space-y-1 pl-5">
          <li>The porter lines the crates up by their stamped numbers: 1, 2, 3.</li>
          <li>Not by the order they arrived in.</li>
          <li>In number order, the pieces join back into the whole photo.</li>
          <li>The original data is whole again — ready to hand over.</li>
        </ul>
      ),
      visual: <ReassemblyDiagram />,
    },
    {
      section: "8. Back Together",
      title: "Delivered — the Short Way",
      story: {
        text: "A satisfying clunk, and the crates finish unloading — Pip right behind them.\nA porter at Dad's PC Station stamps the delivery log.\nPorter: \"Delivered — straight into the shared folder, right where it belongs.\"\nPip: \"That's the short way home. Didn't even need to go anywhere near the mainline for this one.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <p>
          The full-resolution photo lands in Dad&rsquo;s shared folder almost instantly. It never
          left the house, and never needed the address-swapping trick. That&rsquo;s a trick a
          later chapter introduces, for trips that actually leave home.
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
            <li>Before sending anything, a device slices data into small, labeled <Term id="packet">packets</Term>. Each one is only as big as the local line can carry in one go.</li>
            <li>Every address secretly has two parts: which line-group a station is on, and which station within it. A subnet mask (like /24) marks exactly where that boundary falls.</li>
            <li>Comparing the line-group part of two addresses tells you whether a destination is a neighbor on the same line. No mainline is required if it is.</li>
            <li>A <Term id="mac-address">MAC address</Term> is a fixed, factory-burned ID — unlike an IP address, which the network assigns. <Term id="arp">ARP</Term> finds a device&rsquo;s MAC address by broadcasting the question. The answer is remembered, so the next send can look it up instead of asking again.</li>
            <li>The router&rsquo;s switch looks that MAC address up in its own list. It forwards the frame out the right port.</li>
          </ul>
          <p>
            With Dad&rsquo;s copy safely saved, Pip&rsquo;s ready to finish the real plan.
            That&rsquo;s getting the cheese photo up on the Cheese-Lovers&rsquo; Board, for the
            whole world to see. That&rsquo;s a much longer trip, saved for later.
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
          {isFirst && onNavigatePrevious ? (
            <button
              onClick={onNavigatePrevious}
              className="px-3 py-1.5 rounded-md bg-white/70 hover:bg-white text-sm text-storybook-ink border border-storybook-ink/10"
            >
              Previous Chapter
            </button>
          ) : (
            <button
              onClick={goBack}
              disabled={isFirst}
              className="px-3 py-1.5 rounded-md bg-white/70 hover:bg-white disabled:opacity-40 text-sm text-storybook-ink border border-storybook-ink/10"
            >
              Back
            </button>
          )}
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
