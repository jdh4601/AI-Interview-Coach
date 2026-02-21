import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  border?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  intensity = 'medium',
  border = true,
  ...props
}) => {
  const getIntensityStyles = () => {
    switch (intensity) {
      case 'low':
        return 'bg-white/[0.02] backdrop-blur-sm';
      case 'medium':
        return 'bg-white/[0.05] backdrop-blur-md';
      case 'high':
        return 'bg-white/[0.08] backdrop-blur-xl';
      default:
        return 'bg-white/[0.05] backdrop-blur-md';
    }
  };

  const borderStyles = border ? 'border border-white/10' : '';

  return (
    <div
      className={`rounded-[2rem] shadow-2xl ${getIntensityStyles()} ${borderStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
