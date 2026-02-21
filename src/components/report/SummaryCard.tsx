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
    <Card className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h3 className="text-xl font-bold tracking-wide text-white mb-4">종합 요약 분석</h3>
        <p className="text-base text-ghost/80 leading-relaxed font-sans">{summary}</p>
      </div>

      <div className="w-px bg-white/10 hidden md:block" />

      <div className="flex flex-row md:flex-col justify-around md:justify-center gap-6 md:min-w-[200px]">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="text-sm tracking-wide text-ghost/50 font-semibold mb-1">평균 답변 시간</span>
          <span className="text-3xl font-bold text-electric-blue font-data tracking-wider">
            {formatTime(Math.round(avgAnswerTime))}
          </span>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-sm tracking-wide text-ghost/50 font-semibold mb-2">평균 발화 속도 (WPM)</span>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white font-data">
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
