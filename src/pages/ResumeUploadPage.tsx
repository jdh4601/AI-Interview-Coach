import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { usePdfExtractor } from '../hooks/usePdfExtractor';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/ui/FileUpload';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PageContainer } from '../components/layout/PageContainer';
import { StepIndicator } from '../components/layout/StepIndicator';

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
    <PageContainer>
      <StepIndicator currentStep={2} />

      <h1 className="mb-2 text-2xl font-bold">이력서 / 자소서 업로드</h1>
      <p className="mb-8 text-sm text-slate-400">
        PDF 파일을 업로드해주세요. 텍스트를 추출하여 맞춤 질문을 생성합니다.
      </p>

      <FileUpload
        onFileSelect={handleFileSelect}
        accept=".pdf"
        label="PDF 파일을 드래그하거나 클릭하여 업로드"
        fileName={fileName}
        className="mb-6"
      />

      {isExtracting && (
        <div className="mb-6 flex items-center gap-3 text-slate-400">
          <LoadingSpinner size="sm" />
          <span className="text-sm">텍스트 추출 중...</span>
        </div>
      )}

      {extractError && (
        <p className="mb-6 text-sm text-red-400">{extractError}</p>
      )}

      {previewText && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-slate-300">추출된 텍스트 미리보기</h3>
          <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-800 p-4 text-sm text-slate-400 leading-relaxed border border-slate-700">
            {previewText.slice(0, 1000)}
            {previewText.length > 1000 && '...'}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4 mb-8">
        <p className="text-xs text-slate-500 flex items-center gap-2">
          <span>🔒</span>
          업로드된 내용은 저장되지 않으며, 세션 종료 시 자동으로 삭제됩니다.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/setup/company')}>
          이전
        </Button>
        <Button onClick={handleNext} disabled={!previewText}>
          다음
        </Button>
      </div>
    </PageContainer>
  );
}
