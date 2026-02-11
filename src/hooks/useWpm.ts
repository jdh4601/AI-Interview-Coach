import { useCallback, useState } from 'react';

import type { SpeedLabel } from '../types/question';
import { calculateWpm, getSpeedLabel } from '../lib/wpmCalculator';

interface WpmReturn {
  currentWpm: number;
  speedLabel: SpeedLabel | null;
  updateWpm: (text: string, durationSeconds: number) => void;
  reset: () => void;
}

export function useWpm(): WpmReturn {
  const [currentWpm, setCurrentWpm] = useState(0);
  const [speedLabel, setSpeedLabel] = useState<SpeedLabel | null>(null);

  const updateWpm = useCallback((text: string, durationSeconds: number) => {
    const wpm = calculateWpm(text, durationSeconds);
    setCurrentWpm(wpm);
    setSpeedLabel(getSpeedLabel(wpm));
  }, []);

  const reset = useCallback(() => {
    setCurrentWpm(0);
    setSpeedLabel(null);
  }, []);

  return { currentWpm, speedLabel, updateWpm, reset };
}
