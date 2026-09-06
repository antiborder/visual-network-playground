"use client";

import { useState } from "react";
import { MeetTheNetworkWalkthrough } from "./MeetTheNetworkWalkthrough";
import { MeetTheNetworkPlayground } from "./MeetTheNetworkPlayground";

/** Wraps Chapter 1's walkthrough with a free-play railway-map sandbox below
 * it — same "Lab" pattern as the old ShortWayHomeLab. Trial implementation
 * of the "each chapter gets its own interactive playground below the
 * walkthrough" idea; see the chat that requested it for why the
 * router/modem/LAN-vs-internet interaction landed here despite initially
 * being flagged as better suited to a later chapter — the user asked to
 * try it in Chapter 1 anyway.
 *
 * The playground reveals once the reader reaches the walkthrough's last
 * step ("Try It Yourself"), not when they click its Finish button — that
 * button is relabeled "Next Chapter" and now navigates straight to
 * Chapter 2 instead of completing in place, so gating the reveal on it
 * would make the playground unreachable through the normal flow. */
export function MeetTheNetworkLab({
  onNavigateNext,
  startAtEnd = false,
}: {
  onNavigateNext?: () => void;
  /** Land on the last step instead of the first — set when the reader
   * arrives via Chapter 2's "Previous Chapter" button. */
  startAtEnd?: boolean;
}) {
  const [reachedEnd, setReachedEnd] = useState(startAtEnd);

  return (
    <div className="space-y-8">
      <MeetTheNetworkWalkthrough
        onComplete={() => onNavigateNext?.()}
        finishLabel="Next Chapter"
        startAtEnd={startAtEnd}
        onStepChange={(step, total) => {
          if (step === total - 1) setReachedEnd(true);
        }}
      />

      {reachedEnd && (
        <div>
          <h3 className="text-sm font-medium text-neutral-800 mb-1">Explore it yourself</h3>
          <p className="text-xs text-neutral-500 mb-4">
            Pip&rsquo;s whole home line, modeled as a little railway map. Send a train from any
            station and watch where it actually goes.
          </p>
          <MeetTheNetworkPlayground />
        </div>
      )}
    </div>
  );
}
