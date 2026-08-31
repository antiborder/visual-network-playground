"use client";

import { useState } from "react";
import { MeetTheNetworkWalkthrough } from "./MeetTheNetworkWalkthrough";
import { FindingTheBoardWalkthrough } from "./FindingTheBoardWalkthrough";
import { TheShortWayHomeWalkthroughDraft } from "./TheShortWayHomeWalkthroughDraft";
import { LeavingTheHouseWalkthroughDraft } from "./LeavingTheHouseWalkthroughDraft";

const CHAPTERS = [
  { id: "meet-the-network", label: "Chapter 1: Meet the Network" },
  { id: "finding-the-board", label: "Chapter 2: Finding the Board" },
  { id: "short-way-home", label: "Chapter 3: The Short Way Home" },
  { id: "leaving-the-house", label: "Chapter 4: Leaving the House" },
] as const;

export type DraftChapterId = (typeof CHAPTERS)[number]["id"];

/** The redesigned Beginner track (see docs/beginner-story-redesign.md),
 * carved out into its own Unit so it can grow independently of the old,
 * soon-to-be-deleted "IP Address & Wi-Fi Connection" Unit
 * (`IpAddressWifiPlayground.tsx`). Every chapter here follows Pip the
 * mouse's cheese photo as one continuous story. Chapter order was
 * deliberately swapped from the original redesign plan: "The Short Way
 * Home" (LAN-local, fully beginner-level) now runs BEFORE "Leaving the
 * House" (out to the internet), since a full technical breakdown of
 * "what happens between leaving the house and reaching the destination
 * server" showed almost none of it is beginner-level — see the chat that
 * made this call. "Leaving the House" now ends on a cliffhanger once the
 * packet reaches the open internet; whether/how it actually arrives is
 * intentionally left undecided for a later chapter. "Who Goes There?",
 * "Momo Gets Online", "Did It Work?", and "Seeing It All at Once" still
 * need to be written/ported in. */
export function DraftBeginnerPlayground() {
  const [activeChapter, setActiveChapter] = useState<DraftChapterId>("meet-the-network");

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveChapter(c.id)}
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

      {activeChapter === "meet-the-network" && <MeetTheNetworkWalkthrough onComplete={() => {}} />}
      {activeChapter === "finding-the-board" && <FindingTheBoardWalkthrough onComplete={() => {}} />}
      {activeChapter === "short-way-home" && <TheShortWayHomeWalkthroughDraft onComplete={() => {}} />}
      {activeChapter === "leaving-the-house" && <LeavingTheHouseWalkthroughDraft onComplete={() => {}} />}
    </div>
  );
}
