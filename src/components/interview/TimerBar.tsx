import { formatTime } from '../../lib/formatTime';
import { ProgressBar } from '../ui/ProgressBar';

interface TimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
}

function getTimerTextColor(remainingSeconds: number, totalSeconds: number): string {
  const elapsed = totalSeconds - remainingSeconds;
  return elapsed >= 90 ? 'text-signal-red' : 'text-electric-blue';
}

export function TimerBar({ remainingSeconds, totalSeconds }: TimerBarProps) {
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const percentage = totalSeconds > 0
    ? (elapsedSeconds / totalSeconds) * 100
    : 0;

  return (
    <div className="flex items-center gap-6 w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-lg">
      <ProgressBar value={percentage} variant="timer" className="flex-1" />
      <span
        className={`text-2xl font-data tracking-wider font-bold ${getTimerTextColor(remainingSeconds, totalSeconds)}`}
      >
        {formatTime(remainingSeconds)}
      </span>
    </div>
  );
}
