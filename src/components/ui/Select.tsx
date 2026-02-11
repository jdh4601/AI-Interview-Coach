interface SelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  className = '',
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-slate-800 border border-slate-700 rounded-lg
        text-slate-50 px-4 py-2.5
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        appearance-none cursor-pointer
        ${className}
      `.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
