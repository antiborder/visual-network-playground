"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, formatIp, type Device } from "./network";
import {
  SceneAtPhoneStation,
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
 * accurate order it's built on: (1) slice into packets, (2) label each
 * with the sender's own address, (3) compare the destination's address
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
 * the photo to "Dad's PC Station." Bodies are carried over as-is for the
 * two steps ported unchanged (ARP, the switch); every other step now has
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
 * these six new steps are left PENDING, matching this app's usual
 * story-then-body phased workflow. */
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
            Pip wakes up inside his own phone — literally. Phone Station, platform and all.
            Somewhere out there, Dad&rsquo;s PC has a shared folder waiting for a cheese photo,
            and Pip has no idea how to get it there. A helpful station clerk is about to change
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
        illustration: <SceneAtPhoneStation />,
      },
      body: (
        <p>
          In short: once Pip&rsquo;s photo is sliced into packets, his phone checks whether
          Dad&rsquo;s PC lives on the same line — it does — so the whole trip stays inside the
          house. ARP finds the exact station, and this time, Pip rides along for delivery.
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
        illustration: <SceneAtPhoneStation />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Wherever a packet is headed, it needs a destination address before anything can be
            sent — &ldquo;Dad&rsquo;s room&rdquo; means nothing on the network. That&rsquo;s why
            the Clerk cut Pip off: a location isn&rsquo;t an address.
          </p>
          <p>
            It works the same way as ordinary mail: a letter needs a street address before the
            postal service can deliver it anywhere. On a network, that address is the{" "}
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
      section: "2. Getting Ready to Send",
      title: "Too Big to Send Whole",
      story: {
        text: "Pip: \"The IP address? Oh — that's the number I saw on Dad's phone earlier.\"\nPip: \"Um... 192.168.1.15.\"\nClerk: \"192.168.1.15, got it. This way, then.\"\nPip: \"But, um, I don't have the cheese photo. I couldn't find my phone...\"\nClerk: \"Cheese? You mean... that?\"\nHe points — there, loaded onto a cart, sits a whole, magnificent wheel of Emmental cheese.\nPip: \"Oh! There it is!\"\nWait — he wanted to send a photo of the cheese. But... never mind that for now.\nPip: \"Wait, is it just me, or did this get bigger?\"\nIt's much bigger than the one he saw yesterday — bigger, even, than the school building he remembers. An undeniably splendid wheel of cheese.\nClerk: \"Well, size around here depends on the data size. Image files tend to come out like that.\"\nPip: \"No way.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every file has a size, measured in bytes — and photos, especially high-resolution
            ones, add up fast. A byte is the smallest practical unit; roughly 1,000 bytes make a
            kilobyte (KB), 1,000 KB make a megabyte (MB), and 1,000 MB make a gigabyte (GB).
          </p>
          <p>
            A typical photo shared online usually runs a few hundred KB to a few MB — small on a
            phone screen, but large next to the tiny messages a network sends by default.
            That&rsquo;s why the cheese towers over Pip in this dream: its size mirrors the data
            behind it.
          </p>
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
            A whole file this size can&rsquo;t be sent as a single piece — every line has its own
            carrying limit, and anything larger than that limit simply won&rsquo;t fit through it.
          </p>
          <p>
            So the sender cuts it into smaller pieces first, each one already sized to fit. A
            bigger file just means more pieces to send, not any single piece growing bigger than
            the line allows.
          </p>
        </div>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "What's a Packet?",
      story: {
        text: "The Clerk leads Pip back toward the platform.\nPip: \"That huge, splendid wheel of cheese... it's just blocks now.\"\nClerk: \"To carry it by train, it has to be divided into packets.\"\nPip: \"Packets?\"\nClerk: \"Right — every train can only carry so much in one trip, so anything bigger gets cut into small, matching pieces. Each one's called a packet.\"\nPip: \"I wonder if it'll ever go back to normal.\"\nClerk: \"Once the pieces reach their destination, they get put back together.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="packet">packet</Term> is just a small, standardized chunk of data — cut
            down so it&rsquo;s guaranteed to fit whatever line is carrying it. Splitting something
            up doesn&rsquo;t lose or damage any of it; once every piece arrives, it goes back
            together exactly as it was.
          </p>
          <p>
            Only the destination does that reassembling — not any station along the way. Routers
            just forward each packet toward the next hop; putting the pieces back in order happens
            once, right at the very end.
          </p>
          <p>
            Pieces don&rsquo;t always arrive in the order they were sent, so each one carries a
            sequence number — a little tag saying where it belongs in line. That&rsquo;s how the
            destination knows how to stack them back up correctly.
          </p>
        </div>
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
            That slip of paper is a packet&rsquo;s header in miniature: writing 192.168.1.15 on it
            is exactly how a real packet gets its destination{" "}
            <Term id="ip-address">IP address</Term>, so every station along the way knows where
            it&rsquo;s headed.
          </p>
          <p>
            A packet also carries a return address — the sender&rsquo;s own IP, 192.168.1.10 —
            so whoever receives it knows exactly where to send a reply. Both addresses ride along
            on every single packet, not just the first one.
          </p>
        </div>
      ),
    },
    {
      section: "2. Getting Ready to Send",
      title: "Numbered, Too",
      story: {
        text: "The Clerk pulls out a stamp and taps a small number onto the corner of each crate as it rolls by — 1, 2, 3, and so on, down the line.\nPip: \"What's that for?\"\nClerk: \"So whoever unpacks these knows what order they go in.\"\nPip: \"Don't they just arrive in the order we send them?\"\nClerk: \"Not always — some might take a hair longer than others down the line. The number's how the other end sorts it out, no matter what order they show up in.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <p>
          Every packet carries a sequence number stamped on as it&rsquo;s created — a small tag
          saying where it belongs in the original order. It travels along with the packet the
          whole way, from departure to arrival.
        </p>
      ),
    },
    // -------------------- 3. Same Line or Not? -------------------
    {
      section: "3. Same Line or Not?",
      title: "Inside or Outside?",
      story: {
        text: "Clerk: \"Before we send this off, we need to figure out whether the destination is inside our own line-group, or outside it.\"\nPip: \"Huh? Why?\"\nClerk: \"If it's inside our own line-group, we can send it straight there. But if it's outside, it has to go through the router first, out toward the mainline.\"\nPip: \"So, how do you actually tell whether the destination is inside the local network or outside it?\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="private-ip">private network</Term> (like a home Wi-Fi) only reaches
            devices connected to that same local line — its addresses only mean something inside
            that line. A <Term id="global-ip">public network</Term> (the wider internet) is
            everyone else, reachable only through a router.
          </p>
          <p>
            That&rsquo;s the real reason a device checks before sending anything: the same private
            network means a short, direct hop; anywhere else means routing out through the gateway
            first.
          </p>
        </div>
      ),
    },
    {
      section: "3. Same Line or Not?",
      title: "Where the Line Ends",
      story: {
        text: "Clerk: \"Every station's address actually has two parts hiding inside it.\"\nPip: \"Two parts? It's just one number to me.\"\nClerk: \"One part says which line-group a station belongs to. The other says which station, inside that group. Compare just the first part, and you'll know.\"\nPip: \"So how do you know where one part ends and the other begins?\"\nClerk: \"There's a marker for that — a little plaque, written as a number like /24.\"\nPip: \"Wait — I've seen that before! On Dad's phone, right next to my address. I always wondered what that slash number meant.\"\nClerk: \"That's called CIDR notation. Now you know.\"\nPip: \"And that tells you where the line-group's boundary falls?\"\nClerk: \"Exactly. Everything before that boundary names the group; everything after names the station.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <p>
          A subnet mask, written as a prefix like /24, marks exactly how many of an address&rsquo;s
          bits belong to the line-group part. Everything before that boundary has to match for two
          stations to share a line; everything after it is free to differ.
        </p>
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
        <p>
          Matching line-group parts mean the two stations share a line — a device only needs to
          reach out through the router when a destination&rsquo;s line-group differs from its own.
          That&rsquo;s exactly why Dad&rsquo;s PC doesn&rsquo;t need the mainline at all.
        </p>
      ),
    },
    // -------------------- 4. The Short Way Home -------------------
    {
      section: "4. The Short Way Home",
      title: "Find the Physical Address",
      story: {
        text: "Clerk: \"Knowing it's in our group still doesn't tell us which physical platform to send this to. Time for an announcement.\"\nStation announcement: \"Attention — does anyone have address 192.168.1.15? Please reply with your station name!\"\nDad's PC Station (over the speaker): \"That's me! My station name is AA:BB:CC:11:22:33.\"\nClerk: \"That broadcast-and-reply, hunting down a station's own fixed name, is called ARP.\"",
        illustration: <SceneStationAnnouncement />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Knowing Dad&rsquo;s PC is on the same subnet still doesn&rsquo;t tell Pip&rsquo;s
            phone how to physically reach it — delivery on a LAN happens by{" "}
            <Term id="mac-address">MAC address</Term>, not IP address. In the station picture,
            it&rsquo;s a station&rsquo;s own fixed name, not the line-group number it happens to
            be using today.
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
        text: "Down at the junction, a lever creaks into place.\nJunction operator: \"Headed out to the mainline? That's the long way — off to the provider's own tracks, with an address swap along the route.\"\nJunction operator: \"But Dad's PC's own station name? That's platform 2, right over there. No mainline, no swap, straight there.\"\nSomewhere inside every home station, a small junction like this one is the one actually making this call.\nWith the route settled, a locomotive rolls up and hitches onto Pip's waiting cart — freshly labeled AA:BB:CC:11:22:33, the station name ARP just found.",
        illustration: <SceneJunctionSwitch />,
      },
      body: (
        <p>
          Every device&rsquo;s traffic actually passes through a small switch built into the
          router, deciding between <Term id="nat">NAT</Term>/the wider internet and a direct
          local delivery. How the switch actually learns which port each device is on gets its
          own full chapter later in this app.
        </p>
      ),
      visual: <LanMap devices={arpDevices} conflictIds={new Set()} packet={null} showMac />,
    },
    // -------------------- 5. All Aboard -------------------
    {
      section: "5. All Aboard",
      title: "Why Not All at Once?",
      story: {
        text: "Down the tracks, Pip can see cart after cart, each one now hitched to its own locomotive, just like his.\nPip: \"That many...\"\nClerk: \"This time, the data came out to about 4,649 packets.\"\nPip: \"Why not hook all the trains together and send them off in one go?\"\nClerk: \"If we connected them into one long shipment, this line would be stuck carrying nothing but your cheese the whole time. Sending each one separately means it can go the moment it's ready, without holding up everyone else waiting to use the same line.\"",
        illustration: <SceneCargoSlicing />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Connecting every packet into one long train would tie up the line for as long as that
            whole shipment takes — nobody else&rsquo;s data could get through until it finished.
            Keeping each packet independent lets it depart the moment it&rsquo;s ready.
          </p>
          <p>
            This is exactly why small, separate packets work so well on a shared line: many
            devices can interleave their traffic — a bit of Pip&rsquo;s cheese here, a bit of
            someone else&rsquo;s data there — instead of one giant transfer hogging the line for
            everyone else.
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
          Pip boarding alongside the crates is the picture-book version of something real: once a
          packet is ready, it doesn&rsquo;t wait around — it heads out right away, along whatever
          path was just worked out.
        </p>
      ),
    },
    {
      section: "5. All Aboard",
      title: "Riding the Rails",
      story: {
        text: "The train pulls away from the platform, rattling gently along the short line toward Dad's PC Station.\nPip: \"It's so quick — we're not even leaving the house, are we?\"\nA passing voice: \"Nope — straight through the Router, no detours.\"",
        illustration: <ScenePipOnTrain />,
      },
      body: (
        <p>
          No provider, no address-swapping, no long detour — a same-line delivery like this one
          only ever passes through the router, the same one Pip met back in Meet the Network.
        </p>
      ),
    },
    {
      section: "5. All Aboard",
      title: "Checking In",
      story: {
        text: "The train rolls into the platform at Dad's PC Station.\nA porter steps out, clipboard in hand, and walks straight to the locomotive.\nPorter: \"Let's see here...\"\nHe reads the little nameplate bolted to its front: AA:BB:CC:11:22:33.\nPorter: \"Yep. That's us, alright. This one's really come to the right station.\"\nPip: \"You check that for every single train?\"\nPorter: \"Every one. Doesn't matter how many pull in — if the name on the engine doesn't match ours, it's not for us, and we don't touch it.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "Nothing Broken?",
      story: {
        text: "Satisfied, the porter moves down the line of crates, giving each one a firm knock and a once-over.\nPorter: \"Mm-hm... mm-hm... good.\"\nPip: \"What are you checking now?\"\nPorter: \"Making sure nothing got torn open or banged up on the way over. A quick check, every time, before anyone touches what's inside.\"\nPip: \"And if something did happen to it?\"\nPorter: \"Let's just say — that's a story for another day.\"\nHe winks and moves on.",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "Unhitching",
      story: {
        text: "With both checks done, the porter unclips the locomotive from the crate.\nPorter: \"Alright, you're off duty.\"\nHe waves it toward a side track, where it rolls away on its own.\nPip: \"Where's it going?\"\nPorter: \"Back out — it was only ever here to get this one crate the last stretch of the way. Its job's done the moment we've got the crate in hand.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "One Last Address Check",
      story: {
        text: "The porter turns his attention to the crate itself now, alone on the platform without its engine.\nHe peels back a corner and checks the label glued underneath: 192.168.1.15.\nPorter: \"This address is ours, too. Matches the station name and the label both — no mix-ups.\"\nPip: \"Wait, didn't you already check the engine's name? Why check the crate too?\"\nPorter: \"Different question, really. The engine told us we're the right station. The label tells us this particular crate is really meant for us — and not, say, a neighbor sharing our platform.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "Out of Order",
      story: {
        text: "More trains keep rolling in, one after another — but not in the order they left.\nPip: \"Wait, that one says 12 on it. Didn't we just see number 4?\"\nPorter: \"Happens all the time. No two trains take exactly the same amount of time down the line.\"\nPip: \"So... is that a problem?\"\nPorter: \"Not even a little. Watch.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "Back Together",
      story: {
        text: "The porter checks the little number stamped on each crate as it arrives, and lines them up on the platform — not in the order they showed up, but in the order the numbers say: 1, 2, 3...\nAs each one clicks into place beside the last, the blocks melt seamlessly back together.\nPip: \"It's — it's whole again!\"\nPorter: \"As long as we know the order, it doesn't matter which one shows up first.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: PENDING,
    },
    {
      section: "5. All Aboard",
      title: "Delivered — the Short Way",
      story: {
        text: "A satisfying clunk, and the crates finish unloading — Pip right behind them.\nA porter at Dad's PC Station stamps the delivery log.\nPorter: \"Delivered — straight into the shared folder, right where it belongs.\"\nPip: \"That's the short way home. Didn't even need to go anywhere near the mainline for this one.\"",
        illustration: <SceneArrivalAtDadStation />,
      },
      body: (
        <p>
          The full-resolution photo lands in Dad&rsquo;s shared folder almost instantly — it
          never left the house, and never needed anything like the address-swapping trick a
          later chapter introduces for trips that actually leave home.
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
            <li>Before sending anything, a device slices data into small, labeled <Term id="packet">packets</Term> — each one only as big as the local line can carry in one go.</li>
            <li>Every address secretly has two parts: which line-group a station is on, and which station within it. A subnet mask (like /24) marks exactly where that boundary falls.</li>
            <li>Comparing the line-group part of two addresses tells you whether a destination is a neighbor on the same line — no mainline required if it is.</li>
            <li>A <Term id="mac-address">MAC address</Term> is a fixed, factory-burned ID — unlike an IP address, which the network assigns. <Term id="arp">ARP</Term> finds a device&rsquo;s MAC address by broadcasting the question, and the router&rsquo;s switch decides whether traffic needs to leave the house at all.</li>
          </ul>
          <p>
            With Dad&rsquo;s copy safely saved, Pip&rsquo;s ready to finish the real plan —
            getting that cheese photo up on the Cheese-Lovers&rsquo; Board for the whole world to
            see. That&rsquo;s a much longer trip, saved for later.
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
