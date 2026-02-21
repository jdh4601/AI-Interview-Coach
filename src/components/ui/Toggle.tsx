interface ToggleProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({
  options,
  value,
  onChange,
  className = '',
}: ToggleProps) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-full p-1 inline-flex backdrop-blur-md ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300
              ${isActive
                ? 'bg-electric-blue text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                : 'text-ghost/60 hover:text-white hover:bg-white/5'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
