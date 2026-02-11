import { useState } from 'react';

import type { SpeedLabel } from '../../types/question';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface QuestionAnalysisCardProps {
  order: number;
  questionText: string;
  answerText: string;
  answerTime: number;
  speedLabel: SpeedLabel;
  aiSuggestedAnswer: string;
  oneLineReview: string;
}

const MAX_SECONDS = 120;

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

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-slate-700 pt-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 text-sm text-slate-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export function QuestionAnalysisCard({
  order,
  questionText,
  answerText,
  answerTime,
  speedLabel,
  aiSuggestedAnswer,
  oneLineReview,
}: QuestionAnalysisCardProps) {
  const timeWidthPercent = Math.min((answerTime / MAX_SECONDS) * 100, 100);

  return (
    <Card className="flex flex-col gap-4">
      {/* Question header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className="text-xs text-blue-400 font-medium">Q{order}</span>
          <h4 className="text-sm font-semibold text-slate-50 mt-0.5">
            {questionText}
          </h4>
        </div>
        <Badge variant={SPEED_BADGE_VARIANT[speedLabel]}>
          {SPEED_BADGE_LABEL[speedLabel]}
        </Badge>
      </div>

      {/* Time bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${timeWidthPercent}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">{answerTime}s</span>
      </div>

      {/* Collapsible sections */}
      <CollapsibleSection title="내 답변" defaultOpen>
        {answerText}
      </CollapsibleSection>

      <CollapsibleSection title="AI 답변 제안">
        {aiSuggestedAnswer}
      </CollapsibleSection>

      <CollapsibleSection title="한 줄 평가">
        <p className="text-blue-400 font-medium">{oneLineReview}</p>
      </CollapsibleSection>
    </Card>
  );
}
