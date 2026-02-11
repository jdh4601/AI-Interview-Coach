import { formatTime } from '../../lib/formatTime';
import { ProgressBar } from '../ui/ProgressBar';

interface TimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
}

function getTimerTextColor(remainingSeconds: number): string {
  if (remainingSeconds > 60) return 'text-blue-400';
  if (remainingSeconds >= 30) return 'text-amber-400';
  return 'text-red-400';
}

export function TimerBar({ remainingSeconds, totalSeconds }: TimerBarProps) {
  const percentage = totalSeconds > 0
    ? (remainingSeconds / totalSeconds) * 100
    : 0;

  return (
    <div className="flex items-center gap-3 w-full">
      <ProgressBar value={percentage} variant="timer" className="flex-1" />
      <span
        className={`text-sm font-mono font-medium ${getTimerTextColor(remainingSeconds)}`}
      >
        {formatTime(remainingSeconds)}
      </span>
    </div>
  );
}
