"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES, type Device } from "./network";
import {
  SceneBeyondHouse,
  SceneCgnatCity,
  SceneGatewayDoor,
  SceneLanDesk,
  SceneNeighborhoodMap,
  SceneOceanCrossing,
  SceneRouterCloseup,
} from "./StorybookScenes";

/** DRAFT — Chapter 9 "Junction by Junction" (routing; chapter title
 * provisional), written 2026-11-28 to the v1 story design
 * (~/workspace/networking-course/ch9-story-proposal.md). The arrival
 * arc's investigation, chapter three and last: the outside road, from
 * the gate to the Board's building. The form is the re-sending itself,
 * as in Chapter 7 — Pip travels with the crates; the chapter opens at
 * the Gatekeeper's desk, where Chapter 8 handed the crates over, and
 * the rewrite and gate crossing are watched this time. Teaching
 * content: outside routers forward packet by packet by the
 * destination IP address, consulting a routing table of districts
 * (prefixes) and directions, and decide only the next hop; no keeper
 * knows the whole road, and the whole road is written down nowhere
 * (Chapter 6's "who knows what" angle, paid off from the outside);
 * the destination IP address and port never change on the road — only
 * the per-stretch wrapping (the next hop's MAC address) is stripped
 * and replaced at each junction; and outside junctions keep no record
 * of individual packets, so where the first photo vanished is
 * unknowable in principle — the in-story cause stays unknown
 * (decided), and the crowded-junction step shows only that a loss
 * could happen unwitnessed, never that it did. The chapter ends at
 * the far edge: the building's own stretch and the posting are the
 * next chapter. Story text annotates technical counterparts in []
 * (the series' standing rule from 2026-11-28); explanation text uses
 * the technical terms directly. Illustrations are the existing
 * StorybookScenes placeholders. */
