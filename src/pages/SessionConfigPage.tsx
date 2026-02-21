import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { useInterviewStore } from '../stores/useInterviewStore';
import api from '../services/api';
import { companies } from '../data/companies';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function SessionConfigPage() {
  const navigate = useNavigate();
  const session = useSessionStore();
  const interviewStore = useInterviewStore();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session.companyId || !session.jobId) {
      navigate('/setup/company', { replace: true });
    }
  }, [session.companyId, session.jobId, navigate]);

  const questionOptions = Array.from({ length: 6 }, (_, i) => ({
    value: String(i + 5),
    label: `${i + 5} questions`,
  }));

  async function handleStart() {
    setIsStarting(true);
    setError(null);

    try {
      const company = companies.find((c) => c.company_id === session.companyId);
      if (!company) throw new Error('기업 정보를 찾을 수 없습니다.');

      const questions = await api.generateQuestions({
        company,
        jobId: session.jobId,
        resumeText: session.resumeText,
        questionCount: session.questionCount,
        interviewStyle: session.interviewStyle,
      });

      interviewStore.setQuestions(questions);

      const ttsBlobs = new Map<number, Blob>();
      const ttsPromises = questions.map(async (q) => {
        const blob = await api.generateTTS(q.questionText, session.voiceGender, session.interviewStyle);
        ttsBlobs.set(q.order, blob);
      });
      await Promise.all(ttsPromises);
      interviewStore.setAllTtsBlobs(ttsBlobs);

      session.setStatus('in_progress');
      navigate('/interview');
    } catch (err) {
      setError(err instanceof Error ? err.message : '면접 준비 중 오류가 발생했습니다.');
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col relative z-10">
      
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
          <span className="text-xs font-data tracking-wider text-ghost/70">STEP 03 / 03</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
          면접 세팅
        </h1>
        <p className="mt-4 text-lg text-ghost/60 font-drama italic">
          "학습 목적에 맞춰 난이도와 인터뷰 환경을 정밀하게 조정합니다."
        </p>
      </div>

      <div className="space-y-10 flex-1">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <label className="block text-lg font-semibold text-white tracking-wide mb-1">
                면접 질문 수
              </label>
              <p className="text-sm text-ghost/60">첫 질문은 항상 자기소개로 배정됩니다.</p>
            </div>
            <div className="w-full md:w-auto">
              <Select
                value={session.questionCount}
                onChange={(v) => session.setQuestionCount(Number(v))}
                options={questionOptions}
                className="w-full md:w-48 font-data"
              />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <label className="block text-lg font-semibold text-white tracking-wide mb-1">
                면접 압박 텐션
              </label>
              <p className="text-sm text-ghost/60">프롬프트 톤과 TTS 보이스의 친절도가 달라집니다.</p>
            </div>
            <Toggle
              options={[
                { value: 'friendly', label: '친절 모드' },
                { value: 'pressure', label: '압박 모드' },
              ]}
              value={session.interviewStyle}
              onChange={(v) => session.setInterviewStyle(v as 'friendly' | 'pressure')}
            />
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <label className="block text-lg font-semibold text-white tracking-wide mb-1">
                면접관 목소리
              </label>
              <p className="text-sm text-ghost/60">면접관의 성별을 선택합니다.</p>
            </div>
            <Toggle
              options={[
                { value: 'male', label: '남성 (Male)' },
                { value: 'female', label: '여성 (Female)' },
              ]}
              value={session.voiceGender}
              onChange={(v) => session.setVoiceGender(v as 'male' | 'female')}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 mb-4 p-4 rounded-2xl bg-signal-red/10 border border-signal-red/20">
          <p className="text-sm text-signal-red text-center">{error}</p>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
        <MagneticButton variant="ghost" onClick={() => navigate('/setup/resume')} className="text-ghost/60 hover:text-white">
          뒤로 가기
        </MagneticButton>
        <MagneticButton onClick={handleStart} disabled={isStarting}>
          {isStarting ? (
            <span className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <span className="tracking-wide">AI 설정 반영 중...</span>
            </span>
          ) : (
            <span className="tracking-wide font-semibold text-lg">면접 시작하기</span>
          )}
        </MagneticButton>
      </div>
    </div>
  );
}
