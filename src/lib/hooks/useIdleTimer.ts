// lib/hooks/useIdleTimer.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

type IdleTimerProps = {
  onIdle: () => void;
  idleTime: number;
};

export function useIdleTimer({ onIdle, idleTime }: IdleTimerProps) {
  const { data: session } = useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // We use a ref for the callback to ensure we always
  // have the latest version without re-triggering the effect.
  const onIdleRef = useRef(onIdle);
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  // The function that resets the timer.
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    timerRef.current = setTimeout(() => {
      // Call the idle callback
      onIdleRef.current();
    }, idleTime * 1000); // Convert seconds to milliseconds
  }, [idleTime]);

  useEffect(() => {
    // We only want to run this if the user is logged in.
    if (session) {
      // List of events that reset the timer
      const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

      // Add event listeners
      events.forEach((event) => window.addEventListener(event, resetTimer));

      // Start the timer on mount
      resetTimer();

      // Cleanup function
      return () => {
        // Clear the timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        // Remove all event listeners
        events.forEach((event) =>
          window.removeEventListener(event, resetTimer)
        );
      };
    }
  }, [resetTimer, session]); // Re-run if the user logs in/out
}
