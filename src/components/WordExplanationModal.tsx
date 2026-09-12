import React from 'react';
import { Sparkles, Volume2, X, BookOpen, Lightbulb, Check } from 'lucide-react';
import { AccessibilityTheme, WordExplanation } from '../types';

interface WordExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  explanation: WordExplanation | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSpeak: (text: string) => void;
  theme: AccessibilityTheme;
}

export const WordExplanationModal: React.FC<WordExplanationModalProps> = ({
  isOpen,
  onClose,
  word,
  explanation,
  isLoading,
  errorMessage,
  onSpeak,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="word-explanation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl border-2 shadow-2xl p-6 relative transition-all ${
          theme === 'high-contrast'
            ? 'bg-black text-yellow-300 border-yellow-400'
            : theme === 'night'
            ? 'bg-slate-900 text-slate-100 border-sky-400'
            : theme === 'warm'
            ? 'bg-amber-50 text-amber-950 border-amber-300'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/20 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : theme === 'night'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-amber-500 text-white'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>Giải thích từ khó cho học sinh</span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              </h3>
              <p className="text-xs opacity-75 font-medium">
                Dùng từ ngữ đơn giản, dễ nhớ, phù hợp lứa tuổi THCS
              </p>
            </div>
          </div>

          <button
            id="btn-close-word-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-current/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-current/20 border-t-current rounded-full animate-spin" />
            <p className="text-sm font-bold opacity-80">
              AI đang tìm cách giải thích dễ hiểu nhất cho từ "{word}"...
            </p>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="p-4 rounded-2xl bg-red-100 text-red-800 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {explanation && !isLoading && (
          <div className="space-y-4">
            {/* Word Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                theme === 'high-contrast'
                  ? 'bg-zinc-950 border-yellow-500'
                  : theme === 'night'
                  ? 'bg-slate-800 border-sky-500/40'
                  : theme === 'warm'
                  ? 'bg-amber-100/70 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-chinese font-black text-3xl sm:text-4xl text-red-600 dark:text-red-400">
                    {explanation.word}
                  </span>
                  <span className="font-mono text-base font-bold opacity-90 text-amber-600 dark:text-sky-300">
                    [{explanation.pinyin}]
                  </span>
                </div>
                <div className="text-base font-extrabold mt-0.5">
                  Nghĩa: {explanation.meaning}
                </div>
              </div>

              <button
                id="btn-speak-explained-word"
                onClick={() => onSpeak(explanation.word)}
                className={`p-3 rounded-full transition-transform active:scale-90 ${
                  theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Simple Middle-school explanation */}
            <div
              className={`p-4 rounded-2xl border ${
                theme === 'high-contrast'
                  ? 'bg-zinc-900 border-yellow-400'
                  : theme === 'night'
                  ? 'bg-sky-950/50 border-sky-400/40 text-sky-100'
                  : 'bg-amber-50/90 border-amber-200 text-amber-950'
              }`}
            >
              <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-sky-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Giải nghĩa siêu dễ hiểu:</span>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {explanation.simpleExplanation}
              </p>
            </div>

            {/* Micro example sentence */}
            {explanation.example && (
              <div
                className={`p-3.5 rounded-2xl border ${
                  theme === 'high-contrast'
                    ? 'bg-black border-zinc-700'
                    : theme === 'night'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-black uppercase opacity-75">
                    Câu ví dụ cực ngắn:
                  </span>
                  <button
                    id="btn-speak-explained-example"
                    onClick={() => onSpeak(explanation.example)}
                    className="p-1 rounded-md hover:bg-current/10 transition-colors"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="font-chinese font-bold text-base">
                  {explanation.example}
                </div>
                <div className="text-xs opacity-80 mt-0.5">
                  {explanation.exampleMeaning}
                </div>
              </div>
            )}

            <button
              id="btn-confirm-word-understood"
              onClick={onClose}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : theme === 'night'
                  ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                  : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Đã hiểu từ này rồi!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
