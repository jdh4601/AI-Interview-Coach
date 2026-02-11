import type { SpeedLabel } from '../../types/question';

interface SpeedSignalProps {
  speedLabel: SpeedLabel | null;
}

const SIGNALS = [
  { key: 'fast', label: '빠름', activeColor: 'bg-amber-500', textColor: 'text-amber-400' },
  { key: 'normal', label: '적정', activeColor: 'bg-emerald-500', textColor: 'text-emerald-400' },
  { key: 'slow', label: '느림', activeColor: 'bg-red-500', textColor: 'text-red-400' },
] as const;

export function SpeedSignal({ speedLabel }: SpeedSignalProps) {
  return (
    <div className="flex items-center gap-4">
      {SIGNALS.map((signal) => {
        const isActive = speedLabel === signal.key;

        return (
          <div key={signal.key} className="flex items-center gap-1.5">
            <div
              className={`
                rounded-full transition-all
                ${isActive
                  ? `w-3.5 h-3.5 ${signal.activeColor}`
                  : 'w-2.5 h-2.5 bg-slate-600 opacity-30'
                }
              `.trim()}
            />
            <span
              className={`
                text-xs font-medium transition-colors
                ${isActive ? signal.textColor : 'text-slate-600'}
              `.trim()}
            >
              {signal.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
