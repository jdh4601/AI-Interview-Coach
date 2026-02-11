export type QuestionType = 'intro' | 'resume' | 'competency' | 'situational';
export type SpeedLabel = 'fast' | 'normal' | 'slow';

export interface Question {
  readonly order: number;
  readonly questionText: string;
  readonly questionType: QuestionType;
  readonly context: string;
}

export interface AnsweredQuestion extends Question {
  readonly answerText: string;
  readonly answerDuration: number;
  readonly answerWpm: number;
  readonly speedLabel: SpeedLabel;
  readonly ttsBlob?: Blob;
}
