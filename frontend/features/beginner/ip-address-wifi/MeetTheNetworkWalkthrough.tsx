"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES } from "./network";
import {
  NetworkChainDiagram,
  SignalDistanceDiagram,
  InterferenceDiagram,
  NetworkOfNetworksDiagram,
  WifiLockDiagram,
  AddressAnalogyDiagram,
  ClientServerDiagram,
} from "./NetworkDiagrams";
import {
  SceneHallwayBox,
  SceneWalkingSignal,
  SceneTwoBands,
  SceneRouterCloseup,
  SceneRouterModem,
  SceneLanDesk,
  SceneBeyondHouse,
  SceneWorldNetworks,
  SceneWifiLock,
  ScenePhoneNumber,
  SceneReadyToUpload,
  SceneFallingAsleep,
  SceneWakingAtStation,
} from "./StorybookScenes";

/** Chapter 1 "Meet the Network" from the beginner story-based redesign (see
 * docs/beginner-story-redesign.md and docs/network-train-analogy.md). Same
 * plot/illustrations as before — Pip's own Wi-Fi troubleshooting gives every
 * foundational term a concrete reason to come up — but every explanation
 * now leans on Dad's favorite way of making sense of networks: as a railway
 * system (devices = stations, Wi-Fi = an invisible rail, data = passengers,
 * the internet = the whole connected rail network). The chapter ends with
 * Pip falling asleep before he ever sends his photo, and waking up literally
 * inside that railway world — the twist that turns the analogy into the
 * literal setting for every chapter from here on, where Pip experiences the
 * network firsthand instead of just hearing it explained. This is also the
 * FIRST chapter converted to the train framing; the rest of the course
 * still uses the old wording until they're each converted in turn — see the
 * chat that made this call for why (existing terminology decisions from
 * earlier in the project were deliberately not treated as sacred here). */
