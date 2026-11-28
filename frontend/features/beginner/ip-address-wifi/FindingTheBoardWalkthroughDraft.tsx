"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES } from "./network";
import {
  SceneCheesePhoto,
  SceneFallingAsleep,
  SceneHandingOff,
  SceneHowLongToRemember,
  SceneLanDesk,
  SceneOpeningBookmark,
  SceneRecordBook,
  SceneStartingFromTop,
  SceneTwoCounters,
  SceneWhoToAskFirst,
} from "./StorybookScenes";

/** DRAFT — Chapter 4 "Finding the Board" (DNS), written 2026-11-27 to the
 * v2 story design (~/workspace/networking-course/ch4-story-proposal.md).
 * Replaces the old full-coverage `FindingTheBoardWalkthrough` in the
 * draft track: this version teaches only the beginner core (items 63,
 * 66–67, 69–71, 81, with 76–77 and 68 as one light beat each) and follows
 * the settled canon — the dream world is the real network made visible,
 * so the lookup happens exactly as it really does: Pip's phone needs the
 * number BEFORE anything is split or addressed, the Junction Operator
 * asks from the station one step at a time (root → .com → the Board's
 * own keeper), and the three keepers (Old Root, Dottie, Brie — names
 * still provisional) are met only through the answers that come back.
 * Pip travels empty-handed: the cheese does not appear until the
 * address is settled (Step 9), mirroring Chapter 2's order — address
 * first (its Steps 3–4), cheese second (its Step 5). The chapter ends
 * inside the dream; the sending itself is Chapter 5. Illustrations are
 * the existing StorybookScenes placeholders. */
