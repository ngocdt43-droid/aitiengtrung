import React, { useState } from 'react';
import { Edit3, Check, Copy, Volume2, Sparkles, BookOpen, Layers, HelpCircle } from 'lucide-react';
import { AccessibilityTheme, TextSizeLevel } from '../types';

interface RecognizedTextEditorProps {
  recognizedText: string;
  pinyin: string;
  vietnamese: string;
  onUpdateText: (newText: string) => void;
  onSpeak: (text: string) => void;
  onExplainSelectedWord?: (word: string) => void;
  theme: AccessibilityTheme;
  textSize: TextSizeLevel;
  activeSentenceIndex: number | null;
}

export const RecognizedTextEditor: React.FC<RecognizedTextEditorProps> = ({
  recognizedText,
  pinyin,
  vietnamese,
  onUpdateText,
  onSpeak,
  onExplainSelectedWord,
  theme,
  textSize,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(recognizedText);
  const [copied, setCopied] = useState(false);
  const [viewFormat, setViewFormat] = useState<'ruby' | 'standard'>('ruby');

  const handleSaveEdit = () => {
    onUpdateText(editText);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${recognizedText}\n${pinyin}\n${vietnamese}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Font size classes based on textSize setting
  const textSizeClassMap: Record<TextSizeLevel, { hanzi: string; pinyin: string; vi: string }> = {
    normal: { hanzi: 'text-2xl sm:text-3xl leading-relaxed', pinyin: 'text-sm sm:text-base', vi: 'text-base sm:text-lg' },
    large: { hanzi: 'text-3xl sm:text-4xl leading-loose', pinyin: 'text-base sm:text-lg', vi: 'text-lg sm:text-xl' },
    'extra-large': { hanzi: 'text-4xl sm:text-5xl leading-loose', pinyin: 'text-lg sm:text-xl', vi: 'text-xl sm:text-2xl' },
    huge: { hanzi: 'text-5xl sm:text-6xl leading-loose', pinyin: 'text-xl sm:text-2xl', vi: 'text-2xl sm:text-3xl' },
  };

  const textStyle = textSizeClassMap[textSize];

  return (
    <div
      id="recognized-text-panel"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        theme === 'high-contrast'
          ? 'bg-zinc-950 border-yellow-400 text-white'
          : theme === 'night'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : theme === 'warm'
          ? 'bg-amber-50/80 border-amber-300 text-amber-950'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-current/20">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black'
                : theme === 'night'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-red-600 text-white'
            }`}
          >
            字
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Văn bản tiếng Trung đã nhận diện</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Bôi đen từ để xem giải thích
              </span>
            </h2>
            <p
              className={`text-xs sm:text-sm font-medium ${
                theme === 'high-contrast'
                  ? 'text-yellow-200'
                  : theme === 'night'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }`}
            >
              Chữ to, phân tách rõ ràng, kèm Pinyin chuẩn và dịch nghĩa
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Edit Button */}
          <button
            id="btn-edit-recognized-text"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : theme === 'night'
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Đóng sửa chữ' : 'Sửa chữ nếu nhận diện sai'}</span>
          </button>

          {/* Copy Button */}
          <button
            id="btn-copy-recognized-text"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : theme === 'night'
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép bài'}</span>
          </button>

          {/* Speak Button */}
          <button
            id="btn-speak-entire-text"
            onClick={() => onSpeak(recognizedText)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : theme === 'night'
                ? 'bg-sky-500 text-slate-950 font-black hover:bg-sky-400'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe đoạn này</span>
          </button>
        </div>
      </div>

      {/* Content Display or Edit Box */}
      {isEditing ? (
        <div className="space-y-3">
          <label htmlFor="edit-chinese-textarea" className="text-xs font-bold opacity-80 block">
            Chỉnh sửa văn bản tiếng Trung (nhập chữ Hán):
          </label>
          <textarea
            id="edit-chinese-textarea"
            rows={5}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={`w-full p-4 rounded-2xl text-xl font-chinese font-semibold border-2 focus:outline-hidden ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                : theme === 'night'
                ? 'bg-slate-950 text-sky-100 border-sky-400 focus:ring-2 focus:ring-sky-500'
                : 'bg-white text-slate-900 border-red-300 focus:ring-2 focus:ring-red-100'
            }`}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold opacity-70 hover:opacity-100"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Cập nhật chữ
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chinese Characters + Pinyin */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'high-contrast'
                ? 'bg-black border-yellow-400/50'
                : theme === 'night'
                ? 'bg-slate-950/80 border-slate-800'
                : theme === 'warm'
                ? 'bg-amber-100/40 border-amber-200'
                : 'bg-slate-50/70 border-slate-200'
            }`}
          >
            <div className={`chinese-char font-bold tracking-wide select-text cursor-text ${textStyle.hanzi}`}>
              {recognizedText}
            </div>

            {/* Pinyin representation */}
            <div className="mt-3 pt-3 border-t border-dashed border-slate-300/60 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-1">
                Phiên âm Pinyin chuẩn (hỗ trợ tập gõ bàn phím):
              </span>
              <p
                className={`font-semibold tracking-wider font-mono ${textStyle.pinyin} ${
                  theme === 'high-contrast'
                    ? 'text-yellow-300'
                    : theme === 'night'
                    ? 'text-sky-300'
                    : theme === 'warm'
                    ? 'text-amber-800'
                    : 'text-red-700'
                }`}
              >
                {pinyin}
              </p>
            </div>
          </div>

          {/* Vietnamese Translation */}
          <div
            className={`p-4 rounded-2xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-zinc-700 text-yellow-100'
                : theme === 'night'
                ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                : theme === 'warm'
                ? 'bg-amber-200/50 border-amber-300 text-amber-950'
                : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Dịch nghĩa tiếng Việt:
              </span>
            </div>
            <p className={`font-medium leading-relaxed ${textStyle.vi}`}>
              {vietnamese}
            </p>
          </div>

          {/* Quick Tip for High School/Dyslexia Learners */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
              theme === 'high-contrast'
                ? 'bg-black border-yellow-500/40 text-yellow-300'
                : theme === 'night'
                ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Mẹo cho học sinh:</strong> Hãy dùng chuột hoặc ngón tay <strong>bôi đen bất kỳ từ nào</strong> để mở nút <em>"Giải thích từ khó"</em> ngay lập tức!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
