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
    <div className="border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-sm font-semibold tracking-wide text-ghost/70 group-hover:text-electric-blue transition-colors">
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 text-ghost/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="text-sm text-ghost/80 leading-relaxed max-w-none">
            {children}
          </div>
        </div>
      </div>
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
    <Card className="flex flex-col gap-6">
      {/* Question header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-electric-blue font-bold tracking-wider px-2 py-1 rounded bg-electric-blue/10 border border-electric-blue/20">QUESTION {order}</span>
            <span className="text-xs text-ghost/50 font-data">{answerTime}s / {MAX_SECONDS}s</span>
          </div>
          <h4 className="text-base font-semibold text-white leading-snug">
            {questionText}
          </h4>
        </div>
        <div className="shrink-0">
          <Badge variant={SPEED_BADGE_VARIANT[speedLabel]}>
            <span className="tracking-wide text-xs">{SPEED_BADGE_LABEL[speedLabel]}</span>
          </Badge>
        </div>
      </div>

      {/* Time bar (Subtle) */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-[-0.5rem]">
        <div
          className="h-full bg-electric-blue rounded-full opacity-60"
          style={{ width: `${timeWidthPercent}%` }}
        />
      </div>

      {/* One-line Review Badge */}
      <div className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <p className="text-sm font-semibold text-emerald tracking-wide mt-0.5">{oneLineReview}</p>
      </div>

      <div className="flex flex-col gap-2">
        <CollapsibleSection title="내 답변 기록" defaultOpen>
          <p className="font-sans italic">{answerText}</p>
        </CollapsibleSection>

        <CollapsibleSection title="AI 추천 모범 답변">
          <p className="font-sans">{aiSuggestedAnswer}</p>
        </CollapsibleSection>
      </div>
    </Card>
  );
}
