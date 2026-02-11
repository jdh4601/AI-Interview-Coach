import { useCallback, useState } from 'react';

import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = PdfWorker;

interface PdfExtractorReturn {
  extractText: (file: File) => Promise<string>;
  isExtracting: boolean;
  error: string | null;
}

export function usePdfExtractor(): PdfExtractorReturn {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (file: File): Promise<string> => {
    setError(null);
    setIsExtracting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const pageTexts: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter((item) => 'str' in item)
          .map((item) => (item as { str: string }).str)
          .join(' ');
        pageTexts.push(pageText);
      }

      return pageTexts.join('\n');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? `PDF 텍스트 추출 실패: ${err.message}`
          : 'PDF 텍스트 추출에 실패했습니다.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return { extractText, isExtracting, error };
}
