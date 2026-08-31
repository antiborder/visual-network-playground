"use client";

import { useState } from "react";
import { LeavingTheHouseLab } from "./LeavingTheHouseLab";
import { ShortWayHomeLab } from "./ShortWayHomeLab";
import { DhcpLab } from "./DhcpLab";

const CHAPTERS = [
  { id: "leaving-the-house", label: "Chapter 1: Leaving the House" },
  { id: "short-way-home", label: "Chapter 2: The Short Way Home" },
  { id: "momo-online", label: "Chapter 3: Momo Gets Online" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** [old] This Unit's three Chapters are slated for deletion — the redesigned
 * versions now live under the new "DRAFT: Pip's Network Story" Unit
 * (`features/beginner/ip-address-wifi/DraftBeginnerPlayground.tsx`). Kept
 * around only until that replacement is complete; do not add new content
 * here. Tab-switched — mirrors ai-engineering-lab/frontend's Classical ML
 * Unit pattern: one route, a plain `useState` tab strip, each Chapter's Lab
 * fully unmounted while inactive (so its walkthrough progress resets on
 * return, matching that reference implementation's actual behavior). All
 * three chapters follow Pip the mouse's cheese photo (Chapters 1–2) and a
 * new story about Momo the smart bulb (Chapter 3, DHCP). */
export function IpAddressWifiPlayground() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>("leaving-the-house");

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

      {activeChapter === "leaving-the-house" && (
        <LeavingTheHouseLab onNavigateToChapter={setActiveChapter} />
      )}
      {activeChapter === "short-way-home" && <ShortWayHomeLab onNavigateToChapter={setActiveChapter} />}
      {activeChapter === "momo-online" && <DhcpLab />}
    </div>
  );
}
