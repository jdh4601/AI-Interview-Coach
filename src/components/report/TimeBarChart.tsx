interface TimeBarChartProps {
  questions: { order: number; answerTime: number }[];
}

const MAX_SECONDS = 120;

function getBarColor(answerTime: number): string {
  if (answerTime >= 105) return 'bg-signal-red shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  if (answerTime >= 60) return 'bg-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
}

export function TimeBarChart({ questions }: TimeBarChartProps) {
  return (
    <div className="flex flex-col gap-5 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
      {questions.map(({ order, answerTime }) => {
        const widthPercent = Math.min((answerTime / MAX_SECONDS) * 100, 100);

        return (
          <div key={order} className="flex items-center gap-4">
            <span className="text-sm text-electric-blue font-bold tracking-wide w-8 shrink-0">
              Q{order}
            </span>
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getBarColor(answerTime)}`}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            <span className="text-sm text-ghost w-12 font-data text-right">
              {answerTime}s
            </span>
          </div>
        );
      })}
    </div>
  );
}
