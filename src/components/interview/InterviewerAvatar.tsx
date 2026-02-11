interface InterviewerAvatarProps {
  isSpeaking?: boolean;
  className?: string;
}

export function InterviewerAvatar({
  isSpeaking = false,
  className = '',
}: InterviewerAvatarProps) {
  return (
    <div
      className={`
        relative w-32 h-32 rounded-full bg-slate-700
        flex items-center justify-center
        ${isSpeaking ? 'animate-pulse' : ''}
        ${className}
      `.trim()}
    >
      {/* Pulse ring when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/30 animate-ping" />
      )}

      {/* User icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    </div>
  );
}
