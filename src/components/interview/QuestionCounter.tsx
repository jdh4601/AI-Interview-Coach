interface QuestionCounterProps {
  current: number;
  total: number;
}

export function QuestionCounter({ current, total }: QuestionCounterProps) {
  return (
    <span className="text-slate-400 text-sm font-medium">
      Q{current} / {total}
    </span>
  );
}
