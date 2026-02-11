import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../stores/useInterviewStore';
import { useTimer } from '../hooks/useTimer';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { calculateWpm, getSpeedLabel } from '../lib/wpmCalculator';
import api from '../services/api';
import { InterviewerAvatar } from '../components/interview/InterviewerAvatar';
import { TimerBar } from '../components/interview/TimerBar';
import { StructureGuide } from '../components/interview/StructureGuide';
import { SpeedSignal } from '../components/interview/SpeedSignal';
import { QuestionCounter } from '../components/interview/QuestionCounter';
import { RecordingIndicator } from '../components/interview/RecordingIndicator';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { SpeedLabel } from '../types/question';

const ANSWER_TIME = 120;

type InterviewPhase = 'playing_tts' | 'waiting_start' | 'recording' | 'processing' | 'transitioning';

export default function InterviewPage() {
  const navigate = useNavigate();
  const interview = useInterviewStore();
  const timer = useTimer(ANSWER_TIME);
  const audioRecorder = useAudioRecorder();

  const [phase, setPhase] = useState<InterviewPhase>('playing_tts');
  const [currentSpeedLabel, setCurrentSpeedLabel] = useState<SpeedLabel | null>(null);
  const recordingStartTime = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const phaseRef = useRef<InterviewPhase>('playing_tts');

  // Keep phaseRef in sync for use in async callbacks
  phaseRef.current = phase;

  const currentQuestion = interview.questions[interview.currentIndex];
  const currentTtsBlob = currentQuestion
    ? interview.ttsBlobs.get(currentQuestion.order)
    : undefined;

  // Play TTS for the current question
  useEffect(() => {
    if (!currentTtsBlob) return;

    setPhase('playing_tts');
    setCurrentSpeedLabel(null);
    timer.reset();

    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(currentTtsBlob);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      setPhase('waiting_start');
    });

    audio.addEventListener('error', () => {
      setPhase('waiting_start');
    });

    audio.play().catch(() => {
      setPhase('waiting_start');
    });

    return () => {
      audio.pause();
      audio.removeAttribute('src');
    };
    // Only re-run when the question index changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.currentIndex, currentTtsBlob]);

  // Auto-stop recording when timer expires
  useEffect(() => {
    if (timer.isExpired && phaseRef.current === 'recording') {
      handleStopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isExpired]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  async function handleStartRecording() {
    try {
      await audioRecorder.startRecording();
      recordingStartTime.current = Date.now();
      timer.start();
      setPhase('recording');
    } catch {
      // mic permission error handled in useAudioRecorder
    }
  }

  async function handleStopRecording() {
    if (phaseRef.current !== 'recording') return;
    setPhase('processing');
    timer.stop();

    const duration = Math.round((Date.now() - recordingStartTime.current) / 1000);

    try {
      const audioBlob = await audioRecorder.stopRecording();
      const transcribedText = await api.transcribeAudio(audioBlob);

      const wpm = calculateWpm(transcribedText, duration);
      const speedLabel = getSpeedLabel(wpm);
      setCurrentSpeedLabel(speedLabel);

      interview.setAnswer(currentQuestion.order, transcribedText, duration, wpm, speedLabel);

      if (interview.isLastQuestion()) {
        navigate('/interview/complete');
      } else {
        setPhase('transitioning');
        await new Promise((r) => setTimeout(r, 1500));
        interview.advanceQuestion();
      }
    } catch (err) {
      interview.setError(err instanceof Error ? err.message : 'STT 처리 중 오류가 발생했습니다.');
      setPhase('waiting_start');
    }
  }

  function handleSkipQuestion() {
    if (phase === 'recording') {
      handleStopRecording();
    } else if (phase === 'waiting_start') {
      interview.setAnswer(currentQuestion.order, '', 0, 0, 'slow');
      if (interview.isLastQuestion()) {
        navigate('/interview/complete');
      } else {
        interview.advanceQuestion();
      }
    }
  }

  if (!currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        <QuestionCounter
          current={interview.currentIndex + 1}
          total={interview.questions.length}
        />

        <div className="flex flex-col items-center gap-6">
          <InterviewerAvatar isSpeaking={phase === 'playing_tts'} />

          {phase === 'playing_tts' && (
            <p className="text-sm text-slate-400 animate-pulse">질문을 듣고 있습니다...</p>
          )}

          {phase === 'waiting_start' && (
            <p className="text-sm text-blue-400">답변을 시작해주세요</p>
          )}

          {phase === 'processing' && (
            <div className="flex items-center gap-2 text-slate-400">
              <LoadingSpinner size="sm" />
              <span className="text-sm">답변 분석 중...</span>
            </div>
          )}

          {phase === 'transitioning' && (
            <p className="text-sm text-emerald-400">다음 질문으로 이동합니다...</p>
          )}
        </div>

        {(phase === 'recording' || phase === 'processing') && (
          <>
            <TimerBar remainingSeconds={timer.remainingSeconds} totalSeconds={ANSWER_TIME} />
            <StructureGuide elapsedSeconds={timer.elapsedSeconds} />
            <SpeedSignal speedLabel={currentSpeedLabel} />
          </>
        )}

        <RecordingIndicator isRecording={phase === 'recording'} />

        {audioRecorder.error && (
          <div className="rounded-lg bg-red-900/30 border border-red-800 p-4 text-sm text-red-300">
            <p className="font-medium mb-1">마이크 접근 오류</p>
            <p>{audioRecorder.error}</p>
          </div>
        )}

        {interview.error && (
          <p className="text-sm text-red-400 text-center">{interview.error}</p>
        )}

        <div className="flex justify-center gap-4">
          {phase === 'waiting_start' && (
            <Button onClick={handleStartRecording} size="lg">
              답변 시작
            </Button>
          )}
          {phase === 'recording' && (
            <Button onClick={handleStopRecording} variant="secondary" size="lg">
              답변 완료
            </Button>
          )}
          {(phase === 'waiting_start' || phase === 'recording') && (
            <Button onClick={handleSkipQuestion} variant="ghost" size="sm">
              {interview.isLastQuestion() ? '면접 종료' : '다음 질문'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
