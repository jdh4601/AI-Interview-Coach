interface TimeBarChartProps {
  questions: { order: number; answerTime: number }[];
}

const MAX_SECONDS = 120;

function getBarColor(answerTime: number): string {
  if (answerTime > 90) return 'bg-blue-600';
  if (answerTime >= 60) return 'bg-emerald-500';
  return 'bg-amber-500';
}

export function TimeBarChart({ questions }: TimeBarChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {questions.map(({ order, answerTime }) => {
        const widthPercent = Math.min((answerTime / MAX_SECONDS) * 100, 100);

        return (
          <div key={order} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium w-8 shrink-0">
              Q{order}
            </span>
            <div className="flex-1 h-6 bg-slate-700 rounded overflow-hidden relative">
              <div
                className={`h-full rounded transition-all duration-500 ${getBarColor(answerTime)}`}
                style={{ width: `${widthPercent}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-300 font-mono">
                {answerTime}s
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
