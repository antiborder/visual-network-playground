"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { LanMap } from "./LanMap";
import { DEFAULT_DEVICES, findConflicts, type Device } from "./network";
import {
  SceneDoraExchange,
  SceneFallingAsleep,
  SceneFixed,
  SceneHallwayBox,
  SceneLanDesk,
  SceneMixUp,
  SceneMomoArrives,
  SceneTwoAnswers,
  SceneWakingAtStation,
} from "./StorybookScenes";

/** DRAFT — Chapter 3 "Momo Gets Online", rewritten 2026-11-19 to the v4
 * story design (~/workspace/networking-course/ch3-story-proposal.md):
 * Pip leads (Dad never appears), Momo the smart bulb speaks, and her wish
 * — "I want to talk to other people too" — is the engine that makes DHCP
 * a personal problem instead of a rule. Covers curriculum items 20–26:
 * a unique address is needed to be reachable (20), what a duplicate does
 * (21), what DHCP is (22), DORA as the four steps' nickname, distinct
 * from DHCP's full name (23), the router's lease ledger as the reason
 * duplicates normally never happen (24), hand-set addresses bypassing
 * that protection (25), and the lease itself (26). Gateway (27) and the
 * DNS handout (88) stay with their own chapters, as decided.
 *
 * Staging follows the series' settled rules: the story's events happen
 * in the railway world; home appears only as the doorway (the parcel,
 * Pip installing the bulb himself, bed). The bulb IS a station (a
 * device is a station), she arrives as freight and becomes a station
 * when set in place, the rails are the network and never the power —
 * her lamp lighting is her own power state, a separate event from
 * joining the line. She can talk face-to-face before she has a number
 * (standing in front of someone is not network traffic); what the
 * number buys her is being callable by the whole line.
 *
 * Map discipline inside this chapter: Momo appears on the LanMap only
 * from the Ack step on — before that she has no address, so she is not
 * on the network map yet. (The decided removal of `iot` from Chapters
 * 1–2's own maps is a separate, not-yet-implemented change; this file
 * does not touch those chapters.) Illustrations are the existing
 * StorybookScenes placeholders, as with Chapter 2's first draft. */
