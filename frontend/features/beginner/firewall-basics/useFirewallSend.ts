"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction } from "./firewall";

export interface FirewallProgress {
  /** 0 (just sent) to 1 (arrived — either through the gate, or bounced
   * back to where it started). */
  progress: number;
  direction: Direction;
  allowed: boolean;
}

const DURATION_MS = 900;

/** Same timing split as `usePacketSend`/`useRequestSend`: this hook only
 * owns the 0→1 clock, `FirewallGate` turns that into a position. */
export function useFirewallSend() {
  const [state, setState] = useState<FirewallProgress | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const send = useCallback(
    (direction: Direction, allowed: boolean) => {
      stopAnimation();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        setState({ progress, direction, allowed });
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
