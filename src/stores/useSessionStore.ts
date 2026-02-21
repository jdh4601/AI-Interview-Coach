import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { InterviewStyle, SessionStatus, VoiceGender } from '../types/session';

interface SessionState {
  companyId: string;
  jobId: string;
  resumeText: string;
  questionCount: number;
  interviewStyle: InterviewStyle;
  voiceGender: VoiceGender;
  status: SessionStatus;

  setCompany: (companyId: string, jobId: string) => void;
  setResumeText: (text: string) => void;
  setQuestionCount: (count: number) => void;
  setInterviewStyle: (style: InterviewStyle) => void;
  setVoiceGender: (gender: VoiceGender) => void;
  setStatus: (status: SessionStatus) => void;
  reset: () => void;
}

const initialState = {
  companyId: '',
  jobId: '',
  resumeText: '',
  questionCount: 5,
  interviewStyle: 'friendly' as InterviewStyle,
  voiceGender: 'male' as VoiceGender,
  status: 'setup' as SessionStatus,
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,

      setCompany: (companyId, jobId) => set({ companyId, jobId }),

      setResumeText: (text) => set({ resumeText: text }),

      setQuestionCount: (count) => set({ questionCount: count }),

      setInterviewStyle: (style) => set({ interviewStyle: style }),

      setVoiceGender: (gender) => set({ voiceGender: gender }),

      setStatus: (status) => set({ status }),

      reset: () => set(initialState),
    }),
    {
      name: 'ai-interview-session',
    }
  )
);
