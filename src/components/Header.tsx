import React from 'react';
import { BookOpen, HelpCircle, History, Sparkles, Sun, Moon, Eye, ZoomIn, ZoomOut, Type, Sparkle } from 'lucide-react';
import { AccessibilityTheme, TextSizeLevel, DyslexiaFontFamily } from '../types';

interface HeaderProps {
  theme: AccessibilityTheme;
  setTheme: (theme: AccessibilityTheme) => void;
  textSize: TextSizeLevel;
  setTextSize: (size: TextSizeLevel) => void;
  fontFamily: DyslexiaFontFamily;
  setFontFamily: (font: DyslexiaFontFamily) => void;
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  textSize,
  setTextSize,
  fontFamily,
  setFontFamily,
  onOpenGuide,
  onOpenHistory,
  historyCount,
}) => {
  const textSizeLabels: Record<TextSizeLevel, { label: string; px: string }> = {
    normal: { label: 'Chữ Vừa', px: '18px' },
    large: { label: 'Chữ To', px: '22px' },
    'extra-large': { label: 'Chữ Rất To', px: '26px' },
    huge: { label: 'Cực Đại', px: '32px' },
  };

  const cycleTextSize = (direction: 'up' | 'down') => {
    const order: TextSizeLevel[] = ['normal', 'large', 'extra-large', 'huge'];
    const currentIndex = order.indexOf(textSize);
    if (direction === 'up' && currentIndex < order.length - 1) {
      setTextSize(order[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setTextSize(order[currentIndex - 1]);
    }
  };

  return (
    <header
      id="app-main-header"
      className={`border-b transition-colors duration-200 ${
        theme === 'high-contrast'
          ? 'bg-black text-white border-yellow-400'
          : theme === 'night'
          ? 'bg-slate-950 text-slate-100 border-slate-800'
          : theme === 'warm'
          ? 'bg-amber-100/90 text-amber-950 border-amber-300'
          : 'bg-white text-slate-900 border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black border-2 border-white'
                : theme === 'night'
                ? 'bg-sky-500 text-slate-950 font-black'
                : theme === 'warm'
                ? 'bg-amber-600 text-white'
                : 'bg-gradient-to-br from-red-600 to-amber-600 text-white'
            }`}
          >
            中
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                AI học tiếng trung cùng em
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black'
                    : theme === 'night'
                    ? 'bg-sky-900/70 text-sky-300 border border-sky-600'
                    : theme === 'warm'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                Trợ lý học sinh
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-medium mt-0.5 ${
                theme === 'high-contrast'
                  ? 'text-yellow-200'
                  : theme === 'night'
                  ? 'text-slate-400'
                  : theme === 'warm'
                  ? 'text-amber-800'
                  : 'text-slate-600'
              }`}
            >
              Chữ to dễ đọc • Nhận diện sách ảnh • Đọc nổi bật từng từ • Giải thích từ khó THCS
            </p>
          </div>
        </div>

        {/* Accessibility & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Dyslexia Font Selector */}
          <div
            id="font-family-controls"
            className={`flex items-center p-1 rounded-xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400'
                : theme === 'night'
                ? 'bg-slate-900 border-slate-700'
                : theme === 'warm'
                ? 'bg-amber-200/70 border-amber-400'
                : 'bg-slate-100 border-slate-300'
            }`}
            title="Chọn kiểu phông chữ hỗ trợ người khó đọc chữ Hán và tiếng Việt"
          >
            <span className="px-1.5 text-xs font-black opacity-70 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phông:</span>
            </span>
            <button
              id="btn-font-standard"
              onClick={() => setFontFamily('standard')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                fontFamily === 'standard'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Chuẩn
            </button>
            <button
              id="btn-font-dyslexic-wide"
              onClick={() => setFontFamily('dyslexic-wide')}
              title="Phông Lexend - khoảng cách chữ rộng, chống lẫn lộn chữ"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                fontFamily === 'dyslexic-wide'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>Giãn rộng</span>
            </button>
            <button
              id="btn-font-spacious-sans"
              onClick={() => setFontFamily('spacious-sans')}
              title="Phông thoáng mắt, nét tròn thân thiện"
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                fontFamily === 'spacious-sans'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Nét tròn
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div
            id="font-size-controls"
            className={`flex items-center p-1 rounded-xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400'
                : theme === 'night'
                ? 'bg-slate-900 border-slate-700'
                : theme === 'warm'
                ? 'bg-amber-200/70 border-amber-400'
                : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              id="btn-decrease-font"
              onClick={() => cycleTextSize('down')}
              disabled={textSize === 'normal'}
              title="Thu nhỏ cỡ chữ"
              className={`p-1.5 rounded-lg font-bold disabled:opacity-40 transition-colors flex items-center gap-1 ${
                theme === 'high-contrast'
                  ? 'hover:bg-zinc-800 text-yellow-300'
                  : theme === 'night'
                  ? 'hover:bg-slate-800 text-slate-200'
                  : 'hover:bg-white text-slate-700'
              }`}
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">A-</span>
            </button>
            <span
              id="current-font-label"
              className={`px-1.5 text-xs font-extrabold whitespace-nowrap min-w-[55px] text-center ${
                theme === 'high-contrast'
                  ? 'text-yellow-400'
                  : theme === 'night'
                  ? 'text-sky-400'
                  : 'text-slate-800'
              }`}
            >
              {textSizeLabels[textSize].label}
            </span>
            <button
              id="btn-increase-font"
              onClick={() => cycleTextSize('up')}
              disabled={textSize === 'huge'}
              title="Phóng to cỡ chữ"
              className={`p-1.5 rounded-lg font-bold disabled:opacity-40 transition-colors flex items-center gap-1 ${
                theme === 'high-contrast'
                  ? 'hover:bg-zinc-800 text-yellow-300'
                  : theme === 'night'
                  ? 'hover:bg-slate-800 text-slate-200'
                  : 'hover:bg-white text-slate-700'
              }`}
            >
              <span className="text-xs font-black">A+</span>
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color & Contrast Mode Toggle: Sáng / Ấm / Đêm / Tương phản */}
          <div
            id="theme-controls"
            className={`flex items-center p-1 rounded-xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400'
                : theme === 'night'
                ? 'bg-slate-900 border-slate-700'
                : theme === 'warm'
                ? 'bg-amber-200/70 border-amber-400'
                : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              id="btn-theme-light"
              onClick={() => setTheme('light')}
              title="Giao diện sáng tiêu chuẩn"
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                theme === 'light'
                  ? 'bg-white text-blue-800 shadow-xs ring-1 ring-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sáng</span>
            </button>

            <button
              id="btn-theme-warm"
              onClick={() => setTheme('warm')}
              title="Giao diện tông ấm dịu mắt"
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                theme === 'warm'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Dịu mắt</span>
            </button>

            <button
              id="btn-theme-night"
              onClick={() => setTheme('night')}
              title="Chế độ ban đêm êm dịu, bảo vệ mắt học khuya"
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                theme === 'night'
                  ? 'bg-slate-800 text-sky-400 border border-slate-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Ban đêm</span>
            </button>

            <button
              id="btn-theme-contrast"
              onClick={() => setTheme('high-contrast')}
              title="Tương phản cực cao (Chữ vàng trên nền Đen tuyền)"
              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black shadow-xs font-black'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              <Sparkle className="w-3.5 h-3.5 text-yellow-500" />
              <span className="hidden sm:inline">Tương phản cao</span>
            </button>
          </div>

          {/* Guide Modal Button */}
          <button
            id="btn-open-guide"
            onClick={onOpenGuide}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs ${
              theme === 'high-contrast'
                ? 'bg-zinc-800 text-yellow-300 border border-yellow-400 hover:bg-zinc-700'
                : theme === 'night'
                ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                : theme === 'warm'
                ? 'bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">3 bước học</span>
          </button>

          {/* History Modal Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs relative ${
              theme === 'high-contrast'
                ? 'bg-zinc-800 text-yellow-300 border border-yellow-400 hover:bg-zinc-700'
                : theme === 'night'
                ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                : theme === 'warm'
                ? 'bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Bài đã học</span>
            {historyCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] font-extrabold rounded-full ${
                  theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-red-600 text-white'
                }`}
              >
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

