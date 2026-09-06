"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Point {
  x: number;
  y: number;
}

interface JourneyState {
  x: number;
  y: number;
  /** Index of the leg currently being traveled (0 = the first hop). */
  legIndex: number;
  done: boolean;
}

const LEG_DURATION_MS = 700;

/** Drives a train's position along an arbitrary multi-stop path (e.g.
 * source → Router → Modem → Mainline) over time via requestAnimationFrame —
 * the same "own the timing in a small hook, keep the visual a pure function
 * of props" split as `usePacketSend`, generalized from a single straight
 * leg to a sequence of waypoints so a playground can show a trip actually
 * passing through each station along the way, not just jumping A to B. */
export function useTrainJourney() {
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const send = useCallback(
    (path: Point[]) => {
      stopAnimation();
      if (path.length < 2) return;
      const start = performance.now();
      const totalDuration = (path.length - 1) * LEG_DURATION_MS;
      const tick = (now: number) => {
        const elapsed = Math.min(now - start, totalDuration);
        const legFloat = elapsed / LEG_DURATION_MS;
        const legIndex = Math.min(path.length - 2, Math.floor(legFloat));
        const legProgress = legFloat - legIndex;
        const from = path[legIndex];
        const to = path[legIndex + 1];
        const done = elapsed >= totalDuration;
        setJourney({
          x: from.x + (to.x - from.x) * legProgress,
          y: from.y + (to.y - from.y) * legProgress,
          legIndex,
          done,
        });
        if (!done) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopAnimation]
  );

  const reset = useCallback(() => {
    stopAnimation();
    setJourney(null);
  }, [stopAnimation]);

  useEffect(() => stopAnimation, [stopAnimation]);

  return { journey, send, reset };
}
