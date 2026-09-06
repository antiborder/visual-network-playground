"use client";

import { useState, type ReactNode } from "react";
import { Term } from "@/components/Term";
import { SegmentedProgressBar } from "@/components/SegmentedProgressBar";
import { StoryText } from "@/components/StoryText";
import { Slider } from "@/components/Slider";
import { HandshakeSequence, type HandshakeStep } from "@/components/HandshakeSequence";
import { LanMap } from "./LanMap";
import { usePacketSend } from "./usePacketSend";
import { DEFAULT_DEVICES, clampOctet, findConflicts, formatIp, type Device } from "./network";
import {
  SceneMomoArrives,
  SceneDoraExchange,
  SceneMixUp,
  SceneTwoAnswers,
  SceneFixed,
} from "./StorybookScenes";

const CONFLICT_OCTET = 10;

const DORA_STEPS: HandshakeStep[] = [
  { from: "left", label: "DHCP Discover", detail: "“Is anyone offering an address?” (broadcast)" },
  { from: "right", label: "DHCP Offer", detail: "“You can have 192.168.1.20”" },
  { from: "left", label: "DHCP Request", detail: "“I'll take that one”" },
  { from: "right", label: "DHCP Ack", detail: "Address leased, for a limited time" },
];

/** Chapter 3: a brand-new story (new protagonist, per the user's explicit
 * permission) — Momo, a smart bulb, joins the house and needs an address.
 * Reuses the DORA + IP-conflict mechanics unchanged, re-narrated. One
 * Section, since the whole story is one continuous scene. Every Step below
 * the Welcome/Wrap-up bookends carries a `story` half (illustration + pure
 * narrative text) above the unchanged technical half. */
