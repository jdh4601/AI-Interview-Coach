import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { useInterviewStore } from '../stores/useInterviewStore';
import api from '../services/api';
import { companies } from '../data/companies';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PageContainer } from '../components/layout/PageContainer';
import { StepIndicator } from '../components/layout/StepIndicator';
import { useState } from 'react';

export default function SessionConfigPage() {
  const navigate = useNavigate();
  const session = useSessionStore();
  const interviewStore = useInterviewStore();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionOptions = Array.from({ length: 6 }, (_, i) => ({
    value: String(i + 5),
    label: `${i + 5}개`,
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
    <PageContainer>
      <StepIndicator currentStep={3} />

      <h1 className="mb-8 text-2xl font-bold">면접 설정</h1>

      <div className="space-y-8">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            면접 질문 수
          </label>
          <Select
            value={session.questionCount}
            onChange={(v) => session.setQuestionCount(Number(v))}
            options={questionOptions}
          />
          <p className="mt-1 text-xs text-slate-500">첫 질문은 항상 자기소개입니다</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            면접 스타일
          </label>
          <Toggle
            options={[
              { value: 'friendly', label: '친절' },
              { value: 'pressure', label: '압박' },
            ]}
            value={session.interviewStyle}
            onChange={(v) => session.setInterviewStyle(v as 'friendly' | 'pressure')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            면접관 목소리
          </label>
          <Toggle
            options={[
              { value: 'male', label: '남성' },
              { value: 'female', label: '여성' },
            ]}
            value={session.voiceGender}
            onChange={(v) => session.setVoiceGender(v as 'male' | 'female')}
          />
        </div>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400">{error}</p>
      )}

      <div className="mt-12 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/setup/resume')}>
          이전
        </Button>
        <Button onClick={handleStart} disabled={isStarting}>
          {isStarting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              면접 준비 중...
            </span>
          ) : (
            '면접 시작'
          )}
        </Button>
      </div>
    </PageContainer>
  );
}
