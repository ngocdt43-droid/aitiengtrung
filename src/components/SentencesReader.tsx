import React from 'react';
import { Volume2, PlayCircle, BookOpen, Check, Sparkles } from 'lucide-react';
import { AccessibilityTheme, SentenceItem, TextSizeLevel, HighlightTrackingMode } from '../types';
import { HighlightableChineseText } from './HighlightableChineseText';

interface SentencesReaderProps {
  sentences: SentenceItem[];
  activeSentenceIndex: number | null;
  activeCharIndex: number | null;
  highlightTrackingMode: HighlightTrackingMode;
  onSentenceClick: (index: number) => void;
  onWordExplainRequest?: (word: string, sentenceContext: string) => void;
  theme: AccessibilityTheme;
  textSize: TextSizeLevel;
}

export const SentencesReader: React.FC<SentencesReaderProps> = ({
  sentences,
  activeSentenceIndex,
  activeCharIndex,
  highlightTrackingMode,
  onSentenceClick,
  onWordExplainRequest,
  theme,
  textSize,
}) => {
  const textSizeClassMap: Record<TextSizeLevel, { hanzi: string; pinyin: string; vi: string }> = {
    normal: { hanzi: 'text-2xl sm:text-3xl', pinyin: 'text-sm sm:text-base', vi: 'text-base' },
    large: { hanzi: 'text-3xl sm:text-4xl', pinyin: 'text-base sm:text-lg', vi: 'text-lg' },
    'extra-large': { hanzi: 'text-4xl sm:text-5xl', pinyin: 'text-lg sm:text-xl', vi: 'text-xl' },
    huge: { hanzi: 'text-5xl sm:text-6xl', pinyin: 'text-xl sm:text-2xl', vi: 'text-2xl' },
  };

  const style = textSizeClassMap[textSize];

  return (
    <section
      id="sentences-reader-section"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        theme === 'high-contrast'
          ? 'bg-zinc-950 border-yellow-400 text-white'
          : theme === 'night'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : theme === 'warm'
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-current/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black'
                : theme === 'night'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-blue-600 text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
              <span>Luyện đọc câu & từ vựng</span>
              {highlightTrackingMode === 'word' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Đang bật: Đọc nổi bật từng từ
                </span>
              )}
            </h3>
            <p
              className={`text-xs sm:text-sm font-medium ${
                theme === 'high-contrast'
                  ? 'text-yellow-200'
                  : theme === 'night'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              Bấm vào câu để nghe. Có thể bôi đen chữ để xem AI giải thích nghĩa!
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
            theme === 'high-contrast'
              ? 'bg-yellow-400 text-black'
              : theme === 'night'
              ? 'bg-sky-950 text-sky-300 border border-sky-600'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {sentences.length} câu hoàn chỉnh
        </span>
      </div>

      <div className="space-y-4">
        {sentences.map((sentence, idx) => {
          const isActive = activeSentenceIndex === idx;

          return (
            <div
              key={sentence.id || idx}
              id={`sentence-card-${idx}`}
              onClick={() => onSentenceClick(idx)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                isActive
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black border-white shadow-lg ring-4 ring-yellow-400/50 font-black'
                    : theme === 'night'
                    ? 'bg-slate-800 border-sky-400 shadow-md ring-4 ring-sky-400/40 reading-highlight text-white'
                    : 'bg-amber-100 border-amber-400 shadow-md ring-4 ring-amber-300/40 reading-highlight'
                  : theme === 'high-contrast'
                  ? 'bg-zinc-900 border-zinc-700 hover:border-yellow-400 text-white'
                  : theme === 'night'
                  ? 'bg-slate-950/70 border-slate-800 hover:border-sky-500 text-slate-200 hover:bg-slate-900'
                  : theme === 'warm'
                  ? 'bg-amber-100/40 border-amber-200 hover:border-amber-400 text-amber-950'
                  : 'bg-slate-50/80 border-slate-200 hover:border-blue-400 text-slate-800 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-black text-yellow-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Câu {idx + 1}
                    </span>
                    {isActive && (
                      <span className="text-xs font-black uppercase text-red-600 dark:text-sky-300 flex items-center gap-1 animate-pulse">
                        <Volume2 className="w-3.5 h-3.5" />
                        {highlightTrackingMode === 'word'
                          ? 'Đang đọc theo từ...'
                          : 'Đang đọc phát âm...'}
                      </span>
                    )}
                  </div>

                  {/* Chinese Character with Word-level tracking */}
                  <HighlightableChineseText
                    chineseText={sentence.chinese}
                    isActiveSentence={isActive}
                    activeCharIndex={isActive ? activeCharIndex : null}
                    highlightTrackingMode={highlightTrackingMode}
                    className={`font-chinese font-bold leading-relaxed tracking-wide ${style.hanzi} ${
                      isActive && theme !== 'high-contrast' ? 'text-red-700 dark:text-sky-200' : ''
                    }`}
                    theme={theme}
                  />

                  {/* Pinyin */}
                  <div
                    className={`font-mono font-semibold tracking-wider ${style.pinyin} ${
                      isActive
                        ? theme === 'high-contrast'
                          ? 'text-black font-black'
                          : theme === 'night'
                          ? 'text-sky-300 font-bold'
                          : 'text-amber-800 font-bold'
                        : theme === 'high-contrast'
                        ? 'text-yellow-300'
                        : theme === 'night'
                        ? 'text-sky-400'
                        : 'text-red-700'
                    }`}
                  >
                    {sentence.pinyin}
                  </div>

                  {/* Vietnamese translation */}
                  <div
                    className={`pt-2 border-t border-dashed border-current/20 ${style.vi} font-medium ${
                      isActive
                        ? theme === 'high-contrast'
                          ? 'text-black font-extrabold'
                          : theme === 'night'
                          ? 'text-slate-100'
                          : 'text-slate-900 font-bold'
                        : theme === 'high-contrast'
                        ? 'text-yellow-100'
                        : theme === 'night'
                        ? 'text-slate-300'
                        : theme === 'warm'
                        ? 'text-amber-900'
                        : 'text-slate-600'
                    }`}
                  >
                    {sentence.vietnamese}
                  </div>
                </div>

                <button
                  id={`btn-play-sentence-${idx}`}
                  title="Nghe câu này"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSentenceClick(idx);
                  }}
                  className={`p-3 rounded-full shrink-0 transition-transform active:scale-90 ${
                    isActive
                      ? theme === 'high-contrast'
                        ? 'bg-black text-yellow-300'
                        : theme === 'night'
                        ? 'bg-sky-500 text-slate-950 font-black'
                        : 'bg-red-600 text-white'
                      : theme === 'high-contrast'
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : theme === 'night'
                      ? 'bg-slate-800 text-sky-400 hover:bg-slate-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
