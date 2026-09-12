import React from 'react';
import { FileText, Volume2, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { AccessibilityTheme, TextSizeLevel } from '../types';

interface SummarySectionProps {
  summary: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
    keyPoints: string[];
  };
  onSpeak: (text: string) => void;
  theme: AccessibilityTheme;
  textSize: TextSizeLevel;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  onSpeak,
  theme,
  textSize,
}) => {
  const textSizeClassMap: Record<TextSizeLevel, { hanzi: string; vi: string }> = {
    normal: { hanzi: 'text-xl sm:text-2xl', vi: 'text-base' },
    large: { hanzi: 'text-2xl sm:text-3xl', vi: 'text-lg' },
    'extra-large': { hanzi: 'text-3xl sm:text-4xl', vi: 'text-xl' },
    huge: { hanzi: 'text-4xl sm:text-5xl', vi: 'text-2xl' },
  };

  const style = textSizeClassMap[textSize];

  return (
    <section
      id="summary-content-section"
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
      {/* Header with Title & Listen Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-current/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black'
                : 'bg-amber-500 text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Bản tóm tắt ý chính bài học (3-5 câu)
            </h3>
            <p
              className={`text-xs sm:text-sm font-medium ${
                theme === 'high-contrast' ? 'text-yellow-200' : 'text-slate-500'
              }`}
            >
              Giúp học sinh nắm nhanh nội dung cốt lõi và luyện đọc đoạn ngắn
            </p>
          </div>
        </div>

        <button
          id="btn-speak-summary"
          onClick={() => onSpeak(summary.chinese)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xs transition-transform active:scale-95 self-start sm:self-auto ${
            theme === 'high-contrast'
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Nghe bản tóm tắt</span>
        </button>
      </div>

      {/* Mandatory Disclaimer Required by Prompt */}
      <div
        id="ai-summary-disclaimer"
        className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 mb-5 ${
          theme === 'high-contrast'
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}
      >
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-bold leading-relaxed">
          Đây là bản tóm tắt do AI tạo, có thể chưa đầy đủ — hãy đọc bản gốc nếu cần hiểu chi tiết.
        </p>
      </div>

      {/* Summary Content Cards */}
      <div className="space-y-4">
        {/* Chinese Text */}
        <div
          className={`p-5 rounded-2xl border ${
            theme === 'high-contrast'
              ? 'bg-black border-yellow-400/60 text-yellow-300'
              : theme === 'warm'
              ? 'bg-amber-100/50 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2">
            Tóm tắt tiếng Trung:
          </span>
          <p className={`font-chinese font-bold leading-relaxed ${style.hanzi}`}>
            {summary.chinese}
          </p>
          <p className="mt-3 pt-3 border-t border-dashed border-slate-300/60 text-sm sm:text-base font-mono font-semibold text-amber-700">
            {summary.pinyin}
          </p>
        </div>

        {/* Vietnamese Translation */}
        <div
          className={`p-4 rounded-2xl border ${
            theme === 'high-contrast'
              ? 'bg-zinc-900 border-zinc-700 text-white'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}
        >
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 block mb-1">
            Dịch nghĩa tóm tắt:
          </span>
          <p className={`font-medium leading-relaxed ${style.vi}`}>
            {summary.vietnamese}
          </p>
        </div>

        {/* Key Takeaways */}
        {summary.keyPoints && summary.keyPoints.length > 0 && (
          <div
            className={`p-4 rounded-2xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-950 border-yellow-500/40'
                : 'bg-blue-50/70 border-blue-200 text-blue-950'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider text-blue-800 block mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Điểm kiến thức cần ghi nhớ:
            </span>
            <ul className="space-y-2 text-sm sm:text-base font-semibold">
              {summary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
