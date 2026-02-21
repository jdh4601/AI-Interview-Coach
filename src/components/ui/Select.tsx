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
        bg-white/5 border border-white/10 rounded-xl
        text-white px-5 py-3 
        focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-transparent
        appearance-none cursor-pointer backdrop-blur-md outline-none
        transition-colors hover:bg-white/10
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-obsidian text-ghost">
          {option.label}
        </option>
      ))}
    </select>
  );
}