export function FindingTheBoardWalkthroughDraft({
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
  const houseDevices = DEFAULT_DEVICES.filter((d) => d.id !== "iot");

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
        text: "Tonight is the night.\nPip is back in his room, phone in paw.\nTonight, the cheese photo goes to the Cheese-Lovers' Board.\nHe opens the Board.\nThere it is: cheeselovers.com.\nPip: \"There you are. Now — I just send the photo.\"\nBut the screen shows only a name. No number anywhere.\nPip: \"Where are you, really?\"\nHis eyes are getting heavy.",
        illustration: <SceneOpeningBookmark />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The photo has been to Dad&rsquo;s PC. It has never left the house. The Board is
            somewhere outside — and all Pip has is its name.
          </p>
          <p>
            Before anything can be sent, the name has to become a number. That is this
            chapter: how a name is looked up, one step at a time, by asking.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Only a Name</li>
            <li>Asking in Steps</li>
            <li>The Answer</li>
          </ol>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      story: {
        text: "Pip: \"I'm getting sleepy...\"\nHe climbs into bed.\nPip: \"The Board's number. First, the number...\"",
        illustration: <SceneFallingAsleep />,
      },
      body: (
        <p>
          In short: Pip goes to the Junction with a name and no number. The Operator there
          cannot answer himself — his book knows only this house. So he asks on Pip&rsquo;s
          behalf, one step at a time, and the answers come back as notes. At the end, Pip
          holds a number. Only then does the cheese appear.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // -------------------------- 1. Only a Name ------------------------
    {
      section: "1. Only a Name",
      title: "To Send a Photo",
      story: {
        text: "Pip blinks.\nHe is at the Junction, on the platform.\nNo crates. Nothing in his paws.\nThe Operator is waiting by his desk.\nOperator: \"Ready to send that photo of yours?\"\nPip: \"I need the Board's number first.\"\nOperator: \"And what number do you have?\"\nPip: \"I don't have a number. I only have the name.\"\nPip: \"Cheeselovers.com.\"\nOperator: \"Then we ask.\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <div className="space-y-3">
          <p>
            A photo travels by number, like everything on the line. A name is what people
            remember; a number is what the line delivers to. The two are not the same
            thing, and one has to be turned into the other before anything moves.
          </p>
          <p>
            Notice when this happens: before any splitting, before any address is written.
            The lookup comes first — the rest of the sending is built on its answer.
          </p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "1. Only a Name",
      title: "The Operator Asks for You",
      story: {
        text: "Pip: \"Can't you just look it up in your book?\"\nThe Operator pats his book.\nOperator: \"This book knows this house. Every station, every number — in here.\"\nOperator: \"Outside names are not in it.\"\nPip: \"Then who knows?\"\nOperator: \"Nobody knows all of it. That's not how names work.\"\nOperator: \"I ask from this station. One step at a time.\"\nOperator: \"First — the oldest desk of all. Wait here.\"",
        illustration: <SceneWhoToAskFirst />,
      },
      body: (
        <div className="space-y-3">
          <p>
            There is no single book of every name in the world. The knowledge is spread
            out, desk by desk, and each desk knows one step.
          </p>
          <p>
            So the asking is done by one asker, from one place, following the steps in
            order. Pip stays at the Junction. What travels is the question — and the
            answers that come back.
          </p>
        </div>
      ),
    },
    // ------------------------ 2. Asking in Steps ----------------------
    {
      section: "2. Asking in Steps",
      title: "The Old Root",
      story: {
        text: "A note comes back down the line.\nThe Operator reads it aloud.\nOperator: \"From the Root Desk. 'Ask me for a district, not a door.'\"\nOperator: \"'For .com, ask Dottie.'\"\nPip: \"That's not the number.\"\nOperator: \"It's the first step.\"\nOperator: \"That's the Old Root — the oldest desk there is. His book holds only the big districts.\"\nPip: \"Districts?\"\nOperator: \"Read the name from the right. The last part — .com — is the district.\"",
        illustration: <SceneStartingFromTop />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Names are built in layers, and they are read from the right: the rightmost
            part is the widest district, and each part to the left narrows it down.
          </p>
          <p>
            The first desk — the root — does not know any station&rsquo;s number. It knows
            who keeps each district. That is all, and it is enough to start.
          </p>
        </div>
      ),
    },
    {
      section: "2. Asking in Steps",
      title: "Dottie",
      story: {
        text: "The Operator sends the question on.\nThis time the note is back in a flash.\nOperator: \"From the .com Desk. Dottie writes:\"\nOperator: \"'cheeselovers.com is kept by Brie. Ask her.'\"\nPip: \"Still not the number!\"\nOperator: \"Dottie's desk is the busiest there is. She keeps who keeps every name in .com.\"\nOperator: \"The numbers themselves — not her job.\"",
        illustration: <SceneTwoCounters />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The district desk also has no number for Pip. What it has is a pointer: the
            name of the one keeper who looks after this particular name.
          </p>
          <p>
            Each desk hands the question down one level. Nobody so far has failed — this
            is simply how the answer is stored: in steps, not in one place.
          </p>
        </div>
      ),
    },
    {
      section: "2. Asking in Steps",
      title: "Brie",
      story: {
        text: "The Operator sends the question on, one last time.\nA note comes back, and this one feels different.\nOperator: \"From Brie's desk. She writes:\"\nOperator: \"'cheeselovers.com? That's us.'\"\nOperator: \"'The number is 203.0.113.50.'\"\nPip: \"That's it? That's the Board?\"\nOperator: \"That's the Board.\"\nThe Operator opens his notebook and writes the number down, carefully.",
        illustration: <SceneRecordBook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The last desk is the name&rsquo;s own keeper — the one place that actually
            holds the number. Three asks, and the answer is a number: 203.0.113.50.
          </p>
          <p>
            That is the whole shape of the lookup: a name goes in, a number comes out,
            and in between, each desk knew exactly one step.
          </p>
        </div>
      ),
    },
    // --------------------------- 3. The Answer ------------------------
    {
      section: "3. The Answer",
      title: "A Note With a Time Limit",
      story: {
        text: "Pip leans over the notebook.\nNext to the number, the Operator stamps a time.\nPip: \"What's the stamp for?\"\nOperator: \"How long this note can be trusted.\"\nOperator: \"Numbers can change. The Board might move to a new number one day.\"\nOperator: \"Names don't change. So when the time runs out, we ask again.\"\nPip: \"And until then?\"\nOperator: \"Until then, we just read the note. No asking needed.\"",
        illustration: <SceneHowLongToRemember />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The answer is kept — in the Operator&rsquo;s notebook — but only for a while.
            The stamp is the answer&rsquo;s time limit.
          </p>
          <p>
            Keeping the answer saves asking every time. The time limit keeps the kept
            answer honest: numbers can change, and an old note could point at the wrong
            place.
          </p>
        </div>
      ),
    },
    {
      section: "3. The Answer",
      title: "You Mean... That?",
      story: {
        text: "The Operator closes the notebook.\nOperator: \"Well. Now we know where it goes.\"\nHe points down the line, past the platform.\nPip looks.\nFar off, beside the line, stands something enormous.\nIt has been waiting there all along.\nPip: \"The cheese.\"\nPip: \"Now we can send it.\"",
        illustration: <SceneCheesePhoto />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Only now — with the address settled — does the cheese enter the story. That
            order is the real order: first find out where a thing is going, then pack it.
          </p>
          <p>
            The number is in the notebook: 203.0.113.50. Next chapter, the photo is split,
            labelled with that number — and meets the house&rsquo;s one way out.
          </p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "3. The Answer",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>What this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A name and a number are different things; sending needs the number.</li>
            <li>The lookup happens before anything is split or addressed.</li>
            <li>No one desk knows everything — the Operator asks in steps: root, then the district desk, then the name&rsquo;s own keeper.</li>
            <li>Names are read from the right; each part narrows the search.</li>
            <li>The answer is a number — and it is kept in a note with a time limit, because numbers can change and names don&rsquo;t.</li>
          </ul>
          <p>Next chapter: the photo leaves the house.</p>
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
