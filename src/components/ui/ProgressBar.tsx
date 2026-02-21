interface ProgressBarProps {
  value: number; // 0-100
  variant?: 'default' | 'timer';
  className?: string;
}

export function ProgressBar({
  value,
  variant = 'default',
  className = '',
}: ProgressBarProps) {
  const MathValue = Math.min(100, Math.max(0, value));
  // 90s is 75%, 110s is 91.6% of 120s
  const isCritical = variant === 'timer' && MathValue >= 91.6;

  const getTimerColor = (pct: number) => {
    return pct >= 75 ? 'bg-signal-red' : 'bg-electric-blue';
  };

  const getTimerShadow = (pct: number) => {
    return pct >= 75 ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.3)]';
  };

  const fillColor = variant === 'timer' ? getTimerColor(MathValue) : 'bg-electric-blue';
  const shadow = variant === 'timer' ? getTimerShadow(MathValue) : '';
  const pulseClass = isCritical ? 'animate-pulse' : '';

  return (
    <div
      className={`h-4 bg-white/5 border border-white/10 rounded-full overflow-hidden backdrop-blur-md ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillColor} ${shadow} ${pulseClass}`}
        style={{ width: `${MathValue}%` }}
      />
    </div>
  );
}
