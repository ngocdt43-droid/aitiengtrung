export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export function getChineseVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  // Filter Chinese voices (zh-CN, zh-TW, zh-HK, zh, cmn)
  const chineseVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('zh') ||
      v.lang.toLowerCase().includes('chinese') ||
      v.lang.toLowerCase().startsWith('cmn')
  );

  return chineseVoices;
}

export function speakChineseText(
  text: string,
  rate: number = 1.0,
  voice?: SpeechSynthesisVoice | null,
  onBoundary?: (charIndex: number) => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis API is not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || !text.trim()) return null;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = Math.max(0.4, Math.min(rate, 2.0));
  utterance.pitch = 1.0;

  if (voice) {
    utterance.voice = voice;
  } else {
    // Pick the best available Chinese voice
    const voices = getChineseVoices();
    if (voices.length > 0) {
      // Prioritize zh-CN
      const cnVoice = voices.find((v) => v.lang.toLowerCase() === 'zh-cn') || voices[0];
      utterance.voice = cnVoice;
    }
  }

  if (onBoundary) {
    utterance.onboundary = (event) => {
      onBoundary(event.charIndex);
    };
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    if (onError) onError(event);
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}
