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
        bg-slate-800 rounded-xl p-6
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isClickable ? 'hover:bg-slate-700/50 cursor-pointer' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
