interface CardProps {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  selected = false,
  disabled = false,
  onClick,
  className = '',
}: CardProps) {
  const isClickable = Boolean(onClick) && !disabled;

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`
        rounded-[2rem] p-6 transition-all duration-300 border backdrop-blur-md
        ${selected ? 'bg-white/10 border-electric-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]' : 'bg-white/5 border-white/10'}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}
        ${isClickable && !selected ? 'hover:bg-white/[0.08] hover:border-white/20 cursor-pointer' : isClickable ? 'cursor-pointer' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}
