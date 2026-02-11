import { create } from 'zustand';

import type { Question, SpeedLabel } from '../types/question';

interface AnswerEntry {
  readonly text: string;
  readonly duration: number;
  readonly wpm: number;
  readonly speedLabel: SpeedLabel;
}

interface InterviewState {
  questions: Question[];
  ttsBlobs: Map<number, Blob>;
  currentIndex: number;
  answers: Map<number, AnswerEntry>;
  isLoading: boolean;
  error: string | null;

  setQuestions: (questions: Question[]) => void;
  setTtsBlob: (order: number, blob: Blob) => void;
  setAllTtsBlobs: (blobs: Map<number, Blob>) => void;
  advanceQuestion: () => void;
  setAnswer: (order: number, text: string, duration: number, wpm: number, speedLabel: SpeedLabel) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLastQuestion: () => boolean;
  reset: () => void;
}

const initialState = {
  questions: [] as Question[],
  ttsBlobs: new Map<number, Blob>(),
  currentIndex: 0,
  answers: new Map<number, AnswerEntry>(),
  isLoading: false,
  error: null as string | null,
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  ...initialState,

  setQuestions: (questions) => set({ questions }),

  setTtsBlob: (order, blob) => {
    const next = new Map(get().ttsBlobs);
    next.set(order, blob);
    set({ ttsBlobs: next });
  },

  setAllTtsBlobs: (blobs) => set({ ttsBlobs: new Map(blobs) }),

  advanceQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  setAnswer: (order, text, duration, wpm, speedLabel) => {
    const next = new Map(get().answers);
    next.set(order, { text, duration, wpm, speedLabel });
    set({ answers: next });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  isLastQuestion: () => {
    const { currentIndex, questions } = get();
    return currentIndex >= questions.length - 1;
  },

  reset: () =>
    set({
      questions: [],
      ttsBlobs: new Map<number, Blob>(),
      currentIndex: 0,
      answers: new Map<number, AnswerEntry>(),
      isLoading: false,
      error: null,
    }),
}));
