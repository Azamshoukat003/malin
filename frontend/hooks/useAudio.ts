'use client';

import { useEffect, useRef, useState } from 'react';

export const useAudio = (src?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const toggle = async (): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.load();
    await audio.play();
    setPlaying(true);
  };

  const seek = (next: number): void => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const setVol = (next: number): void => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = next;
    setVolume(next);
  };

  return { audioRef, playing, currentTime, duration, volume, toggle, seek, setVol };
};
