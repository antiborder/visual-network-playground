"use client";

import { useState } from "react";
import { MeetTheNetworkLab } from "./MeetTheNetworkLab";
import { FindingTheBoardWalkthrough } from "./FindingTheBoardWalkthrough";
import { TheShortWayHomeWalkthroughDraft } from "./TheShortWayHomeWalkthroughDraft";
import { LeavingTheHouseWalkthroughDraft } from "./LeavingTheHouseWalkthroughDraft";
import { DhcpLab } from "./DhcpLab";

const CHAPTERS = [
  { id: "meet-the-network", label: "Chapter 1: Meet the Network" },
  { id: "short-way-home", label: "Chapter 2: The Short Way Home" },
  { id: "momo-gets-online", label: "Chapter 3: Momo Gets Online" },
  { id: "finding-the-board", label: "Chapter 4: Finding the Board" },
  { id: "leaving-the-house", label: "Chapter 5: Leaving the House" },
] as const;

export type DraftChapterId = (typeof CHAPTERS)[number]["id"];

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
 * still renders the old, un-storified `DhcpLab` as a stopgap — it hasn't
 * been rewritten yet into a Pip-as-observer story (see
 * docs/beginner-story-redesign.md § ③) or converted to the train analogy
 * (see docs/network-train-analogy.md § 5). "Who Goes There?", "Did It
 * Work?", and "Seeing It All at Once" still need to be written/ported in
 * too. */
export function DraftBeginnerPlayground() {
  const [activeChapter, setActiveChapter] = useState<DraftChapterId>("meet-the-network");
  // True only when the reader arrived at Chapter 1 via Chapter 2's "Previous
  // Chapter" button — makes it land on the last step instead of the first.
  // Reset whenever a chapter tab is clicked directly, so that path still
  // always starts fresh.
  const [meetTheNetworkStartAtEnd, setMeetTheNetworkStartAtEnd] = useState(false);

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              if (c.id === "meet-the-network") setMeetTheNetworkStartAtEnd(false);
              setActiveChapter(c.id);
            }}
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

      {activeChapter === "meet-the-network" && (
        <MeetTheNetworkLab
          onNavigateNext={() => setActiveChapter("short-way-home")}
          startAtEnd={meetTheNetworkStartAtEnd}
        />
      )}
      {activeChapter === "short-way-home" && (
        <TheShortWayHomeWalkthroughDraft
          onComplete={() => {}}
          onNavigatePrevious={() => {
            setMeetTheNetworkStartAtEnd(true);
            setActiveChapter("meet-the-network");
          }}
        />
      )}
      {activeChapter === "momo-gets-online" && <DhcpLab />}
      {activeChapter === "finding-the-board" && <FindingTheBoardWalkthrough onComplete={() => {}} />}
      {activeChapter === "leaving-the-house" && <LeavingTheHouseWalkthroughDraft onComplete={() => {}} />}
    </div>
  );
}
