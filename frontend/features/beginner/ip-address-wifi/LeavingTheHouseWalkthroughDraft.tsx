"use client";

import { useState, type ReactNode } from "react";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { isPrivateIpv4 } from "./network";
import {
  SceneCheesePhoto,
  ScenePipsPhone,
  SceneAddressCheck,
  SceneGatewayDoor,
  SceneCgnatCity,
  SceneCheckpoint,
  SceneLogbook,
  ScenePrivateGlobal,
  SceneOceanCrossing,
} from "./StorybookScenes";

const ADDRESS_EXAMPLES = [
  { label: "This home network", firstOctet: 192, secondOctet: 168, example: "192.168.1.10" },
  { label: "A public DNS server", firstOctet: 8, secondOctet: 8, example: "8.8.8.8" },
  { label: "Another home network", firstOctet: 10, secondOctet: 0, example: "10.0.0.5" },
] as const;

/** DRAFT (v2) — story-half only. Chapter 4 "Leaving the House" from the
 * beginner story-based redesign (see docs/beginner-story-redesign.md) —
 * reordered to run AFTER the new Chapter 3 "The Short Way Home"
 * (`TheShortWayHomeWalkthroughDraft.tsx`), where Dad's PC request already
 * introduced packet slicing, source labeling, and the "is this a
 * neighbor?" subnet check. This chapter only reviews those (the check now
 * comes out the opposite way — not a neighbor) instead of re-teaching them,
 * then builds forward: the default gateway, CGNAT, NAT/NAPT, and a
 * private/global recap grounded in this specific journey. Deliberately
 * ends on a cliffhanger right as the packet reaches the open internet —
 * whether it actually arrives at the Cheese-Lovers' Board (and what a
 * reply's return trip looks like, including the stateful-inspection beat,
 * item 102) is unresolved and left for a later chapter once routing,
 * switching, TCP, and TLS have been taught; see the chat that reordered
 * this for why. Broken into finer, one-idea-per-step beats with the same
 * richly conversational style as the other chapters — matching precedent,
 * the speakers here are Pip and the network entities themselves (Phone,
 * Router, Checkpoint, a passing signal) rather than Dad, since Dad stays
 * behind in the house once the packet leaves. Every `body` below is a
 * placeholder — only the picture-book story half was requested for this
 * pass. */
