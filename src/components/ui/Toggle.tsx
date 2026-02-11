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
    <div className={`bg-slate-800 rounded-lg p-1 inline-flex ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `.trim()}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
