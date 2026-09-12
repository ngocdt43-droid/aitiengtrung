import React, { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, Volume2, X } from 'lucide-react';
import { AccessibilityTheme } from '../types';

interface TextSelectionToolbarProps {
  onExplainWord: (selectedWord: string) => void;
  onSpeakWord: (selectedWord: string) => void;
  theme: AccessibilityTheme;
}

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  onExplainWord,
  onSpeakWord,
  theme,
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      // Small timeout to allow browser to finalize selection
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setPosition(null);
          setSelectedText('');
          return;
        }

        const text = selection.toString().trim();
        // Check if text is between 1 and 15 characters (usually a Chinese word/phrase)
        if (text && text.length >= 1 && text.length <= 15) {
          try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top - 12,
              });
              setSelectedText(text);
              return;
            }
          } catch (e) {
            // ignore range error
          }
        }
        setPosition(null);
        setSelectedText('');
      }, 50);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  if (!position || !selectedText) return null;

  return (
    <div
      id="text-selection-floating-bar"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
      }}
      className={`p-1.5 rounded-2xl shadow-xl border flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 ${
        theme === 'high-contrast'
          ? 'bg-black text-yellow-300 border-yellow-400'
          : theme === 'night'
          ? 'bg-slate-900 text-sky-200 border-sky-500 shadow-sky-950/80'
          : theme === 'warm'
          ? 'bg-amber-50 text-amber-950 border-amber-400'
          : 'bg-white text-slate-900 border-slate-300 shadow-slate-400/40'
      }`}
      onMouseDown={(e) => {
        // Prevent clearing selection
        e.preventDefault();
      }}
    >
      <div className="px-2 py-0.5 text-xs font-bold font-chinese border-r border-current/20 max-w-[100px] truncate text-red-600 dark:text-sky-300">
        "{selectedText}"
      </div>

      {/* Button: Giải thích từ khó */}
      <button
        id="btn-selection-explain-word"
        onClick={() => {
          onExplainWord(selectedText);
          setPosition(null);
        }}
        className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all active:scale-95 ${
          theme === 'high-contrast'
            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
            : theme === 'night'
            ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
        title="AI giải thích nghĩa của từ vừa bôi đen cho học sinh THCS"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Giải thích từ khó</span>
      </button>

      {/* Button: Phát âm từ bôi đen */}
      <button
        id="btn-selection-speak-word"
        onClick={() => {
          onSpeakWord(selectedText);
        }}
        className="p-1.5 rounded-xl hover:bg-current/10 transition-colors"
        title="Nghe phát âm từ này"
      >
        <Volume2 className="w-4 h-4" />
      </button>

      {/* Close float */}
      <button
        id="btn-selection-close-float"
        onClick={() => {
          setPosition(null);
          setSelectedText('');
        }}
        className="p-1 rounded-lg opacity-60 hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