export function MomoGetsOnlineWalkthroughDraft({
  onComplete,
  onNavigatePrevious,
  initialStep,
  onStepChange,
}: {
  onComplete: () => void;
  /** When provided, the first step's disabled "Back" button is replaced
   * with an enabled "Previous Chapter" button that calls this instead. */
  onNavigatePrevious?: () => void;
  /** 0-based step to open on, from the page URL (?step=, 1-based) —
   * reloads and shared step links resume there. */
  initialStep?: number;
  /** Fires whenever the current step changes, so the playground can keep
   * the URL's ?step= in sync. */
  onStepChange?: (step: number, total: number) => void;
}) {
  // The house as Chapter 2 left it — Momo is not on the network yet.
  const houseDevices: Device[] = DEFAULT_DEVICES.filter((d) => d.id !== "iot");
  // The house once Momo holds 192.168.1.20.
  const onlineDevices: Device[] = DEFAULT_DEVICES;
  // §4: a forgotten old tablet, switched on again, still wearing a
  // hand-painted 192.168.1.10 from long ago.
  const oldTablet: Device = {
    id: "old-tablet",
    label: "Old tablet",
    kind: "pc",
    lastOctet: 10,
    mac: "00:11:22:33:44:55",
  };
  const conflictDevices: Device[] = [...onlineDevices, oldTablet];
  const fixedDevices: Device[] = [...onlineDevices, { ...oldTablet, lastOctet: 30 }];

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
            The cheese photo reached Dad&rsquo;s PC — that was last chapter. This time, a
            parcel brings a new smart bulb to the house.
          </p>
          <p>
            Nobody types a single number. Yet by the end of the night, the bulb has an address
            of its own. Pip, the newcomer last chapter, watches it happen as the senior this
            time.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>A New Light</li>
            <li>Asking for a Number</li>
            <li>Borrowed, Not Owned</li>
            <li>Two Stations, One Number</li>
          </ol>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      story: {
        text: "A parcel arrives at Pip's house.\nPip: \"What's in here?\"\nHe opens the box.\nInside sits a new smart bulb.\nThe hallway light has stopped working.\nPip: \"Then this one has to go up.\"\nHe drags in a stepladder.\nHe climbs up, and takes the old bulb out.\nThen he screws the new one in.\nClick — it lights up.\nPip stares at it.\nPip: \"...is it just me, or is it calling me?\"\nBut his eyes are heavy.\nHe shuffles off to bed.",
        illustration: <SceneHallwayBox />,
      },
      body: (
        <p>
          In short: the new bulb is lit, and its station stands on the line. But it has no
          address, so nothing can be sent to it. Tonight, Pip watches how a newcomer asks for
          an address — and what breaks when two stations share one.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------- 1. A New Light ------------------------
    {
      section: "1. A New Light",
      title: "A New Station Nearby",
      story: {
        text: "Pip blinks.\nHe is standing at Phone Station again.\nThe Clerk leans out of the booth.\nClerk: \"Back again, are you?\"\nClerk: \"Your cheese photo reached Dad's PC, by the way.\"\nPip: \"It really arrived?\"\nClerk: \"Safe and sound. And listen — a new station came in near here today.\"\nPip looks down the line.\nA small voice seems to drift over.\nPip: \"...someone's calling.\"\nHe walks toward the voice.",
        illustration: <SceneWakingAtStation />,
      },
      body: (
        <p>
          Same dream, same line. First, the receipt for last chapter: the photo Pip delivered
          really is sitting on Dad&rsquo;s PC now. And inside this world, the hallway bulb
          has a station of its own — every device does.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "1. A New Light",
      title: "The Only Person She's Met",
      story: {
        text: "The little station stands in its place, lamp lit.\nBut its number board is blank.\nA small voice pipes up.\nMomo: \"Thank you for installing me earlier!\"\nPip: \"Huh? Wait — are you the bulb in the hallway?\"\nMomo: \"That's me! I've been waiting for you to come again.\"\nPip: \"Me? Why me?\"\nMomo: \"Because you're the only person I've ever met.\"\nPip: \"Huh?\"\nMomo: \"I want to talk to other people too. How do I do that?\"",
        illustration: <SceneMomoArrives />,
      },
      body: (
        <div className="space-y-3">
          <p>
            Momo can talk to Pip because he is standing right in front of her. Talking down
            the line works differently.
          </p>
          <p>
            On the line, you call a station by its number — and it calls you back by yours.
            Momo has no number. So nobody can call her, and she cannot call anyone. An address
            of her own has to come first.
          </p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    // --------------------- 2. Asking for a Number --------------------
    {
      section: "2. Asking for a Number",
      title: "Calling Out to Everyone",
      story: {
        text: "Pip: \"There's a way to ask the whole line at once.\"\nPip: \"My phone did the same thing, looking for an address's owner.\"\nMomo takes a deep breath.\nMomo: \"Hello, everyone! I need a number of my own!\"\nMomo: \"Will someone give me one, so I can talk to you all?\"\nThe call rolls down the whole line.",
        illustration: <SceneDoraExchange />,
      },
      body: (
        <div className="space-y-3">
          <p>
            This call goes to every station on the line at once — a broadcast. Momo sends it
            because she has no address yet, and no idea who hands them out.
          </p>
          <p>
            On paper, the call is the DHCP Discover. It is sent from 0.0.0.0, the
            &ldquo;no address yet&rdquo; address. And it never leaves the house: the router
            does not pass broadcasts on.
          </p>
        </div>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "2. Asking for a Number",
      title: "An Answer from the Junction",
      story: {
        text: "At the junction station, the Address Clerk opens the big ledger.\nHe runs a claw down the written numbers first.\nAddress Clerk: \"192.168.1.20 — free. Nobody is using it.\"\nAddress Clerk: \"You may use it, little lamp.\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <p>
          The answer is the DHCP Offer. The router keeps the ledger of every address it has
          lent out — and it checks the ledger before offering. A lent address is never
          offered twice. That one habit is what normally keeps duplicates from happening.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "2. Asking for a Number",
      title: "Asking Out Loud",
      story: {
        text: "Momo: \"Then I'll take 192.168.1.20, please!\"\nShe says it loudly, for the whole line to hear.\nPip: \"Everyone heard that. The number is spoken for now.\"",
        illustration: <SceneDoraExchange />,
      },
      body: (
        <p>
          This is the DHCP Request — and it is broadcast too, on purpose. Every station hears
          which address Momo picked, so nobody else asks for it. There is only one address
          clerk, at the junction, but the announcement keeps the whole line honest.
        </p>
      ),
      visual: <LanMap devices={houseDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "2. Asking for a Number",
      title: "Written in the Ledger",
      story: {
        text: "Back at the junction, the Address Clerk writes in the ledger.\nAddress Clerk: \"192.168.1.20 — the hallway lamp.\"\nThe answer rolls back down the line.\nA number plate goes up on Momo's station.\nMomo: \"Now anyone can call me!\"\nPip: \"Now anyone can.\"",
        illustration: <SceneMomoArrives />,
      },
      body: (
        <div className="space-y-3">
          <p>
            The confirmation is the Ack. The four steps have a nickname: DORA — Discover,
            Offer, Request, Ack.
          </p>
          <p>
            DORA is only the nickname. The system itself is <Term id="dhcp">DHCP</Term>,
            short for Dynamic Host Configuration Protocol. And from this moment, Momo appears
            on the house&rsquo;s network map, at 192.168.1.20.
          </p>
        </div>
      ),
      visual: <LanMap devices={onlineDevices} conflictIds={new Set()} packet={null} />,
    },
    // --------------------- 3. Borrowed, Not Owned --------------------
    {
      section: "3. Borrowed, Not Owned",
      title: "Until the Bell",
      story: {
        text: "Momo calls down the line, toward the junction.\nMomo: \"Will it always be mine?\"\nThe answer comes back.\nAddress Clerk: \"It is lent until the bell, little lamp.\"\nAddress Clerk: \"Ask quietly before then, and it simply carries on.\"\nPip: \"Wait — my number is borrowed too?\"",
        illustration: <SceneLanDesk />,
      },
      body: (
        <p>
          An address is lent, not given. The loan is called a lease, and it has a time limit.
          Renewing is one small, quiet ask — and it almost always just continues. Pip&rsquo;s
          own 192.168.1.10 renews so quietly that he never noticed.
        </p>
      ),
      visual: <LanMap devices={onlineDevices} conflictIds={new Set()} packet={null} />,
    },
    {
      section: "3. Borrowed, Not Owned",
      title: "Gone and Back Again",
      story: {
        text: "Pip calls the junction too.\nPip: \"What if she's switched off for a long, long time?\"\nAddress Clerk: \"The ledger remembers her for a while.\"\nAddress Clerk: \"If her number is still free, she gets it back.\"\nAddress Clerk: \"If it was lent away, she gets another.\"",
        illustration: <SceneFallingAsleep />,
      },
      body: (
        <p>
          A device that sleeps through its lease can wake up to a different address. That is
          normal — and it is why devices ask again every time they join, instead of assuming.
          Nothing breaks; callers just use the new number.
        </p>
      ),
      visual: <LanMap devices={onlineDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------ 4. Two Stations, One Number ------------------
    {
      section: "4. Two Stations, One Number",
      title: "The Hand-Painted Plate",
      story: {
        text: "Far down the line stands a dusty little station.\nAn old tablet, found in a drawer and switched on again.\nLong ago, someone painted its number by hand.\nThe painted number reads: 192.168.1.10.\nPip: \"But... that's MY number.\"",
        illustration: <SceneMixUp />,
      },
      body: (
        <p>
          A hand-set address never goes near the ledger. Nobody checked it, and nobody wrote
          it down. The ledger&rsquo;s protection only covers devices that ask — this one
          never did.
        </p>
      ),
      visual: (
        <LanMap devices={conflictDevices} conflictIds={findConflicts(conflictDevices)} packet={null} />
      ),
    },
    {
      section: "4. Two Stations, One Number",
      title: "Two Answers",
      story: {
        text: "The line calls out: \"192.168.1.10!\"\nTwo stations answer at once.\nMomo: \"Pip? I called you — but two voices answered!\"\nMomo: \"Which one is really you?\"\nA crate for Pip's phone rolls to the dusty station instead.\nPip: \"Someone else is answering to my number.\"",
        illustration: <SceneTwoAnswers />,
      },
      body: (
        <p>
          With two stations on one number, nobody can tell them apart — not callers, not the
          junction. Both answer. Deliveries land at whichever station catches them, and
          replies come back mixed. One number has to mean one station.
        </p>
      ),
      visual: (
        <LanMap devices={conflictDevices} conflictIds={findConflicts(conflictDevices)} packet={null} />
      ),
    },
    {
      section: "4. Two Stations, One Number",
      title: "Ask the Ledger",
      story: {
        text: "The painted plate comes down.\nThe old station asks properly this time, like Momo did.\nThe Address Clerk checks the ledger, and lends it a free number.\nMomo: \"Now I know it's really you, Pip.\"",
        illustration: <SceneFixed />,
      },
      body: (
        <p>
          The fix is always the same: take the painted plate down, and take a number from the
          ledger instead. Asked-for addresses cannot collide — the ledger never lends the
          same one twice.
        </p>
      ),
      visual: <LanMap devices={fixedDevices} conflictIds={new Set()} packet={null} />,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A device with no address asks the whole line at once. That broadcast is the DHCP Discover, sent from 0.0.0.0.</li>
            <li>The router offers a free address from its ledger (Offer), the device requests it out loud (Request), and the ledger writes it down (Ack). The four steps are nicknamed DORA.</li>
            <li>The ledger is why duplicates normally never happen: a lent address is never offered twice.</li>
            <li>An address is a loan with a time limit — a lease. Asking quietly before the limit renews it.</li>
            <li>A hand-set address skips the ledger entirely. If it matches someone else&rsquo;s, both stations answer, and nobody can tell them apart.</li>
          </ul>
          <p>
            Back home, the hallway bulb hangs lit, on the map at 192.168.1.20. Momo can talk
            to every station in the house now. But one thought stays with Pip: she got her
            number just by asking. Can anyone join the line, just by asking?
          </p>
        </div>
      ),
      visual: <LanMap devices={onlineDevices} conflictIds={new Set()} packet={null} />,
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
