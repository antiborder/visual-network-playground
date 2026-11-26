"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES } from "./network";
import {
  SceneAddressCheck,
  SceneBeyondHouse,
  SceneCheesePhoto,
  SceneGatewayDoor,
  SceneHandingOff,
  SceneLogbook,
  SceneOceanCrossing,
  ScenePrivateGlobal,
  SceneRecordBook,
  SceneWalkingSignal,
  SceneWorldNetworks,
} from "./StorybookScenes";

/** DRAFT — Chapter 5 "Leaving the House" (NAT), rewritten 2026-11-27 to
 * the current story design (~/workspace/networking-course/
 * ch5-story-proposal.md), replacing the old v2 draft whose speakers were
 * the devices themselves. The dream continues straight from Chapter 4 —
 * no waking: the number (203.0.113.50) is in the Operator's notebook,
 * the cheese appears, and the photo is packed and sent. Cast follows the
 * settled rules: keepers are mice and stay at their stations; only the
 * crates travel. The rewrite at the way out is done by the Gatekeeper —
 * a different mouse at the same Junction station, at the desk on the
 * exit side (decided 2026-11-27: switching and NAT are different roles
 * that happen to share this station; the story never explains this, he
 * is simply a different mouse). Covers items 53, 54, 50, 52, with 51
 * (the room number tells the house's stations apart) and 55 (there are
 * not enough outside numbers to go round) as single beats. CGNAT and
 * dynamic routing stay deferred. The chapter ends on the arrival arc's
 * cliffhanger (design B, 2026-11-19): Pip believes the photo is on its
 * way to the Board. It is not — he learns that in Chapter 6.
 * Illustrations are the existing StorybookScenes placeholders. */
