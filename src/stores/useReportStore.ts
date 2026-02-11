import { create } from 'zustand';

import type { Report } from '../types/report';

interface ReportState {
  report: Report | null;
  isLoading: boolean;
  error: string | null;

  setReport: (report: Report) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  report: null as Report | null,
  isLoading: false,
  error: null as string | null,
};

export const useReportStore = create<ReportState>((set) => ({
  ...initialState,

  setReport: (report) => set({ report }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
