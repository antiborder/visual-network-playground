"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES, type Device } from "./network";
import {
  SceneGatewayDoor,
  SceneMomoArrives,
  ScenePipsHouse,
  ScenePipsPhone,
  SceneStationMap,
  SceneWalkingSignal,
  SceneWhoToAskFirst,
} from "./StorybookScenes";

/** DRAFT — Chapter 6 "Seeing It All at Once", written 2026-11-27 to the
 * v5 story design (~/workspace/networking-course/ch6-story-proposal.md,
 * Atsushi's flow). The beginner track's last chapter: no new items —
 * the whole road, retold once through a single angle: who knew what.
 * The dream of Chapters 4–5 continues without a break: Pip is on his
 * way back along the home line when he passes Momo's station and the
 * retelling happens as a standing chat. Momo lived Chapter 3 herself,
 * so she never reacts as if hearing her own part for the first time —
 * what she asks about is only the outside road she has never seen.
 * The dialogue for Steps 3–9 is the proposal's approved draft,
 * including Atsushi's own Step 8 opening and Step 9 close, kept as
 * written. The reveal lands in reality, at breakfast: the photo is not
 * on the Board. Pip's resolve — to make sure, all the way, next time —
 * closes the chapter (decided 2026-11-26: the resolve sits here, and
 * Chapter 7 opens with its execution). Illustrations are the existing
 * StorybookScenes placeholders. */
