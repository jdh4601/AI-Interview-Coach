import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { useInterviewStore } from '../stores/useInterviewStore';
import { useReportStore } from '../stores/useReportStore';
import { companies } from '../data/companies';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PageContainer } from '../components/layout/PageContainer';

export default function InterviewCompletePage() {
  const navigate = useNavigate();
  const session = useSessionStore();
  const interview = useInterviewStore();
  const reportStore = useReportStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mark session as completed when this page mounts
  // (moved from InterviewPage to avoid InterviewGuard redirect race)
  const setSessionStatus = useSessionStore((s) => s.setStatus);
  useEffect(() => {
    if (!session.companyId) {
      navigate('/setup/company', { replace: true });
      return;
    }
    setSessionStatus('completed');
  }, [setSessionStatus, session.companyId, navigate]);

  async function handleGenerateReport() {
    setIsGenerating(true);
    setError(null);

    try {
      const company = companies.find((c) => c.company_id === session.companyId);
      if (!company) throw new Error('기업 정보를 찾을 수 없습니다.');

      const report = await api.generateReport({
        company,
        jobId: session.jobId,
        resumeText: session.resumeText,
        questions: interview.questions,
        answers: interview.answers,
      });

      reportStore.setReport(report);
      navigate('/report');
    } catch (err) {
      setError(err instanceof Error ? err.message : '리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <PageContainer className="text-center">
        <div className="mb-6 text-6xl">✅</div>

        <h1 className="mb-4 text-3xl font-bold">면접이 종료되었습니다</h1>

        <p className="mb-2 text-slate-400">
          총 {interview.questions.length}개 질문에 답변하셨습니다.
        </p>
        <p className="mb-12 text-sm text-slate-500">
          AI가 답변을 분석하여 맞춤 피드백을 생성합니다.
        </p>

        {isGenerating && (
          <div className="mb-8 flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <div className="space-y-1">
              <p className="text-slate-300">리포트 생성 중...</p>
              <p className="text-xs text-slate-500">답변 분석 및 피드백을 작성하고 있습니다</p>
            </div>
          </div>
        )}

        {error && (
          <p className="mb-6 text-sm text-red-400">{error}</p>
        )}

        <Button
          size="lg"
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="min-w-[200px]"
        >
          {isGenerating ? '분석 중...' : '결과 보기'}
        </Button>
      </PageContainer>
    </div>
  );
}
