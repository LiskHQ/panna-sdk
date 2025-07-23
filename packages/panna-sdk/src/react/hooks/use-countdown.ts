import { useEffect, useState } from 'react';

export function useCountdown(
  start: number,
  intervalMs: number = 1000
): [number, () => void] {
  const [timeRemaining, setTimeRemaining] = useState<number>(start);

  // Reset timer when start changes
  useEffect(() => {
    setTimeRemaining(start);
  }, [start]);

  useEffect(() => {
    if (timeRemaining === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, timeRemaining]);

  // Expose a reset function
  const reset = () => setTimeRemaining(start);

  return [timeRemaining, reset];
}
