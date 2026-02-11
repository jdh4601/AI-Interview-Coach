export type InterviewStyle = 'friendly' | 'pressure';
export type VoiceGender = 'male' | 'female';
export type SessionStatus = 'setup' | 'in_progress' | 'completed';

export interface Session {
  readonly companyId: string;
  readonly jobId: string;
  readonly resumeText: string;
  readonly questionCount: number;
  readonly interviewStyle: InterviewStyle;
  readonly voiceGender: VoiceGender;
  readonly status: SessionStatus;
  readonly createdAt: Date;
}
