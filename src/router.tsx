import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from './App';
import { useSessionStore } from './stores/useSessionStore';
import { useReportStore } from './stores/useReportStore';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const CompanySelectPage = lazy(() => import('./pages/CompanySelectPage'));
const ResumeUploadPage = lazy(() => import('./pages/ResumeUploadPage'));
const SessionConfigPage = lazy(() => import('./pages/SessionConfigPage'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const InterviewCompletePage = lazy(() => import('./pages/InterviewCompletePage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-900"><LoadingSpinner /></div>}>
      {children}
    </Suspense>
  );
}

function InterviewGuard() {
  const status = useSessionStore((s) => s.status);
  if (status !== 'in_progress') return <Navigate to="/" replace />;
  return <SuspenseWrapper><InterviewPage /></SuspenseWrapper>;
}

function ReportGuard() {
  const report = useReportStore((s) => s.report);
  if (!report) return <Navigate to="/" replace />;
  return <SuspenseWrapper><ReportPage /></SuspenseWrapper>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
      { path: 'setup/company', element: <SuspenseWrapper><CompanySelectPage /></SuspenseWrapper> },
      { path: 'setup/resume', element: <SuspenseWrapper><ResumeUploadPage /></SuspenseWrapper> },
      { path: 'setup/config', element: <SuspenseWrapper><SessionConfigPage /></SuspenseWrapper> },
      { path: 'interview', element: <InterviewGuard /> },
      { path: 'interview/complete', element: <SuspenseWrapper><InterviewCompletePage /></SuspenseWrapper> },
      { path: 'report', element: <ReportGuard /> },
    ],
  },
]);
