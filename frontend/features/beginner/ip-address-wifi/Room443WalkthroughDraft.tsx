"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES, type Device } from "./network";
import {
  SceneAddressCheck,
  SceneGatewayDoor,
  SceneLanDesk,
  SceneLogbook,
  SceneRecordBook,
} from "./StorybookScenes";

/** DRAFT — Chapter 8 "Room 443" (ports), written 2026-11-27 to the v2
 * story design (~/workspace/networking-course/ch7-story-proposal.md),
 * and re-staged 2026-11-28 when the chapter order was swapped
 * (Atsushi's decision): the investigation follows the journey's
 * physical order, so the switching chapter ("Sorted by Name") now
 * opens the investigation, and this chapter is the stop at the
 * Gatekeeper's desk — Pip arrives at the Junction with this time's
 * crates (end of Chapter 7), and before they cross the gate he reads
 * the record of last time with the Gatekeeper. The evidence is one
 * line of the Gatekeeper's book (the NAT table) from that night; the
 * chapter reads that line piece by piece and clears the whole
 * departure side, while the cause stays missing: the book ends at the
 * gate. The chapter now ends with the crates handed over at the desk,
 * before the rewrite — the gate crossing is the next chapter's
 * stretch. Port's counterpart is a room (decided 2026-11-26): part of
 * the address, two-way, unlike a gate or a corridor. Honest premise,
 * kept throughout: the ports were there the first time too — the only
 * difference is that Pip never read them. The source port shown is
 * 51234, the proposal's placeholder for an ephemeral port. Port staging corrected 2026-11-28 (Atsushi's
 * questions): two different rooms with two different owners — the
 * phone's own room [source port] 51234, chosen by the phone and
 * meaningful only together with the phone's address, and the
 * Gatekeeper's room 60001, chosen at the desk at the rewrite, which is
 * the room replies are actually addressed to; the book's line pairs
 * the two halves. Story text annotates technical counterparts in []
 * (room [port], book [NAT table], …), the series' standing rule from
 * 2026-11-28. Illustrations are the existing StorybookScenes
 * placeholders. */
