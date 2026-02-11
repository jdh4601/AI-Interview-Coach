interface ProgressBarProps {
  value: number; // 0-100
  variant?: 'default' | 'timer';
  className?: string;
}

function getTimerColor(value: number): string {
  if (value > 50) return 'bg-blue-600';
  if (value >= 25) return 'bg-amber-500';
  return 'bg-red-500';
}

export function ProgressBar({
  value,
  variant = 'default',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillColor = variant === 'timer' ? getTimerColor(clampedValue) : 'bg-blue-600';

  return (
    <div
      className={`h-2 bg-slate-700 rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillColor}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
