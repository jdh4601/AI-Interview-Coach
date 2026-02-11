interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`max-w-2xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
