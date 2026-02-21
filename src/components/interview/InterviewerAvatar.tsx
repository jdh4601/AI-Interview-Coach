interface InterviewerAvatarProps {
  isSpeaking?: boolean;
  className?: string;
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface InterviewerAvatarProps {
  isSpeaking?: boolean;
  className?: string;
}

export function InterviewerAvatar({
  isSpeaking = false,
  className = '',
}: InterviewerAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isSpeaking) {
        gsap.to('.visualizer-ring', {
          scale: 'random(1.1, 1.8)',
          opacity: 'random(0.2, 0.6)',
          duration: 'random(0.3, 0.7)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.1,
            from: 'center',
          },
        });
      } else {
        gsap.to('.visualizer-ring', {
          scale: 1,
          opacity: 0.1,
          duration: 1,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isSpeaking]);

  return (
    <div
      ref={containerRef}
      className={`relative w-48 h-48 flex items-center justify-center ${className}`}
    >
      {/* Visualizer rings */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="visualizer-ring absolute inset-0 rounded-full border border-electric-blue/30 bg-electric-blue/10"
          style={{ transformOrigin: 'center' }}
        />
      ))}

      {/* Center core */}
      <div className={`relative z-10 w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center transition-all duration-700 ${isSpeaking ? 'shadow-[0_0_40px_rgba(59,130,246,0.6)] border-electric-blue border-transparent' : 'shadow-none'}`}>
         <div className={`w-8 h-8 rounded-full transition-all duration-500 ${isSpeaking ? 'bg-electric-blue shadow-[0_0_20px_rgba(59,130,246,1)] scale-110' : 'bg-white/20'}`} />
      </div>
    </div>
  );
}
