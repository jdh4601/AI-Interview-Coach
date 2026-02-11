import type { SpeedLabel } from './question';

export interface QuestionAnalysis {
  readonly questionOrder: number;
  readonly answerTime: number;
  readonly speedLabel: SpeedLabel;
  readonly aiSuggestedAnswer: string;
  readonly oneLineReview: string;
}

export interface Report {
  readonly summary: string;
  readonly avgAnswerTime: number;
  readonly avgWpm: number;
  readonly questionAnalyses: readonly QuestionAnalysis[];
}
