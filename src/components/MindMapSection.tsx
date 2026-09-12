import React, { useState } from 'react';
import {
  GitBranch,
  Volume2,
  Smartphone,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AccessibilityTheme, MindMapNode, TextSizeLevel, AnalysisResult } from '../types';

interface MindMapSectionProps {
  nodes: MindMapNode[];
  centralTopic?: AnalysisResult['centralTopic'];
  onSpeak: (text: string) => void;
  theme: AccessibilityTheme;
  textSize: TextSizeLevel;
}

export const MindMapSection: React.FC<MindMapSectionProps> = ({
  nodes,
  centralTopic,
  onSpeak,
  theme,
  textSize,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'cards'>('visual');
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  const textSizeClassMap: Record<TextSizeLevel, { word: string; text: string; example: string }> = {
    normal: { word: 'text-3xl sm:text-4xl', text: 'text-base', example: 'text-lg sm:text-xl' },
    large: { word: 'text-4xl sm:text-5xl', text: 'text-lg', example: 'text-xl sm:text-2xl' },
    'extra-large': { word: 'text-5xl sm:text-6xl', text: 'text-xl', example: 'text-2xl sm:text-3xl' },
    huge: { word: 'text-6xl sm:text-7xl', text: 'text-2xl', example: 'text-3xl sm:text-4xl' },
  };

  const style = textSizeClassMap[textSize];

  // Derive central word
  const rootWord = centralTopic?.word || nodes[0]?.word || '词';
  const rootPinyin = centralTopic?.pinyin || nodes[0]?.pinyin || '';
  const rootMeaning = centralTopic?.meaning || nodes[0]?.meaning || 'Từ trung tâm';
  const rootCategory = centralTopic?.category || 'Chủ đề từ vựng';

  return (
    <section
      id="mindmap-vocabulary-section"
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
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-current/20">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
              <span>Sơ đồ tư duy từ vựng & Câu ngắn cho người mới học</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                HSK 1 - 2
              </span>
            </h3>
            <p
              className={`text-xs sm:text-sm font-medium ${
                theme === 'high-contrast' ? 'text-yellow-200' : 'text-slate-500'
              }`}
            >
              Mỗi từ liên quan đều có câu ví dụ cực ngắn (4-8 chữ Hán), dễ thuộc và hướng dẫn gõ bàn phím
            </p>
          </div>
        </div>

        {/* View Switcher: Visual Mind Map vs Detailed Cards */}
        <div
          className={`flex p-1 rounded-2xl border self-start sm:self-auto ${
            theme === 'high-contrast'
              ? 'bg-zinc-900 border-yellow-400'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            id="btn-view-visual-mindmap"
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'visual'
                ? theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-emerald-700 shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Sơ đồ tư duy tỏa nhánh</span>
          </button>
          <button
            type="button"
            id="btn-view-cards-mindmap"
            onClick={() => setActiveTab('cards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'cards'
                ? theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-emerald-700 shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Danh sách thẻ chi tiết ({nodes.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Interactive Visual Mind Map Diagram */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          {/* Visual Radial Mind Map Tree Canvas */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 relative overflow-hidden ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400'
                : theme === 'warm'
                ? 'bg-amber-100/40 border-amber-300'
                : 'bg-linear-to-b from-slate-50 to-emerald-50/30 border-slate-200'
            }`}
          >
            {/* Top Root Node: The Central Word */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative z-10">
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-red-100 text-red-800 tracking-wider mb-2 border border-red-200">
                {rootCategory || 'TỪ TRUNG TÂM / GỐC'}
              </span>

              <div
                className={`p-4 sm:p-5 rounded-3xl border-4 shadow-lg flex flex-col items-center gap-1 transition-transform hover:scale-105 ${
                  theme === 'high-contrast'
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-white border-red-500 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-chinese font-black text-4xl sm:text-5xl text-red-600">
                    {rootWord}
                  </span>
                  <button
                    id="btn-speak-root-word"
                    onClick={() => onSpeak(rootWord)}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Nghe phát âm từ gốc"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="font-mono text-base sm:text-lg font-bold text-amber-700">
                  [{rootPinyin}]
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-700">
                  {rootMeaning}
                </div>
              </div>

              {/* Subtitle helper */}
              <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm font-semibold text-emerald-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Các nhánh từ vựng cùng ý nghĩa & câu ngắn cho người mới học:</span>
              </div>
            </div>

            {/* Radiant Branches Grid of Related Words */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {nodes.map((node, idx) => {
                const isSelected = selectedNodeIndex === idx;
                return (
                  <div
                    key={node.id || idx}
                    id={`visual-branch-card-${idx}`}
                    onClick={() => setSelectedNodeIndex(idx)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                      isSelected
                        ? theme === 'high-contrast'
                          ? 'bg-zinc-800 border-yellow-300 ring-2 ring-yellow-400'
                          : 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                        : theme === 'high-contrast'
                        ? 'bg-zinc-950/80 border-yellow-500/40 text-white hover:border-yellow-400'
                        : theme === 'warm'
                        ? 'bg-white/80 border-amber-300 hover:border-amber-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      {/* Node Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          Nhánh #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSpeak(node.word);
                          }}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Nghe từ này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Main Word & Pinyin */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-chinese font-black text-2xl sm:text-3xl text-red-600">
                          {node.word}
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-amber-700">
                          [{node.pinyin}]
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-800 mb-3">
                        {node.meaning}
                      </div>

                      {/* Highlighted Short Beginner Sentence */}
                      <div
                        className={`p-3 rounded-xl border ${
                          theme === 'high-contrast'
                            ? 'bg-black border-yellow-400/60 text-yellow-200'
                            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[11px] font-black uppercase text-emerald-700 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Câu ngắn dễ học:
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSpeak(node.exampleSentence);
                            }}
                            className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Nghe câu ngắn"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-chinese font-bold text-base sm:text-lg text-slate-900">
                          {node.exampleSentence}
                        </div>
                        <div className="font-mono text-xs text-emerald-800 font-semibold mt-0.5">
                          {node.examplePinyin}
                        </div>
                        <div className="text-xs font-medium text-slate-700 mt-1">
                          {node.exampleMeaning}
                        </div>
                      </div>
                    </div>

                    {/* Sub-branch count & quick tip */}
                    <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs opacity-75 font-semibold">
                      <span>Bàn phím: {node.typingGuide.split('->')[0]}</span>
                      <span className="text-emerald-700 font-bold">Xem chi tiết &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Node Deep-Dive Inspection Card */}
          {nodes[selectedNodeIndex] && (
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 ${
                theme === 'high-contrast'
                  ? 'bg-zinc-900 border-yellow-400 text-white'
                  : theme === 'warm'
                  ? 'bg-amber-100/60 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-lg font-black tracking-tight">
                  Chi tiết từ vựng đang chọn: "{nodes[selectedNodeIndex].word}"
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone typing guide */}
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                    theme === 'high-contrast'
                      ? 'bg-black border-yellow-500/40 text-yellow-200'
                      : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-black block text-blue-700 mb-0.5">
                      Hướng dẫn gõ trên bàn phím điện thoại:
                    </span>
                    <span className="font-medium">
                      {nodes[selectedNodeIndex].typingGuide}
                    </span>
                  </div>
                </div>

                {/* Radical & memory tip */}
                {nodes[selectedNodeIndex].radicalOrStrokes && (
                  <div
                    className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                      theme === 'high-contrast'
                        ? 'bg-black border-yellow-500/40 text-yellow-200'
                        : 'bg-amber-50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-black block text-amber-800 mb-0.5">
                        Mẹo nhớ mặt chữ / Bộ thủ:
                      </span>
                      <span className="font-medium">
                        {nodes[selectedNodeIndex].radicalOrStrokes}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub branches if any */}
              {nodes[selectedNodeIndex].relatedWords && nodes[selectedNodeIndex].relatedWords.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <span className="text-xs font-black uppercase tracking-wider block mb-2 opacity-75">
                    Các từ ghép nhánh con mở rộng:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {nodes[selectedNodeIndex].relatedWords.map((rw, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => onSpeak(rw.word)}
                        className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105 ${
                          theme === 'high-contrast'
                            ? 'bg-zinc-800 border-yellow-400 text-yellow-300'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-red-400'
                        }`}
                      >
                        <span className="font-chinese text-red-600 font-black">{rw.word}</span>
                        <span className="font-mono text-amber-700">[{rw.pinyin}]</span>
                        <span className="opacity-70 font-normal">({rw.meaning})</span>
                        <Volume2 className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Complete Detailed Cards List */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {nodes.map((node, index) => (
            <div
              key={node.id || index}
              id={`mindmap-card-${index}`}
              className={`rounded-2xl p-5 sm:p-6 border-2 transition-all hover:shadow-md ${
                theme === 'high-contrast'
                  ? 'bg-zinc-900 border-yellow-400/80 text-white hover:border-yellow-300'
                  : theme === 'warm'
                  ? 'bg-amber-100/50 border-amber-300 hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-200 hover:border-red-300'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left column: Main Target Word & Pinyin & Meaning */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800 uppercase tracking-wider">
                        Từ #{index + 1}
                      </span>
                      <div className="flex items-baseline gap-3 pt-1">
                        <span className={`font-chinese font-black text-red-600 ${style.word}`}>
                          {node.word}
                        </span>
                        <button
                          id={`btn-speak-word-${index}`}
                          onClick={() => onSpeak(node.word)}
                          className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                            theme === 'high-contrast'
                              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                          title="Nghe phát âm chuẩn từ này"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-lg sm:text-xl font-bold font-mono text-amber-700 tracking-wider">
                        [{node.pinyin}]
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl font-bold text-base sm:text-lg border ${
                      theme === 'high-contrast'
                        ? 'bg-black border-yellow-400 text-yellow-300'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="opacity-70 text-xs uppercase block">Nghĩa tiếng Việt:</span>
                    <span>{node.meaning}</span>
                  </div>

                  {/* Phone Pinyin Typing Guide */}
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      theme === 'high-contrast'
                        ? 'bg-zinc-950 border-yellow-500/40 text-yellow-200'
                        : 'bg-blue-50/80 border-blue-200 text-blue-950'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-extrabold block text-blue-700">Cách gõ bàn phím điện thoại:</span>
                      <span className="font-medium">{node.typingGuide}</span>
                    </div>
                  </div>

                  {/* Character memory tip / Radicals */}
                  {node.radicalOrStrokes && (
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        theme === 'high-contrast'
                          ? 'bg-zinc-950 border-yellow-500/40 text-yellow-200'
                          : 'bg-amber-100/70 border-amber-300 text-amber-950'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm">
                        <span className="font-extrabold block text-amber-800">Mẹo nhớ mặt chữ:</span>
                        <span className="font-medium">{node.radicalOrStrokes}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column: Context Example Sentence & Mind Map Branches */}
                <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                  {/* Context illustrative sentence specially formatted for beginners */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border-2 ${
                      theme === 'high-contrast'
                        ? 'bg-black border-yellow-400'
                        : 'bg-white border-emerald-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
                        <BookOpen className="w-4 h-4" />
                        <span>Câu ngắn tương ứng cho người mới học:</span>
                      </div>
                      <button
                        id={`btn-speak-example-${index}`}
                        onClick={() => onSpeak(node.exampleSentence)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          theme === 'high-contrast'
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe câu ngắn</span>
                      </button>
                    </div>

                    <div className={`font-chinese font-black ${style.example} text-slate-900 tracking-wide mb-1`}>
                      {node.exampleSentence}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold font-mono text-emerald-800 tracking-wider mb-2">
                      {node.examplePinyin}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-slate-700 pt-2 border-t border-dashed border-slate-200">
                      {node.exampleMeaning}
                    </div>
                  </div>

                  {/* Mind Map Branching / Related Words */}
                  {node.relatedWords && node.relatedWords.length > 0 && (
                    <div
                      className={`p-3.5 rounded-xl border ${
                        theme === 'high-contrast'
                          ? 'bg-zinc-950 border-yellow-500/40'
                          : 'bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider block mb-2 opacity-70 flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-red-600" />
                        Sơ đồ từ ghép liên quan (nhánh mở rộng):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {node.relatedWords.map((rw, rIdx) => (
                          <div
                            key={rIdx}
                            onClick={() => onSpeak(rw.word)}
                            title="Bấm để nghe phát âm"
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-102 flex flex-col justify-between ${
                              theme === 'high-contrast'
                                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                                : 'bg-white border-slate-300 hover:border-red-400 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-chinese font-bold text-lg text-red-600">
                                {rw.word}
                              </span>
                              <Volume2 className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                            </div>
                            <span className="text-xs font-mono font-semibold text-amber-700">
                              {rw.pinyin}
                            </span>
                            <span className="text-xs opacity-90 truncate mt-1">
                              {rw.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
