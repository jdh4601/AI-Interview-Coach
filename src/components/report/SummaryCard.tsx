import { formatTime } from '../../lib/formatTime';
import { getSpeedLabel } from '../../lib/wpmCalculator';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface SummaryCardProps {
  summary: string;
  avgAnswerTime: number;
  avgWpm: number;
}

const SPEED_BADGE_VARIANT = {
  fast: 'warning',
  normal: 'success',
  slow: 'danger',
} as const;

const SPEED_BADGE_LABEL = {
  fast: '빠름',
  normal: '적정',
  slow: '느림',
} as const;

export function SummaryCard({
  summary,
  avgAnswerTime,
  avgWpm,
}: SummaryCardProps) {
  const speedLabel = getSpeedLabel(avgWpm);

  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-50 mb-3">종합 요약</h3>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{summary}</p>

      <div className="flex items-center gap-6 pt-3 border-t border-slate-700">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">평균 응답 시간</span>
          <span className="text-sm font-medium text-slate-50">
            {formatTime(Math.round(avgAnswerTime))}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">평균 WPM</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-50">
              {avgWpm}
            </span>
            <Badge variant={SPEED_BADGE_VARIANT[speedLabel]}>
              {SPEED_BADGE_LABEL[speedLabel]}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
