import React from 'react';
import { Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { AccessibilityTheme } from '../types';

interface HighlightableChineseTextProps {
  chineseText: string;
  isActiveSentence: boolean;
  activeCharIndex: number | null; // character index boundary from SpeechSynthesis
  highlightTrackingMode: 'sentence' | 'word';
  onWordExplainRequest?: (word: string, sentenceContext: string) => void;
  onWordSpeak?: (word: string) => void;
  className?: string;
  theme: AccessibilityTheme;
}

export const HighlightableChineseText: React.FC<HighlightableChineseTextProps> = ({
  chineseText,
  isActiveSentence,
  activeCharIndex,
  highlightTrackingMode,
  onWordExplainRequest,
  onWordSpeak,
  className = '',
  theme,
}) => {
  // Chinese punctuation marks
  const isPunctuation = (char: string) => {
    return /[，。！？、；：“”‘’（）《》\s\.,!\?]/.test(char);
  };

  const chars: string[] = Array.from(chineseText);

  // Group characters into 1-2 character semantic units for easier reading if needed,
  // or render each character with an active indicator when activeCharIndex matches.
  return (
    <div className={`chinese-char select-text ${className}`}>
      {chars.map((char: string, cIdx: number) => {
        const isWordHighlighted =
          isActiveSentence &&
          highlightTrackingMode === 'word' &&
          activeCharIndex !== null &&
          (cIdx === activeCharIndex ||
            (!isPunctuation(chars[activeCharIndex] || '') &&
              cIdx === activeCharIndex + 1 &&
              !isPunctuation(char)));

        return (
          <span
            key={cIdx}
            className={`transition-all inline-block ${
              isWordHighlighted
                ? 'word-active-highlight'
                : isPunctuation(char)
                ? 'opacity-60 px-0.5'
                : 'hover:text-red-600 cursor-text'
            }`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
