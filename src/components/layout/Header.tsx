interface HeaderProps {
  title?: string;
}

export function Header({ title = 'AI Interview Coach' }: HeaderProps) {
  return (
    <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-bold text-slate-50">{title}</h1>
      </div>
    </header>
  );
}