export function LeavingTheHouseWalkthroughDraft({
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
        text: "The notebook is closed. The number is in it: 203.0.113.50.\nPip turns from the Operator's desk.\nFar off, beside the line, the cheese is waiting — enormous.\nPip: \"Now we can send it.\"\nPip: \"All the way outside.\"",
        illustration: <SceneCheesePhoto />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The dream does not stop between chapters. The address is settled, the cheese
            is here, and tonight the photo finally leaves the house.
          </p>
          <p>
            Getting out turns out to need one more thing: the address written on the
            crates for the way back. Inside numbers mean nothing outside — so at the way
            out, they are rewritten, and the rewriting is written down.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Getting Ready to Send</li>
            <li>The Address That Means Nothing Outside</li>
            <li>The Rewrite</li>
            <li>Out</li>
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
          In short: the photo is split and labelled with the Board&rsquo;s number. At the
          Junction&rsquo;s exit desk, the Gatekeeper stops the crates — their return
          address is a house number, and outside, that means nothing. He rewrites it to
          the house&rsquo;s one outside number, adds a room number for this conversation,
          and writes the pairing in his book. Then the crates go out.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // --------------------- 1. Getting Ready to Send -------------------
    {
      section: "1. Getting Ready to Send",
      title: "Too Big to Send Whole — Again",
      story: {
        text: "Pip walks up to the cheese.\nIt towers over him, the way it did before.\nPip: \"Same cheese. Same problem.\"\nPip: \"Too big for one crate.\"\nSo the work begins, the way it did for Dad's PC: slice it into pieces that fit.",
        illustration: <SceneCheesePhoto />,
      },
      body: (
        <p>
          Nothing about the cheese has changed since Chapter 2 — same photo, same size.
          It still cannot travel in one piece, so it is split first, exactly as before.
        </p>
      ),
    },
    {
      section: "1. Getting Ready to Send",
      title: "Numbered and Labeled",
      story: {
        text: "The pieces are packed, one by one.\nEach crate gets its number — four thousand, six hundred and forty-nine in all.\nThen the addresses are written.\nTo: 203.0.113.50 — the number from the Operator's notebook.\nFrom: 192.168.1.10 — Pip's phone, so the answer knows the way back.\nPip: \"There. Ready.\"",
        illustration: <SceneAddressCheck />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Same count as last time — it is the same photo. What is new is the destination:
            not a station in this house, but the number the lookup found.
          </p>
          <p>
            And each crate carries a return address, as crates always do: Pip&rsquo;s own
            number, 192.168.1.10. Remember that number. The way out has something to say
            about it.
          </p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "1. Getting Ready to Send",
      title: "To the Junction",
      story: {
        text: "The crates roll out in a long row.\nPip goes with them, down the line to the Junction.\nEverything in the house passes this station — and the way out is here too.\nAt the far side of the station stands another desk.\nA different mouse is sitting at it, with a big book.",
        illustration: <SceneWalkingSignal />,
      },
      body: (
        <p>
          The Junction is the middle of the house&rsquo;s line — and it is also the
          house&rsquo;s only way out. The crates are headed for the desk on its far side:
          the exit desk.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ---------- 2. The Address That Means Nothing Outside -------------
    {
      section: "2. The Address That Means Nothing Outside",
      title: "Stopped at the Gate",
      story: {
        text: "The first crate reaches the desk.\nThe mouse looks at its label — and raises a paw.\nGatekeeper: \"Stop.\"\nGatekeeper: \"This return address won't do.\"\nPip: \"Won't do? It's my number. 192.168.1.10.\"\nGatekeeper: \"In here, yes. Out there — nothing.\"",
        illustration: <SceneGatewayDoor />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The Gatekeeper&rsquo;s desk is where crates leave the house, and his word is
            final there. What he is objecting to is not the destination — it is the
            return address.
          </p>
          <p>
            192.168.1.10 is a private address: a number that means something only inside
            this house.
          </p>
        </div>
      ),
    },
    {
      section: "2. The Address That Means Nothing Outside",
      title: "Every House Has a .10",
      story: {
        text: "Pip: \"Nothing? But it's my address!\"\nGatekeeper: \"Yours — and not only yours.\"\nGatekeeper: \"Every house on every street uses the same inside numbers.\"\nGatekeeper: \"Somewhere out there, thousands of stations are .10, just like you.\"\nPip: \"Then an answer addressed to .10...\"\nGatekeeper: \"...would not know which house. Which you.\"\nGatekeeper: \"It is like writing 'my room' as the return address on a letter to another town.\"",
        illustration: <SceneWorldNetworks />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Inside numbers are reused by every house in the world. That is fine inside —
            the line here knows its own .10 from any other.
          </p>
          <p>
            Outside, the number carries no meaning at all. A reply addressed to it could
            never find this house, let alone this phone.
          </p>
        </div>
      ),
    },
    {
      section: "2. The Address That Means Nothing Outside",
      title: "One Number for the Whole House",
      story: {
        text: "Pip: \"Then how does anything get an answer?\"\nGatekeeper: \"The house has one number of its own. An outside number.\"\nGatekeeper: \"One number, for the whole house. The whole world knows that one.\"\nPip: \"One? For all of us?\"\nGatekeeper: \"Outside numbers are precious. There are not enough for every station in the world.\"\nGatekeeper: \"So the house shares one — and I keep track of who is who.\"",
        illustration: <ScenePrivateGlobal />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The house&rsquo;s outside number is a global address: one of a kind in the
            whole world, and the only address the outside can use for anyone in this
            house.
          </p>
          <p>
            Two kinds of numbers exist because they have to: there are not enough global
            addresses for every device, so houses reuse private numbers inside and share
            one global number at the door.
          </p>
        </div>
      ),
    },
    // --------------------------- 3. The Rewrite ------------------------
    {
      section: "3. The Rewrite",
      title: "Rewritten at the Gate",
      story: {
        text: "The Gatekeeper takes the first crate's label and rewrites it.\nFrom: the house's outside number — and a room number, for this conversation.\nPip: \"A room number too?\"\nGatekeeper: \"The outside number is the whole house. The room number says which conversation.\"\nGatekeeper: \"Many stations, one number. The room keeps you apart.\"\nThe destination does not change: 203.0.113.50.\nCrate by crate, he rewrites them all.",
        illustration: <SceneRecordBook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            This rewriting is the heart of the chapter. On every crate, the return address
            — a private address — is replaced by the house&rsquo;s global address, plus a
            room number (a port) chosen for this conversation.
          </p>
          <p>
            The destination is not touched. Only the way back is rewritten, so that a way
            back exists at all.
          </p>
        </div>
      ),
    },
    {
      section: "3. The Rewrite",
      title: "Written in the Gate Book",
      story: {
        text: "As he rewrites, the Gatekeeper writes in his big book.\nOutside number, plus this room — that is Pip's phone, .10.\nPip: \"Why write it down?\"\nGatekeeper: \"So the answer can find its way home.\"\nGatekeeper: \"An answer will come to the house's number, to that room.\"\nGatekeeper: \"This book is how it will know the room means you.\"",
        illustration: <SceneLogbook />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The pairing — outside number plus room number, matched to the inside station —
            is written in the Gatekeeper&rsquo;s book. That book is the translation table:
            the house&rsquo;s memory of which conversation belongs to whom.
          </p>
          <p>
            The rewriting and the writing-down are one act. A rewritten label with no book
            entry would be a one-way trip.
          </p>
        </div>
      ),
    },
    {
      section: "3. The Rewrite",
      title: "How Answers Come Home",
      story: {
        text: "Pip: \"So when the Board answers...\"\nGatekeeper: \"It answers the label. The house's outside number, and the room.\"\nGatekeeper: \"The answer comes here, to my desk.\"\nGatekeeper: \"I read my book backwards — and send it down the line to your station.\"\nPip: \"And if there were no book?\"\nGatekeeper: \"Then the answer would stand at the door, with nowhere to go.\"",
        illustration: <SceneHandingOff />,
      },
      body: (
        <p>
          Replies do not find their own way in. They arrive at the house&rsquo;s one
          outside number, and the book is read in reverse to carry them to the right
          station. Without the book, a reply could reach the house — and still never
          reach Pip.
        </p>
      ),
    },
    // ------------------------------ 4. Out -----------------------------
    {
      section: "4. Out",
      title: "Through the Gate",
      story: {
        text: "The last label is rewritten. The last line is in the book.\nThe Gatekeeper steps back.\nGatekeeper: \"They can go.\"\nThe crates roll past the desk, out of the station —\n— and onto the great main line, away from the house.\nTo: 203.0.113.50. From: the house's outside number, and a room.",
        illustration: <SceneOceanCrossing />,
      },
      body: (
        <p>
          The photo has left the house — the first time any crate of Pip&rsquo;s has.
          From here, the road belongs to the outside world: junction after junction,
          none of them known to Pip.
        </p>
      ),
    },
    {
      section: "4. Out",
      title: "Sent at Last",
      story: {
        text: "Pip watches the crates grow smaller down the main line.\nFour thousand, six hundred and forty-nine of them, all addressed, all on their way.\nPip: \"It went out.\"\nPip: \"It's on its way.\"\nHe turns back toward his own station, well pleased.\nBy now, surely, it is nearly there.",
        illustration: <SceneBeyondHouse />,
      },
      body: (
        <div className="space-y-3">
          <p>
            As far as Pip can see, everything is done: the number was found, the crates
            were labelled, the way out rewrote what needed rewriting.
          </p>
          <p>
            He saw them leave. He did not see them arrive — nobody did. Hold that thought
            for the next chapter.
          </p>
        </div>
      ),
    },
    {
      section: "4. Out",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>What this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Inside numbers are private: they mean something only in their own house, and every house reuses the same ones.</li>
            <li>The house has one outside number — a global address, shared by everyone inside.</li>
            <li>At the way out, each crate&rsquo;s return address is rewritten to the outside number plus a room number for the conversation.</li>
            <li>The pairing is written in the Gatekeeper&rsquo;s book; replies come back by reading the book in reverse.</li>
            <li>Without the book, a reply could reach the house and still never reach Pip.</li>
          </ul>
          <p>Next chapter: the morning after — and a look back at the whole road.</p>
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
