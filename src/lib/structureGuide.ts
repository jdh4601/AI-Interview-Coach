export type StructurePhase = 'intro' | 'core' | 'conclusion';

export interface StructureSection {
  readonly phase: StructurePhase;
  readonly label: string;
  readonly startSec: number;
  readonly endSec: number;
}

export const STRUCTURE_SECTIONS: readonly StructureSection[] = [
  { phase: 'intro', label: '도입', startSec: 0, endSec: 30 },
  { phase: 'core', label: '핵심 경험', startSec: 30, endSec: 90 },
  { phase: 'conclusion', label: '결과/배운 점', startSec: 90, endSec: 120 },
];

export function getCurrentPhase(elapsedSeconds: number): StructurePhase {
  if (elapsedSeconds < 30) return 'intro';
  if (elapsedSeconds < 90) return 'core';
  return 'conclusion';
}
