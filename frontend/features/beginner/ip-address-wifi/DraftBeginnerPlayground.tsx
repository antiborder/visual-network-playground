"use client";

import { useCallback, useEffect, useState } from "react";
import { MeetTheNetworkLab } from "./MeetTheNetworkLab";
import { FindingTheBoardWalkthrough } from "./FindingTheBoardWalkthrough";
import { TheShortWayHomeWalkthroughDraft } from "./TheShortWayHomeWalkthroughDraft";
import { LeavingTheHouseWalkthroughDraft } from "./LeavingTheHouseWalkthroughDraft";
import { MomoGetsOnlineWalkthroughDraft } from "./MomoGetsOnlineWalkthroughDraft";

const CHAPTERS = [
  { id: "meet-the-network", label: "Chapter 1: Meet the Network" },
  { id: "short-way-home", label: "Chapter 2: The Short Way Home" },
  { id: "momo-gets-online", label: "Chapter 3: Momo Gets Online" },
  { id: "finding-the-board", label: "Chapter 4: Finding the Board" },
  { id: "leaving-the-house", label: "Chapter 5: Leaving the House" },
] as const;

export type DraftChapterId = (typeof CHAPTERS)[number]["id"];

/** Read ?ch= / ?step= from the address bar. `step` is 1-based in the URL
 * (matching the on-screen "Step X of Y") and 0-based everywhere inside. */
function parseUrlState(): { ch: DraftChapterId | null; step: number | undefined } {
  const params = new URLSearchParams(window.location.search);
  const chRaw = params.get("ch");
  const ch = CHAPTERS.some((c) => c.id === chRaw) ? (chRaw as DraftChapterId) : null;
  const stepNum = Number.parseInt(params.get("step") ?? "", 10);
  const step = Number.isFinite(stepNum) && stepNum >= 1 ? stepNum - 1 : undefined;
  return { ch, step };
}

/** Write the chapter (and optionally the 0-based step) into the address
 * bar. Step changes use replaceState so they don't flood the history;
 * chapter changes push, so Back returns to the previous chapter. */
function writeUrl(ch: DraftChapterId, step: number | undefined, push: boolean) {
  const url = new URL(window.location.href);
  url.searchParams.set("ch", ch);
  if (step === undefined || step <= 0) url.searchParams.delete("step");
  else url.searchParams.set("step", String(step + 1));
  window.history[push ? "pushState" : "replaceState"](null, "", url.toString());
}

/** The redesigned Beginner track (see docs/beginner-story-redesign.md § ③
 * for the decided chapter order and why), carved out into its own Unit so
 * it can grow independently of the old, soon-to-be-deleted "IP Address &
 * Wi-Fi Connection" Unit (`IpAddressWifiPlayground.tsx`). Every chapter
 * here follows Pip the mouse's cheese photo as one continuous story.
 * Chapter order was deliberately reshuffled from the original redesign
 * plan: "The Short Way Home" (LAN-local, fully beginner-level) runs right
 * after "Meet the Network" so Pip's main cheese-photo plot (Dad wants a
 * copy) continues immediately, before "Momo Gets Online" (DHCP) interrupts
 * as a side-quest; both run before "Finding the Board" and "Leaving the
 * House" (out to the internet) since a full technical breakdown of "what
 * happens between leaving the house and reaching the destination server"
 * showed almost none of it is beginner-level — see the chat that made
 * these calls. "Leaving the House" now ends on a cliffhanger once the
 * packet reaches the open internet; whether/how it actually arrives is
 * intentionally left undecided for a later chapter. "momo-gets-online"
 * was rewritten 2026-11-19 into the story-format
 * `MomoGetsOnlineWalkthroughDraft` (Pip leads, Momo speaks; the old
 * `DhcpLab` remains only in the legacy Unit). "Who Goes There?", "Did It
 * Work?", and "Seeing It All at Once" still need to be written/ported in
 * too.
 *
 * The address bar carries ?ch=<chapter>&step=<1-based step> (2026-11-22):
 * reloading resumes on the same step, a link can point straight at a
 * step, and the browser's Back/Forward move between chapters. Each
 * walkthrough reports its step through onStepChange; the step named by
 * the URL is handed back down as initialStep when a chapter mounts. */