export function SeeingItAllAtOnceWalkthroughDraft({
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
        text: "The dream is not over.\nThe crates are gone, out on the main line.\nAnd Pip is walking home along the house's line, well pleased.\nPip: \"It went out. It's on its way.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-3">
          <p>
            This chapter teaches nothing new. Instead, the whole journey — the number
            lent by the line, the name looked up in steps, the way out and its rewriting —
            is told once, end to end, through one question: who knew what?
          </p>
          <p>
            Every keeper Pip met knew one piece of the road. So did Pip. Remembering who
            knew what is how the journey becomes one shape — and it is also how the
            morning&rsquo;s news will make sense.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>On the Way Back</li>
            <li>Telling Momo</li>
            <li>Morning</li>
          </ol>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------- 1. On the Way Back ---------------------
    {
      section: "1. On the Way Back",
      title: "On the Way Back",
      story: {
        text: "Pip walks back along the line, the way he came.\nPast the Junction. Past the desks, quiet now.\nThe house is sleeping. The line is empty.\nPip: \"It went out. It's on its way.\"\nPip: \"By now, it must be far.\"",
        illustration: <SceneWalkingSignal />,
      },
      body: (
        <p>
          The sending is over, and this is the walk home after it. Nothing is left to do
          — which is exactly why this chapter can look back. Ahead of Pip, one station on
          his road is still lit.
        </p>
      ),
    },
    // -------------------------- 2. Telling Momo -----------------------
    {
      section: "2. Telling Momo",
      title: "Passing Momo's Station",
      story: {
        text: "Momo: \"Pip? Is that you, this late?\"\nPip: \"Momo! You're still awake.\"\nMomo: \"I don't sleep. I glow. — You look pleased.\"\nPip: \"I did it. Tonight, my cheese photo went out. Out of the house.\"\nMomo: \"Out? Tell me about the road. I've never seen past my own stretch of line.\"",
        illustration: <SceneMomoArrives />,
      },
      body: (
        <p>
          Momo&rsquo;s station stands beside Pip&rsquo;s, on his way home. She knows the
          house&rsquo;s line from her own night on it. What she has never seen is anything
          past her own stretch — so the outside road is what she asks for.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "2. Telling Momo",
      title: "A Name, Asked in Pieces",
      story: {
        text: "Momo: \"Tell me the parts I don't know. The outside parts.\"\nPip: \"The Board is far away. I didn't know its number. I only knew its name.\"\nMomo: \"A name isn't a number.\"\nPip: \"So the Operator asked for me, from the Junction. One step at a time.\"\nPip: \"The Old Root knew one step. Dottie knew the next. Brie knew the number itself.\"\nMomo: \"Nobody knew the whole thing?\"\nPip: \"Nobody. The answer came back in pieces: 203.0.113.50.\"",
        illustration: <SceneWhoToAskFirst />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The lookup, retold: three desks, three partial answers, one number. Not one
            of them could have answered alone.
          </p>
          <p>
            That is not a flaw in the system. It is the system: knowledge about names is
            kept in steps, on purpose, by the desks whose step it is.
          </p>
        </div>
      ),
    },
    {
      section: "2. Telling Momo",
      title: "The Way Out",
      story: {
        text: "Pip: \"Then the crates went back to the Junction, and out.\"\nPip: \"Well — the Gatekeeper stopped them first. Our numbers mean nothing outside.\"\nMomo: \"Nothing?\"\nPip: \"Every house has a ten. So the Gatekeeper rewrote the return address, to the house's outside number.\"\nPip: \"And wrote the pairing in his book, so an answer can find its way back.\"",
        illustration: <SceneGatewayDoor />,
      },
      body: (
        <p>
          The way out, retold: the stop at the exit desk, the rewriting, and the book.
          The Gatekeeper&rsquo;s knowledge is his desk&rsquo;s stretch — the pairing of
          inside and outside. What happens past his desk, his book does not say.
        </p>
      ),
    },
    {
      section: "2. Telling Momo",
      title: "Nobody Knows the Whole Road",
      story: {
        text: "Pip: \"Everyone I met knew one piece of it.\"\nMomo: \"Of the road?\"\nPip: \"The Clerk knows the line. The Address Clerk knows the numbers he lent out.\"\nPip: \"Out there, it was the same. One step each.\"\nMomo: \"And you? You walked the whole thing.\"\nPip: \"I never saw past the Junction. I only know the crates went out.\"",
        illustration: <SceneStationMap />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Here is the chapter&rsquo;s one idea, said plainly: nobody — not the keepers,
            not Pip — has seen the whole road. Each one knows the stretch at their own
            desk.
          </p>
          <p>
            Pip&rsquo;s own knowledge ends at the Junction. He watched the crates go out.
            Going out and arriving are two different things, and he has only seen one of
            them.
          </p>
        </div>
      ),
    },
    {
      section: "2. Telling Momo",
      title: "On the Board by Now",
      story: {
        text: "Momo: \"So by now, your cheese is hanging on the Board.\"\nPip: \"By now, it is.\"\nMomo: \"Good night, Pip.\"\nPip: \"Good night, Momo.\"\nPip walks the rest of the way home.\nThe dream closes, quietly.",
        illustration: <SceneWalkingSignal />,
      },
      body: (
        <p>
          &ldquo;By now, it is&rdquo; — that is a belief, not something Pip saw. The whole
          track so far has rested on it: sent means on its way, on its way means arrived.
          The morning has a word to say about that.
        </p>
      ),
    },
    // ----------------------------- 3. Morning -------------------------
    {
      section: "3. Morning",
      title: "It Isn't There",
      story: {
        text: "Dad: \"Did you post it on the board?\"\nPip: \"Uh-huh.\"\nDad: \"Eh? Really?\"\nPip: \"Eh? I sent it in the night.\"\nDad: \"Papa looked this morning, but yours wasn't there.\"\nPip: \"Eh?\"\nPip: \"It wasn't? But I sent it. Last night. I saw it go out.\"\nDad: \"You saw it go out.\"\nPip: \"...Out of the house. Yes.\"\nDad: \"And then?\"\nPip: \"And then it was on its way. It should be there by now.\"\nPip: \"It should be.\"",
        illustration: <ScenePipsHouse />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Reality, the next morning. Dad looked at the Board this morning, the way a
            person does — and Pip&rsquo;s cheese was not there.
          </p>
          <p>
            Listen to what Pip can actually claim: he sent it, and he saw it go out.
            Everything after that was &ldquo;should be&rdquo;. Dad&rsquo;s two short
            questions find exactly the edge of what Pip knows.
          </p>
        </div>
      ),
    },
    {
      section: "3. Morning",
      title: "The Part He Never Saw",
      story: {
        text: "Pip opened cheeselovers.com on his phone.\nDad was right. His cheese wasn't there.\nPip: \"It's true. I never saw it arrive. I only saw it off, out of the house.\"\nPip: \"I should have gone with it, all the way.\"\nPip: \"Next time, I'll make sure — all the way to cheeselovers.com!\"\nAnd so, Pip fell asleep.",
        illustration: <ScenePipsPhone />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Pip checks with his own eyes, the way Dad did — and the Board is empty of his
            cheese. Wherever the crates went after the Junction, they did not arrive.
          </p>
          <p>
            The beginner track ends on a resolve, not an answer: next time, he will not
            just see the sending off. He will make sure — all the way. The middle track
            opens with him keeping that promise.
          </p>
        </div>
      ),
    },
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>The whole beginner track, in the shape of who knew what:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Address Clerk knows the numbers he lent out — and his ledger keeps them unique.</li>
            <li>The DNS desks each know one step of a name; the answer comes back in pieces.</li>
            <li>The Gatekeeper knows the pairing at the way out — inside number to outside number, in his book.</li>
            <li>The Junction&rsquo;s keepers know the house. Past the Junction, nobody Pip met knows anything.</li>
            <li>Pip knows the sending. Arrival is the part he never saw.</li>
          </ul>
          <p>
            Next: the middle track. Pip sends the photo again — asking everything first,
            this time.
          </p>
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