export function Room443WalkthroughDraft({
  onComplete,
  initialStep,
  onStepChange,
}: {
  onComplete: () => void;
  /** 0-based step to open on, from the page URL (?step=, 1-based) —
   * reloads and shared step links resume there. */
  initialStep?: number;
  /** Fires whenever the current step changes, so the playground can keep
   * the URL's ?step= in sync. */
  onStepChange?: (step: number, total: number) => void;
}) {
  const houseDevices: Device[] = DEFAULT_DEVICES;

  interface Step {
    section: string;
    title: string;
    story?: { text: string; illustration: ReactNode };
    body: ReactNode;
    visual?: ReactNode;
  }

  const steps: Step[] = [
    // ----------------------------- Welcome ---------------------------
    {
      section: "Welcome",
      title: "What you learn from this chapter",
      story: {
        text: "The crates roll across the Junction, to the Gatekeeper's desk — and stop.\nBefore the gate, Pip wants one thing.\nPip: \"Wait. Before they cross — I want to check last time.\"\nGatekeeper: \"Last time?\"\nPip: \"The record. It's in your book.\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The inside stretch is checked — Chapter 7 watched it, crate by crate. Now
            the crates stand at the Gatekeeper&rsquo;s desk, about to cross the gate.
            Before they do, Pip stops. The one piece of written evidence in this whole
            story is here: the record of last time&rsquo;s sending, one line in the
            Gatekeeper&rsquo;s book.
          </p>
          <p>
            Reading that line closely teaches this chapter&rsquo;s subject: an address
            is not finished at the number. It needs a room as well.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Questions First</li>
            <li>One Line in the Book</li>
            <li>The Numbers He Never Read</li>
            <li>Four Numbers</li>
            <li>This Time</li>
          </ol>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: at the desk, before this time&rsquo;s crates cross, Pip checks last
          time&rsquo;s departure, doubt by doubt — the address, the going out, the
          rewriting. All of it was right. Along the way he finds two
          numbers on the crates that he never read before: a room on the Board&rsquo;s
          side, and a room on his own. Four numbers together name one conversation. The
          cause of the failure is not in the book — the book ends at the gate.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------- 1. Questions First ---------------------
    {
      section: "1. Questions First",
      title: "A List of Questions",
      story: {
        text: "Pip: \"Why didn't it arrive?\"\nThe Gatekeeper does not answer at once.\nGatekeeper: \"One by one. First, we look at the record.\"\nHe opens his big book [NAT table], and turns to that night.",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Pip&rsquo;s question is the right one, and it is too big to answer whole.
            The Gatekeeper&rsquo;s way is the investigator&rsquo;s way: take it one doubt
            at a time, and check each against the record.
          </p>
          <p>
            The record is the book from Chapter 5 — the pairing written when last
            time&rsquo;s crates went out. Everything the gate knows about that night is
            in one line of it. This time&rsquo;s crates wait at the desk while he reads.
          </p>
        </div>
      ),
    },
    // ----------------------- 2. One Line in the Book ------------------
    {
      section: "2. One Line in the Book",
      title: "The Address Was Right",
      story: {
        text: "Pip: \"First — was the address wrong?\"\nThe Gatekeeper runs a paw down the line.\nGatekeeper: \"To: 203.0.113.50.\"\nGatekeeper: \"The number [IP address] from the Operator's note. Copied onto every crate.\"\nPip: \"So the address wasn't wrong.\"\nGatekeeper: \"The address was right.\"",
        illustration: <SceneRecordBook />,
      },
      body: (
        <p>
          Doubt one, cleared. The destination in the book is the number the lookup
          produced in Chapter 4 — the Board&rsquo;s own keeper&rsquo;s answer, written
          into the Operator&rsquo;s note and copied from there. No slip anywhere along
          that chain.
        </p>
      ),
    },
    {
      section: "2. One Line in the Book",
      title: "It Went Out",
      story: {
        text: "Pip: \"Did it even go out?\"\nGatekeeper: \"This line exists because your crates passed this desk.\"\nGatekeeper: \"And here — the return address [source address], rewritten. My hand.\"\nPip: \"It went out.\"\nGatekeeper: \"It went out. Whatever happened, happened past here.\"",
        illustration: <SceneLogbook />,
      },
      body: (
        <p>
          Doubt two, cleared. The line itself is the proof of passage: the book is only
          written when a crate is rewritten and sent on. The departure side of the
          journey — address, rewriting, the record — is all in order.
        </p>
      ),
    },
    // ------------------- 3. The Numbers He Never Read -----------------
    {
      section: "3. The Numbers He Never Read",
      title: "What's This Number?",
      story: {
        text: "Pip stares at the line.\nSomething in it, he has never seen before.\nPip: \"What's this number? 51234 — next to my .10. I don't know this number.\"\nGatekeeper: \"Your phone's room [source port].\"\nGatekeeper: \"When your phone sent the crates, it chose that room itself — for the answer to come back to, on your phone.\"\nPip: \"My phone chose it?\"\nGatekeeper: \"A room alone doesn't say which phone. Together with your .10, it names the end of this conversation, inside the house.\"\nGatekeeper: \"Chosen for this conversation. Given up when it ends.\"",
        illustration: <SceneAddressCheck />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The number is 51234 — Pip&rsquo;s own port for that night&rsquo;s sending: the
            source port. A reply addressed to the house&rsquo;s number alone could be for
            anyone in the house; the answer&rsquo;s last step, inside the phone, is this
            room — the conversation it belongs to.
          </p>
          <p>
            His phone chose it by itself, just for this conversation, and it is given up
            when the conversation ends. A port like this — chosen on the spot, kept
            briefly — is called an ephemeral port. Note whose port it is: the
            phone&rsquo;s own. The phone knows nothing of the router&rsquo;s port,
            assigned at the NAT rewrite — that is a different number, and it is in this
            same line. Step 8 reads it.
          </p>
        </div>
      ),
    },
    {
      section: "3. The Numbers He Never Read",
      title: "Room 443",
      story: {
        text: "Pip: \"Then the other side has a room too?\"\nGatekeeper: \"Read the line.\"\nPip: \"...443.\"\nGatekeeper: \"The Board's room [destination port]. The web's room.\"\nGatekeeper: \"That is where the Board's keeper waits, for every visitor.\"\nGatekeeper: \"It was written last time too, Pip. On every crate.\"\nPip: \"I just never read it.\"",
        illustration: <SceneRecordBook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            An address has two parts: the building, and the room. 203.0.113.50 is the
            building; 443 is the room where the Board&rsquo;s service waits. Web services
            wait at 443 — the same room, at every building on the web.
          </p>
          <p>
            Nothing was missing last time. The room numbers were written on every crate,
            by Pip&rsquo;s phone, as they always are. The only difference tonight is that
            Pip has read them.
          </p>
        </div>
      ),
    },
    // --------------------------- 4. Four Numbers ----------------------
    {
      section: "4. Four Numbers",
      title: "Four Numbers, One Name",
      story: {
        text: "The Gatekeeper reads the line one last time, slowly.\nGatekeeper: \"Your side: 192.168.1.10, room 51234 — your phone's address [local address], your phone's room.\"\nGatekeeper: \"My side: the house's outside number [global IP address], room 60001 — the room I chose, at this desk.\"\nGatekeeper: \"Their side: 203.0.113.50, room 443.\"\nGatekeeper: \"An answer comes back to my room. This line says whose it is.\"\nPip: \"Now this conversation has a name.\"",
        illustration: <SceneLogbook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Look at the outside half of the line, together with the destination: the
            house&rsquo;s global IP address, port 60001, 203.0.113.50, port 443. Those
            four values — the 4-tuple — pick out exactly one conversation from all the
            traffic in the world. They are the name the outside world knows this
            conversation by.
          </p>
          <p>
            And the line ties those four to the inside pair — the phone&rsquo;s IP address
            and source port. A reply arrives carrying the same four values in reverse;
            the line it matches is the conversation it belongs to, and the inside pair is
            where the router sends it on to.
          </p>
        </div>
      ),
      visual: (
        <div className="rounded-md border border-storybook-ink/10 bg-white/50 p-3 text-sm">
          <p className="font-semibold mb-2">One line of the NAT table — one conversation</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded bg-white/70 p-2">
              <p className="text-xs uppercase tracking-wide text-storybook-ink/60">Your side — the phone</p>
              <p>Local address: 192.168.1.10</p>
              <p>Source port: 51234 — the phone&rsquo;s own</p>
            </div>
            <div className="rounded bg-white/70 p-2">
              <p className="text-xs uppercase tracking-wide text-storybook-ink/60">The gate&rsquo;s side — the router</p>
              <p>Global IP address: the house&rsquo;s outside number</p>
              <p>Port: 60001 — chosen by the router</p>
            </div>
            <div className="rounded bg-white/70 p-2">
              <p className="text-xs uppercase tracking-wide text-storybook-ink/60">Their side — the Board</p>
              <p>203.0.113.50</p>
              <p>Destination port: 443 — the web&rsquo;s port</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      section: "4. Four Numbers",
      title: "Then Why?",
      story: {
        text: "Pip: \"Then why didn't it arrive?\"\nThe Gatekeeper closes the book.\nGatekeeper: \"Everything here was written right.\"\nGatekeeper: \"What happens past the gate is not in this book.\"\nPip looks down the main line, into the dark.\nSomewhere out there, the answer is — unwritten, in nobody's book.",
        illustration: <SceneGatewayDoor />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The desk check ends with the departure side fully
            cleared — and the cause unfound. That is a result, not a failure: it rules
            out everything the house controls.
          </p>
          <p>
            What remains is past the gate — the stretch no book covers. The only way to
            check it is to cross it, watching.
          </p>
        </div>
      ),
    },
    // ----------------------------- 5. This Time -----------------------
    {
      section: "5. This Time",
      title: "He Reads Them Himself",
      story: {
        text: "The Gatekeeper turns the book to a fresh page — tonight's line, not yet written.\nPip reads this time's labels himself, slowly.\nPip: \"To: 203.0.113.50, room 443.\"\nPip: \"From: 192.168.1.10, room 51234 — my address [local address], my room.\"\nPip: \"And you'll rewrite it. To the house's number — and your room.\"\nGatekeeper: \"60001. As always.\"\nPip: \"This time, I know what's written. All of it.\"",
        illustration: <SceneAddressCheck />,
      },
      body: (
        <p>
          The sending is the same sending. The difference is the sender: Pip now knows
          what is written on his packets — the destination IP address and port, his own
          IP address and source port — and what the router will rewrite them to, and
          why. The crates are in the Gatekeeper&rsquo;s hands now. Next chapter: through
          the gate, watching.
        </p>
      ),
    },
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>What this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>An address is an IP address plus a port. The IP address alone does not say who, inside the building, a packet is for.</li>
            <li>The Board waits at port 443 — the web&rsquo;s port, the same at every server.</li>
            <li>A reply needs a port too: the source port, chosen by the phone itself for that one conversation — an ephemeral port. At the router it is rewritten to the router&rsquo;s own port, and the NAT table pairs the two.</li>
            <li>The four values the outside world sees — the house&rsquo;s global IP address, the router&rsquo;s port, the Board&rsquo;s IP address, port 443 — are the 4-tuple: they name exactly one conversation. Replies are matched by reading the table line in reverse.</li>
            <li>The ports were there the first time too. Pip just never read them.</li>
          </ul>
          <p>Next chapter: through the gate — the first stretch of the outside, watched this time.</p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
  ];

  // Declared after `steps` so the URL's initial step can be clamped to
  // this chapter's real range (the MeetTheNetworkWalkthrough pattern).
  const [step, setStep] = useState(() =>
    initialStep !== undefined
      ? Math.max(0, Math.min(initialStep, steps.length - 1))
      : 0,
  );

  const total = steps.length;
  const current = steps[step];

  // Keep the playground (and through it, the URL) posted on step changes.
  useEffect(() => {
    onStepChange?.(step, total);
  }, [step, total, onStepChange]);
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

        {current.visual && <div className="space-y-3">{current.visual}</div>}
      </div>
    </div>
  );
}