export function DraftBeginnerPlayground() {
  const [activeChapter, setActiveChapter] = useState<DraftChapterId>("meet-the-network");
  // The step named by the URL, handed to whichever chapter mounts next.
  const [initialStep, setInitialStep] = useState<number | undefined>(undefined);
  // Chapters render only after the URL has been adopted on mount, so a
  // reload never flashes Chapter 1 or overwrites the URL from step 0.
  const [ready, setReady] = useState(false);
  // Bumped on popstate so the active chapter remounts and re-reads
  // initialStep even when only the step changed within the same chapter.
  const [navNonce, setNavNonce] = useState(0);
  // True only when the reader arrived at Chapter 1 via Chapter 2's "Previous
  // Chapter" button — makes it land on the last step instead of the first.
  // Reset whenever a chapter tab is clicked directly, so that path still
  // always starts fresh.
  const [meetTheNetworkStartAtEnd, setMeetTheNetworkStartAtEnd] = useState(false);

  useEffect(() => {
    const { ch, step } = parseUrlState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time adoption of the address bar's chapter/step on mount: synchronizing React state with the URL, an external system
    if (ch) setActiveChapter(ch);
    setInitialStep(step);
    setReady(true);
    const onPopState = () => {
      const s = parseUrlState();
      if (s.ch) setActiveChapter(s.ch);
      setInitialStep(s.step);
      setMeetTheNetworkStartAtEnd(false);
      setNavNonce((n) => n + 1);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const goToChapter = useCallback((ch: DraftChapterId) => {
    setMeetTheNetworkStartAtEnd(false);
    setInitialStep(undefined);
    setActiveChapter(ch);
    writeUrl(ch, undefined, true);
  }, []);

  // Only the active chapter is mounted, so its reports always belong to
  // activeChapter.
  const handleStepChange = useCallback(
    (step: number) => writeUrl(activeChapter, step, false),
    [activeChapter],
  );

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => goToChapter(c.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeChapter === c.id
                ? "border-cyan-600 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {ready && activeChapter === "meet-the-network" && (
        <MeetTheNetworkLab
          key={navNonce}
          onNavigateNext={() => goToChapter("short-way-home")}
          startAtEnd={meetTheNetworkStartAtEnd}
          initialStep={initialStep}
          onStepChange={handleStepChange}
        />
      )}
      {ready && activeChapter === "short-way-home" && (
        <TheShortWayHomeWalkthroughDraft
          key={navNonce}
          onComplete={() => {}}
          onNavigatePrevious={() => {
            setMeetTheNetworkStartAtEnd(true);
            setInitialStep(undefined);
            setActiveChapter("meet-the-network");
            writeUrl("meet-the-network", undefined, true);
          }}
          initialStep={initialStep}
          onStepChange={handleStepChange}
        />
      )}
      {ready && activeChapter === "momo-gets-online" && (
        <MomoGetsOnlineWalkthroughDraft
          key={navNonce}
          onComplete={() => {}}
          onNavigatePrevious={() => goToChapter("short-way-home")}
          initialStep={initialStep}
          onStepChange={handleStepChange}
        />
      )}
      {ready && activeChapter === "finding-the-board" && (
        <FindingTheBoardWalkthrough
          key={navNonce}
          onComplete={() => {}}
          initialStep={initialStep}
          onStepChange={handleStepChange}
        />
      )}
      {ready && activeChapter === "leaving-the-house" && (
        <LeavingTheHouseWalkthroughDraft
          key={navNonce}
          onComplete={() => {}}
          initialStep={initialStep}
          onStepChange={handleStepChange}
        />
      )}
    </div>
  );
}
