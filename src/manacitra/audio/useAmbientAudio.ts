import { useEffect, useRef } from 'react';
import { useManacitraStore } from '../store';

let sharedAudio: HTMLAudioElement | null = null;

export default function useAmbientAudio() {
  const muted = useManacitraStore(s => s.audioMuted);
  const loaded = useRef(false);

  useEffect(() => {
    if (sharedAudio) return;
    const audio = new Audio('/manacitra/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    sharedAudio = audio;
  }, []);

  useEffect(() => {
    if (!sharedAudio) return;
    if (!muted && !loaded.current) {
      sharedAudio.play().catch(() => {});
      loaded.current = true;
    } else if (muted) {
      sharedAudio.pause();
    }
  }, [muted]);
}