export function MeetTheNetworkWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Chasing the Signal" interference sandbox ---
  const [wallCount, setWallCount] = useState<0 | 1 | 2>(2);

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
            Meet Pip, a mouse whose Wi-Fi is acting up in his own room. Chasing down why gives you
            every basic term for how a home network fits together — Dad explains all of it his own
            favorite way, as a railway system — before Pip ever gets around to sharing a photo with
            the world.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Chasing the Wi-Fi</li>
            <li>The Home Network</li>
            <li>An Address of His Own</li>
            <li>A Strange Dream</li>
          </ol>
        </div>
      ),
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: Pip chases a weak Wi-Fi signal from his room, meets the router and the modem
          behind it, learns what a home network actually is — and picks up an address of his own
          along the way. Dad explains every bit of it as a railway system, and by the end, that
          railway stops feeling like just an analogy.
        </p>
      ),
      visual: <NetworkChainDiagram />,
    },
    // ---------------------------- The story ---------------------------
    {
      section: "1. Chasing the Wi-Fi",
      title: "A Weak Signal",
      story: {
        text: "Pip is an ordinary mouse, living in an ordinary house. Dinner just finished, and he's back in his room for the night, trying to send a photo from his phone.\nPip: \"Ugh, so slow. Did Dad start streaming something again?\"\nHis Wi-Fi signal is barely holding on, right here in his own room.\nPip: \"I wonder if Dad's in his room...\"\nPip steps out into the hallway.\nPip: \"Oh, right — the Wi-Fi comes from that white box.\"\nDown the dim hallway sits a small box, glowing faintly.\nSomewhere between his phone and that little box, something is supposed to be carrying his data through — and right now, it isn't.",
        illustration: <SceneHallwayBox />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Pip&rsquo;s phone and the router talk over radio waves — that&rsquo;s{" "}
            <Term id="wifi">Wi-Fi</Term>. Picture it as a rail nobody can actually see: an
            invisible track laid straight through the air, carrying data instead of trains. Like
            any signal riding on radio waves, it fades the farther that track has to stretch.
          </p>
          <p>
            That&rsquo;s why a room at the far end of the house sits at the far end of that
            invisible rail, and naturally gets a weaker signal than a spot standing right next to
            the router itself.
          </p>
        </div>
      ),
      visual: <SignalDistanceDiagram />,
    },
    {
      section: "1. Chasing the Wi-Fi",
      title: "Chasing the Signal",
      story: {
        text: "Pip creeps closer, checking the signal at every step along the way.\nPip: \"Barely anything back in my room... a bit stronger out here... and full strength right next to the box!\"\nPip: \"So it's not just about distance — that wall did something too.\"\nThe thicker the wall between him and the router, the weaker the signal gets — that's interference.",
        illustration: <SceneWalkingSignal />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Distance isn&rsquo;t the only thing that weakens a signal — anything physical in its
            way does too. Walls, floors, even furniture sit right across that invisible rail, and
            can block or scatter it before it arrives.
          </p>
          <p>
            Blocking or weakening a signal like this is called <Term id="interference">
              interference
            </Term>
            . Try adding walls below and watch the signal drop.
          </p>
        </div>
      ),
      controls: (
        <div className="flex flex-wrap gap-2">
          {(["Open air", "1 wall", "2 walls"] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setWallCount(i as 0 | 1 | 2)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                wallCount === i
                  ? "bg-storybook-accent text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ),
      visual: <InterferenceDiagram wallCount={wallCount} />,
      resetAction: () => setWallCount(2),
    },
    {
      section: "1. Chasing the Wi-Fi",
      title: "Two Speeds to Choose From",
      story: {
        text: "Pip nearly jumps out of his fur — someone's right behind him.\nDad: \"What are you up to?\"\nPip: \"Aah! Oh — it's just you, Dad. Don't sneak up on me like that.\"\nDad: \"Sorry, sorry. You looked like you were wandering around out here.\"\nPip explains what's going on.\nDad: \"Ah, this I can explain — you know how I love trains. Think of it as two different rail services running side by side. 5 gigahertz is the express: faster up close, but it can't push through walls. 2.4 gigahertz is the local, all-stops line: slower, but it reaches farther and shrugs off walls better.\"\nPip: \"Huh — so it's not one Wi-Fi, it's two lines, and they trade off speed for reach.\"\nThat tradeoff, reach versus speed, is exactly what separates the 2.4GHz and 5GHz bands.\nPip: \"Oh, right — I think I saw '5GHz' and '2.4GHz' written on that white box.\"",
        illustration: <SceneTwoBands />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A router can broadcast on more than one <Term id="wifi-band">Wi-Fi band</Term> at
            once — commonly 2.4GHz and 5GHz, the two rail services Dad mentioned, both running on
            the same invisible track between the router and every device in the house.
          </p>
          <p>
            Neither band wins outright: 5GHz is the express, faster up close, while 2.4GHz is the
            local line, reaching farther and shrugging off walls better. Picking one is a straight
            reach-versus-speed tradeoff.
          </p>
        </div>
      ),
      visual: (
        <div className="w-full max-w-xl overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                <th className="p-2 font-medium"> </th>
                <th className="p-2 font-medium">2.4GHz (local line)</th>
                <th className="p-2 font-medium">5GHz (express)</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Range</td>
                <td className="p-2">Farther</td>
                <td className="p-2">Shorter</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="p-2 text-neutral-500">Speed</td>
                <td className="p-2">Slower</td>
                <td className="p-2">Faster</td>
              </tr>
              <tr>
                <td className="p-2 text-neutral-500">Through walls</td>
                <td className="p-2">Better</td>
                <td className="p-2">Worse</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      section: "1. Chasing the Wi-Fi",
      title: "The Router",
      story: {
        text: "Pip crouches down by the blinking box in the corner of the study.\nPip: \"There it is — it really does say 5GHz and 2.4GHz. Both lights are lit, so I guess both lines come out of this one box?\"\nDad: \"That's right. In my head, that box is the junction station — every device's own little station in the house connects back to it, and it's what bundles all those local trips into one connection.\"\nDad explains, clearly happy to be asked.\nThat box, bundling one connection for every device in the house, is the router.",
        illustration: <SceneRouterCloseup />,
      },
      body: (
        <p>
          A <Term id="router">router</Term> is the box that takes one internet connection and
          spreads it to every device in the house — phones, PCs, smart devices, all through the
          same one box. Dad&rsquo;s way of picturing it: the router is the junction station where
          every device&rsquo;s own little station meets, before anything heads farther out.
        </p>
      ),
      visual: (
        <LanMap devices={DEFAULT_DEVICES} conflictIds={new Set()} packet={null} showIp={false} />
      ),
    },
    {
      section: "1. Chasing the Wi-Fi",
      title: "The Modem",
      story: {
        text: "Pip: \"Oh, there's something else here too.\"\nPip notices another small box tucked behind the router.\nDad: \"Ah, that one's the modem.\"\nPip: \"Huh? What's that?\"\nDad: \"If the router's our junction station, the modem is the one platform in this whole house with a line running out to the provider's own mainline, out past our street.\"\nTwo boxes, two jobs: the modem reaches the provider's mainline, and the router bundles that connection for everyone home.",
        illustration: <SceneRouterModem />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A <Term id="modem">modem</Term> has a different job: it&rsquo;s what actually
            connects the house to the internet provider outside, over a line running out to the
            street — in Dad&rsquo;s railway picture, the one platform with track leading out to
            the provider&rsquo;s own mainline.
          </p>
          <p>
            Two boxes, two jobs — the modem reaches out to that outside mainline, and the router
            bundles that one connection for everyone at home.
          </p>
        </div>
      ),
      visual: (
        <div className="space-y-3">
          <div className="w-full max-w-xl grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
              <div className="text-sm font-medium text-neutral-800">Router</div>
              <div className="text-xs text-neutral-500">
                The junction station bundling every device in the house
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center space-y-1">
              <div className="text-sm font-medium text-neutral-800">Modem</div>
              <div className="text-xs text-neutral-500">
                The platform with a line out to the provider&rsquo;s mainline
              </div>
            </div>
          </div>
          <NetworkChainDiagram highlight="modem" />
        </div>
      ),
    },
    {
      section: "2. The Home Network",
      title: "Everyone on the Same Team",
      story: {
        text: "Pip looks around the study: his phone in hand, and Dad's PC humming away on the desk right there.\nPip: \"Is Dad's PC connected to the same router too?\"\nDad: \"Yep — we've only got the one junction station in this house.\"\nDad: \"It's what lets your phone and my PC ride between each other, and everything else in the house too — all on our own little line.\"\nA group of stations like this, all sharing one junction in one place, is called a LAN.",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every device that shares one router like this — Pip&rsquo;s phone, Dad&rsquo;s PC,
            even a smart bulb plugged in down the hall — belongs to the same <Term id="lan">
              LAN
            </Term>
            : our own little private line, running entirely inside this one house.
          </p>
          <p>
            Nothing inside a LAN needs to go anywhere near the outside mainline to reach anything
            else inside the same LAN — the router alone is enough to pass a trip between them.
          </p>
        </div>
      ),
      visual: (
        <LanMap devices={DEFAULT_DEVICES} conflictIds={new Set()} packet={null} showIp={false} />
      ),
    },
    {
      section: "2. The Home Network",
      title: "Farther Than the House",
      story: {
        text: "Pip: \"So the router's job is handling trips inside our house.\"\nThen Pip realizes something.\nPip: \"But earlier my phone loaded a news site from outside of our house. That's not just our little line, is it?\"\nDad: \"Nope. Past our router is the internet — every other line out there, all stitched together into one enormous rail network.\"\nPip: \"Whoa, so even the next town over is connected through it? That's amazing.\"\nAnything beyond his own LAN's front platform, Pip realizes, is simply the internet.",
        illustration: <SceneBeyondHouse />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Anything past the edge of a LAN is simply the internet: every other network in the
            world, connected together outside this one house — in railway terms, every other
            line out there, all stitched onto the same enormous rail network.
          </p>
          <p>
            A LAN&rsquo;s router is the one platform between the two — every trip headed beyond
            the house passes through it first.
          </p>
        </div>
      ),
      visual: (
        <LanMap
          devices={DEFAULT_DEVICES}
          conflictIds={new Set()}
          packet={null}
          showIp={false}
          showInternet
        />
      ),
    },
    {
      section: "2. The Home Network",
      title: "A World of Networks",
      story: {
        text: "Dad: \"Not just the next town — networks all over the world are connected through the internet.\"\nPip: \"Wait, seriously? Even the other side of the earth?\"\nDad: \"Yep. Picture every home, every office, every country running its own little line — and all of them wired together into one giant network of networks. That's why it's called the 'inter' 'net.'\"\nThat's the idea baked right into the word itself: a network connecting networks, an inter-net.",
        illustration: <SceneWorldNetworks />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The internet isn&rsquo;t one giant network — it&rsquo;s countless separate networks,
            homes, offices, whole countries, each running its own line, all wired together into
            one connected whole.
          </p>
          <p>
            That&rsquo;s exactly the idea baked into the name: a network of networks, an{" "}
            <strong>inter</strong>-<strong>net</strong>.
          </p>
        </div>
      ),
      visual: <NetworkOfNetworksDiagram />,
    },
    {
      section: "2. The Home Network",
      title: "Why the Lock?",
      story: {
        text: "Pip: \"Wait — does that mean people on the other side of the world could look right into our network?\"\nDad: \"Don't worry, there are plenty of layers of security in the way. The easiest one to picture is the password.\"\nPip: \"Oh, right — you can't even join our Wi-Fi without typing one in.\"\nDad: \"Think of it as the key to our own little line. Without it, anyone walking by outside could hop aboard. The password keeps this line just ours.\"\nThat password is the lock keeping this LAN private to the people who know it.",
        illustration: <SceneWifiLock />,
      },
      body: (
        <div className="space-y-2">
          <p>
            A Wi-Fi password is a lock at the network&rsquo;s front platform: only someone who
            knows it can board, so a stranger walking by outside can&rsquo;t quietly hop on.
          </p>
          <p>
            It&rsquo;s one of several layers of security protecting a home network — the easiest
            one to see, since it&rsquo;s the one every device has to type in.
          </p>
        </div>
      ),
      visual: <WifiLockDiagram />,
    },
    {
      section: "3. An Address of His Own",
      title: "A Number of His Own",
      story: {
        text: "Pip: \"So does that mean every phone and PC in this house uses the same password?\"\nDad: \"That's right — they're all connected to the same Wi-Fi router.\"\nDad: \"Let me show you the list of devices connected to our Wi-Fi, too.\"\nDad opens the router's app on his own phone.\nPip: \"Whoa, there's a whole list! 'Pip's Phone — 192.168.1.10.' Is that... me?\"\nDad: \"Every station on a line gets a number like that. Four numbers separated by dots — an IP address.\"\nFour numbers separated by dots — that's an IP address, like a station number for a device on the network.",
        illustration: <ScenePhoneNumber />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Every device on a network gets its own <Term id="ip-address">IP address</Term> —
            four numbers separated by dots, like 192.168.1.10, Pip&rsquo;s own phone. In
            Dad&rsquo;s railway picture, it&rsquo;s the number stenciled on a device&rsquo;s own
            little station.
          </p>
          <p>
            It works the same way a station number would: it&rsquo;s how the router knows
            exactly which station — which device — a trip is meant for.
          </p>
        </div>
      ),
      visual: <LanMap devices={DEFAULT_DEVICES} conflictIds={new Set()} packet={null} showIp />,
    },
    {
      section: "3. An Address of His Own",
      title: "Just a Room Number",
      story: {
        text: "Pip: \"So my address is 192.168.1.10? It's kind of amazing I've had an address this whole time without even knowing it.\"\nDad: \"Well, to be precise, that's not the whole address. It's the number of a little local stop, not the ID that means anything out on the mainline.\"\nPip: \"Huh? So even if I told everyone '192.168.1.10,' a letter still wouldn't reach me from outside?\"\nDad: \"Exactly. That number only means something inside our own line. Out on the mainline, our whole house needs a completely different number — one that actually means something out there.\"\nA station number like that only makes sense inside its own little line — reaching the wider world will need something more.",
        illustration: <ScenePhoneNumber />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Line it up against a full postal address and the gap is obvious: 192.168.1.10 only
            fills in the &ldquo;room number&rdquo; level. Which building, which city, which
            country it&rsquo;s even in — that&rsquo;s all one job, done by a single{" "}
            <Term id="global-ip">global IP address</Term>.
          </p>
          <p>
            That&rsquo;s exactly what makes 192.168.1.10 a{" "}
            <Term id="private-ip">private address</Term> instead: reused by countless other
            homes&rsquo; routers, and meaningless on its own without a global address to say
            which house it&rsquo;s in. In Dad&rsquo;s railway terms, it&rsquo;s a number that
            only means something on our own little line — the mainline needs its own, separate
            numbering entirely.
          </p>
        </div>
      ),
      visual: <AddressAnalogyDiagram />,
    },
    {
      section: "3. An Address of His Own",
      title: "Ready to Send",
      story: {
        text: "Pip remembers why he opened his phone in the first place.\nPip: \"Right — I still need to upload my photo to the Cheese-Lovers' Board.\"\nPip: \"It's not on my phone, not on Dad's PC. It must live on some computer far away — out in the cloud, as Dad calls it.\"\nDad: \"In my head, that's just a big station too — a huge one, always open, always waiting for someone to pull in.\"\nThat faraway computer is a server; Pip's own phone, reaching out to it, is a client. Sending his photo across is what \"uploading\" means.",
        illustration: <SceneReadyToUpload />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The Cheese-Lovers&rsquo; Board doesn&rsquo;t live on Pip&rsquo;s phone or Dad&rsquo;s
            PC — it lives on a <Term id="server">server</Term>, a faraway computer that&rsquo;s
            always on, waiting for visitors. In Dad&rsquo;s railway picture, it&rsquo;s a huge
            station somewhere out on the mainline that never closes.
          </p>
          <p>
            Pip&rsquo;s phone, reaching out to it, is the <Term id="client">client</Term> —
            the station that departs. Sending his photo across to that server is what
            &ldquo;uploading&rdquo; means.
          </p>
        </div>
      ),
      visual: <ClientServerDiagram />,
    },
    // -------------------------- 4. A Strange Dream ------------------------
    {
      section: "4. A Strange Dream",
      title: "Lights Out",
      story: {
        text: "Pip's thumb hovers over the upload button.\nPip: \"Okay, this time for real —\"\nBut a yawn cuts him off before he can finish the thought. It's been a long night of hallways, walls, and boxes with blinking lights.\nPip: \"...I'll just close my eyes for a second.\"\nHis phone slips from his hand, screen still open to the photo, still unsent.\nWithin a minute, Pip's fast asleep — his head still full of junction stations, mainlines, and station numbers.",
        illustration: <SceneFallingAsleep />,
      },
      body: (
        <p className="text-storybook-ink/40 italic">(Technical explanation — not yet written.)</p>
      ),
    },
    {
      section: "4. A Strange Dream",
      title: "Waking at a Station",
      story: {
        text: "Pip: \"...huh?\"\nHe opens his eyes to the low rumble of an engine and the smell of hot metal.\nHe's standing on a platform. Rails stretch out in both directions, further than he can see, hopping between little stations that look — oddly — like his own phone, and Dad's PC, and that blinking box in the hallway.\nA train pulls in beside him, doors sliding open.\nPip: \"...this is what Dad's been talking about, isn't it? Except it's not a picture in my head anymore. I'm actually standing in it.\"\nSomewhere out past the edge of the platform, an enormous network of rails hums quietly, carrying countless trips he can't yet see the end of.\nTo be continued.",
        illustration: <SceneWakingAtStation />,
      },
      body: (
        <p className="text-storybook-ink/40 italic">(Technical explanation — not yet written.)</p>
      ),
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Wi-Fi signal strength fades with distance and <Term id="interference">interference</Term>{" "}
              like walls; a router can offer more than one <Term id="wifi-band">Wi-Fi band</Term>,
              trading reach for speed.
            </li>
            <li>
              A <Term id="router">router</Term> spreads one connection to every device in the
              house; a <Term id="modem">modem</Term> connects that house to the internet provider
              outside.
            </li>
            <li>
              Devices sharing one router form a <Term id="lan">LAN</Term>; anything beyond it is
              simply the internet — a network of networks.
            </li>
            <li>
              A Wi-Fi password locks a LAN to people who know it. Every device also gets its own{" "}
              <Term id="ip-address">IP address</Term> — a <Term id="private-ip">private</Term>{" "}
              one at home, though reaching the internet needs a <Term id="global-ip">global</Term>{" "}
              one instead.
            </li>
            <li>
              A <Term id="client">client</Term> like Pip&rsquo;s phone reaches out to a{" "}
              <Term id="server">server</Term> far away — sending data to one is what
              &ldquo;uploading&rdquo; means.
            </li>
            <li>
              Dad explains all of it as a railway system — and by the end of the chapter, Pip
              wakes up standing right inside it.
            </li>
          </ul>
        </div>
      ),
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