export function LeavingTheHouseWalkthroughDraft({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // --- "Try It Yourself" private/global sandbox ---
  const [exampleIdx, setExampleIdx] = useState(0);

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
            With Dad&rsquo;s copy safely saved, Pip finally has a real number in hand —
            203.0.113.50 — and turns back to the real plan. This chapter follows his photo out
            the door, through the internet provider&rsquo;s own hidden city, past a border
            checkpoint, and out into the open internet. Whether it actually reaches the
            Cheese-Lovers&rsquo; Board is a story for another chapter.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Getting Ready to Send</li>
            <li>The Provider&rsquo;s Hidden City</li>
            <li>The Border Checkpoint</li>
            <li>Across the Open Internet</li>
          </ol>
        </div>
      ),
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: PENDING,
    },
    // ---------------------------- The story ---------------------------
    {
      section: "1. Getting Ready to Send",
      title: "Knocking on the Door",
      story: {
        text: "Pip: \"Okay, Dad's got his copy. Now, back to the real plan — 203.0.113.50, let's actually get this photo moving!\"\nHe taps to send.\nPhone: \"On it. Sending something this big takes a little preparation first — though you know the drill by now.\"",
        illustration: <SceneCheesePhoto />,
      },
      body: PENDING,
    },
    {
      section: "1. Getting Ready to Send",
      title: "Too Big to Send Whole",
      story: {
        text: "Phone: \"Same as with Dad's copy — this whole photo won't fit through in one go, so I'll slice it into small labeled packets, ready to be put back together on the other end.\"\nPip: \"Right, I remember!\"",
        illustration: <ScenePipsPhone />,
      },
      body: PENDING,
    },
    {
      section: "1. Getting Ready to Send",
      title: "Every Piece, Labeled",
      story: {
        text: "Phone: \"And just like with Dad's PC, every piece carries my own address, 192.168.1.10, so whoever answers knows exactly where to send a reply.\"\nPip: \"Right, same trick as always.\"",
        illustration: <ScenePipsPhone />,
      },
      body: PENDING,
    },
    {
      section: "1. Getting Ready to Send",
      title: "Not a Neighbor",
      story: {
        text: "Phone: \"Now for the same check as before — is 203.0.113.50 a neighbor on our own network, or somewhere else entirely?\"\nPip: \"Last time it was a 'yes.' This time?\"\nPhone: \"My own address starts 192.168.1. ... this one doesn't even come close. Not a neighbor — it's out past our own network entirely, this time.\"",
        illustration: <SceneAddressCheck />,
      },
      body: PENDING,
    },
    {
      section: "1. Getting Ready to Send",
      title: "The One Address Everyone Knows",
      story: {
        text: "Pip: \"So if it's not a neighbor, who do you even ask?\"\nPhone: \"There's exactly one address I always try first, whenever somewhere is out past our own network — our router, at 192.168.1.1.\"\nRouter: \"Can't hand this to a neighbor, then — same as any letter addressed elsewhere, it comes to me to forward.\"",
        illustration: <SceneGatewayDoor />,
      },
      body: PENDING,
    },
    {
      section: "2. The Provider's Hidden City",
      title: "Past the Router",
      story: {
        text: "Pip's packet steps past the router into an enormous, unfamiliar city.\nPacket: \"Whoa — where am I?\"\nPassing signal: \"You're in our network now. Every house on this street has a router just like yours — we all share this one, before anyone reaches the real internet.\"",
        illustration: <SceneCgnatCity />,
      },
      body: PENDING,
    },
    {
      section: "2. The Provider's Hidden City",
      title: "A Second Address",
      story: {
        text: "Packet: \"So I'm still carrying my house's address, 192.168.1.10 — is that enough to get around in here?\"\nPassing signal: \"Not quite. In here, you'll need a second address too — one this whole hidden city hands out.\"\nAnd with that, Pip's packet picks up a fresh tag: 10.64.20.5.",
        illustration: <SceneCgnatCity />,
      },
      body: PENDING,
    },
    {
      section: "2. The Provider's Hidden City",
      title: "Why Hide So Many Houses Together",
      story: {
        text: "Pip's packet looks around at just how many houses share this one hidden city.\nPacket: \"Why not just give every house its own real address, out on the internet?\"\nPassing signal: \"There simply aren't enough of those real addresses to go around — so we share, and only step out one at a time, when someone actually needs to.\"",
        illustration: <SceneCgnatCity />,
      },
      body: PENDING,
    },
    {
      section: "3. The Border Checkpoint",
      title: "One Way Out",
      story: {
        text: "Pip's packet reaches the edge of the hidden city — a checkpoint, gate down.\nCheckpoint: \"Hold on. Your return address is still your house's own — leave it like that, and you won't be able to get back.\"\nPip: \"Huh? Really?\"\nCheckpoint: \"Really. The moment you step outside, telling everyone 'I'm in such-and-such room of my house' won't get you anywhere — nobody out there knows where your house is.\"",
        illustration: <SceneCheckpoint />,
      },
      body: PENDING,
    },
    {
      section: "3. The Border Checkpoint",
      title: "Swapping Addresses",
      story: {
        text: "Pip: \"Oh no, that's a problem. What do I do?\"\nCheckpoint: \"Don't worry. Let's swap that address for this checkpoint's own — now you can go out there and still find your way home.\"\nPip: \"Wow, thank you!\"\nSwapping one address for another so a reply can find its way back — that's called NAT.",
        illustration: <SceneCheckpoint />,
      },
      body: PENDING,
    },
    {
      section: "3. The Border Checkpoint",
      title: "Why a Port Too",
      story: {
        text: "Pip: \"Wait, this checkpoint only has the one address for everyone leaving?\"\nCheckpoint: \"Just the one, yes — but I also hand out a little number alongside it, just for you. That way, even sharing one address, nobody gets mixed up.\"\nThat little number is a port — and swapping both together has its own name: NAPT.",
        illustration: <SceneCheckpoint />,
      },
      body: PENDING,
    },
    {
      section: "3. The Border Checkpoint",
      title: "The Logbook",
      story: {
        text: "The checkpoint carefully writes something down before waving Pip's packet through.\nPip: \"What's that for?\"\nCheckpoint: \"My logbook. I'm writing down exactly which address and number I gave you, and which house you actually came from — so when your reply comes back, I know exactly where to send it.\"",
        illustration: <SceneLogbook />,
      },
      body: PENDING,
    },
    {
      section: "4. Across the Open Internet",
      title: "Two Addresses, One Trip",
      story: {
        text: "Pip's packet looks back at the trip so far.\nPacket: \"Hold on — I've carried two different addresses this whole time: my house's, and then the checkpoint's own. Why two?\"\nOne of those addresses only ever meant something inside its own network — a private address.",
        illustration: <ScenePrivateGlobal />,
      },
      body: PENDING,
    },
    {
      section: "4. Across the Open Internet",
      title: "Try It Yourself",
      story: {
        text: "Checkpoint: \"Because each one has its own job — one only has to make sense inside your own house, the other has to make sense to the entire world.\"\nPrivate for home, global for the whole wide world — two very different kinds of address.",
        illustration: <ScenePrivateGlobal />,
      },
      body: PENDING,
      controls: (
        <div className="flex flex-wrap gap-2">
          {ADDRESS_EXAMPLES.map((ex, i) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setExampleIdx(i)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                exampleIdx === i
                  ? "bg-storybook-accent text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
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
      section: "4. Across the Open Internet",
      title: "Side by Side",
      story: {
        text: "Pip: \"So mine is private, and the checkpoint's own is global?\"\nCheckpoint: \"Exactly. Side by side, they don't look all that different — but what they're allowed to do is worlds apart.\"",
        illustration: <ScenePrivateGlobal />,
      },
      body: PENDING,
    },
    {
      section: "4. Across the Open Internet",
      title: "Out Into the Open",
      story: {
        text: "Passport in hand, Pip's packet slips into the vast internet — router after router passing it along like a bucket brigade.\nRouters: \"203.0.113.50? That way!\"\nPacket: \"How do they all know exactly which way to send me?\"\nA passing router: \"We're always trading notes on the fastest way to everywhere — pick a path, and if one ever breaks, we quietly pick another.\"\nAnd with that, after such a long journey, Pip's cheese photo is finally out in the internet's wide open sky.\nPip: \"Did it actually make it to the Cheese-Lovers' Board?\"\n...to be continued.",
        illustration: <SceneOceanCrossing />,
      },
      body: PENDING,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: PENDING,
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