export function DhcpWalkthrough({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const [doraStep, setDoraStep] = useState(0);
  const [conflictDevices, setConflictDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const conflictPacket = usePacketSend();
  const conflictIds = findConflicts(conflictDevices);
  const setBulbOctet = (n: number) =>
    setConflictDevices((ds) => ds.map((d) => (d.id === "iot" ? { ...d, lastOctet: clampOctet(n) } : d)));
  const makeConflict = () =>
    setConflictDevices((ds) => ds.map((d) => (d.id === "iot" ? { ...d, lastOctet: CONFLICT_OCTET } : d)));
  const resetConflictDevices = () => {
    setConflictDevices(DEFAULT_DEVICES);
    conflictPacket.reset();
  };

  interface Step {
    section: string;
    title: string;
    story?: { text: string; illustration: ReactNode };
    body: ReactNode;
    visual: ReactNode;
    controls?: ReactNode;
    onAdvance?: () => void;
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
            One evening, Dad comes home with a box under his arm: a new smart bulb for the
            hallway lamp. Its name, printed on the box in cheerful letters, is Momo.
          </p>
          <p>
            Before Momo can light up on command, it needs an address of its own — and
            you&rsquo;ll see exactly how it gets one, and what happens when someone tries to skip
            the process.
          </p>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Getting Momo Online</li>
          </ol>
        </div>
      ),
      visual: undefined,
    },
    {
      section: "Welcome",
      title: "The chapter at a glance",
      body: (
        <p>
          In short: this chapter follows Momo the smart bulb from the moment it&rsquo;s screwed in
          to the moment it&rsquo;s finally, uniquely, reachable — including one hallway mix-up
          along the way.
        </p>
      ),
      visual: <HandshakeSequence leftLabel="Momo" rightLabel="Router" steps={DORA_STEPS} currentStep={0} />,
    },
    // ---------------------- 1. Getting Momo Online ---------------------
    {
      section: "1. Getting Momo Online",
      title: "A new smart bulb joins the house",
      story: {
        text: "Dad pulls a box out from under his arm — its name, printed in cheerful letters, is Momo.\nDad: \"A smart bulb for the hallway lamp!\"\nWithout an address of its own yet, Momo needs a system to hand it one — that's DHCP.",
        illustration: <SceneMomoArrives />,
      },
      body: (
        <div className="space-y-2">
          <p>
            Momo screws into the hallway lamp and blinks awake for the very first time. It has no
            address yet — nobody has told it one.
          </p>
          <p>
            Typing an address in by hand does work, but it&rsquo;s easy to accidentally repeat one
            already in use, which is exactly the trouble about to happen in this story.
          </p>
          <p>
            Most devices instead get their address automatically over{" "}
            <Term id="dhcp">DHCP</Term> (short for Dynamic Host Configuration Protocol) — a
            router service that hands out and tracks addresses for you.
          </p>
        </div>
      ),
      visual: <HandshakeSequence leftLabel="Momo" rightLabel="Router" steps={DORA_STEPS} currentStep={0} />,
    },
    {
      section: "1. Getting Momo Online",
      title: "Watch it happen",
      story: {
        text: "Momo calls out into the Wi-Fi.\nMomo: \"Is anyone offering an address?\"\nRouter: \"You can have 192.168.1.20.\"\nMomo: \"I'll take it.\"\nDiscover, Offer, Request, Ack — together, this little exchange is known as DORA.",
        illustration: <SceneDoraExchange />,
      },
      body: (
        <p>
          These four messages are commonly remembered by the acronym <strong>DORA</strong> —
          Discover, Offer, Request, Ack — the name for this exchange itself, not for{" "}
          <Term id="dhcp">DHCP</Term> the protocol. Click through it below.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={() => setDoraStep((s) => Math.min(DORA_STEPS.length, s + 1))}
          disabled={doraStep >= DORA_STEPS.length}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark disabled:opacity-40 text-sm font-medium text-white"
        >
          {doraStep === 0
            ? "Start"
            : doraStep >= DORA_STEPS.length
              ? "Done"
              : `Next: ${DORA_STEPS[doraStep].label}`}
        </button>
      ),
      visual: <HandshakeSequence leftLabel="Momo" rightLabel="Router" steps={DORA_STEPS} currentStep={doraStep} />,
      resetAction: () => setDoraStep(0),
    },
    {
      section: "1. Getting Momo Online",
      title: "Why this normally prevents conflicts",
      story: {
        text: "The router checks its lease list.\nRouter: \"Don't worry — I keep track of every address I hand out. 192.168.1.20 is yours, and only yours.\"\nThat lease list the router keeps is exactly what normally stops two devices from colliding.",
        illustration: <SceneDoraExchange />,
      },
      body: (
        <div className="space-y-2">
          <p>
            The router keeps a table of every address it has already leased out, so as long as
            devices only ever get addresses this way, it will never hand out the same one twice.
          </p>
          <p>
            The conflict about to happen occurs because someone sets an address by hand instead,
            stepping around the one system built to prevent exactly that.
          </p>
        </div>
      ),
      visual: (
        <HandshakeSequence leftLabel="Momo" rightLabel="Router" steps={DORA_STEPS} currentStep={DORA_STEPS.length} />
      ),
    },
    {
      section: "1. Getting Momo Online",
      title: "A mix-up",
      story: {
        text: "A few days later, Dad pokes around in the router's settings app.\nDad: \"Let's just give Momo a fixed address, so it always answers to the same name.\"\nType an address in by hand, though, and that protection never gets the chance to kick in.",
        illustration: <SceneMixUp />,
      },
      body: (
        <p>
          Click the button below to (accidentally, on purpose) give Momo the exact same address as
          Pip&rsquo;s phone — the kind of mistake DHCP normally prevents, but a manually typed
          address doesn&rsquo;t.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={makeConflict}
          className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-900 text-sm font-medium text-white"
        >
          Give Momo {formatIp(CONFLICT_OCTET)} too
        </button>
      ),
      visual: <LanMap devices={conflictDevices} conflictIds={conflictIds} packet={null} showMac />,
      resetAction: resetConflictDevices,
    },
    {
      section: "1. Getting Momo Online",
      title: "Two answers to the same question",
      story: {
        text: `Broadcast: "Who has ${formatIp(CONFLICT_OCTET)}?"\nThis time, both Pip's phone and Momo answer — the hallway lamp starts flickering on and off whenever Pip's phone tries to load anything.\nDad: "That's not right."\nTwo replies to one question, with no way to tell them apart — that's an IP conflict.`,
        illustration: <SceneTwoAnswers />,
      },
      body: (
        <p>
          There&rsquo;s no correct way to pick between two replies to the same question, so the
          address becomes undeliverable to either device. This is the actual, technical reason an{" "}
          <Term id="ip-conflict">IP conflict</Term> can&rsquo;t just be worked around.
        </p>
      ),
      controls: (
        <button
          type="button"
          onClick={() => conflictPacket.send("pc", CONFLICT_OCTET)}
          className="px-3 py-1.5 rounded-md bg-storybook-accent hover:bg-storybook-accent-dark text-sm font-medium text-white"
        >
          Who has {formatIp(CONFLICT_OCTET)}?
        </button>
      ),
      visual: <LanMap devices={conflictDevices} conflictIds={conflictIds} packet={conflictPacket.packet} showMac />,
      resetAction: () => conflictPacket.reset(),
    },
    {
      section: "1. Getting Momo Online",
      title: "Fixing it",
      story: {
        text: "Dad drags Momo's address away from the clash.\nDad: \"There — try that instead.\"\nThe flickering stops at once, and Momo settles happily back into 192.168.1.20.\nDad: \"Much better.\"\nOne unique address each, and the conflict simply disappears.",
        illustration: <SceneFixed />,
      },
      body: (
        <p>
          Drag the slider away from {formatIp(CONFLICT_OCTET)}, then broadcast again — with two
          unique addresses, exactly one reply comes back.
        </p>
      ),
      controls: (
        <Slider
          label="Momo's address"
          value={conflictDevices.find((d) => d.id === "iot")!.lastOctet}
          min={2}
          max={254}
          step={1}
          onChange={setBulbOctet}
          format={formatIp}
        />
      ),
      visual: <LanMap devices={conflictDevices} conflictIds={conflictIds} packet={conflictPacket.packet} showMac />,
      resetAction: resetConflictDevices,
    },
    // ------------------------------ Wrap-up --------------------------
    {
      section: "Wrap-up",
      title: "Now it's your turn",
      body: (
        <div className="space-y-3">
          <p>Here&rsquo;s everything this chapter covered:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><Term id="dhcp">DHCP</Term> (Dynamic Host Configuration Protocol) hands out addresses automatically, tracked via the Discover→Offer→Request→Ack exchange (DORA), which is what normally prevents conflicts.</li>
            <li>Manually typing a fixed address bypasses that protection.</li>
            <li>Two replies to the same ARP question is exactly what an <Term id="ip-conflict">IP conflict</Term> is — and it&rsquo;s unresolvable until one device gets its own address back.</li>
          </ul>
          <p>
            A free-play version of this scenario is now unlocked below — replay Momo&rsquo;s DHCP
            handshake, or cause (and fix) the conflict yourself.
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
    current.onAdvance?.();
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
