import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  magneticStrength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  magneticStrength = 0.3,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-white text-obsidian font-semibold hover:bg-ghost shadow-lg shadow-white/10';
      case 'accent':
        return 'bg-electric-blue text-white font-semibold hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      case 'secondary':
        return 'bg-white/10 text-ghost font-medium hover:bg-white/20 border border-white/10';
      case 'danger':
        return 'bg-signal-red text-white font-semibold hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      case 'ghost':
        return 'bg-transparent text-ghost font-medium hover:bg-white/5';
      default:
        return 'bg-white text-obsidian';
    }
  };

  const { contextSafe } = useGSAP({ scope: buttonRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    gsap.to(buttonRef.current, {
      x: x * magneticStrength,
      y: y * magneticStrength,
      duration: 1,
      ease: 'power3.out',
    });

    if (onMouseMove) onMouseMove(e);
  });

  const handleMouseEnter = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: 1.03,
      duration: 0.3,
      ease: 'power3.out', // cubic-bezier(0.25, 0.46, 0.45, 0.94) approximation
    });

    if (onMouseEnter) onMouseEnter(e);
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });

    if (onMouseLeave) onMouseLeave(e);
  });

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative px-6 py-3 rounded-full transition-colors duration-200 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