export function JunctionByJunctionWalkthroughDraft({
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
        text: "The crates stand at the Gatekeeper's desk.\nThe record is checked. The questions are answered.\nGatekeeper: \"Now they cross.\"\nPip: \"And I cross with them.\"\nGatekeeper: \"Then watch my hands, Pip. Every stroke.\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The record is checked and the questions are answered. What remains is the
            road itself — and this chapter travels its last stretch: through the gate,
            and along the outside road to the Board&rsquo;s building.
          </p>
          <p>
            Two things will be learned on the way. How the outside road works: junction
            by junction, each keeper deciding only the next stretch. And what the
            outside road does not do: it keeps no record — which is why where the first
            photo vanished can never be found out.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Through the Gate</li>
            <li>The Outside Road</li>
            <li>What No One Wrote Down</li>
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
          In short: Pip crosses the gate with the crates and rides the outside road. At
          every junction, a keeper reads the destination number and sends the crates
          down one line, by a chart of districts and directions. No keeper knows the
          whole road, and no one writes anything down. The stretch ends at the
          Board&rsquo;s building — with this time&rsquo;s journey fully watched, and last
          time&rsquo;s fate still unknown.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------- 1. Through the Gate --------------------
    {
      section: "1. Through the Gate",
      title: "Rewritten, Watched",
      story: {
        text: "The Gatekeeper takes the first crate's label, and rewrites it — slowly.\nGatekeeper: \"From: the house's outside number [global IP address] — and room [port] 60001.\"\nHe writes the pairing in his big book [NAT table].\nPip: \"The same as last time.\"\nGatekeeper: \"The same. It was always written right.\"\nThe crates roll to the gate — and through it.\nFor the first time, Pip passes through the gate.",
        illustration: <SceneGatewayDoor />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The rewrite is Chapter 5&rsquo;s, now watched and understood: the source
            address is replaced — the house&rsquo;s global IP address and the
            router&rsquo;s port, 60001 — and the pairing is written in the NAT table.
          </p>
          <p>
            From this gate onward, the destination IP address and the destination port
            are never changed again, by anyone. Only the wrapping for each stretch is
            replaced, junction by junction. And Pip has never been past the gate: every
            keeper from here on is a stranger.
          </p>
        </div>
      ),
    },
    // ------------------------- 2. The Outside Road --------------------
    {
      section: "2. The Outside Road",
      title: "The First Junction",
      story: {
        text: "The line runs on, to a junction bigger than the house's — lines leaving in every direction.\nPip: \"Which line is the Board's?\"\nKeeper: \"Read me the number.\"\nPip: \"203.0.113.50.\"\nThe keeper looks at his chart [routing table].\nKeeper: \"203... That whole district goes down the third line.\"\nPip: \"You know the Board, then?\"\nKeeper: \"I know the direction. The place, I have never seen.\"",
        illustration: <SceneBeyondHouse />,
      },
      body: (
        <div className="space-y-3">
          <p>
            A router reads the destination IP address on each packet and decides one
            thing: the next line. The decision comes from its routing table.
          </p>
          <p>
            The table does not list every address in the world. It lists districts —
            groups of addresses that start the same, a prefix — and the direction each
            district travels. That is why one chart is enough, and why the keeper can
            know the direction to a place he has never seen.
          </p>
        </div>
      ),
    },
    {
      section: "2. The Outside Road",
      title: "Only the Next Stretch",
      story: {
        text: "Another junction. Another keeper. The same motion: read the number, look at the chart, point.\nPip: \"How many junctions are there, to the Board?\"\nKeeper: \"I don't know.\"\nPip: \"You don't know the road?\"\nKeeper: \"I know my lines. I know which of them your number travels.\"\nKeeper: \"The rest is other keepers' business.\"",
        illustration: <SceneNeighborhoodMap />,
      },
      body: (
        <div className="space-y-3">
          <p>
            This is hop-by-hop forwarding. Each router makes exactly one local decision
            — the next hop — from its own table. No router holds the whole path, and
            the whole path is written down nowhere: it exists only as the sum of these
            local decisions, made one junction at a time.
          </p>
          <p>
            Chapter 6&rsquo;s angle, seen from the outside: every keeper knows a piece;
            nobody knows the whole road. The road is not promised, either — another
            packet, another day, may be sent a different way. What Pip is watching is
            this journey, not the journey.
          </p>
        </div>
      ),
    },
    {
      section: "2. The Outside Road",
      title: "The Number Never Changes",
      story: {
        text: "At the next junction, Pip watches the keepers re-wrap a crate for the next stretch.\nPip: \"You changed the wrapping.\"\nKeeper: \"The wrapping is for this stretch only. A new one at every junction.\"\nPip: \"And the label inside?\"\nKeeper: \"Untouched. The number [IP address] is read at every junction — and changed at none.\"",
        illustration: <SceneRouterCloseup />,
      },
      body: (
        <p>
          On each stretch, delivery is local, exactly as inside the house in Chapter 7:
          the frame is wrapped for that stretch, addressed to the next junction by its
          MAC address on that line. At each junction the wrapping is stripped and
          replaced. The IP address and the port inside are read at every junction and
          changed at none — that is what makes the IP address the address of the whole
          journey.
        </p>
      ),
    },
    // --------------------- 3. What No One Wrote Down ------------------
    {
      section: "3. What No One Wrote Down",
      title: "The Crowded Junction",
      story: {
        text: "A junction so big that Pip cannot see its far side. Crates stream in from every line. The keepers work without pause.\nPip: \"If a crate fell here...\"\nKeeper: \"Fell?\"\nPip: \"Last time. Somewhere on this road, my photo—\"\nKeeper: \"Last time is not written here. Nothing is written here.\"\nPip watches the stream of crates go by.\nPip: \"If one fell... no one would know.\"",
        illustration: <SceneCgnatCity />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Outside junctions keep no record of individual packets. There is no book
            pairing senders with destinations, and no board that learns names — a
            router&rsquo;s table holds directions, not history.
          </p>
          <p>
            A packet dropped at a crowded junction leaves no trace there. Nobody is
            notified, and nothing is written. So the question &ldquo;where did the first
            photo vanish?&rdquo; has no answer stored anywhere — not because it was
            hidden, but because the road never wrote it down.
          </p>
          <p>
            This stretch cannot be cleared the way the inside was. It can only be
            watched — this time.
          </p>
        </div>
      ),
    },
    {
      section: "3. What No One Wrote Down",
      title: "The Last Junction",
      story: {
        text: "Keeper: \"Your number travels no further with me.\"\nKeeper: \"The building's own stretch is next. That line — to the lights.\"\nFar off, at the end of the line, the Board's building stands.\nPip: \"We made it. All the way — and I saw every stretch.\"\nPip: \"...This time.\"",
        illustration: <SceneOceanCrossing />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The outside road is done: the gate, the junctions, the far edge — all of it
            watched, this time, and nothing lost that Pip could see. The crates pass to
            the building&rsquo;s own stretch, the last piece of the road.
          </p>
          <p>
            What happened on the first journey stays unknown. That is the honest end of
            the investigation&rsquo;s road. Next chapter: the building&rsquo;s stretch,
            room 443 — and the posting itself.
          </p>
        </div>
      ),
    },
    // ----------------------------- Wrap-up ----------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>What this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Outside the house, routers forward packets junction by junction, by the destination IP address. Each consults its routing table — districts and directions — and decides only the next stretch.</li>
            <li>No keeper knows the whole road. The path is the sum of local decisions, and it is written down nowhere.</li>
            <li>The destination IP address and port never change on the road. Only the local wrapping is stripped and replaced at each junction.</li>
            <li>Outside junctions keep no record of individual packets. Where the first photo vanished cannot be known — the road never wrote it down.</li>
            <li>This time, the crates crossed the outside road watched at every stretch.</li>
          </ul>
          <p>Next chapter: the building&rsquo;s own stretch — and the posting.</p>
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
