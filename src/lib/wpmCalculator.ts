import type { SpeedLabel } from '../types/question';

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

function countHangulSyllables(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      count++;
    }
  }
  return count;
}

export function calculateWpm(text: string, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  const syllables = countHangulSyllables(text);
  const words = syllables / 2.5;
  return Math.round((words / durationSeconds) * 60);
}

export function getSpeedLabel(wpm: number): SpeedLabel {
  if (wpm > 180) return 'fast';
  if (wpm >= 120) return 'normal';
  return 'slow';
}
