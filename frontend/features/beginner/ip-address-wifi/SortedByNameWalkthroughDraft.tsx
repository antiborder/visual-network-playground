"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES, type Device } from "./network";
import {
  SceneArpBroadcast,
  SceneLanDesk,
  ScenePipsPhone,
  SceneRecordBook,
  SceneSwitchDecision,
  SceneWalkingSignal,
} from "./StorybookScenes";

/** DRAFT — Chapter 8 "Sorted by Name" (LAN switching), written
 * 2026-11-28 to the v2 story design
 * (~/workspace/networking-course/ch8-story-proposal.md). The arrival
 * arc's investigation, chapter two: the first stretch of the road,
 * inside the house, from Pip's station to the Junction. The chapter's
 * form is the re-sending itself — Pip travels WITH the crates whose
 * labels he wrote by hand at the end of Chapter 7, and everything the
 * Operator explains is explained about these very crates; there is no
 * side demonstration, and Momo does not appear. Teaching content
 * (curriculum items 44–45): inside the house, frames are forwarded by
 * the station's name [MAC address], not by the number [IP address],
 * which belongs to the whole journey and is not read on this stretch;
 * on this stretch the destination name is the Junction itself, whose
 * Operator receives the crates and passes them across the station to
 * the Gatekeeper's desk (the gate crossing itself is the next
 * chapter's stretch); the Operator's board [MAC table] learns each
 * name's line from arriving crates' senders, quiet stations' entries
 * fade (aging), and a name not on the board is sent down every line
 * but the one it came from (flooding) — only the addressed station
 * takes it, and its answer puts the name on the board. Conclusion of
 * the stretch: inside the house a crate cannot get lost, so the photo
 * did not vanish here. Story text annotates technical counterparts in
 * [] (the series' standing rule from 2026-11-28); explanation text
 * uses the technical terms directly. Illustrations are the existing
 * StorybookScenes placeholders. Note: this chapter is written to the
 * proposal's premise that Chapter 7 ends with the addressing finished
 * and the journey beginning here; Chapter 7's Step 10 currently sends
 * the crates out already — that seam is a known, still-open adjustment
 * (see the proposal's 未決). */
