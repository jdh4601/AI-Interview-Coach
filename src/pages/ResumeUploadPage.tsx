import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { usePdfExtractor } from '../hooks/usePdfExtractor';
import { MagneticButton } from '../components/ui/MagneticButton';
import { FileUpload } from '../components/ui/FileUpload';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const { resumeText, setResumeText } = useSessionStore();
  const { extractText, isExtracting, error: extractError } = usePdfExtractor();
  const [fileName, setFileName] = useState('');
  const [previewText, setPreviewText] = useState(resumeText);

  async function handleFileSelect(file: File) {
    setFileName(file.name);
    const text = await extractText(file);
    setPreviewText(text);
    setResumeText(text);
  }

  function handleNext() {
    if (!previewText) return;
    navigate('/setup/config');
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col relative z-10">
      
      <div className="mb-12">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
          <span className="text-xs font-data tracking-wider text-ghost/70">STEP 02 / 03</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
          이력서 업로드
        </h1>
        <p className="mt-4 text-lg text-ghost/60 font-drama italic">
          "지원자의 과거 경험과 성과에서 고유의 면접 시나리오를 도출합니다."
        </p>
      </div>

      <div className="flex-1">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".pdf"
          label="PDF 형식의 이력서 또는 자기소개서를 드롭다운하여 업로드"
          fileName={fileName}
          className="mb-8"
        />

        {isExtracting && (
          <div className="mb-8 flex justify-center items-center gap-4 text-ghost/60 bg-white/5 border border-white/10 rounded-2xl p-6">
            <LoadingSpinner size="sm" />
            <span className="text-sm font-medium tracking-wide">문서 컨텍스트 분석 및 텍스트 추출 중...</span>
          </div>
        )}

        {extractError && (
          <p className="mb-8 text-sm text-signal-red bg-signal-red/10 border border-signal-red/20 p-4 rounded-xl">{extractError}</p>
        )}

        {previewText && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="mb-4 text-sm font-bold tracking-wide text-ghost">추출된 데이터 컨텍스트</h3>
            <div className="max-h-60 overflow-y-auto rounded-3xl bg-white/5 p-6 text-sm text-ghost/60 leading-relaxed border border-white/10 font-data">
              {previewText.slice(0, 1000)}
              {previewText.length > 1000 && '... [이하 생략]'}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-12">
          <p className="text-sm text-ghost/50 flex items-center gap-3">
            <span className="text-emerald text-lg">🔒</span>
            모든 데이터는 브라우저 메모리 내에만 스토어되며 세션 종료 시 영구 삭제됩니다.
          </p>
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-8 border-t border-white/10">
        <MagneticButton variant="ghost" onClick={() => navigate('/setup/company')} className="text-ghost/60 hover:text-white">
          뒤로 가기
        </MagneticButton>
        <MagneticButton onClick={handleNext} disabled={!previewText} className={`${!previewText ? 'opacity-50 cursor-not-allowed' : ''}`}>
          다음 단계로
        </MagneticButton>
      </div>
    </div>
  );
}
