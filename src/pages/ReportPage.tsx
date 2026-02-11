import { useNavigate } from 'react-router-dom';
import { useReportStore } from '../stores/useReportStore';
import { useInterviewStore } from '../stores/useInterviewStore';
import { useSessionStore } from '../stores/useSessionStore';
import { SummaryCard } from '../components/report/SummaryCard';
import { TimeBarChart } from '../components/report/TimeBarChart';
import { QuestionAnalysisCard } from '../components/report/QuestionAnalysisCard';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout/PageContainer';

export default function ReportPage() {
  const navigate = useNavigate();
  const { report, reset: resetReport } = useReportStore();
  const interview = useInterviewStore();
  const session = useSessionStore();

  if (!report) return null;

  const questionsWithAnswers = interview.questions.map((q) => {
    const answer = interview.answers.get(q.order);
    const analysis = report.questionAnalyses.find((a) => a.questionOrder === q.order);
    return { ...q, answer, analysis };
  });

  function handleRestart() {
    resetReport();
    interview.reset();
    session.reset();
    navigate('/');
  }

  return (
    <PageContainer className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">면접 리포트</h1>
        <Button variant="ghost" size="sm" onClick={handleRestart}>
          다시 시작하기
        </Button>
      </div>

      <p className="mb-8 text-sm text-slate-500">
        합격 여부와 무관한 연습용 피드백입니다
      </p>

      <div className="space-y-8">
        <SummaryCard
          summary={report.summary}
          avgAnswerTime={report.avgAnswerTime}
          avgWpm={report.avgWpm}
        />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-200">질문별 답변 시간</h2>
          <TimeBarChart
            questions={interview.questions.map((q) => ({
              order: q.order,
              answerTime: interview.answers.get(q.order)?.duration ?? 0,
            }))}
          />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-200">질문별 상세 분석</h2>
          <div className="space-y-4">
            {questionsWithAnswers.map((item) => (
              <QuestionAnalysisCard
                key={item.order}
                order={item.order}
                questionText={item.questionText}
                answerText={item.answer?.text ?? '(답변 없음)'}
                answerTime={item.answer?.duration ?? 0}
                speedLabel={item.analysis?.speedLabel ?? 'normal'}
                aiSuggestedAnswer={item.analysis?.aiSuggestedAnswer ?? ''}
                oneLineReview={item.analysis?.oneLineReview ?? ''}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 flex justify-center">
        <Button size="lg" onClick={handleRestart} className="min-w-[200px]">
          다시 시작하기
        </Button>
      </div>
    </PageContainer>
  );
}
