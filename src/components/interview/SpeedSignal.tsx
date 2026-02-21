import type { SpeedLabel } from '../../types/question';

interface SpeedSignalProps {
  speedLabel: SpeedLabel | null;
}

const SIGNALS = [
  { key: 'fast', label: '빠름', activeColor: 'bg-signal-red shadow-[0_0_15px_rgba(239,68,68,0.8)]', textColor: 'text-signal-red' },
  { key: 'normal', label: '적정', activeColor: 'bg-emerald shadow-[0_0_15px_rgba(16,185,129,0.8)]', textColor: 'text-emerald' },
  { key: 'slow', label: '느림', activeColor: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]', textColor: 'text-amber-400' },
] as const;

export function SpeedSignal({ speedLabel }: SpeedSignalProps) {
  return (
    <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
      {SIGNALS.map((signal) => {
        const isActive = speedLabel === signal.key;

        return (
          <div key={signal.key} className="flex items-center gap-2">
            <div
              className={`
                rounded-full transition-all duration-300
                ${isActive
                  ? `w-4 h-4 ${signal.activeColor} scale-110`
                  : 'w-3 h-3 bg-white/20'
                }
              `.trim().replace(/\s+/g, ' ')}
            />
            <span
              className={`
                text-sm font-bold tracking-wide transition-colors duration-300
                ${isActive ? signal.textColor : 'text-ghost/40'}
              `.trim().replace(/\s+/g, ' ')}
            >
              {signal.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
