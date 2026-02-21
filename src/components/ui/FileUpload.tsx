import { useCallback, useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  fileName?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept,
  label = '파일을 드래그하거나 클릭하여 업로드',
  fileName,
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0]);
    },
    [handleFile],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-[2rem] p-12
        flex flex-col items-center justify-center gap-4
        cursor-pointer transition-all duration-300 text-center backdrop-blur-sm
        ${isDragOver
          ? 'border-electric-blue bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]'
          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
        }
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Upload icon */}
      <div className={`p-4 rounded-2xl bg-white/5 border transition-colors ${isDragOver ? 'border-electric-blue text-electric-blue' : 'border-white/10 text-ghost/60'}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <div>
        {fileName ? (
          <p className="text-sm text-electric-blue font-medium tracking-wide">{fileName}</p>
        ) : (
          <p className="text-sm text-ghost/60 font-medium tracking-wide">{label}</p>
        )}
      </div>
    </div>
  );
}
