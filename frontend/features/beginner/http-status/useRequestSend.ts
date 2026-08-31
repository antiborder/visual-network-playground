"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Outcome } from "./http";

export interface RequestProgress {
  /** 0 (just sent) to 1 (response back at the client). */
  progress: number;
  /** Index into the pipeline's node list the *forward* leg travels to
   * before turning back — the point where things actually went wrong, or
   * the last node if nothing did. */
  forwardTargetIndex: number;
  outcome: Outcome;
}

const DURATION_MS = 900;

/** Same "own the timing in a small hook, keep the visual a pure function of
 * props" split as `usePacketSend` (beginner/ip-address-wifi) — driving a
 * linear request/response trip instead of an ARP broadcast/reply. */
export function useRequestSend() {
  const [state, setState] = useState<RequestProgress | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const send = useCallback(
    (forwardTargetIndex: number, outcome: Outcome) => {
      stopAnimation();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        setState({ progress, forwardTargetIndex, outcome });
        if (progress < 1) {
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
    setState(null);
  }, [stopAnimation]);

  useEffect(() => stopAnimation, [stopAnimation]);

  return { state, send, reset };
}
