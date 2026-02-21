import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { GlassCard } from '../components/ui/GlassCard';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo('.stagger-item', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden" ref={containerRef}>
      <div className="noise-overlay" />
      
      {/* Background radial gradient to give some depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-6 py-20 text-center">
        
        <div className="stagger-item mb-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-electric-blue mr-2 animate-pulse-recording" />
            <span className="text-xs font-data tracking-wider text-ghost/70">SYSTEM V1.0.4 - ONLINE</span>
          </div>
        </div>

        <h1 className="stagger-item mb-6 text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          AI Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-emerald">Coach</span>
        </h1>

        <p className="stagger-item mb-20 text-xl font-drama italic text-ghost/80 max-w-2xl leading-relaxed text-center">
          "답을 알려주는 AI가 아니라, <br/><span className="text-ghost not-italic font-bold font-sans">말하는 연습</span>을 돕습니다."
        </p>

        <div className="stagger-item w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-left">
          <FeatureCard
            icon="🎙️"
            title="Blind Audio"
            description="텍스트 없이 음성만 제공, 실전과 동일한 환경과 압박감 재현"
          />
          <FeatureCard
            icon="⏱️"
            title="Time & Structure"
            description="120초 제한 시간과 3단계 구조 가이드를 통한 말하기 리듬 훈련"
          />
          <FeatureCard
            icon="📊"
            title="Coaching Report"
            description="합격 예측이 아닌, 강점과 개선점 및 속도 분석에 집중한 피드백"
          />
        </div>

        <div className="stagger-item">
          <MagneticButton
            onClick={() => navigate('/setup/company')}
            className="text-lg px-8 py-4"
          >
            면접 연습 시작
          </MagneticButton>
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <GlassCard intensity="low" className="p-8 hover:bg-white/[0.04] transition-colors duration-300">
      <div className="mb-6 text-3xl opacity-80">{icon}</div>
      <h3 className="mb-3 text-lg font-semibold text-ghost tracking-wide">{title}</h3>
      <p className="text-sm text-ghost/60 leading-relaxed">{description}</p>
    </GlassCard>
  );
}

