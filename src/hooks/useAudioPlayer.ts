import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioPlayerReturn {
  isPlaying: boolean;
  play: (blob: Blob) => Promise<void>;
  stop: () => void;
}

export function useAudioPlayer(): AudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setIsPlaying(false);
  }, [cleanup]);

  const play = useCallback(
    (blob: Blob): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        cleanup();

        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          cleanup();
          resolve();
        });

        audio.addEventListener('error', () => {
          setIsPlaying(false);
          cleanup();
          reject(new Error('Audio playback failed'));
        });

        setIsPlaying(true);
        audio.play().catch((err: unknown) => {
          setIsPlaying(false);
          cleanup();
          reject(err);
        });
      });
    },
    [cleanup],
  );

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return { isPlaying, play, stop };
}
