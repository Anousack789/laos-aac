import { useState } from "react";

export const useAudio = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const getAudioPath = (symbolId: string) => `/audio/${symbolId}.mp3`;

  const fallbackSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "lo-LA";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsSpeaking(false);
  };

  const speak = (text: string, symbolId?: string) => {
    stopAudio();

    if (!symbolId) {
      fallbackSpeak(text);
      return;
    }

    const audio = new Audio(getAudioPath(symbolId));
    setCurrentAudio(audio);

    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => { setIsSpeaking(false); setCurrentAudio(null); };
    audio.onerror = () => { setIsSpeaking(false); setCurrentAudio(null); fallbackSpeak(text); };
    audio.play().catch(() => { setIsSpeaking(false); setCurrentAudio(null); fallbackSpeak(text); });
  };

  const speakSequence = (items: { text: string; id: string }[]) => {
    if (items.length === 0) return;
    let index = 0;
    setIsSpeaking(true);

    const playNext = () => {
      if (index >= items.length) { setIsSpeaking(false); return; }
      const audio = new Audio(getAudioPath(items[index].id));
      setCurrentAudio(audio);
      audio.onended = () => { index++; playNext(); };
      audio.onerror = () => { index++; playNext(); };
      audio.play().catch(() => { index++; playNext(); });
    };

    playNext();
  };

  return { isSpeaking, speak, speakSequence, stopAudio };
};