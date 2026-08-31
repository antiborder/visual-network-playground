"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PacketState {
  fromId: string;
  /** The destination address the user sent to — resolved against the
   * current device list by the caller/LanMap, not stored here, so a
   * conflict correctly reflects whichever devices hold that address at
   * render time. */
  toOctet: number;
  /** 0 (just sent) to 1 (arrived). */
  progress: number;
}

const DURATION_MS = 900;

/** Drives a single in-flight packet's 0→1 progress over time via
 * requestAnimationFrame — the same "own the timing in a small hook, keep
 * the visual a pure function of props" split used by the reference app's
 * setTimeout-driven training loops. `reset` is the undo affordance for
 * whatever `send` started. */
export function usePacketSend() {
  const [packet, setPacket] = useState<PacketState | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const send = useCallback(
    (fromId: string, toOctet: number) => {
      stopAnimation();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        setPacket({ fromId, toOctet, progress });
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
    setPacket(null);
  }, [stopAnimation]);

  useEffect(() => stopAnimation, [stopAnimation]);

  return { packet, send, reset };
}
