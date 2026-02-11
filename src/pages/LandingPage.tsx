import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout/PageContainer';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <PageContainer className="text-center">
        <div className="mb-6 text-6xl">🎙️</div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-50">
          AI Interview Coach
        </h1>

        <p className="mb-2 text-lg text-slate-300">
          실전 면접 감각을 훈련하는 AI 기반 면접 연습 서비스
        </p>

        <p className="mb-12 text-base text-slate-400">
          답을 알려주는 AI가 아니라,{' '}
          <span className="text-blue-400 font-medium">말하는 연습을 돕습니다</span>
        </p>

        <div className="mb-16 grid grid-cols-3 gap-6 text-left">
          <FeatureCard
            icon="🔊"
            title="Blind Audio"
            description="텍스트 없이 음성만 제공, 실전 면접 상황 재현"
          />
          <FeatureCard
            icon="⏱️"
            title="Time & Structure"
            description="120초 답변 + 구조 가이드로 리듬 감각 훈련"
          />
          <FeatureCard
            icon="📊"
            title="Coaching Report"
            description="점수 없이, 훈련 피드백에만 집중하는 리포트"
          />
        </div>

        <Button
          size="lg"
          onClick={() => navigate('/setup/company')}
          className="min-w-[200px]"
        >
          면접 연습 시작
        </Button>
      </PageContainer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-5">
      <div className="mb-3 text-2xl">{icon}</div>
      <h3 className="mb-1 text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