export function SortedByNameWalkthroughDraft({
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
        text: "Clerk: \"Off again?\"\nPip: \"Off again. But this time I'm not just seeing them off. I'm going with them.\"\nClerk: \"With them?\"\nPip: \"Last time, I only watched them leave. This time, I watch everything.\"\nClerk: \"Then watch closely. The Junction first.\"\nPip: \"The Junction first.\"",
        illustration: <ScenePipsPhone />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The crates are addressed — Pip wrote the labels himself, and read all four
            numbers aloud. Now the journey begins again, and this time Pip travels with
            them, stretch by stretch. The first stretch is the one inside the house:
            from his own station to the Junction.
          </p>
          <p>
            What this chapter checks is how things are sorted inside the house. The
            answer is not the number on the crates. It is the name.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>The First Stretch</li>
            <li>At the Junction</li>
            <li>Checked</li>
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
          In short: Pip rides with his crates along the inside stretch. At the Junction,
          the Operator sorts by name, not by number — using a board that learns each
          name&rsquo;s line from the crates that arrive, forgets quiet stations, and,
          when a name is missing, sends the crate down every line at once. The stretch
          ends with a cleared name: inside the house, a crate cannot get lost.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------- 1. The First Stretch -------------------
    {
      section: "1. The First Stretch",
      title: "On the Line",
      story: {
        text: "The crates leave Pip's station and roll along the line.\nFour thousand, six hundred and forty-nine of them, in a long row — with Pip following behind.\nEvery line in the house leads to the Junction.\nPip: \"The Junction first. From here on, I don't look away.\"",
        illustration: <SceneWalkingSignal />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Every line in the house runs to one place: the Junction. On this stretch
            there is no choosing of roads — a frame leaving any station in the house
            arrives at the Junction, and the only sorting in the house happens there,
            on arrival.
          </p>
          <p>
            Nothing in this chapter is demonstrated on the side. Everything the Operator
            explains, he explains about these very crates, carrying this very photo.
          </p>
        </div>
      ),
    },
    // -------------------------- 2. At the Junction --------------------
    {
      section: "2. At the Junction",
      title: "Sorted by Name",
      story: {
        text: "Pip: \"Operator — did you see that? My crates were passed to the Gatekeeper's desk the moment they arrived.\"\nOperator: \"I sort by name.\"\nPip: \"You never looked at the number. And the number is the address — 203.0.113.50.\"\nOperator: \"The number [IP address] is the address for the whole journey. Inside the house, crates move by name [MAC address].\"\nOperator: \"On this stretch, the name on your crates is this station. I receive them, and pass them to the Gatekeeper.\"",
        illustration: <SceneSwitchDecision />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Inside the house, forwarding is done by name: the MAC address. The Operator
            reads the destination MAC address written on each frame. The IP address —
            203.0.113.50, the address of the whole journey — is not read on this stretch
            at all.
          </p>
          <p>
            And on this stretch, the destination MAC address is the Junction&rsquo;s own.
            A frame leaving a station in the house for the outside is addressed, at this
            layer, to the router. The Operator receives Pip&rsquo;s frames as their
            addressee, and passes them across the station to the Gatekeeper&rsquo;s desk —
            where the next stretch begins.
          </p>
        </div>
      ),
    },
    {
      section: "2. At the Junction",
      title: "The Board",
      story: {
        text: "Operator: \"Want to see my board [MAC table]?\"\nPip: \"Names, and lines... Oh — my name is being written.\"\nOperator: \"It wasn't there an hour ago. Your crates just taught it.\"\nPip: \"My crates did?\"\nOperator: \"When a crate arrives, I read the sender's name. I note the line it came from. That's how the board learns.\"\nPip: \"Then Dad's name — it's not here.\"\nOperator: \"Quiet stations fade from the board. Dad's station has been quiet.\"\nPip: \"And once it's written?\"\nOperator: \"I look up the destination's name, and send the crate down that line.\"",
        illustration: <SceneRecordBook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The board is the MAC table: a pairing of each station&rsquo;s MAC address
            with the line that station can be reached on.
          </p>
          <p>
            It is not written in advance. It is learned: when a frame arrives, the
            switch notes the frame&rsquo;s source MAC address and the line it arrived
            on. That is why Pip&rsquo;s name appears as his crates come in — his frames
            are the ones teaching it.
          </p>
          <p>
            Entries do not last forever. A station that stays quiet is forgotten — its
            entry is removed after a while. This is called aging. Dad&rsquo;s name is
            missing because his station has sent nothing lately. A forgotten name is not
            a lost one: the next frame for it is simply treated as unknown — which is
            the next step.
          </p>
        </div>
      ),
    },
    {
      section: "2. At the Junction",
      title: "Not on the Board",
      story: {
        text: "Pip: \"What about a crate for a name that isn't on the board? Does it get lost?\"\nOperator: \"I send it down every line. Every line but the one it came from.\"\nPip: \"Every line? Even the wrong stations?\"\nOperator: \"Even those. Only the right station takes it. The others leave it alone.\"\nPip: \"And that's it?\"\nOperator: \"The answer comes back. And then I know that name's line. It goes on the board.\"",
        illustration: <SceneArpBroadcast />,
      },
      body: (
        <div className="space-y-3">
          <p>
            When the destination MAC address is not in the table, the switch floods the
            frame: it sends it out on every line except the one it arrived on.
          </p>
          <p>
            Every station on those lines receives it. Only the station whose name
            matches takes it in; the others ignore it.
          </p>
          <p>
            Flooding is not a failure — it is how the house handles not knowing, and it
            repairs itself. When the addressed station answers, the reply&rsquo;s source
            address teaches the switch that name&rsquo;s line, and the entry goes into
            the table. From then on, frames for that name go down one line only.
          </p>
        </div>
      ),
    },
    // ----------------------------- 3. Checked -------------------------
    {
      section: "3. Checked",
      title: "Not in the House",
      story: {
        text: "Pip: \"So inside the house, a crate can't get lost?\"\nOperator: \"Inside the house, no. If I don't know, I can ask every line.\"\nPip: \"...Then my photo didn't vanish inside the house.\"\n(The crates roll across the station, to the Gatekeeper's desk.)\nPip: \"This stretch is checked. Next is outside.\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The first stretch is cleared. Inside the house, a frame for a known name
            goes straight down its line, and a frame for an unknown name is flooded and
            answered. There is no way for a crate to quietly vanish between Pip&rsquo;s
            station and the Junction.
          </p>
          <p>
            Pip watches his crates cross the station to the Gatekeeper&rsquo;s desk.
            Whatever happened to the photo, it happened further on. Next chapter: the
            gate, and the first stretch of the outside.
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
            <li>Inside the house, frames are forwarded by MAC address. The IP address is the address of the whole journey, and it is not read on this stretch.</li>
            <li>On this stretch, the destination MAC address is the Junction&rsquo;s own: the Operator receives the crates and passes them to the Gatekeeper&rsquo;s desk.</li>
            <li>The MAC table pairs each name with a line. It learns from arriving frames&rsquo; source addresses, and quiet stations&rsquo; entries expire.</li>
            <li>A name that is not in the table is flooded to every line except the one it came from. Only the addressed station takes the frame, and its reply puts the name into the table.</li>
            <li>Inside the house, a crate cannot get lost. The photo vanished further on.</li>
          </ul>
          <p>Next chapter: through the gate, and the first stretch of the outside.</p>
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
