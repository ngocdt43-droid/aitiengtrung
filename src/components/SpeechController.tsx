import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  FastForward,
  RotateCcw,
  Sparkles,
  Settings2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AccessibilityTheme, ReadingMode, HighlightTrackingMode } from '../types';
import { getChineseVoices } from '../utils/speech';

interface SpeechControllerProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  highlightTrackingMode: HighlightTrackingMode;
  setHighlightTrackingMode: (mode: HighlightTrackingMode) => void;
  currentReadingText?: string;
  theme: AccessibilityTheme;
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export const SpeechController: React.FC<SpeechControllerProps> = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onStop,
  playbackRate,
  setPlaybackRate,
  readingMode,
  setReadingMode,
  highlightTrackingMode,
  setHighlightTrackingMode,
  currentReadingText,
  theme,
  selectedVoice,
  setSelectedVoice,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const cnVoices = getChineseVoices();
      setVoices(cnVoices);
      if (!selectedVoice && cnVoices.length > 0) {
        setSelectedVoice(cnVoices[0]);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speedPresets = [
    { label: 'Rất chậm (0.6x)', value: 0.6 },
    { label: 'Chậm (0.8x)', value: 0.8 },
    { label: 'Vừa (1.0x)', value: 1.0 },
    { label: 'Nhanh (1.2x)', value: 1.2 },
  ];

  return (
    <div
      id="speech-controller-panel"
      className={`rounded-3xl p-5 sm:p-6 border shadow-md transition-all ${
        theme === 'high-contrast'
          ? 'bg-zinc-900 border-yellow-400 text-white'
          : theme === 'warm'
          ? 'bg-amber-100/90 border-amber-300 text-amber-950'
          : 'bg-gradient-to-r from-red-50 via-white to-amber-50 border-red-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Playback Controls & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {!isPlaying || isPaused ? (
              <button
                id="btn-speech-play"
                onClick={onPlay}
                className={`px-5 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-md transition-all active:scale-95 ${
                  theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-white'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isPaused ? 'Tiếp tục đọc' : 'Phát giọng đọc'}</span>
              </button>
            ) : (
              <button
                id="btn-speech-pause"
                onClick={onPause}
                className={`px-5 py-3.5 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-md transition-all active:scale-95 ${
                  theme === 'high-contrast'
                    ? 'bg-yellow-300 text-black hover:bg-yellow-400'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Tạm dừng</span>
              </button>
            )}

            <button
              id="btn-speech-stop"
              onClick={onStop}
              disabled={!isPlaying && !isPaused}
              title="Dừng hẳn"
              className={`p-3.5 rounded-2xl font-bold border transition-all active:scale-95 disabled:opacity-40 ${
                theme === 'high-contrast'
                  ? 'bg-zinc-800 border-yellow-400 text-yellow-400 hover:bg-zinc-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Reading Mode Selector (Requirement #5) */}
          <div
            className={`flex p-1 rounded-2xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-950 border-yellow-400'
                : theme === 'warm'
                ? 'bg-amber-200/80 border-amber-300'
                : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              id="btn-mode-full"
              onClick={() => {
                setReadingMode('full');
                if (isPlaying) onStop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                readingMode === 'full'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-white text-red-700 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Đọc toàn bài gốc
            </button>
            <button
              id="btn-mode-summary"
              onClick={() => {
                setReadingMode('summary');
                if (isPlaying) onStop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                readingMode === 'summary'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-white text-red-700 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Chỉ đọc bản tóm tắt
            </button>
            <button
              id="btn-mode-mindmap"
              onClick={() => {
                setReadingMode('mindmap');
                if (isPlaying) onStop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                readingMode === 'mindmap'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-white text-red-700 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Đọc từ vựng sơ đồ
            </button>
          </div>

          {/* Highlight Mode Toggle: Nổi bật theo câu vs Nổi bật theo từng từ */}
          <div
            className={`flex p-1 rounded-2xl border ${
              theme === 'high-contrast'
                ? 'bg-zinc-950 border-yellow-400'
                : theme === 'night'
                ? 'bg-slate-900 border-slate-700'
                : theme === 'warm'
                ? 'bg-amber-200/80 border-amber-300'
                : 'bg-slate-100 border-slate-300'
            }`}
            title="Chọn chế độ làm nổi bật khi AI phát âm để dễ dõi theo"
          >
            <button
              id="btn-track-sentence"
              onClick={() => setHighlightTrackingMode('sentence')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                highlightTrackingMode === 'sentence'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-white text-blue-700 shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Dõi theo từng câu
            </button>
            <button
              id="btn-track-word"
              onClick={() => setHighlightTrackingMode('word')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1 ${
                highlightTrackingMode === 'word'
                  ? theme === 'high-contrast'
                    ? 'bg-yellow-400 text-black font-black'
                    : theme === 'night'
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dõi theo từng từ ✨</span>
            </button>
          </div>
        </div>

        {/* Speed Adjustment Slider & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-black uppercase tracking-wider ${
                theme === 'high-contrast' ? 'text-yellow-300' : 'text-slate-700'
              }`}
            >
              Tốc độ:
            </span>
            <div className="flex gap-1">
              {speedPresets.map((preset) => (
                <button
                  key={preset.value}
                  id={`btn-speed-${preset.value}`}
                  onClick={() => setPlaybackRate(preset.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    playbackRate === preset.value
                      ? theme === 'high-contrast'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-red-600 text-white'
                      : theme === 'high-contrast'
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset.value}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Settings Toggle */}
          <button
            id="btn-toggle-voice-settings"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              showVoiceSettings
                ? theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black border-white'
                  : 'bg-slate-200 text-slate-900 border-slate-400'
                : theme === 'high-contrast'
                ? 'bg-zinc-800 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
            title="Tùy chỉnh giọng đọc tiếng Trung"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Giọng đọc ({voices.length > 0 ? 'Có sẵn' : 'Mặc định'})</span>
          </button>
        </div>
      </div>

      {/* Voice Selection Drawer */}
      {showVoiceSettings && (
        <div
          className={`mt-4 pt-4 border-t text-sm space-y-2 ${
            theme === 'high-contrast' ? 'border-yellow-400/40' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-bold">Chọn giọng tiếng Trung của trình duyệt:</span>
            {voices.length > 0 ? (
              <select
                id="select-chinese-voice"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const v = voices.find((item) => item.name === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
                className={`p-2 rounded-xl border text-sm font-semibold max-w-full ${
                  theme === 'high-contrast'
                    ? 'bg-black text-yellow-300 border-yellow-400'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-amber-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-4 h-4" />
                Dùng giọng tiếng Trung hệ thống (Web Speech API tự động phát)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Current Active Sentence Banner when Playing */}
      {isPlaying && currentReadingText && (
        <div
          className={`mt-4 p-3.5 rounded-2xl flex items-center gap-3 border ${
            theme === 'high-contrast'
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-amber-100/90 text-amber-950 border-amber-300'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
          <div className="text-sm sm:text-base font-bold flex-1 truncate">
            <span className="opacity-70 mr-1.5">Đang đọc:</span>
            <span className="font-black underline decoration-red-500 decoration-2">
              {currentReadingText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
