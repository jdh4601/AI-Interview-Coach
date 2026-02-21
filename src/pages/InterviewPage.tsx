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
import { MagneticButton } from '../components/ui/MagneticButton';
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
      <div className="flex h-screen items-center justify-center bg-obsidian relative z-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-obsidian overflow-hidden relative z-10 text-ghost">
      
      {/* HUD Elements */}
      <div className="absolute top-8 w-full flex justify-between items-start px-8 pointer-events-none z-20">
        <QuestionCounter
          current={interview.currentIndex + 1}
          total={interview.questions.length}
        />
        {(phase === 'recording' || phase === 'processing') && (
          <SpeedSignal speedLabel={currentSpeedLabel} />
        )}
      </div>

      {(phase === 'recording' || phase === 'processing') && (
        <StructureGuide elapsedSeconds={timer.elapsedSeconds} />
      )}

      {/* Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mb-12">
        <div className="mb-12 relative flex justify-center w-full">
           <InterviewerAvatar isSpeaking={phase === 'playing_tts' || phase === 'recording'} />
        </div>

        <div className="h-16 flex items-center justify-center animate-in fade-in duration-500">
          {phase === 'playing_tts' && (
            <p className="text-lg font-drama italic text-electric-blue animate-pulse">질문을 듣는 중입니다...</p>
          )}

          {phase === 'waiting_start' && (
             <p className="text-lg font-drama italic text-ghost/70">준비가 되면 답변을 시작해주세요</p>
          )}

          {phase === 'processing' && (
            <div className="flex items-center gap-3 text-ghost/70">
              <LoadingSpinner size="sm" />
              <span className="text-lg font-medium tracking-wide">답변 내용을 분석 및 처리 중입니다...</span>
            </div>
          )}

          {phase === 'transitioning' && (
             <p className="text-lg font-drama italic text-emerald">다음 질문으로 이동합니다...</p>
          )}
        </div>
      </div>

      {/* Bottom Controls & Timer */}
      <div className="absolute bottom-0 w-full p-8 flex flex-col items-center z-20 gap-6">
        
        {audioRecorder.error && (
          <div className="rounded-xl bg-signal-red/10 border border-signal-red/20 p-4 text-sm text-signal-red text-center mb-4 backdrop-blur-md">
            <p className="font-bold mb-1">시스템 권한 오류</p>
            <p>{audioRecorder.error}</p>
          </div>
        )}

        {interview.error && (
          <div className="rounded-xl bg-signal-red/10 border border-signal-red/20 p-4 text-sm text-signal-red text-center mb-4 backdrop-blur-md">
            <p className="font-bold mb-1">시스템 분석 시스템 오류</p>
            <p>{interview.error}</p>
          </div>
        )}

        {phase === 'recording' && (
          <div className="w-full max-w-4xl mx-auto">
             <TimerBar remainingSeconds={timer.remainingSeconds} totalSeconds={ANSWER_TIME} />
          </div>
        )}

        <div className="flex justify-center items-center gap-6 mt-2 relative w-full h-16">
           <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
              {phase === 'waiting_start' && (
                <MagneticButton onClick={handleStartRecording} variant="accent" className="px-10 py-4 text-lg">
                  답변 시작하기
                </MagneticButton>
              )}
              
              {phase === 'recording' && (
                <MagneticButton onClick={handleStopRecording} variant="danger" className="px-10 py-4 text-lg">
                  답변 완료
                </MagneticButton>
              )}
           </div>

           <div className="absolute right-0 flex items-center justify-end">
              {(phase === 'waiting_start' || phase === 'recording') && (
                <MagneticButton onClick={handleSkipQuestion} variant="ghost" className="text-sm px-6">
                  {interview.isLastQuestion() ? '면접 조기 종료' : '질문 스킵하기'}
                </MagneticButton>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
