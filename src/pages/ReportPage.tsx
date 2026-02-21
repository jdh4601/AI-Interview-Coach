import { useNavigate } from 'react-router-dom';
import { useReportStore } from '../stores/useReportStore';
import { useInterviewStore } from '../stores/useInterviewStore';
import { useSessionStore } from '../stores/useSessionStore';
import { SummaryCard } from '../components/report/SummaryCard';
import { TimeBarChart } from '../components/report/TimeBarChart';
import { QuestionAnalysisCard } from '../components/report/QuestionAnalysisCard';
import { MagneticButton } from '../components/ui/MagneticButton';

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
    <div className="min-h-screen bg-obsidian text-ghost pt-20 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald mr-2" />
              <span className="text-xs font-data tracking-wider text-ghost/70">ANALYSIS COMPLETE</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white font-sans">
              종합 리포트
            </h1>
            <p className="mt-2 text-sm text-ghost/50 italic font-drama">
              연습 피드백용 데이터입니다. 실제 합격 여부와는 무관합니다.
            </p>
          </div>
          <MagneticButton variant="ghost" className="text-sm px-6 border border-white/10 shadow-sm" onClick={handleRestart}>
            새로운 면접 시작
          </MagneticButton>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <SummaryCard
            summary={report.summary}
            avgAnswerTime={report.avgAnswerTime}
            avgWpm={report.avgWpm}
          />

          <section>
            <h2 className="mb-6 text-xl font-bold tracking-wide text-white">문항별 타임라인</h2>
            <TimeBarChart
              questions={interview.questions.map((q) => ({
                order: q.order,
                answerTime: interview.answers.get(q.order)?.duration ?? 0,
              }))}
            />
          </section>

          <section>
            <h2 className="mb-6 text-xl font-bold tracking-wide text-white">상세 AI 피드백</h2>
            <div className="space-y-6">
              {questionsWithAnswers.map((item) => (
                <QuestionAnalysisCard
                  key={item.order}
                  order={item.order}
                  questionText={item.questionText}
                  answerText={item.answer?.text ?? '(응답 기록 없음)'}
                  answerTime={item.answer?.duration ?? 0}
                  speedLabel={item.analysis?.speedLabel ?? 'normal'}
                  aiSuggestedAnswer={item.analysis?.aiSuggestedAnswer ?? '제안을 생성할 수 없습니다.'}
                  oneLineReview={item.analysis?.oneLineReview ?? '분석 결과 없음'}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 flex justify-center pt-10 border-t border-white/10">
          <MagneticButton onClick={handleRestart} className="px-12 py-5 text-lg shadow-[0_4px_14px_rgba(59,130,246,0.4)]">
            처음으로 돌아가기
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
