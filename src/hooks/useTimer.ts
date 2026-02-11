import { useCallback, useEffect, useRef, useState } from 'react';

interface TimerReturn {
  remainingSeconds: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isExpired: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(totalSeconds: number): TimerReturn {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          clearTimer();
          setIsRunning(false);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, totalSeconds, clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return {
    remainingSeconds: totalSeconds - elapsed,
    elapsedSeconds: elapsed,
    isRunning,
    isExpired: elapsed >= totalSeconds,
    start,
    stop,
    reset,
  };
}
