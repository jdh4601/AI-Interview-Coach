import type { Question } from '../types/question';
import type { Report } from '../types/report';
import type { InterviewStyle, VoiceGender } from '../types/session';
import type { Company } from '../types/company';

import { generateQuestions as openaiGenerateQuestions } from './openai/questionGenerator';
import { selectVoice, generateTTS as openaiGenerateTTS } from './openai/ttsService';
import { transcribeAudio as openaiTranscribeAudio } from './openai/sttService';
import { generateReport as openaiGenerateReport } from './openai/reportGenerator';

interface GenerateQuestionsParams {
  readonly company: Company;
  readonly jobId: string;
  readonly resumeText: string;
  readonly questionCount: number;
  readonly interviewStyle: InterviewStyle;
}

interface GenerateReportParams {
  readonly company: Company;
  readonly jobId: string;
  readonly resumeText: string;
  readonly questions: readonly Question[];
  readonly answers: Map<
    number,
    { text: string; duration: number; wpm: number; speedLabel: string }
  >;
}

// When backend is ready, ONLY this file needs to change to fetch('/api/...') calls.
const api = {
  async generateQuestions(params: GenerateQuestionsParams): Promise<Question[]> {
    const job = params.company.jobs.find((j) => j.job_id === params.jobId);
    if (!job) {
      throw new Error(`Job not found: ${params.jobId}`);
    }

    return openaiGenerateQuestions({
      companyName: params.company.name,
      companySummary: params.company.company_summary,
      talentProfile: params.company.talent_profile,
      cultureFit: params.company.culture_fit,
      jobTitle: job.title,
      focusPoints: job.focus_points,
      resumeText: params.resumeText,
      questionCount: params.questionCount,
      interviewStyle: params.interviewStyle,
    });
  },

  async generateTTS(
    text: string,
    gender: VoiceGender,
    style: InterviewStyle,
  ): Promise<Blob> {
    const voice = selectVoice(gender, style);
    return openaiGenerateTTS(text, voice);
  },

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return openaiTranscribeAudio(audioBlob);
  },

  async generateReport(params: GenerateReportParams): Promise<Report> {
    const job = params.company.jobs.find((j) => j.job_id === params.jobId);
    if (!job) {
      throw new Error(`Job not found: ${params.jobId}`);
    }

    const answers = Array.from(params.answers.entries()).map(
      ([order, answer]) => ({
        order,
        answerText: answer.text,
        answerDuration: answer.duration,
        answerWpm: answer.wpm,
        speedLabel: answer.speedLabel,
      }),
    );

    return openaiGenerateReport({
      companyName: params.company.name,
      jobTitle: job.title,
      resumeText: params.resumeText,
      questions: params.questions.map((q) => ({
        order: q.order,
        questionText: q.questionText,
        questionType: q.questionType,
        context: q.context,
      })),
      answers,
    });
  },
} as const;

export default api;
